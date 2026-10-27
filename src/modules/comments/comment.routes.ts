import { Router } from "express";
import {
  createCommentController,
  getCommentsController,
  getCommentRepliesController,
  updateCommentController,
  deleteCommentController,
  setCommentReactionController,
  removeCommentReactionController,
  getCommentReactionCountsController,
} from "./comment.controller.js";
import {
  createCommentValidation,
  getCommentsValidation,
  commentIdValidation,
  updateCommentValidation,
  setCommentReactionValidation,
  removeCommentReactionValidation,
} from "./comment.validation.js";
import authMiddleware from "../../middleware/auth.middleware.js";
import optionalAuthMiddleware from "../../middleware/optional-auth.middleware.js";
import validationMiddleware from "../../middleware/validation.middleware.js";
import { cacheMiddleware } from "../../middleware/cache.middleware.js";

const commentRouter = Router();


commentRouter.get(
  "/",
  cacheMiddleware(60),
  optionalAuthMiddleware,
  getCommentsValidation,
  validationMiddleware,
  getCommentsController
);

commentRouter.get(
  "/:id/replies",
  cacheMiddleware(60),
  optionalAuthMiddleware,
  commentIdValidation,
  validationMiddleware,
  getCommentRepliesController
);

commentRouter.get(
  "/:id/reactions",
  cacheMiddleware(60),
  commentIdValidation,
  validationMiddleware,
  getCommentReactionCountsController
);


commentRouter.post(
  "/",
  authMiddleware,
  createCommentValidation,
  validationMiddleware,
  createCommentController
);

commentRouter.patch(
  "/:id",
  authMiddleware,
  updateCommentValidation,
  validationMiddleware,
  updateCommentController
);

commentRouter.delete(
  "/:id",
  authMiddleware,
  commentIdValidation,
  validationMiddleware,
  deleteCommentController
);

commentRouter.post(
  "/:id/reactions",
  authMiddleware,
  setCommentReactionValidation,
  validationMiddleware,
  setCommentReactionController
);

commentRouter.delete(
  "/:id/reactions",
  authMiddleware,
  removeCommentReactionValidation,
  validationMiddleware,
  removeCommentReactionController
);

export default commentRouter;