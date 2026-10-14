import { Router } from "express";

import {
  createAccountController,
  deleteAccountController,
  getAccountByIdController,
  getMyAccountsController,
  updateAccountController,
} from "./account.controller.js";

import {
  createAccountValidation,
  updateAccountValidation,
  accountIdValidation,
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
//authmidd
accountRouter.use(authMiddleware);

// create account
accountRouter.post(
  "/",
  createAccountValidation,
  validationMiddleware,
  createAccountController,
);

// get all user account
accountRouter.get("/", getMyAccountsController);

// upload iamge
accountRouter.post(
  "/:accountId/images",
  accountIdValidation,
  validationMiddleware,
  accountImageUpload.array("images", 5),
  uploadAccountImagesController,
);

// get image account by id
accountRouter.get(
  "/:accountId/images",
  accountIdValidation,
  validationMiddleware,
  getAccountImagesController,
);

// delete image by id && accountId
accountRouter.delete(
  "/:accountId/images/:imageId",
  accountIdValidation,
  validationMiddleware,
  deleteAccountImageController,
);

//get account info
accountRouter.get(
  "/:accountId",
  accountIdValidation,
  validationMiddleware,
  getAccountByIdController,
);

// edit account by id
accountRouter.patch(
  "/:accountId",
  updateAccountValidation,
  validationMiddleware,
  updateAccountController,
);

//delete account by id
accountRouter.delete(
  "/:accountId",
  accountIdValidation,
  validationMiddleware,
  deleteAccountController,
);

// chose main image profile
accountRouter.patch(
  "/:accountId/images/:imageId/primary",
  accountIdValidation,
  validationMiddleware,
  setPrimaryAccountImageController,
);

export default accountRouter;