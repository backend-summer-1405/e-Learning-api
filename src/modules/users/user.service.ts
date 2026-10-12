import bcrypt from "bcrypt";
import AppError from "../../utils/AppError.js";
import { createUser, findUserById } from "./user.repository.js";

export const createUserService = async (data: {
  name: string;
  email: string;
  password?: string;
}) => {
  let hashedPassword: string | undefined;

  if (data.password) {
    hashedPassword = await bcrypt.hash(data.password, 12);
  }

  return createUser({
    name: data.name,
    email: data.email,
    password: hashedPassword,
  });
};

////////

export const getMeService = async (userId: string) => {
  const user = await findUserById(userId);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  return user;
};