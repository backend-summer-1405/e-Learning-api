import bcrypt from "bcrypt";
import { createUser } from "./user.repository.js";

export const createUserService = async (data: {
  email: string;
  password?: string;
}) => {
  let hashedPassword: string | undefined;

  if (data.password) {
    hashedPassword = await bcrypt.hash(data.password, 12);
  }

  return createUser({
    email: data.email,
    password: hashedPassword,
  });
};