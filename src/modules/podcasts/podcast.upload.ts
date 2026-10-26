import createUpload from "../../middleware/upload.middleware.js";

const podcastUpload = createUpload({
  destination: "uploads/podcasts",
  allowedMimeTypes: [
    "audio/mpeg",
    "audio/mp4",
    "audio/wav",
    "audio/webm",
    "audio/m4a",
  ],
  maxFiles: 1,
  maxFileSize: 500 * 1024 * 1024, 
});

export default podcastUpload;