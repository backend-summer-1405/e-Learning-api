import { Queue } from "bullmq";
import redisBullMQ from "../../../config/redis-bullmq.js";

export const subtitleQueue = new Queue("subtitle-generation", {
    connection: redisBullMQ,
    defaultJobOptions: {
        attempts: 3,
        backoff: {
            type: "exponential",
            delay: 5000,
        },
        removeOnComplete: 100,
        removeOnFail: 500,
    },
});

export const closeSubtitleQueue = async () => {
    await subtitleQueue.close();
};