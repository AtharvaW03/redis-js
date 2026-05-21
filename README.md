# redis-js

Eight Express projects covering the Redis patterns used in production backends: caching, TTLs, queues, pub/sub, and sorted sets.

## Stack

- Node.js (ES modules)
- Express
- ioredis
- BullMQ
- Redis 7 and MongoDB 7 via Docker Compose

## Quick start

Spin up Redis and Mongo:

```bash
docker compose up -d
```

Pick a project, install, run:

```bash
cd 03-site-banner
npm install
npm run dev
```

Every project listens on `:3000`. Stop one before starting another.

## Projects

| # | Project | Concepts |
|---|---------|----------|
| 02 | Setup local Redis | `ioredis` + Express + Mongo wiring, `PING` |
| 03 | Site banner | `SET` / `GET` / `DEL` / `EXISTS` |
| 04 | Login OTP with TTL | `SET ... EX`, `TTL` |
| 05 | User profile cache: JSON vs Hash | Strings vs Hashes, `HSET` / `HGETALL` |
| 06 | Email queue with Lists | `LPUSH` / `RPOP`, and the limits of using lists as queues |
| 07 | Order jobs with BullMQ | Retries, exponential backoff, workers, job lifecycle |
| 08 | Admin notifications via Pub/Sub | `PUBLISH` / `SUBSCRIBE`, separate publisher and subscriber processes |
| 09 | Live leaderboard and counters | `INCR`, sorted sets (`ZINCRBY`, `ZREVRANGE`, `ZREVRANK`) |

Each folder is self-contained: its own `package.json`, its own `src/`, its own endpoints.

## Where these patterns show up

The projects map to common production use cases:

- Project 04 is the structure behind login flows, password resets, and rate limiters.
- Project 07 is the architecture used for background jobs in most JavaScript-stack services.
- Project 08 is the basis for real-time notifications and cache invalidation fan-out.
- Project 09 uses sorted sets, which are O(log N) for inserts and rank lookups, making them the standard choice for leaderboards and trending feeds.

## Layout

```
redis-js/
├── docker-compose.yml
├── 02-setup-local-redis/
├── 03-site-banner/
├── 04-login-otp-with-ttl/
├── 05-user-profile-cache-json-vs-hash/
├── 06-email-queue-with-redis-lists/
├── 07-order-confirmation-jobs-with-bullmq/
├── 08-live-admin-notification-pubsub/
└── 09-live-leaderboard-and-counters/
```

## Notes

- Connection defaults: Redis at `redis://localhost:6379`, Mongo at `mongodb://localhost:27017/redis_tutorial`. Override with `REDIS_URL` and `MONGO_URL`.
- Projects 07 (BullMQ) and 08 (Pub/Sub) need two processes. Run the worker or subscriber in one terminal and the API in another.
- Compose enables AOF (`--appendonly yes`) so data survives container restarts.