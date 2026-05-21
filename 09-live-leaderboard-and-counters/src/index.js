import express from 'express';
import Redis from 'ioredis';

const app = express();
app.use(express.json());

const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

const redis = new Redis(redisUrl);

const LEADERBOARD_KEY = 'leaderboard';

app.post('/:id/views', async(req, res) => {
    const userId = req.params.id;
    const currentViews = await redis.incr(userId);
    res.json({message: `Incremented user ${userId} counter by 1`, currentViews});
});

app.post('/leaderboard/score', async(req, res) => {
    const user = {
        userId: req.body.id,
        points: parseInt(req.body.points)
    };

    const updatedScore = await redis.zincrby(LEADERBOARD_KEY, user.points, user.userId);
    res.json({
        message: `Incremented user ${user.userId} points by ${user.points}`,
        newScore: parseFloat(updatedScore)
    });
})

app.get('/leaderboard', async(req, res) => {
    const result = await redis.zrevrange(LEADERBOARD_KEY, 0, 9, 'WITHSCORES');
    res.json({
        leaderboard: result
    });
});

app.get('/leaderboard/:userId/rank', async(req, res) => {
    
    const userId = req.params.userId;
    const rank = await redis.zrevrank(LEADERBOARD_KEY, userId);

    if(rank===null){
        return res.status(404).json({error: "User not found on the leaderboard"})
    }

    res.json({
        userId,
        rank: rank
    });
});

app.listen(3000, () => {
    console.log("Server is running on port http://localhost:3000");
});