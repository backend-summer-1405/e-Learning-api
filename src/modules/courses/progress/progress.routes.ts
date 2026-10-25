import { Router } from "express";
import {
    updateProgressController,
    getLessonProgressController,
    getCourseProgressController,
} from "./progress.controller.js";
import {
    lessonIdParamValidation,
    courseIdParamValidation,
    updateProgressValidation,
} from "./progress.validation.js";
import authMiddleware from "../../../middleware/auth.middleware.js";
import validationMiddleware from "../../../middleware/validation.middleware.js";

const progressRouter = Router();

progressRouter.use(authMiddleware);

progressRouter.post(
    "/lessons/:lessonId/progress",
    updateProgressValidation,
    validationMiddleware,
    updateProgressController
);

progressRouter.get(
    "/lessons/:lessonId/progress",
    lessonIdParamValidation,
    validationMiddleware,
    getLessonProgressController
);

progressRouter.get(
    "/courses/:courseId/progress",
    courseIdParamValidation,
    validationMiddleware,
    getCourseProgressController
);

export default progressRouter;