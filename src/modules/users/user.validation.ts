import { body } from "express-validator";

export const createUserValidation = [
  body("email").isEmail().withMessage("Invalid email"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters"),
];

export const updateMeValidation = [
  body("name")
    .optional()
    .isString()
    .withMessage("Name must be a string")
    .trim()
    .notEmpty()
    .withMessage("Name cannot be empty"),

  body("email")
    .optional()
    .trim()
    .isEmail()
    .withMessage("Invalid email"),

  body().custom((_, { req }) => {
    const hasName = req.body.name !== undefined;
    const hasEmail = req.body.email !== undefined;
    const hasFile = !!req.file;                       
    if (!hasName && !hasEmail && !hasFile) {
      throw new Error(
        "At least one field (name, email, or avatar) is required"
      );
    }
    return true;
  }),
];

export const changePasswordValidation = [
  body("currentPassword")
    .isString()
    .withMessage("Current password must be a string")
    .notEmpty()
    .withMessage("Current password is required"),

  body("newPassword")
    .isString()
    .withMessage("New password must be a string")
    .isLength({ min: 8 })
    .withMessage("New password must be at least 8 characters long"),
];