import type { Request, Response, NextFunction } from "express";

import AppError from "../../utils/AppError.js";

import {
  addNewsImagesService,
  getNewsImagesService,
  deleteNewsImageService,
  replaceNewsImageService,
} from "./news-image.service.js";

const getParam = (value: unknown, name: string): string => {
  if (typeof value !== "string" || !value) {
    throw new AppError(`Invalid ${name}`, 400);
  }

  return value;
};

export const addNewsImagesController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const newsId = getParam(req.params.id, "news ID");

    const files = req.files;

    if (!Array.isArray(files) || files.length === 0) {
      throw new AppError("At least one image is required", 400);
    }

    const urls = files.map(
      (file) => `uploads/news/${file.filename}`,
    );

    const images = await addNewsImagesService(newsId, urls);

    res.status(201).json({
      status: "success",
      results: images.length,
      data: { images },
    });
  } catch (error) {
    next(error);
  }
};

export const getNewsImagesController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const newsId = getParam(req.params.id, "news ID");

    const images = await getNewsImagesService(newsId);

    res.status(200).json({
      status: "success",
      results: images.length,
      data: { images },
    });
  } catch (error) {
    next(error);
  }
};

export const deleteNewsImageController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const newsId = getParam(req.params.id, "news ID");
    const imageId = getParam(req.params.imageId, "image ID");

    await deleteNewsImageService(newsId, imageId);

    res.status(200).json({
      status: "success",
      message: "News image deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const replaceNewsImageController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const newsId = getParam(req.params.id, "news ID");
    const imageId = getParam(req.params.imageId, "image ID");

    const file = req.file;

    if (!file) {
      throw new AppError("An image is required", 400);
    }

    const url = `uploads/news/${file.filename}`;

    const image = await replaceNewsImageService(
      newsId,
      imageId,
      url,
    );

    res.status(200).json({
      status: "success",
      data: { image },
    });
  } catch (error) {
    next(error);
  }
};