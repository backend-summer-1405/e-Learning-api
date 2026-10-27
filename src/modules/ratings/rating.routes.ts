import { Router } from "express";
import { createRatingController, updateRatingController, deleteRatingController, getRatingsController, getMyRatingController, } from "./rating.controller.js";
import { createRatingValidation, updateRatingValidation, ratingIdValidation, getRatingsValidation, } from "./rating.validation.js";
import authMiddleware from "../../middleware/auth.middleware.js";
import validationMiddleware from "../../middleware/validation.middleware.js";
import { cacheMiddleware } from "../../middleware/cache.middleware.js";

const ratingRouter = Router();

ratingRouter.get(
  '/:targetType/:targetId/ratings',
  cacheMiddleware(300),
  getRatingsValidation,
  validationMiddleware,
  getRatingsController
)

ratingRouter.get(
  "/:targetType/:targetId/ratings/me",
  authMiddleware,
  getRatingsValidation,
  validationMiddleware,
  getMyRatingController
)

ratingRouter.post(
  "/",
  authMiddleware,
  createRatingValidation,
  validationMiddleware,
  createRatingController
);

ratingRouter.patch(
  "/:id",
  authMiddleware,
  updateRatingValidation,
  validationMiddleware,
  updateRatingController
);

ratingRouter.delete(
  "/:id",
  authMiddleware,
  ratingIdValidation,
  validationMiddleware,
  deleteRatingController
);

export default ratingRouter;