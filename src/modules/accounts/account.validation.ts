import { body, param } from "express-validator";

export const createAccountValidation = [
  body("username")
    .isString()
    .withMessage("Username must be a string")
    .trim()
    .notEmpty()
    .withMessage("Username is required")
    .isLength({ min: 3, max: 30 })
    .withMessage("Username must be between 3 and 30 characters")
    .matches(/^[a-zA-Z0-9_-]+$/)
    .withMessage(
      "Username can only contain letters, numbers, underscores, and hyphens",
    ),

  body("name")
    .optional()
    .isString()
    .withMessage("Name must be a string")
    .trim()
    .isLength({ max: 100 })
    .withMessage("Name must not exceed 100 characters"),
];

export const updateAccountValidation = [
  param("accountId")
    .isUUID()
    .withMessage("Invalid account ID"),

  body("username")
    .optional()
    .isString()
    .withMessage("Username must be a string")
    .trim()
    .notEmpty()
    .withMessage("Username cannot be empty")
    .isLength({ min: 3, max: 30 })
    .withMessage("Username must be between 3 and 30 characters")
    .matches(/^[a-zA-Z0-9_-]+$/)
    .withMessage(
      "Username can only contain letters, numbers, underscores, and hyphens",
    ),

  body("name")
    .optional({ nullable: true })
    .isString()
    .withMessage("Name must be a string")
    .trim()
    .isLength({ max: 100 })
    .withMessage("Name must not exceed 100 characters"),
];

export const accountIdValidation = [
  param("accountId")
    .isUUID()
    .withMessage("Invalid account ID"),
];

export const imageIdValidation = [
  param("imageId")
    .isUUID()
    .withMessage("Image ID must be a valid UUID"),
];