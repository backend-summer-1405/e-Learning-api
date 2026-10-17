import fs from "node:fs/promises";
import path from "node:path";

import AppError from "../../utils/AppError.js";

import { findNewsById } from "./news.repository.js";

import {
  createNewsImages,
  findNewsImagesByNewsId,
  findNewsImageById,
  deleteNewsImageById,
  updateNewsImageUrl,
} from "./news-image.repository.js";

const deleteFile = async (url: string) => {
  const filePath = path.resolve(url.replace(/^\/+/, ""));

  try {
    await fs.unlink(filePath);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
      throw error;
    }
  }
};

export const addNewsImagesService = async (
  newsId: string,
  urls: string[],
) => {
  const news = await findNewsById(newsId);

  if (!news) {
    throw new AppError("News not found", 404);
  }

  try {
    await createNewsImages(newsId, urls);
  } catch (error) {
    await Promise.allSettled(urls.map(deleteFile));
    throw error;
  }

  return findNewsImagesByNewsId(newsId);
};

export const getNewsImagesService = async (newsId: string) => {
  const news = await findNewsById(newsId);

  if (!news) {
    throw new AppError("News not found", 404);
  }

  return findNewsImagesByNewsId(newsId);
};

export const deleteNewsImageService = async (
  newsId: string,
  imageId: string,
) => {
  const image = await findNewsImageById(imageId);

  if (!image || image.newsId !== newsId) {
    throw new AppError("News image not found", 404);
  }

  await deleteNewsImageById(imageId);
  await deleteFile(image.url);

  return image;
};

export const replaceNewsImageService = async (
  newsId: string,
  imageId: string,
  newUrl: string,
) => {
  const image = await findNewsImageById(imageId);

  if (!image || image.newsId !== newsId) {
    throw new AppError("News image not found", 404);
  }

  const updatedImage = await updateNewsImageUrl(imageId, newUrl);

  try {
    await deleteFile(image.url);
  } catch (error) {
    console.error("Failed to delete replaced news image:", error);
  }

  return updatedImage;
};
