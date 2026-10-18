import prisma from "../../config/prisma.js";


export const findUserByEmail = async (email: string) => {
  return prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      name: true,
      email: true,
      password: true,
      role: true,

      avatarUrl: true,
      googleId: true,
      createdAt: true,
      updatedAt: true,
    },
  });
};

export const createUser = async (data: {
  name: string;
  email: string;
  password?: string;
}) => {


  return prisma.user.create({
    data,
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      avatarUrl: true,
      createdAt: true,
      updatedAt: true,
    },
  });
};


export const createPasswordResetToken = async (
  userId: string,
  token: string,
  expiresAt: Date
) => {
  return prisma.passwordResetToken.create({
    data: {
      userId,
      token,
      expiresAt
    },
  });
};

export const findPasswordResetToken = async (
  token: string
) => {
  return prisma.passwordResetToken.findUnique({
    where: {
      token
    },
    include: {
      user: true
    },
  });
};

export const markPasswordResetTokenAsUsed = async (
  id: string
) => {
  return prisma.passwordResetToken.update({
    where: { id },
    data: { usedAt: new Date() },
  });
};

export const updateUserPassword = async (
  userId: string,
  hashedPassword: string
) => {
  return prisma.user.update({
    where: {
      id: userId

    },
    data: {
      password: hashedPassword
    },
  });
};

export const deleteUserPasswordResetTokens = async (
  userId: string
) => {
  return prisma.passwordResetToken.deleteMany({
    where: {
      userId
    
    },
  });
};