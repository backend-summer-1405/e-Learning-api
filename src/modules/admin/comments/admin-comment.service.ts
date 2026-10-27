import AppError from "../../../utils/AppError.js";
import { createNotificationService } from "../../notifications/notification.service.js";
import {
  adminFindComments,
  adminCountComments,
  adminFindCommentById,
  adminApproveComment,
  adminRejectComment,
  adminSoftDeleteComment,
  adminRestoreComment,
  adminHardDeleteComment,
} from "./admin-comment.repository.js";
import type {
  AdminGetCommentsQuery,
  AdminGetCommentsResult,
  AdminActionSuccess,
} from "./admin-comment.types.js";

import { clearCommentCache } from "../../../utils/cache.utils.js";

export const adminGetCommentsService = async (
  query: AdminGetCommentsQuery
): Promise<AdminGetCommentsResult> => {
  try {
    const [comments, total] = await Promise.all([
      adminFindComments(query),
      adminCountComments(query),
    ]);

    return {
      comments,
      pagination: {
        page: query.page,
        limit: query.limit,
        total,
        totalPages: Math.ceil(total / query.limit),
      },
    };
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw error;
  }
};

export const adminApproveCommentService = async (
  id: string
): Promise<AdminActionSuccess> => {
  try {
    const comment = await adminFindCommentById(id);

    if (!comment) throw new AppError("Comment not found", 404);
    if (comment.status === "APPROVED")
      throw new AppError("Comment is already approved", 400);
    if (comment.deletedAt)
      throw new AppError("Cannot approve a deleted comment", 400);
    ;

    await adminApproveComment(id);

    await clearCommentCache()

    // ★ Notification
    await createNotificationService({
      userId: comment.userId,
      type: "COMMENT_APPROVED",
      title: "کامنتت تأیید شد",
      message: "کامنتت توسط ادمین تأیید شد",
      data: { commentId: id },
    });

    return {
      success: true
    };

  } catch (error) {
    if (error instanceof AppError) throw error;
    throw error;
  }
};

export const adminRejectCommentService = async (
  id: string,
  reason: string
): Promise<AdminActionSuccess> => {
  try {
    const comment = await adminFindCommentById(id);

    if (!comment) throw new AppError("Comment not found", 404);
    if (comment.status === "REJECTED")
      throw new AppError("Comment is already rejected", 400);
    if (comment.deletedAt)
      throw new AppError("Cannot reject a deleted comment", 400);

    await adminRejectComment(id, reason);
    await clearCommentCache();

    // ★ Notification
    await createNotificationService({
      userId: comment.userId,
      type: "COMMENT_REJECTED",
      title: "کامنتت رد شد",
      message: `کامنتت رد شد. دلیل: ${reason}`,
      data: { commentId: id, reason },
    });

    return { success: true };

  } catch (error) {
    if (error instanceof AppError) throw error;
    throw error;
  }
};

export const adminDeleteCommentService = async (
  id: string
): Promise<AdminActionSuccess> => {
  try {
    const comment = await adminFindCommentById(id);

    if (!comment) throw new AppError("Comment not found", 404);
    if (comment.deletedAt)
      throw new AppError("Comment is already deleted", 400);

    await adminSoftDeleteComment(id);
    await clearCommentCache();

    return { success: true };
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw error;
  }
};

export const adminRestoreCommentService = async (
  id: string
): Promise<AdminActionSuccess> => {
  try {
    const comment = await adminFindCommentById(id);

    if (!comment) throw new AppError("Comment not found", 404);
    if (!comment.deletedAt)
      throw new AppError("Comment is not deleted", 400);

    await adminRestoreComment(id);
    await clearCommentCache();

    return { success: true };
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw error;
  }
};

export const adminHardDeleteCommentService = async (
  id: string
): Promise<AdminActionSuccess> => {
  try {
    const comment = await adminFindCommentById(id);

    if (!comment) throw new AppError("Comment not found", 404);

    await adminHardDeleteComment(id);
    await clearCommentCache();

    return { success: true };
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw error;
  }
};