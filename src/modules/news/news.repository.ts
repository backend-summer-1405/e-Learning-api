import { CreateNewsInput } from './news.type.js';
import prisma from "../../config/prisma.js";



export const createNews = (data: CreateNewsInput) => {
  return prisma.news.create({
    data,
  });
};

export const findAllNews = () => {
  return prisma.news.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const findNewsById = (id: string) => {
  return prisma.news.findUnique({
    where: {
      id,
    },
  });
};