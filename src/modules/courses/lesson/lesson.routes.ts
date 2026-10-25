import { Router } from "express";
import {
  getLessonsController,
  createLessonController,
  updateLessonController,
  deleteLessonController,
} from "./lesson.controller.js";
import {
  sectionIdParamValidation,
  lessonIdValidation,
  createLessonValidation,
  updateLessonValidation,
} from "./lesson.validation.js";
import authMiddleware from "../../../middleware/auth.middleware.js";
import teacherMiddleware from "../../../middleware/teacher.middleware.js";   // ← جدید
import validationMiddleware from "../../../middleware/validation.middleware.js";

const lessonRouter = Router();

lessonRouter.get(
  "/sections/:sectionId/lessons",
  sectionIdParamValidation,
  validationMiddleware,
  getLessonsController
);

lessonRouter.post(
  "/sections/:sectionId/lessons",
  authMiddleware,
  teacherMiddleware,   
  createLessonValidation,
  validationMiddleware,
  createLessonController
);

lessonRouter.patch(
  "/lessons/:id",
  authMiddleware,
  teacherMiddleware,   
  updateLessonValidation,
  validationMiddleware,
  updateLessonController
);

lessonRouter.delete(
  "/lessons/:id",
  authMiddleware,
  teacherMiddleware,   
  lessonIdValidation,
  validationMiddleware,
  deleteLessonController
);

export default lessonRouter;