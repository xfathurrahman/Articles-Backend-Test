import swaggerJsdoc from 'swagger-jsdoc';

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Article Backend API',
            version: '1.0.0',
            description: 'API for managing articles and categories',
        },
        servers: [
            {
                url: process.env.NODE_ENV === 'production'
                    ? 'https://articles-backend-test.fly.dev/api'
                    : 'http://localhost:3000/api',
                description: process.env.NODE_ENV === 'production' ? 'Production server' : 'Development server',
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
            schemas: {
                User: {
                    type: 'object',
                    properties: {
                        id: { type: 'string' },
                        username: { type: 'string' },
                        role: { type: 'string', enum: ['User', 'Admin'] },
                    },
                },
                Category: {
                    type: 'object',
                    properties: {
                        id: { type: 'string' },
                        name: { type: 'string' },
                        userId: { type: 'string' },
                        createdAt: { type: 'string', format: 'date-time' },
                        updatedAt: { type: 'string', format: 'date-time' },
                    },
                },
                CategoryInput: {
                    type: 'object',
                    required: ['name'],
                    properties: {
                        name: { type: 'string' },
                    },
                },
                Article: {
                    type: 'object',
                    properties: {
                        id: { type: 'string' },
                        title: { type: 'string' },
                        content: { type: 'string' },
                        userId: { type: 'string' },
                        categoryId: { type: 'string' },
                        createdAt: { type: 'string', format: 'date-time' },
                        updatedAt: { type: 'string', format: 'date-time' },
                        category: { $ref: '#/components/schemas/Category' },
                        user: { $ref: '#/components/schemas/User' },
                    },
                },
                ArticleInput: {
                    type: 'object',
                    required: ['title', 'content', 'categoryId'],
                    properties: {
                        title: { type: 'string' },
                        content: { type: 'string' },
                        categoryId: { type: 'string' },
                    },
                },
            },
        },
    },
    apis: ['./src/routes/*.js'], // Path to the API routes
};

export const swaggerSpec = swaggerJsdoc(options);

