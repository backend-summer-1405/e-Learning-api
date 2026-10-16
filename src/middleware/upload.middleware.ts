import multer from "multer";
import path from "node:path";
import fs from "node:fs";
import { randomUUID } from "node:crypto";
import AppError from "../utils/AppError.js";

export type UploadOptions = {
  destination: string;
  allowedMimeTypes: string[];
  maxFiles?: number;
  maxFileSize?: number;
};

const createUpload = ({
  destination,
  allowedMimeTypes,
  maxFiles = 5,
  maxFileSize = 5 * 1024 * 1024,
}: UploadOptions) => {
  const uploadDirectory = path.resolve(destination);

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

  const allowedTypes = new Set(allowedMimeTypes);

  const fileFilter: multer.Options["fileFilter"] = (
    _req,
    file,
    callback,
  ) => {
    if (!allowedTypes.has(file.mimetype)) {
      callback(
        new AppError("Unsupported file type", 400),
      );
      return;
    }

    callback(null, true);
  };

  return multer({
    storage,
    fileFilter,
    limits: {
      fileSize: maxFileSize,
      files: maxFiles,
    },
  });
};

export default createUpload;