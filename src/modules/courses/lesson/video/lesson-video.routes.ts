import { Router } from "express";
import {
    uploadLessonVideoController,
    getLessonVideoController,
} from "./lesson-video.controller.js";
import { lessonIdParamValidation } from "./lesson-video.validation.js";
import authMiddleware from "../../../../middleware/auth.middleware.js";
import teacherMiddleware from "../../../../middleware/teacher.middleware.js";
import optionalAuthMiddleware from "../../../../middleware/optional-auth.middleware.js";
import validationMiddleware from "../../../../middleware/validation.middleware.js";
import createUpload from "../../../../middleware/upload.middleware.js";

const lessonVideoRouter = Router();

const videoUpload = createUpload({
    destination: "uploads/courses/videos",
    allowedMimeTypes: ["video/mp4", "video/webm", "video/ogg"],
    maxFiles: 1,
    maxFileSize: 500 * 1024 * 1024,
});

lessonVideoRouter.post(
    "/:lessonId/video",
    authMiddleware,
    teacherMiddleware,
    lessonIdParamValidation,
    validationMiddleware,
    videoUpload.single("video"),
    uploadLessonVideoController
);

lessonVideoRouter.get(
    "/:lessonId/video",
    optionalAuthMiddleware,
    lessonIdParamValidation,
    validationMiddleware,
    getLessonVideoController
);

export default lessonVideoRouter;