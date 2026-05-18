import express from 'express'
import Redis from 'ioredis'
import mongoose from 'mongoose'

const app = express();

const redisUrl =
  process.env.REDIS_URL || 'redis://localhost:6379';

const mongoUrl =
  process.env.MONGO_URL || 'mongodb://localhost:27017/redis_tutorial';

const redis = new Redis(redisUrl);

await mongoose.connect(mongoUrl);

app.get('/redis', async (req, res) => {
    const reply = await redis.ping();

    res.json({ redis: reply });
});

app.get('/mongo', async (req, res) => {
    res.json({
        mongo: "connected",
        database: mongoose.connection.name
    });
});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});