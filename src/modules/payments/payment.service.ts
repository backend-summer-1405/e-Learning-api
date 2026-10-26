import AppError from "../../utils/AppError.js";
import logger from "../../config/logger.js";
import zarinpal from "../../config/zarinpal.js";
import prisma from "../../config/prisma.js";
import {
    findPaymentById,
    updatePaymentFailed,
} from "./payment.repository.js";
import { getOrCreateWallet } from "../wallet/wallet.repository.js";
import type { VerifyPaymentResult } from "./payment.types.js";
import { createNotificationService } from "../notifications/notification.service.js";

export const verifyPaymentService = async (
    paymentId: string,
    authority: string,
    status: string
): Promise<VerifyPaymentResult> => {
    try {
        const payment = await findPaymentById(paymentId);

        if (!payment) {
            logger.warn("Payment callback: payment not found", {
                paymentId,
                authority
            });
            throw new AppError("Payment not found", 404);
        }


        if (!payment.authority || payment.authority !== authority) {
            logger.error("Payment callback: authority mismatch", {
                paymentId,
                authorityFromQuery: authority,
                authorityFromDb: payment.authority,
            });
            throw new AppError("Invalid payment authority", 400);
        }

        if (payment.status === "SUCCESS") {
            logger.info("Payment callback: already verified (idempotent)", {
                paymentId,
                refId: payment.refId,
            });
            return {
                success: true,
                message: "Payment already verified",
                paymentId: payment.id,
                refId: payment.refId ?? undefined,
            };
        }

        if (status !== "OK") {
            await updatePaymentFailed(paymentId);
            logger.info("Payment callback: status not OK", { paymentId, status });
            return {
                success: false,
                message: "Payment was cancelled or failed",
                paymentId,
            };
        }

        let verifyResult;
        try {
            verifyResult = await zarinpal.verify({
                authority,
                amount: payment.amount,
            });
        } catch (error) {
            await updatePaymentFailed(paymentId);
            logger.error("Payment callback: zarinpal verify failed", {
                paymentId,
                authority,
                error,
            });
            throw new AppError("Failed to verify payment with ZarinPal", 500);
        }

        if (verifyResult.code !== 100 && verifyResult.code !== 101) {
            await updatePaymentFailed(paymentId);
            logger.warn("Payment callback: invalid verify code", {
                paymentId,
                code: verifyResult.code,
            });
            return {
                success: false,
                message: `Payment verification failed (code: ${verifyResult.code})`,
                paymentId,
            };
        }

        const wallet = await getOrCreateWallet(payment.userId);

        await prisma.$transaction([
            prisma.payment.update({
                where: { id: paymentId },
                data: { status: "SUCCESS", refId: String(verifyResult.ref_id) },
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

        logger.info("Payment callback: success", {
            paymentId,
            userId: payment.userId,
            amount: payment.amount,
            refId: verifyResult.ref_id,
        });


        // ★ Notification
        await createNotificationService({
            userId: payment.userId,
            type: "WALLET_TOPUP",
            title: "کیف پول شارژ شد",
            message: `کیف پولت ${payment.amount.toLocaleString()} تومان شارژ شد`,
            data: { paymentId: payment.id, amount: payment.amount },
        });

        return {
            success: true,
            message: "Payment verified and wallet credited",
            paymentId,
            refId: String(verifyResult.ref_id),
        };
    } catch (error) {
        if (error instanceof AppError) throw error;
        logger.error("Payment callback: unexpected error", { error });
        throw error;
    }
};