import { Router } from "express";
import {
  adminGetNewsController,
  adminGetNewsByIdController,
  adminUpdateNewsController,
  adminDeleteNewsController,
} from "./admin-news.controller.js";
import {
  adminGetNewsValidation,
  adminNewsIdValidation,
  adminUpdateNewsValidation,
} from "./admin-news.validation.js";
import authMiddleware from "../../../middleware/auth.middleware.js";
import adminMiddleware from "../../../middleware/admin.middleware.js";
import validationMiddleware from "../../../middleware/validation.middleware.js";
import { cacheMiddleware } from "../../../middleware/cache.middleware.js";

const adminNewsRouter = Router();

adminNewsRouter.use(authMiddleware, adminMiddleware);

adminNewsRouter.get(
  "/",
  cacheMiddleware(300),
  adminGetNewsValidation,
  validationMiddleware,
  adminGetNewsController
);

adminNewsRouter.get(
  "/:id",
  cacheMiddleware(600),
  adminNewsIdValidation,
  validationMiddleware,
  adminGetNewsByIdController
);

adminNewsRouter.patch(
  "/:id",
  adminUpdateNewsValidation,
  validationMiddleware,
  adminUpdateNewsController
);

adminNewsRouter.delete(
  "/:id",
  adminNewsIdValidation,
  validationMiddleware,
  adminDeleteNewsController
);

export default adminNewsRouter;