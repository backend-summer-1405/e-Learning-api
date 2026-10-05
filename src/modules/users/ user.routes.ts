import { Router } from "express";
import { createUserController } from "./user.controller.js";
import { createUserValidation } from "./user.validation.js";
import validationMiddleware from "../../middleware/validation.middleware.js";

const userRouter = Router();

userRouter.post(
  "/",
  createUserValidation,
  validationMiddleware,
  createUserController
);

export default userRouter;