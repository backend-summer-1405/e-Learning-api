import { body } from "express-validator";

export const registerValidation = [
  body("name")
    .isString()
    .withMessage("Name must be a string")
    .trim()
    .notEmpty()
    .withMessage("Name is required"),

  body("email")
    .isEmail()
    .withMessage("Invalid email")
    .normalizeEmail({
      gmail_remove_dots: false,
      gmail_remove_subaddress: false,
    }),

  body("password")
    .isString()
    .withMessage("Password must be a string")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters"),
];

export const loginValidation = [
  body("email")
    .isEmail()
    .withMessage("Invalid email"),
    

  body("password")
    .isString()
    .withMessage("Password must be a string")
    .notEmpty()
    .withMessage("Password is required"),

  body("rememberMe")
    .optional()
    .isBoolean()
    .withMessage("rememberMe must be a boolean")
    .toBoolean(),
];

export const forgotPasswordValidation = [
  body("email")
    .isEmail()
    .withMessage("Invalid email")
    .normalizeEmail({
      gmail_remove_dots: false,
      gmail_remove_subaddress: false,
    }),
];

export const resetPasswordValidation = [
  body("token")
    .isString()
    .withMessage("Token must be a string")
    .notEmpty()
    .withMessage("Token is required"),

  body("newPassword")
    .isString()
    .withMessage("New password must be a string")
    .isLength({ min: 8 })
    .withMessage("New password must be at least 8 characters long"),
];