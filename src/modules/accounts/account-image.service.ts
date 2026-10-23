import fs from "node:fs/promises";
import path from "node:path";
import AppError from "../../utils/AppError.js";
import {
  createAccountImages,
  deleteAccountImage,
  findAccountImageById,
  findAccountImages,
  setPrimaryAccountImage,
} from "./account-image.repository.js";
import { findAccountById } from "./account.repository.js";

const uploadDirectory = path.resolve("uploads/accounts");

const removeUploadedFiles = async (files: Express.Multer.File[]) => {
  await Promise.all(
    files.map((file) => fs.unlink(file.path).catch(() => undefined))
  );
};

const getStoredImagePath = (filename: string) => {
  if (
    !filename ||
    filename !== path.basename(filename) ||
    filename === "." ||
    filename === ".."
  ) {
    throw new AppError("Invalid image path", 400);
  }

  return path.join(uploadDirectory, filename);
};

export const uploadAccountImagesService = async (
  userId: string,
  accountId: string,
  files: Express.Multer.File[]
) => {
  if (!files.length) {
    throw new AppError("At least one image is required", 400);
  }

  try {
    const account = await findAccountById(accountId, userId);

    if (!account) {
      throw new AppError("Account not found", 404);
    }

    await createAccountImages(
      accountId,
      files.map((file) => file.filename)
    );

    return findAccountImages(userId, accountId);
  } catch (error) {
    await removeUploadedFiles(files);
    throw error;
  }
};

export const getAccountImagesService = async (
  userId: string,
  accountId: string
) => {
  return findAccountImages(userId, accountId);
};

export const deleteAccountImageService = async (
  userId: string,
  accountId: string,
  imageId: string
) => {
  const image = await findAccountImageById(userId, accountId, imageId);

  if (!image) {
    throw new AppError("Image not found", 404);
  }

  const imagePath = getStoredImagePath(image.url);

  try {
    await fs.unlink(imagePath);
  } catch (error) {
    const fileError = error as NodeJS.ErrnoException;

    if (fileError.code !== "ENOENT") {
      console.error(`Failed to delete image file: ${imagePath}`, error);
      throw new AppError("Failed to delete image file", 500);
    }

    console.warn(`Image file was already missing: ${imagePath}`);
  }

  return deleteAccountImage(imageId);
};

export const setPrimaryAccountImageService = async (
  userId: string,
  accountId: string,
  imageId: string
) => {
  const image = await findAccountImageById(userId, accountId, imageId);

  if (!image) {
    throw new AppError("Image not found", 404);
  }

  return setPrimaryAccountImage(accountId, imageId);
};