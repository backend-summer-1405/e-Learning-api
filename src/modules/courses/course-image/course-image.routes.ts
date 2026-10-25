import { Router } from "express";
import { getCourseImagesController, addCourseImagesController, setPrimaryCourseImageController, deleteCourseImageController, } from "./course-image.controller.js";
import { courseIdParamValidation, courseImageIdValidation, } from "./course-image.validation.js";
import authMiddleware from "../../../middleware/auth.middleware.js";
import validationMiddleware from "../../../middleware/validation.middleware.js";
import createUpload from "../../../middleware/upload.middleware.js";
import teacherMiddleware from "../../../middleware/teacher.middleware.js";

const courseImageRouter = Router();

const courseImageUpload = createUpload({
    destination: "uploads/courses",
    allowedMimeTypes: ["image/jpeg", "image/png", "image/webp"],
    maxFiles: 10,
    maxFileSize: 5 * 1024 * 1024,
})

courseImageRouter.get(
    "/courses/:courseId/images",
    courseIdParamValidation,
    validationMiddleware,
    getCourseImagesController
)

courseImageRouter.post(
    "/courses/:courseId/images",
    authMiddleware,
    teacherMiddleware,
    courseIdParamValidation,
    validationMiddleware,
    courseImageUpload.array("images", 5),
    addCourseImagesController
);

courseImageRouter.patch(
    "/courses/:courseId/images/:imageId/primary",
    authMiddleware,
    teacherMiddleware,
    courseIdParamValidation,
    courseImageIdValidation,
    validationMiddleware,
    setPrimaryCourseImageController
)

courseImageRouter.delete(
    "/courses/:courseId/images/:imageId",
    authMiddleware,
    teacherMiddleware,
    courseIdParamValidation,
    courseImageIdValidation,
    validationMiddleware,
    deleteCourseImageController
)

export default courseImageRouter;