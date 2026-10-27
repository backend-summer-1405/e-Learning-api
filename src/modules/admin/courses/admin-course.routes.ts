import { Express } from "express";
import { Router } from "express";
import authMiddleware from "../../../middleware/auth.middleware.js";
import adminMiddleware from "../../../middleware/admin.middleware.js";
import { adminCourseIdValidation, adminGetCoursesValidation, adminRejectCourseValidation } from "./admin-course.validation.js";
import validationMiddleware from "../../../middleware/validation.middleware.js";
import { adminApproveCourseController, adminDeleteCourseController, adminGetCoursesController, adminRejectCourseController } from "./admin-course.controller.js";
import { cacheMiddleware } from "../../../middleware/cache.middleware.js";

const adminCourseRouter = Router()

adminCourseRouter.use(authMiddleware, adminMiddleware)

adminCourseRouter.get(
    "/",
     cacheMiddleware(300),
    adminGetCoursesValidation,
    validationMiddleware,
    adminGetCoursesController,

)

adminCourseRouter.get(
    "/:id/approve",
    adminCourseIdValidation,
    validationMiddleware,
    adminApproveCourseController,
);

adminCourseRouter.patch(
    "/:id/reject",
    adminRejectCourseValidation,
    validationMiddleware,
    adminRejectCourseController
);

adminCourseRouter.delete(
    "/:id",
    adminCourseIdValidation,
    validationMiddleware,
    adminDeleteCourseController
);

export default adminCourseRouter;