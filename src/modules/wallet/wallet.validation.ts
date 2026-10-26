import { body } from "express-validator";

export const topupValidation = [
  body("amount")
    .isInt({ min: 1000, max: 100_000_000 })
    .withMessage("amount must be between 1,000 and 100,000,000 toman")
    .toInt(),
];

export const withdrawValidation = [
  body("amount")
    .isInt({ min: 10_000, max: 100_000_000 })
    .withMessage("amount must be between 10,000 and 100,000,000 toman")
    .toInt(),

  body("iban")
    .isString()
    .withMessage("iban must be a string")
    .matches(/^IR\d{24}$/)
    .withMessage("iban must be a valid Iranian IBAN (IR + 24 digits)"),

  body("fullName")
    .isString()
    .withMessage("fullName must be a string")
    .trim()
    .notEmpty()
    .withMessage("fullName is required")
    .isLength({ min: 3, max: 100 })
    .withMessage("fullName must be between 3 and 100 characters"),
];