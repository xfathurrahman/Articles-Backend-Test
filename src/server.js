import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './swaggerConfig.js';
import authRoutes from './routes/authRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import articleRoutes from './routes/articleRoutes.js';
import dotenv from 'dotenv';

dotenv.config();

export const prisma = new PrismaClient();

export function createServer() {
    const app = express();

    app.use(cors());
    app.use(express.json());

    // Update Swagger host dynamically
    app.use((req, res, next) => {
        swaggerSpec.servers[0].url = process.env.NODE_ENV === 'production'
            ? `https://${req.headers.host}/api`
            : 'http://localhost:3000/api';
        next();
    });

    // Swagger UI
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

    app.use('/api/auth', authRoutes);
    app.use('/api/categories', categoryRoutes);
    app.use('/api/articles', articleRoutes);

    return app;
}

