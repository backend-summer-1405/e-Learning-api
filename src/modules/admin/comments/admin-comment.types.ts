import type { CommentableType, CommentStatus } from "@prisma/client";

export type AdminGetCommentsQuery = {
  page: number;
  limit: number;
  targetType?: CommentableType;
  targetId?: string;
  userId?: string;
  status?: CommentStatus;
  includeDeleted?: boolean;
  search?: string;
};

export type AdminCommentsPagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type AdminGetCommentsResult = {
  comments: any[];
  pagination: AdminCommentsPagination;
};

export type AdminActionSuccess = {
  success: boolean;
};