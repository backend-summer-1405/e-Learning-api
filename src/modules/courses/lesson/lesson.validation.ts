import { body, param } from "express-validator";

export const sectionIdParamValidation = [
  param("sectionId").isUUID().withMessage("Invalid section ID"),
];

export const lessonIdValidation = [
  param("id").isUUID().withMessage("Invalid lesson ID"),
];

export const createLessonValidation = [
  ...sectionIdParamValidation,

  body("title")
    .isString()
    .withMessage("title must be a string")
    .trim()
    .notEmpty()
    .withMessage("title is required")
    .isLength({ max: 200 })
    .withMessage("title must not exceed 200 characters"),

  body("videoUrl")
    .isString()
    .withMessage("videoUrl must be a string")
    .trim()
    .notEmpty()
    .withMessage("videoUrl is required"),

  body("duration")
    .optional()
    .isInt({ min: 0 })
    .withMessage("duration must be a non-negative integer")
    .toInt(),

  body("order")
    .optional()
    .isInt({ min: 0 })
    .withMessage("order must be a non-negative integer")
    .toInt(),

  body("isFree")
    .optional()
    .isBoolean()
    .withMessage("isFree must be a boolean")
    .toBoolean(),
];

export const updateLessonValidation = [
  ...lessonIdValidation,

  body("title")
    .optional()
    .isString()
    .withMessage("title must be a string")
    .trim()
    .notEmpty()
    .withMessage("title cannot be empty")
    .isLength({ max: 200 })
    .withMessage("title must not exceed 200 characters"),

  body("videoUrl")
    .optional()
    .isString()
    .withMessage("videoUrl must be a string")
    .trim()
    .notEmpty()
    .withMessage("videoUrl cannot be empty"),

  body("duration")
    .optional()
    .isInt({ min: 0 })
    .withMessage("duration must be a non-negative integer")
    .toInt(),

  body("order")
    .optional()
    .isInt({ min: 0 })
    .withMessage("order must be a non-negative integer")
    .toInt(),

  body("isFree")
    .optional()
    .isBoolean()
    .withMessage("isFree must be a boolean")
    .toBoolean(),
];