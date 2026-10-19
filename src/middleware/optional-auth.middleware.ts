import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const optionalAuthMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return next();
    }

    const token = authHeader.slice(7);

    if (!token) {
      return next();
    }

    const secret = process.env.JWT_SECRET;

    if (!secret) {
      throw new Error("JWT_SECRET is not configured");
    }

    const decoded = jwt.verify(token, secret);

    if (typeof decoded === "string" || typeof decoded.userId !== "string") {
      return next();
    }

    res.locals.userId = decoded.userId;
    res.locals.role = (decoded as any).role;

    next();
  } catch {
    next();
  }
};

export default optionalAuthMiddleware;