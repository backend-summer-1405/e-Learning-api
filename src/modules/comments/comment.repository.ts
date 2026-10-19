import prisma from "../../config/prisma.js";
import type { CommentableType, CommentStatus } from "@prisma/client";
import type { GetCommentsQuery } from "./comment.types.js";

export const findCommentById = async (id: string) => {
  return prisma.comment.findUnique({
    where: { id },
    include: {
      user: {
        select: { id: true, name: true, avatarUrl: true },
      },
    },
  });
};

export const createComment = async (data: {
  content: string;
  userId: string;
  targetType: CommentableType;
  targetId: string;
  parentId: string | null;
  path: string;
  depth: number;
}) => {
  return prisma.comment.create({
    data,
    include: {
      user: {
        select: { id: true, name: true, avatarUrl: true },
      },
    },
  });
};

export const updateComment = async (id: string, content: string) => {
  return prisma.comment.update({
    where: { id },
    data: { content },
    include: {
      user: {
        select: { id: true, name: true, avatarUrl: true },
      },
    },
  });
};

export const softDeleteComment = async (id: string) => {
  return prisma.comment.update({
    where: { id },
    data: { deletedAt: new Date(), content: "[deleted]" },
  });
};

const buildStatusFilter = (viewerId?: string, viewerRole?: string) => {
  if (viewerRole === "ADMIN") {
    return {};
  }

  if (viewerId) {
    return {
      OR: [
        { status: "APPROVED" as CommentStatus },
        { userId: viewerId },
      ],
    };
  }

  return { status: "APPROVED" as CommentStatus };
};

export const findTopLevelComments = async (query: GetCommentsQuery) => {
  const skip = (query.page - 1) * query.limit;
  const statusFilter = buildStatusFilter(query.viewerId, query.viewerRole);

  return prisma.comment.findMany({
    where: {
      targetType: query.targetType,
      targetId: query.targetId,
      parentId: null,
      deletedAt: null,
      ...statusFilter,
    },
    include: {
      user: {
        select: { id: true, name: true, avatarUrl: true },
      },
      _count: {
        select: { replies: true },
      },
    },
    orderBy: { createdAt: "desc" },
    skip,
    take: query.limit,
  });
};

export const findCommentSubtree = async (data: {
  path: string;
  targetType: CommentableType;
  targetId: string;
  viewerId?: string;
  viewerRole?: string;
}) => {
  const statusFilter = buildStatusFilter(data.viewerId, data.viewerRole);

  return prisma.comment.findMany({
    where: {
      targetType: data.targetType,
      targetId: data.targetId,
      path: { startsWith: `${data.path}.` },
      deletedAt: null,
      ...statusFilter,
    },
    include: {
      user: {
        select: { id: true, name: true, avatarUrl: true },
      },
      _count: {
        select: { replies: true },
      },
    },
    orderBy: { path: "asc" },
  });
};

export const countComments = async (data: {
  targetType: CommentableType;
  targetId: string;
  viewerId?: string;
  viewerRole?: string;
}) => {
  const statusFilter = buildStatusFilter(data.viewerId, data.viewerRole);

  return prisma.comment.count({
    where: {
      targetType: data.targetType,
      targetId: data.targetId,
      deletedAt: null,
      ...statusFilter,
    },
  });
};

export const setCommentReaction = async (data: {
  userId: string;
  commentId: string;
  type: "LIKE" | "DISLIKE";
}) => {
  return prisma.commentReaction.upsert({
    where: {
      userId_commentId: {
        userId: data.userId,
        commentId: data.commentId,
      },
    },
    update: { type: data.type },
    create: {
      userId: data.userId,
      commentId: data.commentId,
      type: data.type,
    },
  });
};

export const removeCommentReaction = async (data: {
  userId: string;
  commentId: string;
}) => {
  return prisma.commentReaction.deleteMany({
    where: {
      userId: data.userId,
      commentId: data.commentId,
    },
  });
};

export const getCommentReactionCounts = async (commentId: string) => {
  const reactions = await prisma.commentReaction.groupBy({
    by: ["type"],
    where: { commentId },
    _count: true,
  });

  const likeCount = reactions.find((r) => r.type === "LIKE")?._count ?? 0;
  const dislikeCount = reactions.find((r) => r.type === "DISLIKE")?._count ?? 0;

  return { likeCount, dislikeCount };
};