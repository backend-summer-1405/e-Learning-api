import { Router } from "express";

import {
  createAccountController,
  deleteAccountController,
  getAccountByIdController,
  getMyAccountsController,
  updateAccountController,
  switchAccountController,
  getActiveAccountController,
} from "./account.controller.js";

import {
  createAccountValidation,
  updateAccountValidation,
  accountIdValidation,
  imageIdValidation,
} from "./account.validation.js";

import {
  uploadAccountImagesController,
  getAccountImagesController,
  deleteAccountImageController,
  setPrimaryAccountImageController,
} from "./account-image.controller.js";

import authMiddleware from "../../middleware/auth.middleware.js";
import validationMiddleware from "../../middleware/validation.middleware.js";
import accountImageUpload from "../../middleware/account-image-upload.middleware.js";

const accountRouter = Router();

accountRouter.use(authMiddleware);

// create account
accountRouter.post(
  "/",
  createAccountValidation,
  validationMiddleware,
  createAccountController
);

accountRouter.get("/", getMyAccountsController);

accountRouter.get("/active", getActiveAccountController);

// switch account
accountRouter.post(
  "/:accountId/switch",
  accountIdValidation,
  validationMiddleware,
  switchAccountController
);

accountRouter.get(
  "/:accountId",
  accountIdValidation,
  validationMiddleware,
  getAccountByIdController
);

accountRouter.patch(
  "/:accountId",
  updateAccountValidation,
  validationMiddleware,
  updateAccountController
);

accountRouter.delete(
  "/:accountId",
  accountIdValidation,
  validationMiddleware,
  deleteAccountController
);

accountRouter.post(
  "/:accountId/images",
  accountIdValidation,
  validationMiddleware,
  accountImageUpload.array("images", 5),
  uploadAccountImagesController
);

accountRouter.get(
  "/:accountId/images",
  accountIdValidation,
  validationMiddleware,
  getAccountImagesController
);

accountRouter.delete(
  "/:accountId/images/:imageId",
  accountIdValidation,
  imageIdValidation,
  validationMiddleware,
  deleteAccountImageController
);

accountRouter.patch(
  "/:accountId/images/:imageId/primary",
  accountIdValidation,
  imageIdValidation,
  validationMiddleware,
  setPrimaryAccountImageController
);

export default accountRouter;