import express from 'express';
import { prisma } from '../server.js';
import { authenticateToken, isAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', async (req, res) => {
    const categories = await prisma.category.findMany();
    res.json(categories);
});

router.post('/', authenticateToken, isAdmin, async (req, res) => {
    try {
        const category = await prisma.category.create({
            data: {
                ...req.body,
                userId: req.user.id
            }
        });
        res.json(category);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.put('/:id', authenticateToken, isAdmin, async (req, res) => {
    try {
        const category = await prisma.category.update({
            where: { id: req.params.id },
            data: req.body
        });
        res.json(category);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.delete('/:id', authenticateToken, isAdmin, async (req, res) => {
    try {
        await prisma.category.delete({
            where: { id: req.params.id }
        });
        res.json({ message: 'Category deleted' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

export default router;
