import { Router } from "express";
import {
  adminGetPodcastsController,
  adminGetPodcastDetailController,
  adminApprovePodcastController,
  adminRejectPodcastController,
  adminDeletePodcastController,
} from "./admin-podcast.controller.js";
import {
  adminGetPodcastsValidation,
  adminPodcastIdValidation,
  adminRejectPodcastValidation,
} from "./admin-podcast.validation.js";
import authMiddleware from "../../../middleware/auth.middleware.js";
import adminMiddleware from "../../../middleware/admin.middleware.js";
import validationMiddleware from "../../../middleware/validation.middleware.js";

const adminPodcastRouter = Router();

adminPodcastRouter.use(authMiddleware, adminMiddleware);

adminPodcastRouter.get(
  "/",
  adminGetPodcastsValidation,
  validationMiddleware,
  adminGetPodcastsController
);

adminPodcastRouter.get(
  "/:id",
  adminPodcastIdValidation,
  validationMiddleware,
  adminGetPodcastDetailController
);

adminPodcastRouter.patch(
  "/:id/approve",
  adminPodcastIdValidation,
  validationMiddleware,
  adminApprovePodcastController
);

adminPodcastRouter.patch(
  "/:id/reject",
  adminRejectPodcastValidation,
  validationMiddleware,
  adminRejectPodcastController
);

adminPodcastRouter.delete(
  "/:id",
  adminPodcastIdValidation,
  validationMiddleware,
  adminDeletePodcastController
);

export default adminPodcastRouter;