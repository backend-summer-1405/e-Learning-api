import type { Request, Response, NextFunction } from "express";
import redis from "../config/redis.js";


//   ttlSeconds 
//   jitterSeconds 
 
export const cacheMiddleware = (
    ttlSeconds: number = 60,
    jitterSeconds: number = 30
) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        if (req.method !== "GET") {
            return next();
        }

        const cacheKey = `cache:${req.originalUrl}`;

        try {
            const cachedData = await redis.get(cacheKey);

            if (cachedData) {
                res.setHeader("X-Cache", "HIT");
                return res.status(200).json(JSON.parse(cachedData));
            }

            const originalJson = res.json.bind(res);
            res.json = (data) => {
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    const jitter = Math.floor(Math.random() * jitterSeconds);
                    const finalTtl = ttlSeconds + jitter;

                    redis
                        .setex(cacheKey, finalTtl, JSON.stringify(data))
                        .catch((err) => {
                            console.error("Cache set error:", err);
                        });
                }

                res.setHeader("X-Cache", "MISS");
                return originalJson(data);
            };

            next();
        } catch (error) {
            console.error("Cache middleware error:", error);
            res.setHeader("X-Cache", "BYPASS");
            next();
        }
    };
};