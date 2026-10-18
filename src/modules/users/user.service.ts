import bcrypt from "bcrypt";
import fs from "node:fs/promises";
import path from "node:path";
import AppError from "../../utils/AppError.js";
import {
  createUser,
  findUserById,
  findUserByEmail,
  updateUser,
  findUserPasswordById,
  updateUserPassword,
} from "./user.repository.js";

export const createUserService = async (data: {
  name: string;
  email: string;
  password?: string;
}) => {
  let hashedPassword: string | undefined;
  if (data.password) {
    hashedPassword = await bcrypt.hash(
      
      data.password,
      12
    );
  }
  return createUser({
    name: data.name,
    email: data.email,
    password: hashedPassword,
  });
};

export const getMeService = async (userId: string) => {
  const user = await findUserById(userId);
  if (!user) throw new AppError("User not found", 404);
  return user;
};

export const updateMeService = async (
  userId: string,
  data: { name?: string; email?: string },
  avatarFile?: Express.Multer.File
) => {
  const user = await findUserById(userId);
  if (!user) throw new AppError("User not found", 404);

  if (data.name === undefined && data.email === undefined && !avatarFile) {
    throw new AppError(
      "At least one field (name, email, or avatar) is required",
      400
    );
  }

  const updateData: {
    name?: string;
    email?: string;
    avatarUrl?: string;

  } = {};

  // name
  if (data.name !== undefined) {
    if (typeof data.name !== "string" || data.name.trim() === "") {
      throw new AppError("Name cannot be empty", 400);
    }
    updateData.name = data.name.trim();
  }

  // email
  if (data.email !== undefined) {
    if (typeof data.email !== "string") {
      throw new AppError("Email must be a string", 400);
    }
    const normalizedEmail = data.email.trim().toLowerCase();
    if (normalizedEmail === "") {


      throw new AppError("Email cannot be empty", 400);
    }
    if (normalizedEmail !== user.email) {
      const existing = await findUserByEmail(
        normalizedEmail
      );

      if (existing) throw new AppError("Email is already in use", 409);
    }
    updateData.email = normalizedEmail;
  }


  if (avatarFile) {

    const avatarUrl = (user as { avatarUrl?: string | null }).avatarUrl;
    if (avatarUrl) {
      const oldPath = path.resolve(avatarUrl.replace(/^\//, ""));
      try {
        await fs.unlink(oldPath);
      } catch {

      }
    }
    updateData.avatarUrl = `/uploads/users/${avatarFile.filename}`;
  }

  return updateUser(
    userId,
    updateData
  );
};

export const changePasswordService = async (
  userId: string,
  currentPassword: string,
  newPassword: string
) => {
  const user = await findUserPasswordById(userId);
  if (!user) throw new AppError("User not found", 404);
  if (!user.password) throw new AppError("This account does not have a password", 400);

  const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
  if (!isPasswordValid) throw new AppError("Current password is incorrect", 400);

  const isSamePassword = await bcrypt.compare(
    newPassword, user.password


  );
  if (isSamePassword) {
    throw new AppError("New password must be different from current password", 400);
  }

  const hashpassword = await bcrypt.hash(newPassword, 12);
  await updateUserPassword(userId, hashpassword);
};