import prisma from "../../config/prisma.js";

export const createNewsImages = (
  newsId: string,
  urls: string[],
) => {
  return prisma.newsImage.createMany({
    data: urls.map((url) => ({
      newsId,
      url,
    })),
  });
};

export const findNewsImagesByNewsId = (newsId: string) => {
  return prisma.newsImage.findMany({
    where: {
      newsId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const findNewsImageById = (imageId: string) => {
  return prisma.newsImage.findUnique({
    where: {
      id: imageId,
    },
  });
};

export const deleteNewsImageById = (imageId: string) => {
  return prisma.newsImage.delete({
    where: {
      id: imageId,
    },
  });
};

export const updateNewsImageUrl = (
  imageId: string,
  url: string,
) => {
  return prisma.newsImage.update({
    where: {
      id: imageId,
    },
    data: {
      url,
    },
  });
};
