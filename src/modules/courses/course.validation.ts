import { body, param, query } from "express-validator";

const VALID_LEVELS = ["BEGINNER", "INTERMEDIATE", "ADVANCED"];
const VALID_SORT_BY = ["createdAt", "price", "ratingAvg", "enrollmentCount"];
const VALID_SORT_ORDER = ["asc", "desc"];

const normalizeUpper = (value: unknown) =>
  typeof value === "string" ? value.toUpperCase() : value;

export const getCoursesValidation = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("page must be a positive integer")
    .toInt(),

  query("limit")
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage("limit must be between 1 and 50")
    .toInt(),

  query("search")
    .optional()
    .isString()
    .withMessage("search must be a string")
    .isLength({ max: 100 })
    .withMessage("search must not exceed 100 characters"),

  query("isFree")
    .optional()
    .isBoolean()
    .withMessage("isFree must be a boolean")
    .toBoolean(),

  query("level")
    .optional()
    .customSanitizer(normalizeUpper)
    .isIn(VALID_LEVELS)
    .withMessage(`level must be one of: ${VALID_LEVELS.join(", ")}`),

  query("language")
    .optional()
    .isString()
    .withMessage("language must be a string"),

  query("sortBy")
    .optional()
    .isIn(VALID_SORT_BY)
    .withMessage(`sortBy must be one of: ${VALID_SORT_BY.join(", ")}`),

  query("sortOrder")
    .optional()
    .isIn(VALID_SORT_ORDER)
    .withMessage(`sortOrder must be one of: ${VALID_SORT_ORDER.join(", ")}`),
];

export const courseSlugValidation = [
  param("slug")
    .isString()
    .withMessage("slug must be a string")
    .notEmpty()
    .withMessage("slug is required"),
];

export const courseIdValidation = [
  param("id").isUUID().withMessage("Invalid course ID"),
];

export const createCourseValidation = [
  body("title")
    .isString()
    .withMessage("title must be a string")
    .trim()
    .notEmpty()
    .withMessage("title is required")
    .isLength({ max: 200 })
    .withMessage("title must not exceed 200 characters"),

  body("description")
    .isString()
    .withMessage("description must be a string")
    .trim()
    .notEmpty()
    .withMessage("description is required")
    .isLength({ max: 5000 })
    .withMessage("description must not exceed 5000 characters"),

  body("price")
    .isInt({ min: 0 })
    .withMessage("price must be a non-negative integer")
    .toInt(),

  body("level")
    .customSanitizer(normalizeUpper)
    .isIn(VALID_LEVELS)
    .withMessage(`level must be one of: ${VALID_LEVELS.join(", ")}`),

  body("language")
    .optional()
    .isString()
    .withMessage("language must be a string"),

  body("thumbnailUrl")
    .optional()
    .isString()
    .withMessage("thumbnailUrl must be a string"),

  body("previewVideoUrl")
    .optional()
    .isString()
    .withMessage("previewVideoUrl must be a string"),
];

export const updateCourseValidation = [
  ...courseIdValidation,

  body("title")
    .optional()
    .isString()
    .withMessage("title must be a string")
    .trim()
    .notEmpty()
    .withMessage("title cannot be empty")
    .isLength({ max: 200 })
    .withMessage("title must not exceed 200 characters"),

  body("description")
    .optional()
    .isString()
    .withMessage("description must be a string")
    .trim()
    .notEmpty()
    .withMessage("description cannot be empty")
    .isLength({ max: 5000 })
    .withMessage("description must not exceed 5000 characters"),

  body("price")
    .optional()
    .isInt({ min: 0 })
    .withMessage("price must be a non-negative integer")
    .toInt(),

  body("level")
    .optional()
    .customSanitizer(normalizeUpper)
    .isIn(VALID_LEVELS)
    .withMessage(`level must be one of: ${VALID_LEVELS.join(", ")}`),

  body("language")
    .optional()
    .isString()
    .withMessage("language must be a string"),

  body("thumbnailUrl")
    .optional()
    .isString()
    .withMessage("thumbnailUrl must be a string"),

  body("previewVideoUrl")
    .optional()
    .isString()
    .withMessage("previewVideoUrl must be a string"),
];