import prisma from "../../../config/prisma.js";
import type { Role } from "@prisma/client";
import type { AdminGetUsersQuery } from "./admin-user.types.js";

const adminUserSelect = {
  id: true,
  name: true,
  email: true,
  role: true,
  avatarUrl: true,
  createdAt: true,
  updatedAt: true,
  activeAccountId: true,
  _count: {
    select: {
      accounts: true,
      enrollments: true,
      courses: true,
      comments: true,
    },
  },
};

const buildWhere = (query: AdminGetUsersQuery) => {
  const where: any = {};

  if (query.role) where.role = query.role;

  if (query.search) {
    where.OR = [
      { name: { contains: query.search, mode: "insensitive" } },
      { email: { contains: query.search, mode: "insensitive" } },
    ];
  }

  return where;
};

export const adminFindUsers = async (query: AdminGetUsersQuery) => {
  const skip = (query.page - 1) * query.limit;
  const where = buildWhere(query);
  const sortBy = query.sortBy ?? "createdAt";
  const sortOrder = query.sortOrder ?? "desc";

  return prisma.user.findMany({
    where,
    select: adminUserSelect,
    orderBy: { [sortBy]: sortOrder },
    skip,
    take: query.limit,
  });
};

export const adminCountUsers = async (query: AdminGetUsersQuery) => {
  const where = buildWhere(query);
  return prisma.user.count({ where });
};

export const adminFindUserById = async (id: string) => {
  return prisma.user.findUnique({
    where: { id },
    select: {
      ...adminUserSelect,
      wallet: {
        select: { id: true, balance: true },
      },
      accounts: {
        select: {
          id: true,
          username: true,
          name: true,
          createdAt: true,
          images: {
            select: { id: true, url: true, isPrimary: true },
          },
        },
      },
    },
  });
};

export const adminUpdateUser = async (
  id: string,
  data: {
    name?: string;
    role?: Role;
  }
) => {
  return prisma.user.update({
    where: { id },
    data,
    select: adminUserSelect,
  });
};

export const adminDeleteUser = async (id: string) => {
  return prisma.user.delete({ where: { id } });
};

// ★ آمار کلی کاربران
export const adminGetUserStats = async () => {
  const [total, byRole] = await Promise.all([
    prisma.user.count(),
    prisma.user.groupBy({
      by: ["role"],
      _count: true,
    }),
  ]);

  const stats: Record<string, number> = {
    USER: 0,
    TEACHER: 0,
    ADMIN: 0,
  };

  for (const r of byRole) {
    stats[r.role] = r._count;
  }

  return {
    total,
    byRole: stats,
  };
};