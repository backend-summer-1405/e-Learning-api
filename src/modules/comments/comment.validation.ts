import { body, param, query } from "express-validator";

const VALID_TARGET_TYPES = ["NEWS", "COURSE", "PODCAST"];
const VALID_REACTION_TYPES = ["LIKE", "DISLIKE"];

const normalizeUpper = (value: unknown) =>
  typeof value === "string" ? value.toUpperCase() : value;

export const createCommentValidation = [
  body("content")
    .isString()
    .withMessage("Content must be a string")
    .trim()
    .notEmpty()
    .withMessage("Content is required")
    .isLength({ max: 2000 })
    .withMessage("Content must not exceed 2000 characters"),

  body("targetType")
    .customSanitizer(normalizeUpper)
    .isIn(VALID_TARGET_TYPES)
    .withMessage(`targetType must be one of: ${VALID_TARGET_TYPES.join(", ")}`),

  body("targetId")
    .isString()
    .withMessage("targetId must be a string")
    .notEmpty()
    .withMessage("targetId is required"),

  body("parentId")
    .optional({ nullable: true })
    .isUUID()
    .withMessage("parentId must be a valid UUID"),

  body("timestamp")
    .optional()
    .isInt({ min: 0 })
    .withMessage("timestamp must be a non-negative integer")
    .toInt(),
];

export const getCommentsValidation = [
  query("targetType")
    .customSanitizer(normalizeUpper)
    .isIn(VALID_TARGET_TYPES)
    .withMessage(`targetType must be one of: ${VALID_TARGET_TYPES.join(", ")}`),

  query("targetId")
    .isString()
    .withMessage("targetId must be a string")
    .notEmpty()
    .withMessage("targetId is required"),

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
];

export const commentIdValidation = [
  param("id").isUUID().withMessage("Invalid comment ID"),
];

export const updateCommentValidation = [
  ...commentIdValidation,

  body("content")
    .isString()
    .withMessage("Content must be a string")
    .trim()
    .notEmpty()
    .withMessage("Content is required")
    .isLength({ max: 2000 })
    .withMessage("Content must not exceed 2000 characters"),
];

export const setCommentReactionValidation = [
  ...commentIdValidation,

  body("type")
    .customSanitizer(normalizeUpper)
    .isIn(VALID_REACTION_TYPES)
    .withMessage(`type must be one of: ${VALID_REACTION_TYPES.join(", ")}`),
];

export const removeCommentReactionValidation = [...commentIdValidation];