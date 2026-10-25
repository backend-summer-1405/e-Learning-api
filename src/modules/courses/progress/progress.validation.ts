import { body, param } from "express-validator";

export const lessonIdParamValidation = [
    param("lessonId")
    .isUUID()
    .withMessage("Invalid lesson ID"),
];

export const courseIdParamValidation = [
    param("courseId")
        .isUUID()
        .withMessage("Invalid course ID"),
];

export const updateProgressValidation = [
    ...lessonIdParamValidation,

    body("lastPosition")
        .isInt({ min: 0 })
        .withMessage("lastPosition must be a non-negative integer")
        .toInt(),

    body("isCompleted")
        .optional()
        .isBoolean()
        .withMessage("isCompleted must be a boolean")
        .toBoolean(),
];