import express from 'express';
import { prisma } from '../server.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

/**
 * @swagger
 * /articles:
 *   get:
 *     summary: Get all articles
 *     tags: [Articles]
 *     parameters:
 *       - in: query
 *         name: articleId
 *         schema:
 *           type: string
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *       - in: query
 *         name: title
 *         schema:
 *           type: string
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *       - in: query
 *         name: createdAtStart
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: createdAtEnd
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *     responses:
 *       200:
 *         description: List of articles
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Article'
 */
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

/**
 * @swagger
 * /articles:
 *   post:
 *     summary: Create a new article
 *     tags: [Articles]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ArticleInput'
 *     responses:
 *       200:
 *         description: Created article
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Article'
 *       401:
 *         description: Unauthorized
 */
router.post('/', authenticateToken, async (req, res) => {
    try {
        constarticle = await prisma.article.create({
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

/**
 * @swagger
 * /articles/{id}:
 *   put:
 *     summary: Update an article
 *     tags: [Articles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ArticleInput'
 *     responses:
 *       200:
 *         description: Updated article
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Article'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Article not found
 */
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

/**
 * @swagger
 * /articles/{id}:
 *   delete:
 *     summary: Delete an article
 *     tags: [Articles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Article deleted
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Article not found
 */
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