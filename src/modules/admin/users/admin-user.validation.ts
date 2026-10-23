import { body, param, query } from "express-validator";

const VALID_ROLES = ["USER", "TEACHER", "ADMIN"];
const VALID_SORT_BY = ["createdAt", "name", "email"];
const VALID_SORT_ORDER = ["asc", "desc"];

export const adminGetUsersValidation = [
  query("page").optional().isInt({ min: 1 }).toInt(),
  query("limit").optional().isInt({ min: 1, max: 100 }).toInt(),

  query("role")
    .optional()
    .isIn(VALID_ROLES)
    .withMessage(`role must be one of: ${VALID_ROLES.join(", ")}`),

  query("search").optional().isString().isLength({ max: 100 }),

  query("sortBy")
    .optional()
    .isIn(VALID_SORT_BY)
    .withMessage(`sortBy must be one of: ${VALID_SORT_BY.join(", ")}`),

  query("sortOrder")
    .optional()
    .isIn(VALID_SORT_ORDER)
    .withMessage(`sortOrder must be one of: ${VALID_SORT_ORDER.join(", ")}`),
];

export const adminUserIdValidation = [
  param("id").isUUID().withMessage("Invalid user ID"),
];

export const adminUpdateUserValidation = [
  ...adminUserIdValidation,

  body("name")
    .optional()
    .isString()
    .trim()
    .notEmpty()
    .withMessage("Name cannot be empty")
    .isLength({ max: 100 }),

  body("role")
    .optional()
    .isIn(VALID_ROLES)
    .withMessage(`role must be one of: ${VALID_ROLES.join(", ")}`),
];