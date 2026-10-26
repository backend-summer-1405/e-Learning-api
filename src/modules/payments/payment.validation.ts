import { query } from "express-validator";

export const paymentCallbackValidation = [
    query("Authority")
        .isString()
        .withMessage("Authority must be a string")
        .notEmpty()
        .withMessage("Authority is required"),

    query("Status")
        .isString()
        .withMessage("Status must be a string")
        .isIn(["OK", "NOK"])
        .withMessage("Status must be OK or NOK"),

    query("paymentId")
        .isUUID()
        .withMessage("paymentId must be a valid UUID"),
];