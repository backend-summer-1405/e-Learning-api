import type { Request, Response, NextFunction } from "express";
import {
  adminGetUsersService,
  adminGetUserByIdService,
  adminUpdateUserService,
  adminDeleteUserService,
  adminGetUserStatsService,
} from "./admin-user.service.js";
import type { Role } from "@prisma/client";

export const adminGetUsersController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await adminGetUsersService({
      page: Number(req.query.page ?? 1),
      limit: Number(req.query.limit ?? 20),
      role: req.query.role as Role | undefined,
      search: req.query.search as string | undefined,
      sortBy: req.query.sortBy as any,
      sortOrder: req.query.sortOrder as any,
    });

    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

export const adminGetUserByIdController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await adminGetUserByIdService(req.params.id as string);
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

export const adminUpdateUserController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await adminUpdateUserService(req.params.id as string, req.body);
    res.status(200).json({
      success: true,
      data: user,
      message: "User updated successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const adminDeleteUserController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const currentUserId = res.locals.userId as string;
    const result = await adminDeleteUserService(
      req.params.id as string,
      currentUserId
    );
    res.status(200).json({
      success: true,
      data: result,
      message: "User deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const adminGetUserStatsController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const stats = await adminGetUserStatsService();
    res.status(200).json({ success: true, data: stats });
  } catch (error) {
    next(error);
  }
};