import { Router } from "express";
import {
  createNewsController,
  deleteNewsController,
  getAllNewsController,
  getNewsByIdController,
  updateNewsController,
} from "./news.controller.js";

import {
  createNewsValidation,
  newsIdValidation,
  newsImageIdValidation,
  updateNewsValidation,
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
import { cacheMiddleware } from "../../middleware/cache.middleware.js";

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
newsRouter.get(
  "/",
  cacheMiddleware(300),
  getAllNewsController
);

// get all
newsRouter.get(
  "/:id",
  cacheMiddleware(600),
  newsIdValidation,
  validationMiddleware,
  getNewsByIdController
);

// by Admin routes
// newsRouter.post(
//   "/",
//   authMiddleware,
//   adminMiddleware,
//   newsImageUpload.single("image"),
//   createNewsValidation,
//   validationMiddleware,
//   createNewsController,
// );

newsRouter.post(
  "/:id/images",
  authMiddleware,
  adminMiddleware,
  newsIdValidation,
  newsImageUpload.array("images", 10),
  validationMiddleware,
  addNewsImagesController
);

newsRouter.patch(
  "/:id",
  authMiddleware,
  adminMiddleware,
  updateNewsValidation,
  validationMiddleware,
  updateNewsController
);


// DELETE News
newsRouter.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  newsIdValidation,
  validationMiddleware,
  deleteNewsController,
);



// NEWS IAMGE ROUTES

// Get all images of a news
newsRouter.get(
  "/:id/images",
  newsIdValidation,
  validationMiddleware,
  getNewsImagesController,
);
export default newsRouter;
