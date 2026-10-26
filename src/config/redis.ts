import { Redis } from "ioredis";

const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379", {
    maxRetriesPerRequest: 3,
    retryStrategy: (times) => Math.min(times * 50, 2000),
    enableReadyCheck: true,
    lazyConnect: false,
});

redis.on("connect", () => console.log(" Redis connected"));
redis.on("error", (err) => console.error(" Redis error:", err.message));

export default redis;