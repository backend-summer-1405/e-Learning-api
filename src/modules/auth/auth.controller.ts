import type { Request, Response } from "express";
import { loginService, registerService } from "./auth.service.js";

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
  const {email, name, password } = req.body;

  const result = await registerService(email, name, password);

  res.status(201).json({
    success: true,
    data: result,
  });
};