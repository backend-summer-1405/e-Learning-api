import AppError from "../../../utils/AppError.js";
import prisma from "../../../config/prisma.js";
import {
  adminFindWithdrawals,
  adminCountWithdrawals,
  adminFindWithdrawalById,
  adminApproveWithdrawal,
} from "./admin-withdrawal.repository.js";
import { findWalletByUserId } from "../../wallet/wallet.repository.js";
import type { AdminGetWithdrawalsQuery } from "./admin-withdrawal.types.js";

export const adminGetWithdrawalsService = async (
  query: AdminGetWithdrawalsQuery
) => {
  try {
    const [withdrawals, total] = await Promise.all([
      adminFindWithdrawals(query),
      adminCountWithdrawals(query),
    ]);

    return {
      withdrawals,
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

export const adminApproveWithdrawalService = async (id: string) => {
  try {
    const withdrawal = await adminFindWithdrawalById(id);
    if (!withdrawal) throw new AppError("Withdrawal not found", 404);
    if (withdrawal.status !== "PENDING") {
      throw new AppError("Withdrawal is not pending", 400);
    }

    await adminApproveWithdrawal(id);
    return { success: true };
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw error;
  }
};

export const adminRejectWithdrawalService = async (id: string, note: string) => {
  try {
    const withdrawal = await adminFindWithdrawalById(id);
    if (!withdrawal) throw new AppError("Withdrawal not found", 404);
    if (withdrawal.status !== "PENDING") {
      throw new AppError("Withdrawal is not pending", 400);
    }

    const wallet = await findWalletByUserId(withdrawal.userId);
    if (!wallet) throw new AppError("Wallet not found", 404);

    await prisma.$transaction([
      prisma.withdrawalRequest.update({
        where: { id },
        data: { status: "REJECTED", adminNote: note },
      }),
      prisma.wallet.update({
        where: { id: wallet.id },
        data: { balance: { increment: withdrawal.amount } },
      }),
      prisma.walletTransaction.create({
        data: {
          walletId: wallet.id,
          type: "REFUND",
          amount: withdrawal.amount,
          description: `بازگشت برداشت - ${withdrawal.amount.toLocaleString()} تومان`,
          referenceId: withdrawal.id,
        },
      }),
    ]);

    return { success: true };
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw error;
  }
};