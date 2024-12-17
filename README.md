# Simple Articles Management API with authentication


This is a Node.js Express application for managing articles and categories with user authentication.

# Demo - Interactive API Documentation with Swagger UI
 
This project already deployed, you can access Swagger at [https://articles-backend-test.fly.dev/api-docs](https://articles-backend-test.fly.dev/api-docs)

## Setup

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
    - Supports filtering by articleId, userId, title (search), category, and createdAt (range)
    - Supports sorting by createdAt (ascending/descending)
    - Example: GET /api/articles?sortBy=createdAt&sortOrder=desc
- POST /api/articles
- PUT /api/articles/:id
- DELETE /api/articles/:id

## API Documentation with Swagger UI

This project uses Swagger UI for interactive API documentation. To access the Swagger UI:

1. Start the server: `npm run dev`
2. Open your browser and navigate to `http://localhost:3000/api-docs`
3. You can now explore and test all API endpoints directly from your browser

## Deployment

### Deploying to Fly.io

To deploy this API to Fly.io, follow these steps:

1. Install the Fly CLI: https://fly.io/docs/hands-on/install-flyctl/

2. Login to Fly:
   \`\`\`
   fly auth login
   \`\`\`

3. Create a new app on Fly:
   \`\`\`
   fly launch
   \`\`\`
   Follow the prompts, selecting a unique app name and region.

- create postgres with 
    ```
    flyctl postgres create
    ```
- After that, you will get the database url, save it for later. 
- like : ```postgres://postgres:db_password@db_host:5432/postgres?sslmode=disable```

4. Set up your environment variables:
   \`\`\`
   fly secrets set DATABASE_URL="your-database-url"
   fly secrets set JWT_SECRET="your-jwt-secret"
   \`\`\`

5. Deploy your app:
   \`\`\`
   fly deploy
   \`\`\`

6. Open your deployed app:
   \`\`\`
   fly open
   \`\`\`

Your API is now deployed and accessible via the Fly.io URL. You can find more information about managing your deployment in the [Fly.io documentation](https://fly.io/docs/).

## Technologies Used

- Node.js
- Express.js
- Prisma ORM
- PostgreSQL
- JSON Web Tokens (JWT) for authentication

note: already change the credentials 👌😭
