import prisma from "../../../config/prisma.js";
import type { AdminGetNewsQuery } from "./admin-news.types.js";

const adminNewsSelect = {
  id: true,
  title: true,
  content: true,
  ratingAvg: true,
  ratingCount: true,
  createdAt: true,
  updatedAt: true,
  images: {
    select: { id: true, url: true },
  },
};

const buildWhere = (query: AdminGetNewsQuery) => {
  const where: any = {};
  if (query.search) {
    where.OR = [
      { title: { contains: query.search, mode: "insensitive" } },
      { content: { contains: query.search, mode: "insensitive" } },
    ];
  }
  return where;
};

export const adminFindNews = async (query: AdminGetNewsQuery) => {
  const skip = (query.page - 1) * query.limit;
  const where = buildWhere(query);
  const sortBy = query.sortBy ?? "createdAt";
  const sortOrder = query.sortOrder ?? "desc";

  return prisma.news.findMany({
    where,
    select: adminNewsSelect,
    orderBy: { [sortBy]: sortOrder },
    skip,
    take: query.limit,
  });
};

export const adminCountNews = async (query: AdminGetNewsQuery) => {
  const where = buildWhere(query);
  return prisma.news.count({ where });
};

export const adminFindNewsById = async (id: string) => {
  return prisma.news.findUnique({
    where: { id },
    select: adminNewsSelect,
  });
};

export const adminCreateNews = async (data: {
  title: string;
  content: string;
  images?: string[];
}) => {
  return prisma.news.create({
    data: {
      title: data.title,
      content: data.content,
      images: data.images
        ? {
            create: data.images.map((url) => ({ url })),
          }
        : undefined,
    },
    select: adminNewsSelect,
  });
};

export const adminUpdateNews = async (
  id: string,
  data: {
    title?: string;
    content?: string;
  }
) => {
  return prisma.news.update({
    where: { id },
    data,
    select: adminNewsSelect,
  });
};

export const adminDeleteNews = async (id: string) => {
  return prisma.news.delete({ where: { id } });
};