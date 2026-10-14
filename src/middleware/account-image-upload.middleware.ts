import multer from "multer";
import path from "node:path";
import fs from "node:fs";
import { randomUUID } from "node:crypto";
import AppError from "../utils/AppError.js";

const uploadDirectory = path.resolve("uploads/accounts");

fs.mkdirSync(uploadDirectory, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, callback) => {
    callback(null, uploadDirectory);
  },

  filename: (_req, file, callback) => {
    const extension = path.extname(file.originalname).toLowerCase();
    callback(null, `${randomUUID()}${extension}`);
  },
});

const allowedMimeTypes = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
]);

const fileFilter: multer.Options["fileFilter"] = (
  _req,
  file,
  callback,
) => {
  if (!allowedMimeTypes.has(file.mimetype)) {
    callback(
      new AppError("Only JPEG, PNG, and WebP images are allowed", 400),
    );
    return;
  }

  callback(null, true);
};

const accountImageUpload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 5,
  },
});

export default accountImageUpload;