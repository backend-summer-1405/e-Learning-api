import { body, param } from "express-validator";

const VALID_TARGET_TYPES = ["NEWS", "COURSE", "PODCAST"];

const normalizeUpper = (value: unknown) =>
  typeof value === "string" ? value.toUpperCase() : value;

export const createRatingValidation = [
  body("targetType")
    .customSanitizer(normalizeUpper)
    .isIn(VALID_TARGET_TYPES)
    .withMessage(`targetType must be one of: ${VALID_TARGET_TYPES.join(", ")}`),

  body("targetId")
    .isString()
    .withMessage("targetId must be a string")
    .notEmpty()
    .withMessage("targetId is required"),

  body("score")
    .isInt({ min: 1, max: 5 })
    .withMessage("score must be between 1 and 5")
    .toInt(),

  body("comment")
    .optional()
    .isString()
    .withMessage("comment must be a string")
    .isLength({ max: 1000 })
    .withMessage("comment must not exceed 1000 characters"),
]



export const updateRatingValidation = [
  param("id").isUUID().withMessage("Invalid rating ID"),

  body("score")
    .optional()
    .isInt({ min: 1, max: 5 })
    .withMessage("score must be between 1 and 5")
    .toInt(),

  body("comment")
    .optional()
    .isString()
    .withMessage("comment must be a string")
    .isLength({ max: 1000 })
    .withMessage("comment must not exceed 1000 characters"),
];

export const ratingIdValidation = [
  param("id").isUUID().withMessage("Invalid rating ID"),
];

export const getRatingsValidation = [
  param("targetType")
    .customSanitizer(normalizeUpper)
    .isIn(VALID_TARGET_TYPES)
    .withMessage(`targetType must be one of: ${VALID_TARGET_TYPES.join(", ")}`),
    // //////////////

  param("targetId")
    .isString()
    .withMessage("targetId must be a string")
    .notEmpty()
    .withMessage("targetId is required"),
];