import type { Request, Response, NextFunction } from "express";
import {
  getWalletService,
  topupWalletService,
  withdrawService,
} from "./wallet.service.js";

export const getWalletController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = res.locals.userId as string;
    const result = await getWalletService(userId);

    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

export const topupWalletController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = res.locals.userId as string;
    const { amount } = req.body;

    const result = await topupWalletService(userId, amount);

    res.status(200).json({
      success: true,
      data: result,
      message: "Redirect user to paymentUrl to complete payment",
    });
  } catch (error) {
    next(error);
  }
};

export const withdrawController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = res.locals.userId as string;
    const result = await withdrawService(userId, req.body);

    res.status(201).json({
      success: true,
      data: result,
      message: "Withdrawal request submitted. Waiting for admin approval.",
    });
  } catch (error) {
    next(error);
  }
};