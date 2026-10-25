import { param } from "express-validator";


export const courseIdParamValidation = [
    param("courseId")
        .isUUID()
        .withMessage("Invalid course ID"),
];


export const courseImageIdValidation = [
    param("imageId")
        .isUUID()
        .withMessage("Invalid image ID"),
];



