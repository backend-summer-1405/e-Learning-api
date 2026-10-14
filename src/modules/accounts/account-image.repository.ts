import prisma from "../../config/prisma.js";

export const createAccountImages = async (
  accountId: string,
  urls: string[],
) => {
  return prisma.accountImage.createMany({
    data: urls.map((url) => ({
      accountId,
      url,
    })),
  });
};

export const findAccountImages = async (
  userId: string,
  accountId: string,
) => {
  return prisma.accountImage.findMany({
    where: {
      accountId,
      account: {
        userId,
      },
    },
    orderBy: {
      createdAt: "asc",
    },
    select: {
      id: true,
      url: true,
      accountId: true,
      createdAt: true,
    },
  });
};

export const findAccountImageById = async (
  userId: string,
  accountId: string,
  imageId: string,
) => {
  return prisma.accountImage.findFirst({
    where: {
      id: imageId,
      accountId,
      account: {
        userId,
      },
    },
    select: {
      id: true,
      url: true,
      accountId: true,
      createdAt: true,
    },
  });
};

export const deleteAccountImage = async (imageId: string) => {
  return prisma.accountImage.delete({
    where: {
      id: imageId,
    },
    select: {
      id: true,
      url: true,
      accountId: true,
      createdAt: true,
    },
  });
};

export const setPrimaryAccountImage = async (
  accountId: string,
  imageId: string,
) => {
  return prisma.$transaction(async (tx) => {
    // Remove primary status from the current primary image.
    await tx.accountImage.updateMany({
      where: {
        accountId,
        isPrimary: true,
      },
      data: {
        isPrimary: false,
      },
    });

    // Set the selected image as primary.
    return tx.accountImage.update({
      where: {
        id: imageId,
      },
      data: {
        isPrimary: true,
      },
      select: {
        id: true,
        url: true,
        isPrimary: true,
        accountId: true,
        createdAt: true,
      },
    });
  });
};