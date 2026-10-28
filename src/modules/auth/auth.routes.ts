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
  googleAuthValidation,
} from "./auth.validation.js";

import validationMiddleware from "../../middleware/validation.middleware.js";
import { authLimiter } from "../../middleware/rate-limit.middleware.js";


const authRouter = Router();

authRouter.post(
  "/register",
  authLimiter,
  registerValidation,
  validationMiddleware,
  registerController
);

authRouter.post(
  "/login",
  authLimiter,
  loginValidation,
  validationMiddleware,
  loginController
);

authRouter.post(
  "/google",
  authLimiter,
  googleAuthValidation,
  validationMiddleware,
  googleAuthController
);

authRouter.post(
  "/forgot-password",
  authLimiter,
  forgotPasswordValidation,
  validationMiddleware,
  forgotPasswordController
);

authRouter.post(
  "/reset-password",
  authLimiter,
  resetPasswordValidation,
  validationMiddleware,

  resetPasswordController
);

export default authRouter;