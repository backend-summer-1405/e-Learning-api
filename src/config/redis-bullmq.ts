import { Redis } from "ioredis";

const redisBullMQ = new Redis(
    process.env.REDIS_URL || "redis://localhost:6379",
    {
        maxRetriesPerRequest: null,  
    }
);

redisBullMQ.on("connect", () => {
    console.log(" Redis (BullMQ) connected");
});

redisBullMQ.on("error", (err) => {
    console.error("Redis (BullMQ) error:", err.message);
});

export default redisBullMQ;