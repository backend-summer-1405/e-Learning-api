import { Router } from "express";
import { changePasswordController, createUserController, getMeController, updateMeController } from "./user.controller.js";
import { changePasswordValidation, createUserValidation, updateMeValidation } from "./user.validation.js";
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

userRouter.patch(
  "/me",
  authMiddleware,
  updateMeValidation,
  validationMiddleware,
  updateMeController,
)

userRouter.patch(
  "me/password",
  authMiddleware,
  changePasswordValidation,
  validationMiddleware,
  changePasswordController,

);

export default userRouter;