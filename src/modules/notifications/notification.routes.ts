import { Router } from "express";
import {
  getNotificationsController,
  getUnreadCountController,
  readNotificationController,
  readAllNotificationsController,
  deleteNotificationController,
  deleteAllNotificationsController,
} from "./notification.controller.js";
import {
  getNotificationsValidation,
  notificationIdValidation,
} from "./notification.validation.js";
import authMiddleware from "../../middleware/auth.middleware.js";
import validationMiddleware from "../../middleware/validation.middleware.js";

const notificationRouter = Router();

notificationRouter.use(authMiddleware);

// لیست
notificationRouter.get(
  "/",
  getNotificationsValidation,
  validationMiddleware,
  getNotificationsController
);

// تعداد خوانده‌نشده (قبل از /:id)
notificationRouter.get("/unread-count", getUnreadCountController);

// خواندن همه (قبل از /:id/read)
notificationRouter.patch("/read-all", readAllNotificationsController);

// خواندن یه اعلان
notificationRouter.patch(
  "/:id/read",
  notificationIdValidation,
  validationMiddleware,
  readNotificationController
);

// حذف همه (قبل از /:id)
notificationRouter.delete("/", deleteAllNotificationsController);

// حذف یه اعلان
notificationRouter.delete(
  "/:id",
  notificationIdValidation,
  validationMiddleware,
  deleteNotificationController
);

export default notificationRouter;