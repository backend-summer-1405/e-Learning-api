import prisma from "../../config/prisma.js";

export const createAccount = async (data: {
  username: string;
  name?: string;
  userId: string;
}) => {
  return prisma.account.create({
    data: {
      username: data.username,
      name: data.name,
      userId: data.userId,
    },
    select: {
      id: true,
      username: true,
      name: true,
      userId: true,
      createdAt: true,
      updatedAt: true,
    },
  });
};

export const findAccountsByUserId = async (userId: string) => {
  return prisma.account.findMany({
    where: { userId },
    orderBy: { createdAt: "asc" },
    select: {
      id: true,
      username: true,
      name: true,
      createdAt: true,
      updatedAt: true,
      images: {
        select: {
          id: true,
          url: true,
          isPrimary: true,
          createdAt: true,
        },
      },
    },
  });
};

export const findAccountById = async (accountId: string, userId: string) => {
  return prisma.account.findFirst({
    where: {
      id: accountId,
      userId,
    },
    include: { images: true },
  });
};

export const findAccountByUsername = async (username: string) => {
  return prisma.account.findUnique({
    where: { username },
  });
};

export const updateAccount = async (
  accountId: string,
  data: {
    username?: string;
    name?: string | null;
  }
) => {
  return prisma.account.update({
    where: { id: accountId },
    data,
    select: {
      id: true,
      username: true,
      name: true,
      userId: true,
      createdAt: true,
      updatedAt: true,
    },
  });
};

export const deleteAccount = async (accountId: string) => {
  return prisma.account.delete({
    where: { id: accountId },
    select: {
      id: true,
      username: true,
      name: true,
      userId: true,
      images: {
        select: {
          id: true,
          url: true,
        },
      },
    },
  });
};


export const switchActiveAccount = async (
  userId: string,
  accountId: string
) => {
  return prisma.user.update({
    where: { id: userId },
    data: { activeAccountId: accountId },
    select: {
      id: true,
      activeAccountId: true,
    },
  });
};

export const findActiveAccount = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { activeAccountId: true },
  });

  if (!user?.activeAccountId) return null;

  return prisma.account.findUnique({
    where: { id: user.activeAccountId },
    include: { images: true },
  });
};

export const clearActiveAccount = async (userId: string) => {
  return prisma.user.update({
    where: { id: userId },
    data: { activeAccountId: null },
  });
};