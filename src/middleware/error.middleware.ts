import type { Request, Response, NextFunction } from "express";
import { Prisma } from "@prisma/client";
import multer from "multer";
import AppError from "../utils/AppError.js";

const errorMiddleware = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // custom application errors
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      success: false,
      message: error.message,
    });
  }

  // Multer upload errors
  if (error instanceof multer.MulterError) {
    switch (error.code) {
      // File size limit exceeded
      case "LIMIT_FILE_SIZE":
        return res.status(413).json({
          success: false,
          message: "Each image must be 5 MB or smaller",
        });

      // Too many files or unexpected file field
      case "LIMIT_FILE_COUNT":
      case "LIMIT_UNEXPECTED_FILE":
        return res.status(400).json({
          success: false,
          message: "You can upload a maximum of 5 images",
        });

      // Invalid multipart form data
      case "LIMIT_PART_COUNT":
      case "LIMIT_FIELD_COUNT":
      case "LIMIT_FIELD_KEY":
      case "LIMIT_FIELD_VALUE":
        return res.status(400).json({
          success: false,
          message: "Invalid multipart form data",
        });

      default:
        return res.status(400).json({
          success: false,
          message: "Image upload failed",
        });
    }
  }

  // Prisma known request errors
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      // Unique constraint violation
      case "P2002":
        return res.status(409).json({
          success: false,
          message: "A record with this value already exists",
        });

      // Record required for an operation was not found
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

  // Unexpected errors
  console.error(error);

  return res.status(500).json({
    success: false,
    message: "Internal server error",
  });
};

export default errorMiddleware;