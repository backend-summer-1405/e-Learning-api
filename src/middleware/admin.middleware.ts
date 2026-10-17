import type { Request, Response, NextFunction } from "express";
import prisma from "../config/prisma.js";
import AppError from "../utils/AppError.js";

const adminMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = res.locals.userId;
    // console.log("ADMIN MIDDLEWARE:", userId);

    if (typeof userId !== "string") {
      throw new AppError("Authentication required", 401);
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });

    if (!user) {
      throw new AppError("User not found", 404);
    }

    if (user.role !== "ADMIN") {
      throw new AppError("Admin access required", 403);
    }

    next();
  } catch (error) {
    next(error);
  }
};

export default adminMiddleware;