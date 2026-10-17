import AppError from "../../utils/AppError.js";
import {
  createNews,
  findAllNews,
  findNewsById,
} from "./news.repository.js";
import { CreateNewsInput } from "./news.type.js";

export const createNewsService = (data: CreateNewsInput, imageUrl?: string,) => {
  return createNews(data, imageUrl);
};

export const getAllNewsService = () => {
  return findAllNews();
};

export const getNewsByIdService = async (id: string) => {
  const news = await findNewsById(id);

  if (!news) {
    throw new AppError("News not found", 404);
  }

  return news;
};