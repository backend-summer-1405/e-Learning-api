import bcrypt from "bcrypt";
import { createUser } from "./user.repository.js";

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