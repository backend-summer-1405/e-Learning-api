import type { Request, Response, NextFunction } from "express";
import AppError from "../utils/AppError.js";

const teacherMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const role = res.locals.role as string;

    if (role !== "TEACHER" && role !== "ADMIN") {
      throw new AppError("Teacher or admin access required", 403);
    }

    next();
  } catch (error) {
    next(error);
  }
};

export default teacherMiddleware;