import { Router } from "express";
import {
  getWalletController,
  topupWalletController,
  withdrawController,
} from "./wallet.controller.js";
import {
  topupValidation,
  withdrawValidation,
} from "./wallet.validation.js";
import authMiddleware from "../../middleware/auth.middleware.js";
import validationMiddleware from "../../middleware/validation.middleware.js";

const walletRouter = Router();

walletRouter.use(authMiddleware);

walletRouter.get("/", getWalletController);

walletRouter.post(
  "/topup",
  topupValidation,
  validationMiddleware,
  topupWalletController
);

walletRouter.post(
  "/withdraw",
  withdrawValidation,
  validationMiddleware,
  withdrawController
);

export default walletRouter;