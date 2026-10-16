import { Router } from "express";
import { reactionController } from "./reaction.controller.js";
import authMiddleware from "../../middleware/auth.middleware.js";
import validationMiddleware from "../../middleware/validation.middleware.js";
import {
  setReactionValidation,
  reactionTargetValidation,
} from "./reaction.validation.js";

const reactionRouter = Router();
const controller = reactionController();

// Set Like or Dislike
reactionRouter.post(
  "/:targetType/:targetId",
  authMiddleware,
  setReactionValidation,
  validationMiddleware,
  controller.setReaction,
);

// Remove the current user's reaction
reactionRouter.delete(
  "/:targetType/:targetId",
  authMiddleware,
  reactionTargetValidation,
  validationMiddleware,
  controller.removeReaction,
);

// Get public Like and Dislike counts
reactionRouter.get(
  "/:targetType/:targetId",
  reactionTargetValidation,
  validationMiddleware,
  controller.getReactionCounts,
);

export default reactionRouter;