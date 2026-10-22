import type { CommentableType, CommentStatus } from "@prisma/client";

export type CreateCommentInput = {
  content: string;
  targetType: CommentableType;
  targetId: string;
  parentId?: string | null;
  timestamp?: number;
};

export type UpdateCommentInput = {
  content: string;
};

export type GetCommentsQuery = {
  targetType: CommentableType;
  targetId: string;
  page: number;
  limit: number;
  viewerId?: string;
  viewerRole?: string;
};

export type CommentUser = {
  id: string;
  name: string;
  avatarUrl: string | null;
};

export type CommentResponse = {
  id: string;
  content: string;
  userId: string;
  parentId: string | null;
  path: string;
  depth: number;
  targetId: string;
  targetType: CommentableType;
  status: CommentStatus;
  rejectionReason: string | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  user: CommentUser;
  repliesCount?: number;
  likeCount?: number;
  dislikeCount?: number;
};

export type CommentsPagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type GetCommentsResult = {
  comments: CommentResponse[];
  pagination: CommentsPagination;
};

export type CommentReactionCounts = {
  likeCount: number;
  dislikeCount: number;
};

export type DeleteCommentResult = {
  success: boolean;
};