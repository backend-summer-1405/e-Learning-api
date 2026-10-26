import AppError from "../../utils/AppError.js";
import prisma from "../../config/prisma.js";
import zarinpal from "../../config/zarinpal.js";
import {
  getOrCreateWallet,
  findWalletTransactions,
  findWalletByUserId,
} from "./wallet.repository.js";
import type {
  TopupResult,
  WithdrawInput,
  WithdrawResult,
} from "./wallet.types.js";

export const getWalletService = async (userId: string) => {
  try {
    const wallet = await getOrCreateWallet(userId);
    const transactions = await findWalletTransactions(wallet.id);
    return { wallet, transactions };
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw error;
  }
};

export const topupWalletService = async (
  userId: string,
  amount: number
): Promise<TopupResult> => {
  try {
    if (amount < 1000) {
      throw new AppError("Minimum topup amount is 1000 toman", 400);
    }

    const wallet = await getOrCreateWallet(userId);

    const payment = await prisma.payment.create({
      data: { userId, amount, status: "PENDING" },
    });

    let result;
    try {
      result = await zarinpal.create({
        amount,
        callback_url: `${process.env.BASE_URL}/api/payments/callback?paymentId=${payment.id}`,
        description: `شارژ کیف پول - ${amount.toLocaleString()} تومان`,
      });
    } catch (error) {
      await prisma.payment.update({
        where: { id: payment.id },
        data: { status: "FAILED" },
      });
      throw new AppError("Failed to create payment with ZarinPal", 500);
    }

    await prisma.payment.update({
      where: { id: payment.id },
      data: { authority: result.authority },
    });

    return {
      paymentId: payment.id,
      paymentUrl: result.link,
      authority: result.authority,
    };
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw error;
  }
};

export const withdrawService = async (
  userId: string,
  data: WithdrawInput
): Promise<WithdrawResult> => {
  try {
    const wallet = await findWalletByUserId(userId);
    if (!wallet) throw new AppError("Wallet not found", 404);

    if (wallet.balance < data.amount) {
      throw new AppError(
        `Insufficient balance. You have ${wallet.balance.toLocaleString()} toman.`,
        402
      );
    }

    return await prisma.$transaction(async (tx) => {
      await tx.wallet.update({
        where: { id: wallet.id },
        data: { balance: { decrement: data.amount } },
      });

      const withdrawal = await tx.withdrawalRequest.create({
        data: {
          userId,
          amount: data.amount,
          iban: data.iban,
          fullName: data.fullName,
          status: "PENDING",
        },
        select: {
          id: true,
          userId: true,
          amount: true,
          iban: true,
          fullName: true,
          status: true,
          createdAt: true,
        },
      });

      await tx.walletTransaction.create({
        data: {
          walletId: wallet.id,
          type: "WITHDRAW",
          amount: -data.amount,
          description: `درخواست برداشت - ${data.amount.toLocaleString()} تومان`,
          referenceId: withdrawal.id,
        },
      });

      return withdrawal;
    });
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw error;
  }
};

// ★ برای callback زرین‌پال
export const creditWalletAfterPaymentService = async (paymentId: string) => {
  try {
    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
    });

    if (!payment) throw new AppError("Payment not found", 404);

    if (payment.status === "SUCCESS") {
      return { success: true, alreadyCredited: true };
    }

    const wallet = await getOrCreateWallet(payment.userId);

    await prisma.$transaction([
      prisma.payment.update({
        where: { id: paymentId },
        data: { status: "SUCCESS" },
      }),
      prisma.wallet.update({
        where: { id: wallet.id },
        data: { balance: { increment: payment.amount } },
      }),
      prisma.walletTransaction.create({
        data: {
          walletId: wallet.id,
          type: "TOPUP",
          amount: payment.amount,
          referenceId: payment.id,
          description: `شارژ کیف پول - ${payment.amount.toLocaleString()} تومان`,
        },
      }),
    ]);

    return { success: true, alreadyCredited: false };
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw error;
  }
};

// ★ برای خرید دوره از کیف پول
export const deductWalletForPurchaseService = async (
  userId: string,
  amount: number,
  description: string,
  referenceId?: string
) => {
  try {
    const wallet = await findWalletByUserId(userId);
    if (!wallet) throw new AppError("Wallet not found", 404);

    if (wallet.balance < amount) {
      throw new AppError(
        `Insufficient wallet balance. You need ${(amount - wallet.balance).toLocaleString()} more toman.`,
        402
      );
    }

    await prisma.$transaction([
      prisma.wallet.update({
        where: { id: wallet.id },
        data: { balance: { decrement: amount } },
      }),
      prisma.walletTransaction.create({
        data: {
          walletId: wallet.id,
          type: "PURCHASE",
          amount: -amount,
          description,
          referenceId,
        },
      }),
    ]);

    return { success: true };
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw error;
  }
};