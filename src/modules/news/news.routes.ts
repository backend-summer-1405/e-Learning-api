import { Router } from "express";
import {
  createNewsController,
  getAllNewsController,
  getNewsByIdController,
} from "./news.controller.js";

import {
  createNewsValidation,
  newsIdValidation,
  newsImageIdValidation,
} from "./news.validation.js";

import validationMiddleware from "../../middleware/validation.middleware.js";
import authMiddleware from "../../middleware/auth.middleware.js";
import adminMiddleware from "../../middleware/admin.middleware.js";
import createUpload from "../../middleware/upload.middleware.js";

import {
  addNewsImagesController,
  getNewsImagesController,
  deleteNewsImageController,
  replaceNewsImageController,
} from "./news-image.controller.js";

const newsRouter = Router();

const newsImageUpload = createUpload({
  destination: "uploads/news",
  allowedMimeTypes: [
    "image/jpeg",
    "image/png",
    "image/webp",
  ],
  maxFiles: 10,
  maxFileSize: 5 * 1024 * 1024,
});

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
  newsImageUpload.single("image"),
  createNewsValidation,
  validationMiddleware,
  createNewsController,
);


// NEWS IAMGE ROUTES

// Get all images of a news
newsRouter.get(
  "/:id/images",
  newsIdValidation,
  validationMiddleware,
  getNewsImagesController,
);

// Add multiple images to a news
newsRouter.post(
  "/:id/images",
  authMiddleware,
  adminMiddleware,
  newsIdValidation,
  newsImageUpload.array("images", 10),
  validationMiddleware,
  addNewsImagesController,
);

// Delete one news image
newsRouter.delete(
  "/:id/images/:imageId",
  authMiddleware,
  adminMiddleware,
  newsIdValidation,
  newsImageIdValidation,
  validationMiddleware,
  deleteNewsImageController,
);

// Replace one news image
newsRouter.patch(
  "/:id/images/:imageId",
  authMiddleware,
  adminMiddleware,
  newsIdValidation,
  newsImageIdValidation,
  newsImageUpload.single("image"),
  validationMiddleware,
  replaceNewsImageController,
);



export default newsRouter;
