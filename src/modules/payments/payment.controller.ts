import type { Request, Response, NextFunction } from "express";
import { verifyPaymentService } from "./payment.service.js";

export const paymentCallbackController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { Authority, Status, paymentId } = req.query;

    if (!Authority || !Status || !paymentId) {
      return res.redirect(
        `${process.env.FRONTEND_URL}/wallet?status=failed&reason=invalid_callback`
      );
    }

    const result = await verifyPaymentService(
      paymentId as string,
      Authority as string,
      Status as string
    );

    if (result.success) {
      return res.redirect(
        `${process.env.FRONTEND_URL}/wallet?status=success&refId=${result.refId}`
      );
    }

    return res.redirect(
      `${process.env.FRONTEND_URL}/wallet?status=failed`
    );
  } catch (error) {
    next(error);
  }
};