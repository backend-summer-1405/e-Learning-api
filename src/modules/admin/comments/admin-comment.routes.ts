import { Router } from "express";
import {
  adminGetCommentsController,
  adminApproveCommentController,
  adminRejectCommentController,
  adminDeleteCommentController,
  adminRestoreCommentController,
  adminHardDeleteCommentController,
} from "./admin-comment.controller.js";
import {
  adminGetCommentsValidation,
  adminCommentIdValidation,
  adminRejectCommentValidation,
} from "./admin-comment.validation.js";
import authMiddleware from "../../../middleware/auth.middleware.js";
import adminMiddleware from "../../../middleware/admin.middleware.js";
import validationMiddleware from "../../../middleware/validation.middleware.js";
import { cacheMiddleware } from "../../../middleware/cache.middleware.js";

const adminCommentRouter = Router();

adminCommentRouter.use(authMiddleware, adminMiddleware);

adminCommentRouter.get(
  "/",
    cacheMiddleware(60),
  adminGetCommentsValidation,
  validationMiddleware,
  adminGetCommentsController
);

adminCommentRouter.patch(
  "/:id/approve",
    cacheMiddleware(60),
  adminCommentIdValidation,
  validationMiddleware,
  adminApproveCommentController
);

adminCommentRouter.patch(
  "/:id/reject",
  adminRejectCommentValidation,
  validationMiddleware,
  adminRejectCommentController
);

adminCommentRouter.delete(
  "/:id",
  adminCommentIdValidation,
  validationMiddleware,
  adminDeleteCommentController
);

adminCommentRouter.patch(
  "/:id/restore",
  adminCommentIdValidation,
  validationMiddleware,
  adminRestoreCommentController
);

adminCommentRouter.delete(
  "/:id/hard",
  adminCommentIdValidation,
  validationMiddleware,
  adminHardDeleteCommentController
);

export default adminCommentRouter;