import type { Request, Response, NextFunction } from "express";
import {
  adminGetWithdrawalsService,
  adminApproveWithdrawalService,
  adminRejectWithdrawalService,
} from "./admin-withdrawal.service.js";
import type { WithdrawalStatus } from "@prisma/client";

export const adminGetWithdrawalsController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await adminGetWithdrawalsService({
      page: Number(req.query.page ?? 1),
      limit: Number(req.query.limit ?? 20),
      status: req.query.status as WithdrawalStatus | undefined,
      userId: req.query.userId as string | undefined,
    });

    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

export const adminApproveWithdrawalController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const result = await adminApproveWithdrawalService(id as string);

    res.status(200).json({
      success: true,
      data: result,
      message: "Withdrawal approved",
    });
  } catch (error) {
    next(error);
  }
};

export const adminRejectWithdrawalController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { note } = req.body;
    const result = await adminRejectWithdrawalService(id as string, note);

    res.status(200).json({
      success: true,
      data: result,
      message: "Withdrawal rejected and refunded to wallet",
    });
  } catch (error) {
    next(error);
  }
};