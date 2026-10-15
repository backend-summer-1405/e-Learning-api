import bcrypt from "bcrypt";
import AppError from "../../utils/AppError.js";
import { generateToken } from "../../utils/jwt.js";
import { findUserByEmail } from "./auth.repository.js";
import { createUserService } from "../users/user.service.js";
import { OAuth2Client } from "google-auth-library";
import {
  findUserByGoogleId,
  createGoogleUser,
  linkGoogleAccount,
} from "./auth.repository.js";

const googleClient = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID
);

export const googleAuthService = async (idToken: string) => {
  const ticket = await googleClient.verifyIdToken({
    idToken,
    audience: process.env.GOOGLE_CLIENT_ID,
  });

  const payload = ticket.getPayload();

  if (!payload || !payload.email || !payload.email_verified) {
    throw new AppError("Invalid Google account", 401);
  }

  const { email, name, sub: googleId } = payload;

  let user = await findUserByGoogleId(googleId);

  if (!user) {
    const existingUser = await findUserByEmail(email);

    if (existingUser) {
      if (existingUser.googleId && existingUser.googleId !== googleId) {
        throw new AppError("Google account is already linked incorrectly", 409);
      }

      user = await linkGoogleAccount(existingUser.id, googleId);
    } else {
      user = await createGoogleUser({
        name: name || email.split("@")[0],
        email,
        googleId,
      });
    }
  }

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

