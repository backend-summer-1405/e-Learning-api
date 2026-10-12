
import prisma from "../../config/prisma.js";

export const createUser = async (data: {
  email: string;
  name: string;
  password?: string;
}) => {
  return prisma.user.create({
    data,
  });
};

export const findUserById = async (userId: string) => {
  return prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  });
};