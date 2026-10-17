import { CreateNewsInput } from './news.type.js';
import prisma from "../../config/prisma.js";



export const createNews = ( data: CreateNewsInput, imageUrl?: string, ) => {
  return prisma.news.create({
    data: {
      ...data,
      ...(imageUrl
        ? {
          images: {
            create: {
              url: imageUrl,
            },
          },
        }
        : {}),
    },
    include: {
      images: true,
    },
  });
};

export const findAllNews = () => {
  return prisma.news.findMany({
    include: {
      images: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const findNewsById = (id: string) => {
  return prisma.news.findUnique({
    where: { id },
    include: {
      images: true,
    },
  });
};