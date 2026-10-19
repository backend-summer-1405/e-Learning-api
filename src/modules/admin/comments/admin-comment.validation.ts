import { body, param, query } from "express-validator";

const VALID_TARGET_TYPES = ["NEWS", "COURSE", "PODCAST"];
const VALID_STATUSES = ["PENDING", "APPROVED", "REJECTED"];

const normalizeUpper = (value: unknown) =>
  typeof value === "string" ? value.toUpperCase() : value;

export const adminGetCommentsValidation = [
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

  query("targetType")
    .optional()
    .customSanitizer(normalizeUpper)
    .isIn(VALID_TARGET_TYPES)
    .withMessage(`targetType must be one of: ${VALID_TARGET_TYPES.join(", ")}`),

  query("targetId")
    .optional()
    .isString()
    .withMessage("targetId must be a string"),

  query("userId")
    .optional()
    .isUUID()
    .withMessage("userId must be a valid UUID"),

  query("status")
    .optional()
    .customSanitizer(normalizeUpper)
    .isIn(VALID_STATUSES)
    .withMessage(`status must be one of: ${VALID_STATUSES.join(", ")}`),

  query("includeDeleted")
    .optional()
    .isBoolean()
    .withMessage("includeDeleted must be a boolean")
    .toBoolean(),

  query("search")
    .optional()
    .isString()
    .withMessage("search must be a string")
    .isLength({ max: 200 })
    .withMessage("search must not exceed 200 characters"),
];

export const adminCommentIdValidation = [
  param("id").isUUID().withMessage("Invalid comment ID"),
];

export const adminRejectCommentValidation = [
  ...adminCommentIdValidation,

  body("reason")
    .isString()
    .withMessage("reason must be a string")
    .trim()
    .notEmpty()
    .withMessage("reason is required")
    .isLength({ max: 500 })
    .withMessage("reason must not exceed 500 characters"),
];