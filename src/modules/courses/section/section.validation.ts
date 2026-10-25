import { body, param } from "express-validator";

export const courseIdParamValidation = [
  param("courseId").isUUID().withMessage("Invalid course ID"),
];

export const sectionIdValidation = [
  param("id").isUUID().withMessage("Invalid section ID"),
];

export const createSectionValidation = [
  ...courseIdParamValidation,

  body("title")
    .isString()
    .withMessage("title must be a string")
    .trim()
    .notEmpty()
    .withMessage("title is required")
    .isLength({ max: 200 })
    .withMessage("title must not exceed 200 characters"),

  body("order")
    .optional()
    .isInt({ min: 0 })
    .withMessage("order must be a non-negative integer")
    .toInt(),
];

export const updateSectionValidation = [
  ...sectionIdValidation,

  body("title")
    .optional()
    .isString()
    .withMessage("title must be a string")
    .trim()
    .notEmpty()
    .withMessage("title cannot be empty")
    .isLength({ max: 200 })
    .withMessage("title must not exceed 200 characters"),

  body("order")
    .optional()
    .isInt({ min: 0 })
    .withMessage("order must be a non-negative integer")
    .toInt(),
];