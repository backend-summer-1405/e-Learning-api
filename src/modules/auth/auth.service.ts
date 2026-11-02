import crypto from "node:crypto";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";

import AppError from "../../utils/AppError.js";
import { sendPasswordResetEmail } from "../../utils/email.js";

import {
  findUserByEmail,
  createUser,
  updateUserGoogleId,
  createPasswordResetToken,
  findPasswordResetToken,
  markPasswordResetTokenAsUsed,
  updateUserPassword,
  deleteUserPasswordResetTokens,
} from "./auth.repository.js";

import type {
  RegisterInput,
  LoginInput,
  GoogleAuthInput,
  AuthUser,
  AuthResult,
  LoginResult,
} from "./auth.types.js";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not configured");
}

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;

if (!GOOGLE_CLIENT_ID) {
  throw new Error("GOOGLE_CLIENT_ID is not configured");
}

const googleClient = new OAuth2Client(GOOGLE_CLIENT_ID);

const generateToken = (userId: string, rememberMe: boolean = false): string => {
  const expiresIn = rememberMe ? "7d" : "1d";
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn });
};

const sanitizeUser = (user: AuthUser): AuthUser => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role,
  avatarUrl: user.avatarUrl ?? null,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

export const registerService = async (data: RegisterInput): Promise<AuthResult> => {
  try {
    const normalizedEmail = data.email.trim().toLowerCase();

    const existingUser = await findUserByEmail(normalizedEmail);

    if (existingUser) {
      throw new AppError("Email is already in use", 409);
    }

    const hashedPassword = data.password
      ? await bcrypt.hash(data.password, 12)
      : undefined;

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
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw error;
  }
};

export const loginService = async (data: LoginInput): Promise<LoginResult> => {
  try {
    const normalizedEmail = data.email.trim().toLowerCase();

    const user = await findUserByEmail(normalizedEmail);

    if (!user) {
      throw new AppError("Invalid email or password", 401);
    }

    if (!user.password) {
      throw new AppError("This account was created with Google.", 400);
    }

    const isPasswordValid = await bcrypt.compare(data.password, user.password);

    if (!isPasswordValid) {
      throw new AppError("Invalid email or password", 401);
    }

    const rememberMe = data.rememberMe ?? false;
    const token = generateToken(user.id, rememberMe);

    return {
      user: sanitizeUser(user),
      token,
      rememberMe,
    };
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw error;
  }
};

export const googleAuthService =
  async (data: GoogleAuthInput): Promise<AuthResult> => {
    try {
      let payload;

      try {
        const ticket = await googleClient.verifyIdToken({
          idToken: data.idToken,
          audience: GOOGLE_CLIENT_ID,
        });
        payload = ticket.getPayload();
      } catch {
        throw new AppError("Invalid Google token", 401);
      }

      if (!payload || !payload.email) {
        throw new AppError("Invalid Google token payload", 400);
      }

      const { email, name, picture, sub: googleId } = payload;
      const normalizedEmail = email.toLowerCase();

      const existingUser = await findUserByEmail(normalizedEmail);

      if (existingUser) {
        if (!existingUser.googleId) {
          await updateUserGoogleId(existingUser.id, googleId);
        }
      } else {
        await createUser({
          name: name || "Google User",
          email: normalizedEmail,
          googleId,
          avatarUrl: picture || null,
        });
      }

      const user = await findUserByEmail(normalizedEmail);

      if (!user) {
        throw new AppError("Failed to create or find user", 500);
      }

      const token = generateToken(user.id);

      return {
        user: sanitizeUser(user),
        token,
      };
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw error;
    }
  };

export const forgotPasswordService = async (email: string) => {
  try {
    const normalizedEmail = email.trim().toLowerCase();

    const user = await findUserByEmail(normalizedEmail);

    if (!user) {
      return { success: true };
    }

    await deleteUserPasswordResetTokens(user.id);

    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

    await createPasswordResetToken({
      userId: user.id,
      token,
      expiresAt,
    });

    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

    try {
      await sendPasswordResetEmail(user.email, resetLink);
      console.log("✅ Email sent successfully");
    } catch (error) {
      // console.error("Failed to send reset email:", error);
      console.error("Email error:", error);
      throw error;
    }

    return { success: true };
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw error;
  }
};

export const resetPasswordService = async (
  token: string,
  newPassword: string
) => {
  try {
    const resetToken = await findPasswordResetToken(token);

    if (!resetToken) {
      throw new AppError("Invalid or expired reset token", 400);
    }

    if (resetToken.usedAt) {
      throw new AppError(
        "This reset token has already been used",
        400
      );
    }

    if (resetToken.expiresAt < new Date()) {
      throw new AppError("Reset token has expired", 400);
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);

    await updateUserPassword(resetToken.userId, hashedPassword);
    await markPasswordResetTokenAsUsed(resetToken.id);

    return { success: true };
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw error;
  }
};