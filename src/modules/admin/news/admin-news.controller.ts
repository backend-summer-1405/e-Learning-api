import type { Request, Response, NextFunction } from "express";
import {
  adminGetNewsService,
  adminGetNewsByIdService,
  adminCreateNewsService,
  adminUpdateNewsService,
  adminDeleteNewsService,
} from "./admin-news.service.js";

export const adminGetNewsController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await adminGetNewsService({
      page: Number(req.query.page ?? 1),
      limit: Number(req.query.limit ?? 20),
      search: req.query.search as string | undefined,
      sortBy: req.query.sortBy as any,
      sortOrder: req.query.sortOrder as any,
    });

    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

export const adminGetNewsByIdController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const news = await adminGetNewsByIdService(req.params.id as string);
    res.status(200).json({ success: true, data: news });
  } catch (error) {
    next(error);
  }
};

export const adminCreateNewsController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const files = req.files as Express.Multer.File[] | undefined;
    const images = files?.map((file) => `/uploads/news/${file.filename}`);

    const news = await adminCreateNewsService({
      title: req.body.title,
      content: req.body.content,
      images,
    });

    res.status(201).json({
      success: true,
      data: news,
      message: "News created successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const adminUpdateNewsController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const news = await adminUpdateNewsService(req.params.id as string, req.body);
    res.status(200).json({
      success: true,
      data: news,
      message: "News updated successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const adminDeleteNewsController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await adminDeleteNewsService(req.params.id as string);
    res.status(200).json({
      success: true,
      data: result,
      message: "News deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};