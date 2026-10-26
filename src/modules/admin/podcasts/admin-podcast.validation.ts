import { body, param, query } from "express-validator";

const VALID_STATUSES = ["DRAFT", "PENDING", "APPROVED", "REJECTED"];
const VALID_SORT_BY = ["createdAt", "playCount", "ratingAvg"];
const VALID_SORT_ORDER = ["asc", "desc"];

export const adminGetPodcastsValidation = [
  query("page").optional().isInt({ min: 1 }).toInt(),
  query("limit").optional().isInt({ min: 1, max: 100 }).toInt(),

  query("status")
    .optional()
    .isIn(VALID_STATUSES)
    .withMessage(`status must be one of: ${VALID_STATUSES.join(", ")}`),

  query("teacherId").optional().isUUID(),

  query("search").optional().isString().isLength({ max: 200 }),

  query("sortBy")
    .optional()
    .isIn(VALID_SORT_BY)
    .withMessage(`sortBy must be one of: ${VALID_SORT_BY.join(", ")}`),

  query("sortOrder")
    .optional()
    .isIn(VALID_SORT_ORDER)
    .withMessage(`sortOrder must be one of: ${VALID_SORT_ORDER.join(", ")}`),
];

export const adminPodcastIdValidation = [
  param("id").isUUID().withMessage("Invalid podcast ID"),
];

export const adminRejectPodcastValidation = [
  ...adminPodcastIdValidation,
  body("reason")
    .isString()
    .trim()
    .notEmpty()
    .withMessage("reason is required")
    .isLength({ max: 500 }),
];