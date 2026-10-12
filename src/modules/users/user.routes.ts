import { Router } from "express";
import { createUserController, getMeController } from "./user.controller.js";
import { createUserValidation } from "./user.validation.js";
import validationMiddleware from "../../middleware/validation.middleware.js";
import authMiddleware from "../../middleware/auth.middleware.js";

const userRouter = Router();

userRouter.post(
  "/",
  createUserValidation,
  validationMiddleware,
  createUserController
);

userRouter.get(
  "/me",
  authMiddleware,
  getMeController
);

export default userRouter;