import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient();

export function createServer() {
    const app = express();

    app.use(cors());
    app.use(express.json());

    return app;
}

