import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    // Create admin user
    const adminPassword = await bcrypt.hash('adminpassword', 10);
    const admin = await prisma.user.upsert({
        where: { username: 'admin' },
        update: {},
        create: {
            username: 'admin',
            password: adminPassword,
            role: 'Admin',
        },
    });

    console.log('Admin user created:', admin);

    // Create regular user
    const userPassword = await bcrypt.hash('userpassword', 10);
    const user = await prisma.user.upsert({
        where: { username: 'user' },
        update: {},
        create: {
            username: 'user',
            password: userPassword,
            role: 'User',
        },
    });

    console.log('Regular user created:', user);

    // Create categories
    const categories = await Promise.all([
        prisma.category.create({
            data: {
                name: 'Technology',
                userId: admin.id,
            },
        }),
        prisma.category.create({
            data: {
                name: 'Science',
                userId: admin.id,
            },
        }),
        prisma.category.create({
            data: {
                name: 'Arts',
                userId: admin.id,
            },
        }),
    ]);

    console.log('Categories created:', categories);

    // Create articles
    const articles = await Promise.all([
        prisma.article.create({
            data: {
                title: 'The Future of AI',
                content: 'Artificial Intelligence is rapidly evolving...',
                userId: admin.id,
                categoryId: categories[0].id,
            },
        }),
        prisma.article.create({
            data: {
                title: 'Latest Discoveries in Quantum Physics',
                content: 'Scientists have made groundbreaking discoveries...',
                userId: user.id,
                categoryId: categories[1].id,
            },
        }),
        prisma.article.create({
            data: {
                title: 'The Renaissance of Digital Art',
                content: 'Digital art is experiencing a renaissance...',
                userId: user.id,
                categoryId: categories[2].id,
            },
        }),
    ]);

    console.log('Articles created:', articles);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

