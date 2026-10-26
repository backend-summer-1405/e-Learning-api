import createUpload from "../../../middleware/upload.middleware.js";

const adminNewsImageUpload = createUpload({
  destination: "uploads/news",
  allowedMimeTypes: ["image/jpeg", "image/png", "image/webp"],
  maxFiles: 10,
  maxFileSize: 5 * 1024 * 1024,
});

export default adminNewsImageUpload;