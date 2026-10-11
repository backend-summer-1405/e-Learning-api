import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import AppError from "../utils/AppError.js";

const authMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            throw new AppError("Authentication required", 401);
        }

        const token = authHeader.slice(7);

        if (!token) {
            throw new AppError("Authentication token is missing", 401);
        }

        const secret = process.env.JWT_SECRET;

        if (!secret) {
            throw new Error("JWT_SECRET is not configured");
        }

        const decoded = jwt.verify(token, secret);

        if (
            typeof decoded === "string" ||
            typeof decoded.userId !== "string"
        ) {
            throw new AppError("Invalid authentication token", 401);
        }

        res.locals.userId = decoded.userId;

        next();
    } catch (error) {
        if (error instanceof AppError) {
            next(error);
            return;
        }

        if (error instanceof jwt.TokenExpiredError) {
            next(new AppError("Authentication token has expired", 401));
            return;
        }

        if (error instanceof jwt.JsonWebTokenError) {
            next(new AppError("Invalid authentication token", 401));
            return;
        }

        next(error);
    }
};

export default authMiddleware;