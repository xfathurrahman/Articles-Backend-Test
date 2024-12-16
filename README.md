# Articles API - Backend Test

This is a Node.js Express application for managing articles and categories with user authentication.

# Setup For Local Development

1. Clone the repository
2. Install dependencies: `npm install`
3. Create a `.env` file based on `.env.example` and fill in your database details and JWT secret
4. Run Prisma migrations: `npx prisma migrate dev`
5. Seed the database: `npm run seed`
6. Start the server: `npm run dev`

## Features

- User authentication (register, login, profile)
- CRUD operations for categories (admin only)
- CRUD operations for articles
- Public endpoints for fetching articles and categories
- Filtering and sorting for articles

## API Endpoints

### Authentication
- POST /api/auth/register
- POST /api/auth/login
- GET /api/auth/profile

### Categories
- GET /api/categories
- POST /api/categories (admin only)
- PUT /api/categories/:id (admin only)
- DELETE /api/categories/:id (admin only)

### Articles
- GET /api/articles
- POST /api/articles
- PUT /api/articles/:id
- DELETE /api/articles/:id

## API Documentation with Swagger UI

This project uses Swagger UI for interactive API documentation. To access the Swagger UI:

1. Start the server: `npm run dev`
2. Open your browser and navigate to `http://localhost:3000/api-docs`
3. You can now explore and test all API endpoints directly from your browser