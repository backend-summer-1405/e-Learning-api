import { Router } from "express";
import authMiddleware from "../../../middleware/auth.middleware.js";
import adminMiddleware from "../../../middleware/admin.middleware.js";
import { adminGetPurchasesValidation } from "./admin-purchase.validation.js";
import validationMiddleware from "../../../middleware/validation.middleware.js";
import { adminGetPurchasesController } from "./admin-purchase.controller.js";

const adminPurchaseRouter = Router();

adminPurchaseRouter.use(authMiddleware, adminMiddleware);

adminPurchaseRouter.get(
  "/",
  adminGetPurchasesValidation,
  validationMiddleware,
  adminGetPurchasesController
);

export default adminPurchaseRouter;