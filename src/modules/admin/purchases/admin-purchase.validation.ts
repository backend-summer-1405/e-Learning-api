import { query } from "express-validator";

export const adminGetPurchasesValidation = [
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

    query("userId")
        .optional()
        .isUUID()
        .withMessage("userId must be a valid UUID"),

    query("courseId")
        .optional()
        .isUUID()
        .withMessage("courseId must be a valid UUID"),

    query("isPaid")
        .optional()
        .isBoolean()
        .withMessage("isPaid must be a boolean")
        .toBoolean(),

    query("fromDate")
        .optional()
        .isISO8601()
        .withMessage("fromDate must be a valid ISO date"),

    query("toDate")
        .optional()
        .isISO8601()
        .withMessage("toDate must be a valid ISO date"),
];