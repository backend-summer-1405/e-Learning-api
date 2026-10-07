
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