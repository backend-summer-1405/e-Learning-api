import { param, query } from "express-validator";

export const getNotificationsValidation = [
    query("page").optional().isInt({ min: 1 }).toInt(),
    query("limit").optional().isInt({ min: 1, max: 50 }).toInt(),

    query("unreadOnly")
        .optional()
        .isBoolean()
        .withMessage("unreadOnly must be a boolean")
        .toBoolean(),
];

export const notificationIdValidation = [
    param("id").isUUID().withMessage("Invalid notification ID"),
];