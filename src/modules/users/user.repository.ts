
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

export const updateUser = async(
  userId : string,
  data: {
    name? : string,
    email?: string,
  }
) => {
    return prisma.user.update({
      where : {
        id : userId,
      },
      data,
      select : {
        id: true,
        name: true,
        email: true,
        role :true,
        createdAt : true,
        updatedAt : true,
      }
    })
}
/////////// for change password
export const findUserPasswordById = async (userId: string) => {
  return prisma.user.findUnique({
    where : {
      id : userId,
    },
    select : {
      id : true,
      password : true,
    },
  })
}

export const updateUserPassword = async (
  userId : string,
  hashedPassword : string
) => {
  return prisma.user.update({
    where : {
      id : userId,
    },
    data : {
      password : hashedPassword,
    }
  })
}
