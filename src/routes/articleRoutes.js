import express from 'express';
import { prisma } from '../server.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const {
            articleId,
            userId,
            title,
            category,
            createdAtStart,
            createdAtEnd,
            sortBy,
            sortOrder
        } = req.query;

        let where = {};
        if (articleId) where.id = articleId;
        if (userId) where.userId = userId;
        if (title) where.title = { contains: title, mode: 'insensitive' };
        if (category) where.categoryId = category;
        if (createdAtStart || createdAtEnd) {
            where.createdAt = {};
            if (createdAtStart) where.createdAt.gte = new Date(createdAtStart);
            if (createdAtEnd) where.createdAt.lte = new Date(createdAtEnd);
        }

        let orderBy = {};
        if (sortBy) {
            orderBy[sortBy] = sortOrder?.toLowerCase() === 'desc' ? 'desc' : 'asc';
        }

        const articles = await prisma.article.findMany({
            where,
            orderBy,
            include: {
                category: true,
                user: {
                    select: {
                        id: true,
                        username: true
                    }
                }
            }
        });

        res.json(articles);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.post('/', authenticateToken, async (req, res) => {
    try {
        const article = await prisma.article.create({
            data: {
                ...req.body,
                userId: req.user.id
            }
        });
        res.json(article);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.put('/:id', authenticateToken, async (req, res) => {
    try {
        const article = await prisma.article.findUnique({
            where: { id: req.params.id }
        });

        if (!article) {
            return res.status(404).json({ error: 'Article not found' });
        }

        if (article.userId !== req.user.id && req.user.role !== 'Admin') {
            return res.status(403).json({ error: 'Unauthorized' });
        }

        const updatedArticle = await prisma.article.update({
            where: { id: req.params.id },
            data: req.body
        });
        res.json(updatedArticle);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.delete('/:id', authenticateToken, async (req, res) => {
    try {
        const article = await prisma.article.findUnique({
            where: { id: req.params.id }
        });

        if (!article) {
            return res.status(404).json({ error: 'Article not found' });
        }

        if (article.userId !== req.user.id && req.user.role !== 'Admin') {
            return res.status(403).json({ error: 'Unauthorized' });
        }

        await prisma.article.delete({
            where: { id: req.params.id }
        });
        res.json({ message: 'Article deleted' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

export default router;

