import type { Request, Response } from "express";
import {
  registerService,
  loginService,
  googleAuthService,
  forgotPasswordService,
  resetPasswordService,
} from "./auth.service.js";

export const registerController = async (
  req: Request, res: Response
) => {
  const result = await registerService(req.body);

  return res.status(201).json({
    success: true,
    data: result,
    message: "User registered successfully",
  });
};




export const loginController = async (
  req: Request, res: Response
) => {
  const result = await loginService(req.body);

  return res.status(200).json({
    success: true,
    data: result,
    message: "Login successful",
  })
}

export const googleAuthController = async (
  req: Request, res: Response
) => {

  const result = await googleAuthService(req.body);

  return res.status(200).json({
    success: true,
    data: result,
    message: "Google authentication successful",
  });
};


export const forgotPasswordController = async (
  req: Request,
  res: Response
) => {

  const { email } = req.body;
  await forgotPasswordService(email);

  return res.status(200).json({
    success: true,
    message:
      "If an account exists for this email, a reset link has been sent.",
  });
};

export const resetPasswordController = async (
  req: Request,
  res: Response
) => {

  const { token, newPassword } = req.body;
  
  await resetPasswordService(token, newPassword);



  return res.status(200).json({
    success: true,
    message: "Password reset successfully. You can now log in.",
  });
};