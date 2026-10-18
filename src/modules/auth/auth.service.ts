import crypto from "node:crypto";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import AppError from "../../utils/AppError.js";
import { sendPasswordResetEmail } from "../../utils/email.js";
import {
  findUserByEmail,
  createUser,
  createPasswordResetToken,
  findPasswordResetToken,
  markPasswordResetTokenAsUsed,
  updateUserPassword,
  deleteUserPasswordResetTokens,
} from "./auth.repository.js";


const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not configured");
}

const generateToken = (
  userId: string,
  rememberMe: boolean = false
): string => {
  const expiresIn = rememberMe ? "7d" : "1d";
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn });
};

const sanitizeUser = (user: {
  id: string;
  name: string;
  email: string;
  role: string;
  avatarUrl?: string | null;
  createdAt?: Date;
  updatedAt?: Date;

}) => ({


  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role,
  avatarUrl: user.avatarUrl ?? null,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});


export const registerService = async (data: {
  name: string;
  email: string;
  password?: string;
}) => {
  const normalizedEmail = data.email.trim().toLowerCase();

  const existing = await findUserByEmail(normalizedEmail);

  if (existing) {

    throw new AppError("Email is already in use", 409);
  }

  let hashedPassword: string | undefined;
  if (data.password) {
    hashedPassword = await bcrypt.hash(data.password, 12);
  }

  const user = await createUser({
    name: data.name.trim(),
    email: normalizedEmail,
    password: hashedPassword,
  });

  const token = generateToken(user.id);

  return {
    user: sanitizeUser(user),
    token,
  };
};


export const loginService = async (
  data: {
    email: string;
    password: string;
    rememberMe?: boolean;
  }) => {
  const normalizedEmail = data.email.trim();


  const user = await findUserByEmail(normalizedEmail);


  if (!user) {
    throw new AppError("Invalid email or password", 401);
  }

  if (!user.password) {
    throw new AppError(
      "This account was created with Google.",
      400
    );
  }

  const isPasswordValid = await bcrypt.compare(
    data.password,
    user.password
  );

  if (!isPasswordValid) {
    throw new AppError("Invalid email or password", 401);
  }


  const token = generateToken(
    user.id,
    data.rememberMe ?? false
  );

  return {
    user: sanitizeUser(user),
    token,
    rememberMe: data.rememberMe ?? false,
  };
};


export const googleAuthService = async (
  data: {
    idToken: string
  }

) => {


  throw new AppError("Google auth not implemented yet", 501);
};


export const forgotPasswordService = async (
  email: string
) => {
  const normalizedEmail = email.trim().toLowerCase();

  const user = await findUserByEmail(
    normalizedEmail
  )

  if (!user) {
    return {
      success: true

    }
  }


  await deleteUserPasswordResetTokens(user.id);


  const token = crypto.randomBytes(32).toString("hex");


  const expiresAt = new Date(Date.now() + 60 * 60 * 1000);
  await createPasswordResetToken(
    user.id,
    token,
    expiresAt
  );

  const resetLink =
    `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

  try {
    await sendPasswordResetEmail(
      user.email, resetLink
    );
  } catch (error) {
    console.error("Failed to send reset email:", error)
  }



  return {
    success: true
  };
};


export const resetPasswordService = async (
  token: string,
  newPassword: string
) => {
  const resetToken = await findPasswordResetToken(token);




  if (!resetToken) {
    throw new AppError("Invalid or expired reset token", 400);
  }

  if (resetToken.usedAt) {

    throw new AppError("This reset token has already been used", 400);

  }

  if (resetToken.expiresAt < new Date()) {


    throw new AppError("Reset token has expired", 400);
  }

  const hashedPassword = await bcrypt.hash(newPassword, 12);
  await updateUserPassword(resetToken.userId, hashedPassword);
  await markPasswordResetTokenAsUsed(resetToken.id);

  return { success: true };
};