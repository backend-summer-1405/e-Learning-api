import type { Request, Response } from "express";
import {
  loginService,
  registerService,
  googleAuthService,
} from "./auth.service.js";

export const loginController = async (
  req: Request,
  res: Response
) => {
  const { email, password } = req.body;

  const result = await loginService(email, password);

  res.status(200).json({
    success: true,
    data: result,
  });
};

export const registerController = async (
  req: Request,
  res: Response
) => {
  const { email, name, password } = req.body;

  const result = await registerService(email, name, password);

  res.status(201).json({
    success: true,
    data: result,
  });
};

export const googleAuthController = async (
  req: Request,
  res: Response
) => {
  const { idToken } = req.body;

  const result = await googleAuthService(idToken);

  res.status(200).json({
    success: true,
    data: result,
  });
};