import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import { createClient } from 'redis';

dotenv.config();
connectDB();

export const redisClient = createClient({
    url: process.env.REDIS_URL || 'redis://localhost:6379',
});

redisClient
    .connect()
    .then(() => console.log('Connected to Redis successfully'))
    .catch((err) => {
        console.error('Failed to connect to Redis:', err);
        process.exit(1);
});

const app = express();
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`User service is running on port ${PORT}`);
});