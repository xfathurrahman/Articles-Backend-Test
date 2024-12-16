import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import authRoutes from './routes/authRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import articleRoutes from './routes/articleRoutes.js';

export const prisma = new PrismaClient();

export function createServer() {
    const app = express();

    app.use(cors());
    app.use(express.json());

    app.use('/api/auth', authRoutes);
    app.use('/api/categories', categoryRoutes);
    app.use('/api/articles', articleRoutes);

    return app;
}

