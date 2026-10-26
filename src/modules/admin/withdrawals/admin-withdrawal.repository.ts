import prisma from "../../../config/prisma.js";
import type { AdminGetWithdrawalsQuery } from "./admin-withdrawal.types.js";

const buildWhere = (query: AdminGetWithdrawalsQuery) => {
  const where: any = {};
  if (query.status) where.status = query.status;
  if (query.userId) where.userId = query.userId;
  return where;
};

export const adminFindWithdrawals = async (query: AdminGetWithdrawalsQuery) => {
  const skip = (query.page - 1) * query.limit;
  const where = buildWhere(query);

  return prisma.withdrawalRequest.findMany({
    where,
    include: {
      user: {
        select: { id: true, name: true, email: true, avatarUrl: true },
      },
    },
    orderBy: { createdAt: "desc" },
    skip,
    take: query.limit,
  });
};

export const adminCountWithdrawals = async (query: AdminGetWithdrawalsQuery) => {
  const where = buildWhere(query);
  return prisma.withdrawalRequest.count({ where });
};

export const adminFindWithdrawalById = async (id: string) => {
  return prisma.withdrawalRequest.findUnique({
    where: { id },
    include: {
      user: { select: { id: true, name: true, email: true } },
    },
  });
};

export const adminApproveWithdrawal = async (id: string) => {
  return prisma.withdrawalRequest.update({
    where: { id },
    data: { status: "APPROVED" },
  });
};

export const adminRejectWithdrawal = async (id: string, note: string) => {
  return prisma.withdrawalRequest.update({
    where: { id },
    data: { status: "REJECTED", adminNote: note },
  });
};