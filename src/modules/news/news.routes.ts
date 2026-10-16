import { Router } from "express";
import {
  createNewsController,
  getAllNewsController,
  getNewsByIdController,
} from "./news.controller.js";

import {
  createNewsValidation,
  newsIdValidation,
} from "./news.validation.js";

import validationMiddleware from "../../middleware/validation.middleware.js";
import authMiddleware from "../../middleware/auth.middleware.js";
import adminMiddleware from "../../middleware/admin.middleware.js";

const newsRouter = Router();

// public routes
newsRouter.get("/", getAllNewsController);

// get all
newsRouter.get(
  "/:id",
  newsIdValidation,
  validationMiddleware,
  getNewsByIdController
);

// by Admin routes
newsRouter.post(
  "/",
  authMiddleware,
  adminMiddleware,
  createNewsValidation,
  validationMiddleware,
  createNewsController
);


export default newsRouter;
