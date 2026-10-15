import { param, body } from "express-validator";

export const setReactionValidation = [
  param("targetType")
    .isIn(["NEWS", "COURSE", "PODCAST"])
    .withMessage("Invalid target type"),

  param("targetId")
    .trim()
    .notEmpty()
    .withMessage("Target ID is required"),

  body("type")
    .isIn(["LIKE", "DISLIKE"])
    .withMessage("Reaction type must be LIKE or DISLIKE"),
];

export const reactionTargetValidation = [
  param("targetType")
    .isIn(["NEWS", "COURSE", "PODCAST"])
    .withMessage("Invalid target type"),

  param("targetId")
    .trim()
    .notEmpty()
    .withMessage("Target ID is required"),
];