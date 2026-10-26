import type { Request, Response, NextFunction } from "express";
import { adminGetPurchasesService } from "./admin-purchase.service.js";

export const adminGetPurchasesController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await adminGetPurchasesService({
      page: Number(req.query.page ?? 1),
      limit: Number(req.query.limit ?? 20),
      userId: req.query.userId as string | undefined,
      courseId: req.query.courseId as string | undefined,
      isPaid: req.query.isPaid as boolean | undefined,
      fromDate: req.query.fromDate as string | undefined,
      toDate: req.query.toDate as string | undefined,
    });

    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};