import prisma from "../../config/prisma.js";

export const findWalletByUserId = async (userId: string) => {
  return prisma.wallet.findUnique({
    where: { userId },
    select: {
      id: true,
      userId: true,
      balance: true,
      createdAt: true,
      updatedAt: true,
    },
  });
};

export const createWallet = async (userId: string) => {
  return prisma.wallet.create({
    data: { userId, balance: 0 },
    select: {
      id: true,
      userId: true,
      balance: true,
      createdAt: true,
      updatedAt: true,
    },
  });
};

export const getOrCreateWallet = async (userId: string) => {
  const existing = await findWalletByUserId(userId);
  if (existing) return existing;
  return createWallet(userId);
};

export const incrementWalletBalance = async (walletId: string, amount: number) => {
  return prisma.wallet.update({
    where: { id: walletId },
    data: { balance: { increment: amount } },
    select: { id: true, userId: true, balance: true },
  });
};

export const decrementWalletBalance = async (walletId: string, amount: number) => {
  return prisma.wallet.update({
    where: { id: walletId },
    data: { balance: { decrement: amount } },
    select: { id: true, userId: true, balance: true },
  });
};

export const createWalletTransaction = async (data: {
  walletId: string;
  type: "TOPUP" | "PURCHASE" | "REFUND" | "WITHDRAW";
  amount: number;
  description?: string;
  referenceId?: string;
}) => {
  return prisma.walletTransaction.create({
    data,
    select: {
      id: true,
      walletId: true,
      type: true,
      amount: true,
      description: true,
      referenceId: true,
      createdAt: true,
    },
  });
};

export const findWalletTransactions = async (walletId: string) => {
  return prisma.walletTransaction.findMany({
    where: {
      walletId
    },
    orderBy: {
      createdAt: "desc"
    },
    select: {
      id: true,
      walletId: true,
      type: true,
      amount: true,
      description: true,
      referenceId: true,
      createdAt: true,
    },
  });
};