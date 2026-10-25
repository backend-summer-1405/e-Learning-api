import { param } from "express-validator";

export const courseIdParamValidation = [
    param("courseId")
        .isUUID()
        .withMessage("Invalid course ID"),
];

export const enrollmentIdValidation = [
    param("id")
        .isUUID()
        .withMessage("Invalid enrollment ID"),
];