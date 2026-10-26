import { Router } from "express";
import { paymentCallbackController } from "./payment.controller.js";
import { paymentCallbackValidation } from "./payment.validation.js";
import validationMiddleware from "../../middleware/validation.middleware.js";
import { paymentCallbackLimiter } from "../../middleware/rate-limit.middleware.js";

const paymentRouter = Router();

paymentRouter.get(
    "/callback",
    paymentCallbackLimiter, 
    paymentCallbackValidation,
    validationMiddleware,
    paymentCallbackController
);

export default paymentRouter;