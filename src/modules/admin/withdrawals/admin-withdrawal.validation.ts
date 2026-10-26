import { body, param, query } from "express-validator";

const VALID_STATUSES = ["PENDING", "APPROVED", "REJECTED"];

export const adminGetWithdrawalsValidation = [
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
    .isIn(VALID_STATUSES)
    .withMessage(`status must be one of: ${VALID_STATUSES.join(", ")}`),

  query("userId")
    .optional()
    .isUUID()
    .withMessage("userId must be a valid UUID"),
];

export const adminWithdrawalIdValidation = [
  param("id").isUUID().withMessage("Invalid withdrawal ID"),
];

export const adminRejectWithdrawalValidation = [
  ...adminWithdrawalIdValidation,
  body("note")
    .isString()
    .withMessage("note must be a string")
    .trim()
    .notEmpty()
    .withMessage("note is required")
    .isLength({ max: 500 })
    .withMessage("note must not exceed 500 characters"),
];