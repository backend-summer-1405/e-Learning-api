import rateLimit from "express-rate-limit";

export const paymentCallbackLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,             
  message: {
    success: false,
    message: "Too many callback requests. Please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});