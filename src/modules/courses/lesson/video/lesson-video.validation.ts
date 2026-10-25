import { param } from "express-validator";

export const lessonIdParamValidation = [
    param("lessonId")
        .isUUID()
        .withMessage("Invalid lesson ID"),
];