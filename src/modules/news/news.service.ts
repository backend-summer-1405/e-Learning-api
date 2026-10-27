import prisma from "../../config/prisma.js";
import AppError from "../../utils/AppError.js";
import {
  createNews,
  findAllNews,
  findNewsById,
  deleteNews,
  deleteNewsReactions,
  updateNews,
} from "./news.repository.js";
import { CreateNewsInput } from "./news.type.js";
import fs from "node:fs/promises";
import path from "node:path";
import { clearNewsCache } from "../../utils/cache.utils.js";

export const createNewsService = async(data: CreateNewsInput, imageUrl?: string) => {
  const news = await createNews(data, imageUrl);
  await clearNewsCache();

  return news;
};

export const getAllNewsService = () => {
  return findAllNews();
};

export const getNewsByIdService = async (id: string) => {
  const news = await findNewsById(id);
  if (!news) throw new AppError("News not found", 404);
  return news;
};

// updating
export const updateNewsService = async (
  id: string,
  data: { title?: string; content?: string }
) => {
  const news = await findNewsById(id);
  if (!news) throw new AppError("News not found", 404);

  if (data.title === undefined && data.content === undefined) {
    throw new AppError("At least one field (title or content) is required", 400);
  }

  const updateData: { title?: string; content?: string } = {};

  if (data.title !== undefined) {
    if (typeof data.title !== "string" || data.title.trim() === "") {
      throw new AppError("Title cannot be empty", 400);
    }
    updateData.title = data.title.trim();
  }

  if (data.content !== undefined) {
    if (typeof data.content !== "string" || data.content.trim() === "") {
      throw new AppError("Content cannot be empty", 400);
    }
    updateData.content = data.content.trim();
  }

  const updated = await updateNews(id, updateData);
  await clearNewsCache();

  return updated;
};




// delete
export const deleteNewsService = async (id: string) => {
  const news = await findNewsById(id);

  if (!news) {
    throw new AppError("News not found", 404);
  }

  await Promise.allSettled(
    news.images.map(async (image) => {
      const filePath = path.resolve(image.url.replace(/^\/+/, ""));
      try {
        await fs.unlink(filePath);
      } catch (error) {
        if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
          console.error(`Failed to delete file ${filePath}:`, error);
        }
      }
    })
  );

  await deleteNewsReactions(id);
  await deleteNews(id);

  await clearNewsCache();

  return news;
};