import bcrypt from "bcrypt";
import AppError from "../../utils/AppError.js";
import { createUser, findUserById, updateUser } from "./user.repository.js";

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

//// .....updating
export const updateMeService = async (
  userId: string,
  data: {
    name?: string,
    email?: string,
  }
) => {
  const user = await findUserById(userId);

  if (!user) {
    throw new AppError("user not found", 404);
  }

  if (data.name !== undefined && data.name.trim() === "") {
    throw new AppError("Name cannot be empty", 400)
  }

  if (data.email !== undefined && data.email.trim() === "") {
    throw new AppError("Name cannot be empty", 400)
  }


  return updateUser(userId, {
    ...(data.name !== undefined && { name: data.name.trim() }),
    ...(data.email !== undefined && { email: data.email.trim().toLowerCase() }),
  })

}