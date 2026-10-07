import { Router } from "express";
import { loginController, registerController } from "./auth.controller.js";
import { loginValidation, registerValidation } from "./auth.validation.js";
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

export default authRouter;