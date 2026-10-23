import { Router } from "express";
import {
  adminGetUsersController,
  adminGetUserByIdController,
  adminUpdateUserController,
  adminDeleteUserController,
  adminGetUserStatsController,
} from "./admin-user.controller.js";
import {
  adminGetUsersValidation,
  adminUserIdValidation,
  adminUpdateUserValidation,
} from "./admin-user.validation.js";
import authMiddleware from "../../../middleware/auth.middleware.js";
import adminMiddleware from "../../../middleware/admin.middleware.js";
import validationMiddleware from "../../../middleware/validation.middleware.js";

const adminUserRouter = Router();

adminUserRouter.use(authMiddleware, adminMiddleware);

adminUserRouter.get(
  "/",
  adminGetUsersValidation,
  validationMiddleware,
  adminGetUsersController
);

adminUserRouter.get("/stats", adminGetUserStatsController);

adminUserRouter.get(
  "/:id",
  adminUserIdValidation,
  validationMiddleware,
  adminGetUserByIdController
);

adminUserRouter.patch(
  "/:id",
  adminUpdateUserValidation,
  validationMiddleware,
  adminUpdateUserController
);

adminUserRouter.delete(
  "/:id",
  adminUserIdValidation,
  validationMiddleware,
  adminDeleteUserController
);

export default adminUserRouter;