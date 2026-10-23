import type { Request, Response, NextFunction } from "express";
import AppError from "../../utils/AppError.js";
import {
  createAccountService,
  deleteAccountService,
  getAccountByIdService,
  getMyAccountsService,
  updateAccountService,
  switchAccountService,
  getActiveAccountService,
} from "./account.service.js";

export const createAccountController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = res.locals.userId as string;
    if (!userId) throw new AppError("Authentication required", 401);

    const account = await createAccountService(userId, {
      username: req.body.username,
      name: req.body.name,
    });

    res.status(201).json({
      success: true,
      message: "Account created successfully",
      data: account,
    });
  } catch (error) {
    next(error);
  }
};

export const getMyAccountsController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = res.locals.userId as string;
    if (!userId) throw new AppError("Authentication required", 401);

    const result = await getMyAccountsService(userId);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const getAccountByIdController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = res.locals.userId as string;
    if (!userId) throw new AppError("Authentication required", 401);

    const accountId = req.params.accountId;
    if (typeof accountId !== "string") {
      throw new AppError("Invalid account ID", 400);
    }

    const account = await getAccountByIdService(userId, accountId);

    res.status(200).json({
      success: true,
      data: account,
    });
  } catch (error) {
    next(error);
  }
};

export const updateAccountController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = res.locals.userId as string;
    if (!userId) throw new AppError("Authentication required", 401);

    const accountId = req.params.accountId;
    if (typeof accountId !== "string") {
      throw new AppError("Invalid account ID", 400);
    }

    const account = await updateAccountService(userId, accountId, {
      username: req.body.username,
      name: req.body.name,
    });

    res.status(200).json({
      success: true,
      message: "Account updated successfully",
      data: account,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteAccountController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = res.locals.userId as string;
    if (!userId) throw new AppError("Authentication required", 401);

    const accountId = req.params.accountId;
    if (typeof accountId !== "string") {
      throw new AppError("Invalid account ID", 400);
    }

    const account = await deleteAccountService(userId, accountId);

    res.status(200).json({
      success: true,
      message: "Account deleted successfully",
      data: account,
    });
  } catch (error) {
    next(error);
  }
};

export const switchAccountController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = res.locals.userId as string;
    if (!userId) throw new AppError("Authentication required", 401);

    const accountId = req.params.accountId;
    if (typeof accountId !== "string") {
      throw new AppError("Invalid account ID", 400);
    }

    const account = await switchAccountService(userId, accountId);

    res.status(200).json({
      success: true,
      message: "Account switched successfully",
      data: account,
    });
  } catch (error) {
    next(error);
  }
};

export const getActiveAccountController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = res.locals.userId as string;
    if (!userId) throw new AppError("Authentication required", 401);

    const account = await getActiveAccountService(userId);

    res.status(200).json({
      success: true,
      data: account,
    });
  } catch (error) {
    next(error);
  }
};