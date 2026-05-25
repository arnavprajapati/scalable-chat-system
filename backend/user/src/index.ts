import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import { createClient } from 'redis';
import userRoutes from './routes/User.js';
import { connectRabbitMQ } from './config/rabbitmq.js';

dotenv.config();
connectDB();
connectRabbitMQ();

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

app.use("/api/v1", userRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`User service is running on port ${PORT}`);
});