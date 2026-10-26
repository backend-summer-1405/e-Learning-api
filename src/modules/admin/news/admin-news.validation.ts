import { body, param, query } from "express-validator";

const VALID_SORT_BY = ["createdAt", "title", "ratingAvg"];
const VALID_SORT_ORDER = ["asc", "desc"];

export const adminGetNewsValidation = [
  query("page").optional().isInt({ min: 1 }).toInt(),
  query("limit").optional().isInt({ min: 1, max: 100 }).toInt(),

  query("search").optional().isString().isLength({ max: 200 }),

  query("sortBy")
    .optional()
    .isIn(VALID_SORT_BY)
    .withMessage(`sortBy must be one of: ${VALID_SORT_BY.join(", ")}`),

  query("sortOrder")
    .optional()
    .isIn(VALID_SORT_ORDER)
    .withMessage(`sortOrder must be one of: ${VALID_SORT_ORDER.join(", ")}`),
];

export const adminNewsIdValidation = [
  param("id").isUUID().withMessage("Invalid news ID"),
];

export const adminCreateNewsValidation = [
  body("title")
    .isString()
    .withMessage("title must be a string")
    .trim()
    .notEmpty()
    .withMessage("title is required")
    .isLength({ max: 200 })
    .withMessage("title must not exceed 200 characters"),

  body("content")
    .isString()
    .withMessage("content must be a string")
    .trim()
    .notEmpty()
    .withMessage("content is required")
    .isLength({ max: 10000 })
    .withMessage("content must not exceed 10000 characters"),
];

export const adminUpdateNewsValidation = [
  ...adminNewsIdValidation,

  body("title")
    .optional()
    .isString()
    .withMessage("title must be a string")
    .trim()
    .notEmpty()
    .withMessage("title cannot be empty")
    .isLength({ max: 200 })
    .withMessage("title must not exceed 200 characters"),

  body("content")
    .optional()
    .isString()
    .withMessage("content must be a string")
    .trim()
    .notEmpty()
    .withMessage("content cannot be empty")
    .isLength({ max: 10000 })
    .withMessage("content must not exceed 10000 characters"),
];