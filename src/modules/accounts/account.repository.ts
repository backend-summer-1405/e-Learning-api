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

export const findAccountById = async (accountId: string) => {
  return prisma.account.findUnique({
    where: { id: accountId },
    include: {
      images: true,
    },
  });
};

export const findAccountByUsername = async (username: string) => {
  return prisma.account.findUnique({
    where: { username },
  });
};

export const updateAccount = async (
  userId: string,
  accountId: string,
  data: {
    username?: string;
    name?: string | null;
  },
) => {
  return prisma.account.update({
    where: {
      id: accountId,
      userId,
    },
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

export const deleteAccount = async (
  userId: string,
  accountId: string,
) => {
  return prisma.account.delete({
    where: {
      id: accountId,
      userId,
    },
    select: {
      id: true,
      username: true,
      name: true,
      userId: true,
    },
  });
};