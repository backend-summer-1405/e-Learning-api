import type { Request, Response, NextFunction } from "express";
import AppError from "../../utils/AppError.js";
import {
  deleteAccountImageService,
  getAccountImagesService,
  setPrimaryAccountImageService,
  uploadAccountImagesService,
} from "./account-image.service.js";

const getRouteId = (value: unknown, fieldName: string): string => {
  if (typeof value !== "string" || !value) {
    throw new AppError(`Invalid ${fieldName}`, 400);
  }
  return value;
};

export const uploadAccountImagesController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = res.locals.userId as string;
    if (!userId) throw new AppError("Authentication required", 401);

    const accountId = getRouteId(req.params.accountId, "account ID");
    const files = req.files;

    if (!Array.isArray(files)) {
      throw new AppError("At least one image is required", 400);
    }

    const images = await uploadAccountImagesService(userId, accountId, files);

    res.status(201).json({
      success: true,
      message: "Account images uploaded successfully",
      data: images,
    });
  } catch (error) {
    next(error);
  }
};

export const getAccountImagesController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = res.locals.userId as string;
    if (!userId) throw new AppError("Authentication required", 401);

    const accountId = getRouteId(req.params.accountId, "account ID");
    const images = await getAccountImagesService(userId, accountId);

    res.status(200).json({
      success: true,
      data: images,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteAccountImageController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = res.locals.userId as string;
    if (!userId) throw new AppError("Authentication required", 401);

    const accountId = getRouteId(req.params.accountId, "account ID");
    const imageId = getRouteId(req.params.imageId, "image ID");

    const image = await deleteAccountImageService(userId, accountId, imageId);

    res.status(200).json({
      success: true,
      message: "Account image deleted successfully",
      data: image,
    });
  } catch (error) {
    next(error);
  }
};

export const setPrimaryAccountImageController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = res.locals.userId as string;
    if (!userId) throw new AppError("Authentication required", 401);

    const accountId = getRouteId(req.params.accountId, "account ID");
    const imageId = getRouteId(req.params.imageId, "image ID");

    const image = await setPrimaryAccountImageService(
      userId,
      accountId,
      imageId
    );

    res.status(200).json({
      success: true,
      message: "Primary account image updated successfully",
      data: image,
    });
  } catch (error) {
    next(error);
  }
};