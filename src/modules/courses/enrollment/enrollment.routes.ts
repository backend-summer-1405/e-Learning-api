import { Router } from "express";
import {
    enrollInCourseController,
    getMyEnrollmentsController,
    getEnrollmentByIdController,
    cancelEnrollmentController,
} from "./enrollment.controller.js";
import {
    courseIdParamValidation,
    enrollmentIdValidation,
} from "./enrollment.validation.js";
import authMiddleware from "../../../middleware/auth.middleware.js";
import validationMiddleware from "../../../middleware/validation.middleware.js";

const enrollmentRouter = Router();


enrollmentRouter.post(
    "/courses/:courseId/enroll",
    authMiddleware,
    courseIdParamValidation,
    validationMiddleware,
    enrollInCourseController
);

enrollmentRouter.get(
    "/enrollments/me",
    authMiddleware,
    getMyEnrollmentsController
);

enrollmentRouter.get(
    "/enrollments/:id",
    authMiddleware,
    enrollmentIdValidation,
    validationMiddleware,
    getEnrollmentByIdController
);

enrollmentRouter.delete(
    "/enrollments/:id",
    authMiddleware,
    enrollmentIdValidation,
    validationMiddleware,
    cancelEnrollmentController
);

export default enrollmentRouter;