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
  updateCommentValidation,
  setCommentReactionValidation,
  removeCommentReactionValidation,
  getCommentRepliesValidation,
  commentIdParamValidation,
} from "./comment.validation.js";
import authMiddleware from "../../middleware/auth.middleware.js";
import optionalAuthMiddleware from "../../middleware/optional-auth.middleware.js";
import validationMiddleware from "../../middleware/validation.middleware.js";

const commentRouter = Router();

commentRouter.get(
  "/:targetType/:targetId",
  optionalAuthMiddleware,
  getCommentsValidation,
  validationMiddleware,
  getCommentsController
);

commentRouter.post(
  "/:targetType/:targetId",
  authMiddleware,
  createCommentValidation,
  validationMiddleware,
  createCommentController
);

commentRouter.get(
  "/:targetType/:targetId/replies/:commentId",
  optionalAuthMiddleware,
  getCommentRepliesValidation,
  validationMiddleware,
  getCommentRepliesController
);

commentRouter.patch(
  "/:targetType/:targetId/:commentId",
  authMiddleware,
  updateCommentValidation,
  validationMiddleware,
  updateCommentController
);

commentRouter.delete(
  "/:targetType/:targetId/:commentId",
  authMiddleware,
  commentIdParamValidation,
  validationMiddleware,
  deleteCommentController
);

commentRouter.post(
  "/:targetType/:targetId/:commentId/reactions",
  authMiddleware,
  setCommentReactionValidation,
  validationMiddleware,
  setCommentReactionController
);

commentRouter.delete(
  "/:targetType/:targetId/:commentId/reactions",
  authMiddleware,
  removeCommentReactionValidation,
  validationMiddleware,
  removeCommentReactionController
);

commentRouter.get(
  "/:targetType/:targetId/:commentId/reactions",
  commentIdParamValidation,
  validationMiddleware,
  getCommentReactionCountsController
);

export default commentRouter;