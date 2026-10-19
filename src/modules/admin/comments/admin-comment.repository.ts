import prisma from "../../../config/prisma.js";
import type { AdminGetCommentsQuery } from "./admin-comment.types.js";

const buildWhere = (query: AdminGetCommentsQuery) => {
  const where: any = {};

  if (query.targetType) where.targetType = query.targetType;
  if (query.targetId) where.targetId = query.targetId;
  if (query.userId) where.userId = query.userId;
  if (query.status) where.status = query.status;
  if (!query.includeDeleted) where.deletedAt = null;

  if (query.search) {
    where.OR = [
      { content: { contains: query.search, mode: "insensitive" } },
      { user: { name: { contains: query.search, mode: "insensitive" } } },
    ];
  }

  return where;
};

export const adminFindComments = async (query: AdminGetCommentsQuery) => {
  const skip = (query.page - 1) * query.limit;
  const where = buildWhere(query);

  return prisma.comment.findMany({
    where,
    include: {
      user: {
        select: { id: true, name: true, email: true, avatarUrl: true },
      },
      _count: {
        select: { replies: true, reactions: true },
      },
    },
    orderBy: { createdAt: "desc" },
    skip,
    take: query.limit,
  });
};

export const adminCountComments = async (query: AdminGetCommentsQuery) => {
  const where = buildWhere(query);
  return prisma.comment.count({ where });
};

export const adminFindCommentById = async (id: string) => {
  return prisma.comment.findUnique({
    where: { id },
    include: {
      user: {
        select: { id: true, name: true, email: true, avatarUrl: true },
      },
    },
  });
};

export const adminApproveComment = async (id: string) => {
  return prisma.comment.update({
    where: { id },
    data: { status: "APPROVED", rejectionReason: null },
  });
};

export const adminRejectComment = async (id: string, reason: string) => {
  return prisma.comment.update({
    where: { id },
    data: { status: "REJECTED", rejectionReason: reason },
  });
};

export const adminSoftDeleteComment = async (id: string) => {
  return prisma.comment.update({
    where: { id },
    data: { deletedAt: new Date(), content: "[deleted by admin]" },
  });
};

export const adminRestoreComment = async (id: string) => {
  return prisma.comment.update({
    where: { id },
    data: { deletedAt: null },
  });
};

export const adminHardDeleteComment = async (id: string) => {
  return prisma.comment.delete({
    where: { id },
  });
};