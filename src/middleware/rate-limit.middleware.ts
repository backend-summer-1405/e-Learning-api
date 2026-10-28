import rateLimit from "express-rate-limit";
import { RedisStore } from "rate-limit-redis";
import redis from "../config/redis.js";

const createRedisStore = (prefix: string) =>
  new RedisStore({
    sendCommand: (command: string, ...args: string[]) =>
      redis.call(command, ...args) as Promise<any>,
    prefix: `rate-limit:${prefix}:`,
  });

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: {
    success: false,
    message: "Too many auth attempts. Please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
  store: createRedisStore("auth"),

});

export const paymentCallbackLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  message: {
    success: false,
    message: "Too many callback requests. Please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
  store: createRedisStore("payment"),
  passOnStoreError: true,
});