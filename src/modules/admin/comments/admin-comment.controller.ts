import type { Request, Response, NextFunction } from "express";
import {
  adminGetCommentsService,
  adminApproveCommentService,
  adminRejectCommentService,
  adminDeleteCommentService,
  adminRestoreCommentService,
  adminHardDeleteCommentService,
} from "./admin-comment.service.js";
import type { CommentableType, CommentStatus } from "@prisma/client";

export const adminGetCommentsController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await adminGetCommentsService({
      page: Number(req.query.page ?? 1),
      limit: Number(req.query.limit ?? 20),
      targetType: req.query.targetType as CommentableType | undefined,
      targetId: req.query.targetId as string | undefined,
      userId: req.query.userId as string | undefined,
      status: req.query.status as CommentStatus | undefined,
      includeDeleted: Boolean(req.query.includeDeleted),
      search: req.query.search as string | undefined,
    });

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const adminApproveCommentController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const result = await adminApproveCommentService(id as string);

    res.status(200).json({
      success: true,
      data: result,
      message: "Comment approved",
    });
  } catch (error) {
    next(error);
  }
};

export const adminRejectCommentController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const result = await adminRejectCommentService(id as string, reason);

    res.status(200).json({
      success: true,
      data: result,
      message: "Comment rejected",
    });
  } catch (error) {
    next(error);
  }
};

export const adminDeleteCommentController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const result = await adminDeleteCommentService(id as string);

    res.status(200).json({
      success: true,
      data: result,
      message: "Comment deleted by admin",
    });
  } catch (error) {
    next(error);
  }
};

export const adminRestoreCommentController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const result = await adminRestoreCommentService(id as string);

    res.status(200).json({
      success: true,
      data: result,
      message: "Comment restored",
    });
  } catch (error) {
    next(error);
  }
};

export const adminHardDeleteCommentController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const result = await adminHardDeleteCommentService(id as string);

    res.status(200).json({
      success: true,
      data: result,
      message: "Comment permanently deleted",
    });
  } catch (error) {
    next(error);
  }
};