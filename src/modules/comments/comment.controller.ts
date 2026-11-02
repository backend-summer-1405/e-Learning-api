import type { Request, Response, NextFunction } from "express";
import {
  createCommentService,
  getCommentsService,
  getCommentRepliesService,
  updateCommentService,
  deleteCommentService,
  setCommentReactionService,
  removeCommentReactionService,
  getCommentReactionCountsService,
} from "./comment.service.js";
import AppError from "../../utils/AppError.js";
import type { CommentableType } from "@prisma/client";

const getTargetParams = (req: Request) => {
  const { targetType, targetId } = req.params;

  if (typeof targetType !== "string" || typeof targetId !== "string") {
    throw new AppError("Invalid target", 400);
  }

  return {
    targetType: targetType.toUpperCase() as CommentableType,
    targetId,
  };
};

const getCommentId = (req: Request) => {
  const { commentId } = req.params;

  if (typeof commentId !== "string") {
    throw new AppError("Invalid comment ID", 400);
  }

  return commentId;
};

export const createCommentController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = res.locals.userId as string;
    const { targetType, targetId } = getTargetParams(req);

    const comment = await createCommentService(userId, {
      ...req.body,
      targetType,
      targetId,
    });

    res.status(201).json({
      success: true,
      data: comment,
      message: "Comment created successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const getCommentsController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const viewerId = res.locals.userId as string | undefined;
    const viewerRole = res.locals.role as string | undefined;
    const { targetType, targetId } = getTargetParams(req);

    const result = await getCommentsService({
      targetType,
      targetId,
      page: Number(req.query.page ?? 1),
      limit: Number(req.query.limit ?? 10),
      viewerId,
      viewerRole,
    });

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const getCommentRepliesController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const viewerId = res.locals.userId as string | undefined;
    const viewerRole = res.locals.role as string | undefined;
    const commentId = getCommentId(req);

    const replies = await getCommentRepliesService(
      commentId,
      viewerId,
      viewerRole
    );

    res.status(200).json({
      success: true,
      data: replies,
    });
  } catch (error) {
    next(error);
  }
};

export const updateCommentController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = res.locals.userId as string;
    const commentId = getCommentId(req);
    const { content } = req.body;

    const comment = await updateCommentService(userId, commentId, content);

    res.status(200).json({
      success: true,
      data: comment,
      message: "Comment updated successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const deleteCommentController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = res.locals.userId as string;
    const commentId = getCommentId(req);

    const result = await deleteCommentService(userId, commentId);

    res.status(200).json({
      success: true,
      data: result,
      message: "Comment deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const setCommentReactionController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = res.locals.userId as string;
    const commentId = getCommentId(req);
    const { type } = req.body;

    const reaction = await setCommentReactionService({
      userId,
      commentId,
      type,
    });

    res.status(200).json({
      success: true,
      data: reaction,
      message: "Reaction set successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const removeCommentReactionController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = res.locals.userId as string;
    const commentId = getCommentId(req);

    const result = await removeCommentReactionService({
      userId,
      commentId,
    });

    res.status(200).json({
      success: true,
      data: result,
      message: "Reaction removed successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const getCommentReactionCountsController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const commentId = getCommentId(req);
    const counts = await getCommentReactionCountsService(commentId);

    res.status(200).json({
      success: true,
      data: counts,
    });
  } catch (error) {
    next(error);
  }
};