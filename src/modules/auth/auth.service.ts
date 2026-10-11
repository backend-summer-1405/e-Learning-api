import bcrypt from "bcrypt";
import AppError from "../../utils/AppError.js";
import { generateToken } from "../../utils/jwt.js";
import { findUserByEmail } from "./auth.repository.js";
import { createUserService } from "../users/user.service.js";

export const loginService = async (
  email: string,
  password: string
) => {
  const user = await findUserByEmail(email);

  if (!user || !user.password) {
    throw new AppError("Invalid email or password", 401);
  }

  const isPasswordValid = await bcrypt.compare(
    password,
    user.password
  );

  if (!isPasswordValid) {
    throw new AppError("Invalid email or password", 401);
  }

  const token = generateToken(user.id);

  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
    },
  };
};


export const registerService = async (
  email: string,
  name: string,
  password: string
) => {
  const existingUser = await findUserByEmail(email);

  if (existingUser) {
    throw new AppError("Email already exists", 409);
  }

  const user = await createUserService({
    email,
    name,
    password,
  });

  const token = generateToken(user.id);

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
};

