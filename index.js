import dotenv from 'dotenv';
import { createServer } from './src/server.js';

dotenv.config();

const port = process.env.PORT || 3000;
const server = createServer();

server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
