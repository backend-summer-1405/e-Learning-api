import { Router } from "express";
import {
  registerController,
  loginController,
  googleAuthController,
  forgotPasswordController,
  resetPasswordController,
} from "./auth.controller.js";

import {
  registerValidation,
  loginValidation,
  forgotPasswordValidation,
  resetPasswordValidation,
} from "./auth.validation.js";

import validationMiddleware from "../../middleware/validation.middleware.js";

const authRouter = Router();

authRouter.post(
  "/register",
  registerValidation,
  validationMiddleware,
  registerController
);

authRouter.post(
  "/login",
  loginValidation,
  validationMiddleware,
  loginController
);

authRouter.post("/google", googleAuthController);

authRouter.post(
  "/forgot-password",
  forgotPasswordValidation,
  validationMiddleware,
  forgotPasswordController
);

authRouter.post(
  "/reset-password",
  resetPasswordValidation,
  validationMiddleware,
  
  resetPasswordController
);

export default authRouter;