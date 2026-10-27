import crypto from "node:crypto";
import prisma from "../../config/prisma.js";
import AppError from "../../utils/AppError.js";
import {
  findCommentById,
  createComment,
  updateComment,
  softDeleteComment,
  findTopLevelComments,
  findCommentSubtree,
  countComments,
  setCommentReaction,
  removeCommentReaction,
  getCommentReactionCounts,
} from "./comment.repository.js";
import type { CreateCommentInput } from "./comment.types.js";
import type { CommentableType } from "@prisma/client";
import { createNotificationService } from "../notifications/notification.service.js";
import { clearCommentCache } from "../../utils/cache.utils.js";

const assertTargetExists = async (
  targetType: CommentableType,
  targetId: string
): Promise<void> => {
  switch (targetType) {
    case "NEWS": {
      const news = await prisma.news.findUnique({
        where: {
          id: targetId
        },
        select: {
          id: true
        },
      });
      if (!news) throw new AppError("News not found", 404);
      break;
    }

    case "COURSE": {
      const course = await prisma.course.findUnique({
        where: {
          id: targetId
        },
        select: {
          id: true
        },
      });
      if (!course) throw new AppError("Course not found", 404);
      break;
    }
    case "PODCAST": {
      const podcast = await prisma.podcast.findUnique({
        where: {
          id: targetId
        },
        select: {
          id: true
        },
      });
      if (!podcast) throw new AppError("Podcast not found", 404);
      break;
    }


    default:
      throw new AppError("Invalid target type", 400);
  }
};

export const createCommentService = async (
  userId: string,
  data: CreateCommentInput
) => {
  try {
    await assertTargetExists(data.targetType, data.targetId);

    let parentPath = "";
    let parentDepth = -1;

    if (data.parentId) {
      const parent = await findCommentById(data.parentId);

      if (!parent) {
        throw new AppError("Parent comment not found", 404);
      }

      if (
        parent.targetType !== data.targetType ||
        parent.targetId !== data.targetId
      ) {
        throw new AppError("Parent comment belongs to a different target", 400);
      }

      if (parent.status !== "APPROVED") {
        throw new AppError("Cannot reply to a non-approved comment", 400);
      }

      parentPath = parent.path;
      parentDepth = parent.depth;
    }

    const newId = crypto.randomUUID();
    const path = parentPath ? `${parentPath}.${newId}` : newId;
    const depth = parentDepth + 1;

    const createdComment = await createComment({
      content: data.content.trim(),
      userId,
      targetType: data.targetType,
      targetId: data.targetId,
      parentId: data.parentId ?? null,
      path,
      depth,
      timestamp: data.targetType === "PODCAST" ? data.timestamp : null,
    });


    if (data.parentId) {
      const parent = await findCommentById(data.parentId);
      if (parent && parent.userId !== userId) {
        await createNotificationService({
          userId: parent.userId,
          type: "COMMENT_REPLY",
          title: "پاسخ جدید به کامنتت",
          message: "کسی به کامنتت پاسخ داد",
          data: {
            commentId: createdComment.id,
            parentId: data.parentId,
            targetType: data.targetType,
            targetId: data.targetId,
          },
        });
      }
    }

    // update podcast commentcount
    if (data.targetType === "PODCAST") {
      await prisma.podcast.update({
        where: { id: data.targetId },
        data: { commentCount: { increment: 1 } },
      });
    }

    await clearCommentCache()

    return createdComment;
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw error;
  }
};

export const getCommentsService = async (data: {
  targetType: CommentableType;
  targetId: string;
  page: number;
  limit: number;
  viewerId?: string;
  viewerRole?: string;
}) => {
  try {
    await assertTargetExists(data.targetType, data.targetId);

    const [comments, total] = await Promise.all([
      findTopLevelComments({
        targetType: data.targetType,
        targetId: data.targetId,
        page: data.page,
        limit: data.limit,
        viewerId: data.viewerId,
        viewerRole: data.viewerRole,
      }),
      countComments({
        targetType: data.targetType,
        targetId: data.targetId,
        viewerId: data.viewerId,
        viewerRole: data.viewerRole,
      }),
    ]);

    return {
      comments,
      pagination: {
        page: data.page,
        limit: data.limit,
        total,
        totalPages: Math.ceil(total / data.limit),
      },
    };
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw error;
  }
};

export const getCommentRepliesService = async (
  commentId: string,
  viewerId?: string,
  viewerRole?: string
) => {
  try {
    const comment = await findCommentById(commentId);

    if (!comment) {
      throw new AppError("Comment not found", 404);
    }

    if (comment.status !== "APPROVED") {
      throw new AppError("Comment is not approved", 403);
    }

    return await findCommentSubtree({
      path: comment.path,
      targetType: comment.targetType,
      targetId: comment.targetId,
      viewerId,
      viewerRole,
    });
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw error;
  }
};

export const updateCommentService = async (
  userId: string,
  commentId: string,
  content: string
) => {
  try {
    const comment = await findCommentById(commentId);

    if (!comment) {
      throw new AppError("Comment not found", 404);
    }

    if (comment.userId !== userId) {
      throw new AppError("You can only edit your own comments", 403);
    }

    if (comment.deletedAt) {
      throw new AppError("Cannot edit a deleted comment", 400);
    }

    const updated = await updateComment(commentId, content.trim());

    await clearCommentCache();

    return updated;

  } catch (error) {
    if (error instanceof AppError) throw error;
    throw error;
  }
};

export const deleteCommentService = async (
  userId: string,
  commentId: string
) => {
  try {
    const comment = await findCommentById(commentId);

    if (!comment) {
      throw new AppError("Comment not found", 404);
    }

    if (comment.userId !== userId) {
      throw new AppError("You can only delete your own comments", 403);
    }

    if (comment.deletedAt) {
      throw new AppError("Comment is already deleted", 400);
    }

    await softDeleteComment(commentId);
    await clearCommentCache();

    //  updaste podcast comment Count
    if (comment.targetType === "PODCAST") {
      await prisma.podcast.update({
        where: { id: comment.targetId },
        data: {
          commentCount: {
            decrement: 1
          }
        },
      });
    }

    return { success: true };

  } catch (error) {
    if (error instanceof AppError) throw error;
    throw error;
  }
};

export const setCommentReactionService = async (data: {
  userId: string;
  commentId: string;
  type: "LIKE" | "DISLIKE";
}) => {
  try {
    const comment = await findCommentById(data.commentId);

    if (!comment) {
      throw new AppError("Comment not found", 404);
    }

    if (comment.deletedAt) {
      throw new AppError("Cannot react to a deleted comment", 400);
    }

    if (comment.status !== "APPROVED") {
      throw new AppError("Cannot react to a non-approved comment", 400);
    }

    const existingReaction = await prisma.commentReaction.findUnique({
      where: {
        userId_commentId: {
          userId: data.userId,
          commentId: data.commentId,
        },
      },
    });

    const result = await setCommentReaction(data);

    if (
      data.type === "LIKE" &&
      !existingReaction &&
      comment.userId !== data.userId
    ) {
      await createNotificationService({
        userId: comment.userId,
        type: "COMMENT_LIKE",
        title: "کامنتت لایک شد",
        message: "کسی کامنتت رو لایک کرد",
        data: {
          commentId: data.commentId,
          targetType: comment.targetType,
          targetId: comment.targetId,
        },
      });
    }

    return result;
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw error;
  }
};

export const removeCommentReactionService = async (data: {
  userId: string;
  commentId: string;
}) => {
  try {
    const comment = await findCommentById(data.commentId);

    if (!comment) {
      throw new AppError("Comment not found", 404);
    }

    const result = await removeCommentReaction(data);

    if (result.count === 0) {
      throw new AppError("Reaction not found", 404);
    }

    await clearCommentCache();

    return { success: true };
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw error;
  }
};

export const getCommentReactionCountsService = async (commentId: string) => {
  try {
    return await getCommentReactionCounts(commentId);
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw error;
  }
};