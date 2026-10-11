import type { Request, Response, NextFunction } from "express";
import { Prisma } from "@prisma/client";
import AppError from "../utils/AppError.js";

const errorMiddleware = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  //  custom application errors
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      success: false,
      message: error.message,
    });
  }

  //  prisam known request error
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      // Unique constraint violation
      case "P2002":
        return res.status(409).json({
          success: false,
          message: "A record with this value already exists",
        });

      // record required for an operation was not found
      case "P2025":
        return res.status(404).json({
          success: false,
          message: "The requested resource was not found",
        });

      // Foreign key constraint violation
      case "P2003":
        return res.status(409).json({
          success: false,
          message: "This operation conflicts with related data",
        });

      default:
        console.error("Prisma error:", error);

        return res.status(500).json({
          success: false,
          message: "A database error occurred",
        });
    }
  }

  //  Unexpected error
  console.error(error);

  return res.status(500).json({
    success: false,
    message: "Internal server error",
  });
};

export default errorMiddleware;