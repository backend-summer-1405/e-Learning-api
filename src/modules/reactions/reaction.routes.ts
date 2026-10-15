import { Router } from "express";
import { reactionController } from "./reaction.controller.js";
import authMiddleware from "../../middleware/auth.middleware.js";
import { setReactionValidation } from "./reaction.validation.js";

const reactionRouter = Router();
const controller = reactionController();

reactionRouter.post(
  "/:targetType/:targetId",
  authMiddleware,
  setReactionValidation,
  controller.setReaction,
);

reactionRouter.delete(
  "/:targetType/:targetId",
  authMiddleware,
  setReactionValidation,
  controller.removeReaction,
);


// Get the number of likes and dislikes
reactionRouter.get(
  "/:targetType/:targetId",
  setReactionValidation,
  controller.getReactionCounts,
);

export default reactionRouter;