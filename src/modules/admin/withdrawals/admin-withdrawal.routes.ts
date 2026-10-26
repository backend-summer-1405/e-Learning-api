import { Router } from "express";
import { adminGetWithdrawalsController, adminApproveWithdrawalController, adminRejectWithdrawalController, } from "./admin-withdrawal.controller.js";
import { adminGetWithdrawalsValidation, adminWithdrawalIdValidation, adminRejectWithdrawalValidation, } from "./admin-withdrawal.validation.js";
import authMiddleware from "../../../middleware/auth.middleware.js";
import adminMiddleware from "../../../middleware/admin.middleware.js";
import validationMiddleware from "../../../middleware/validation.middleware.js";

const adminWithdrawalRouter = Router();

adminWithdrawalRouter.use(authMiddleware, adminMiddleware);

adminWithdrawalRouter.get(
    "/",
    adminGetWithdrawalsValidation,
    validationMiddleware,
    adminGetWithdrawalsController
)

adminWithdrawalRouter.patch(
    "/:id/approve",
    adminWithdrawalIdValidation,
    validationMiddleware,
    adminApproveWithdrawalController
)

adminWithdrawalRouter.patch(
    "/:id/reject",
    adminRejectWithdrawalValidation,
    validationMiddleware,
    adminRejectWithdrawalController
)

export default adminWithdrawalRouter;