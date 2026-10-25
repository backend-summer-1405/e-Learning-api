import { Router } from "express";
import {
  getCoursesController,
  getCourseDetailController,
  createCourseController,
  updateCourseController,
  deleteCourseController,
} from "./course.controller.js";
import {
  getCoursesValidation,
  courseSlugValidation,
  courseIdValidation,
  createCourseValidation,
  updateCourseValidation,
} from "./course.validation.js";
import authMiddleware from "../../middleware/auth.middleware.js";
import validationMiddleware from "../../middleware/validation.middleware.js";
import teacherMiddleware from "../../middleware/teacher.middleware.js";

const courseRouter = Router();

//  PUBLIC 
courseRouter.get(
  "/",
  getCoursesValidation,
  validationMiddleware,
  getCoursesController
);

courseRouter.get(
  "/:slug",
  courseSlugValidation,
  validationMiddleware,
  getCourseDetailController
);

//  PROTECTED Teacher/Admin 
courseRouter.post(
  "/",
  authMiddleware,
  teacherMiddleware,
  createCourseValidation,
  validationMiddleware,
  createCourseController
);

courseRouter.patch(
  "/:id",
  authMiddleware,
  teacherMiddleware,
  updateCourseValidation,
  validationMiddleware,
  updateCourseController
);

courseRouter.delete(
  "/:id",
  authMiddleware,
  teacherMiddleware,
  courseIdValidation,
  validationMiddleware,
  deleteCourseController
);

export default courseRouter;