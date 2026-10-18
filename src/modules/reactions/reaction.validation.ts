import { param, body } from "express-validator";

export const setReactionValidation = [
  param("targetType")
    .customSanitizer((value) => (typeof value === "string" ? value.toUpperCase() : value))
    .isIn(["NEWS", "COURSE", "PODCAST"])
    .withMessage("Invalid target type"),

  param("targetId")
    .trim()
    .notEmpty()
    .withMessage("Target ID is required"),

  body("type")
    .customSanitizer((value) => (typeof value === "string" ? value.toUpperCase() : value))
    .isIn(["LIKE", "DISLIKE"])
    .withMessage("Reaction type must be LIKE or DISLIKE"),
];

export const reactionTargetValidation = [
  param("targetType")
    .customSanitizer((value) => (typeof value === "string" ? value.toUpperCase() : value))
    .isIn(["NEWS", "COURSE", "PODCAST"])
    .withMessage("Invalid target type"),

  param("targetId")
    .trim()
    .notEmpty()
    .withMessage("Target ID is required"),
];