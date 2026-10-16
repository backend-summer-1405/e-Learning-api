import { body, param } from "express-validator";

export const createNewsValidation = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("News title is required")
    .isLength({ max: 200 })
    .withMessage("News title must not exceed 200 characters"),

  body("content")
    .trim()
    .notEmpty()
    .withMessage("News content is required"),
];

export const newsIdValidation = [
  param("id")
    .isUUID()
    .withMessage("Invalid news ID"),
];

export const newsImageIdValidation = [
  param("imageId")
    .isUUID()
    .withMessage("Invalid news image ID"),
];