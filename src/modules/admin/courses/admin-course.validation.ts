import { body, param, query } from "express-validator";

const VALID_STATUSES = ["DRAFT", "PENDING", "APPROVED", "REJECTED"];
const VALID_LEVELS = ["BEGINNER", "INTERMEDIATE", "ADVANCED"];

const normalizeUpper = (value: unknown) =>
  typeof value === "string" ? value.toUpperCase() : value;

export const adminGetCoursesValidation = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("page must be a positive integer")
    .toInt(),

  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("limit must be between 1 and 100")
    .toInt(),

  query("status")
    .optional()
    .customSanitizer(normalizeUpper)
    .isIn(VALID_STATUSES)
    .withMessage(`status must be one of: ${VALID_STATUSES.join(", ")}`),

  query("level")
    .optional()
    .customSanitizer(normalizeUpper)
    .isIn(VALID_LEVELS)
    .withMessage(`level must be one of: ${VALID_LEVELS.join(", ")}`),

  query("teacherId")
    .optional()
    .isUUID()
    .withMessage("teacherId must be a valid UUID"),

  query("search")
    .optional()
    .isString()
    .withMessage("search must be a string")
    .isLength({ max: 200 })
    .withMessage("search must not exceed 200 characters"),
];

export const adminCourseIdValidation = [
  param("id").isUUID().withMessage("Invalid course ID"),
];

export const adminRejectCourseValidation = [
  ...adminCourseIdValidation,

  body("reason")
    .isString()
    .withMessage("reason must be a string")
    .trim()
    .notEmpty()
    .withMessage("reason is required")
    .isLength({ max: 500 })
    .withMessage("reason must not exceed 500 characters"),
];