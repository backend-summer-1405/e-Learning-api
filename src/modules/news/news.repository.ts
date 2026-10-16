import prisma from "../../config/prisma.js";

export const newsRepository = {
  create(data: { title: string; content: string }) {
    return prisma.news.create({
      data,
    });
  },

  findAll() {
    return prisma.news.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
  },

  findById(id: string) {
    return prisma.news.findUnique({
      where: { id },
    });
  },
};