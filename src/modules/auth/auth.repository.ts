import prisma from "../../config/prisma.js";

export const findUserByEmail = (email: string) => {
  return prisma.user.findUnique({
    where: {
      email,
    },
  });
};

export const findUserByGoogleId = (googleId: string) => {
  return prisma.user.findUnique({
    where: {
      googleId,
    },
  });
};

export const createGoogleUser = (data: {
  name: string;
  email: string;
  googleId: string;
}) => {
  return prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      googleId: data.googleId,
    },
  });
};

export const linkGoogleAccount = (
  userId: string,
  googleId: string
) => {
  return prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      googleId,
    },
  });
};