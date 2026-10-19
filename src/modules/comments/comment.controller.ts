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
import type { CommentableType } from "@prisma/client";

export const createCommentController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = res.locals.userId as string;
    const comment = await createCommentService(userId, req.body);

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

    const result = await getCommentsService({
      targetType: req.query.targetType as CommentableType,
      targetId: req.query.targetId as string,
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
    const { id } = req.params;

    const replies = await getCommentRepliesService(
      id as string,
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
    const { id } = req.params;
    const { content } = req.body;

    const comment = await updateCommentService(userId, id as string, content);

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
    const { id } = req.params;

    const result = await deleteCommentService(userId, id as string);

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
    const { id } = req.params;
    const { type } = req.body;

    const reaction = await setCommentReactionService({
      userId,
      commentId: id as string,
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
    const { id } = req.params;

    const result = await removeCommentReactionService({
      userId,
      commentId: id as string,
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
    const { id } = req.params;
    const counts = await getCommentReactionCountsService(id as string);

    res.status(200).json({
      success: true,
      data: counts,
    });
  } catch (error) {
    next(error);
  }
};