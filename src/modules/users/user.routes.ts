import { Router } from "express";
import {
  changePasswordController,
  createUserController,
  getMeController,
  updateMeController,
  deleteMeController
} from "./user.controller.js";
import {
  changePasswordValidation,
  createUserValidation,
  updateMeValidation,
} from "./user.validation.js";
import validationMiddleware from "../../middleware/validation.middleware.js";
import authMiddleware from "../../middleware/auth.middleware.js";
import createUpload from "../../middleware/upload.middleware.js";

const userRouter = Router();

const avatarUpload = createUpload({
  destination: "uploads/users",
  allowedMimeTypes: ["image/jpeg", "image/png", "image/webp"],
  maxFiles: 1,
  maxFileSize: 5 * 1024 * 1024,
});

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
  avatarUpload.single("avatar"),
  updateMeValidation,
  validationMiddleware,
  updateMeController
);

userRouter.patch(
  "/me/password",
  authMiddleware,
  changePasswordValidation,
  validationMiddleware,
  changePasswordController
);

userRouter.delete(
  "/me",
  authMiddleware,
  deleteMeController
);

export default userRouter;