const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");
const multer = require("multer");

/**
 * Image uploads for the admin panel.
 *
 * Files land on disk under `uploads/` and are served back as static files (see
 * src/index.js). Filenames are generated rather than taken from the upload, so
 * a crafted name can never escape the directory or overwrite anything, and the
 * extension is derived from the detected mime type rather than trusted input.
 */

const UPLOAD_ROOT = path.join(__dirname, "..", "..", "uploads");
const MENU_IMAGE_DIR = path.join(UPLOAD_ROOT, "menu");
const MAX_BYTES = 4 * 1024 * 1024;

const EXTENSION_BY_MIME = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif",
  "image/avif": ".avif",
};

fs.mkdirSync(MENU_IMAGE_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: (_request, _file, done) => done(null, MENU_IMAGE_DIR),
  filename: (_request, file, done) => {
    const extension = EXTENSION_BY_MIME[file.mimetype] ?? ".bin";
    done(null, `${crypto.randomBytes(16).toString("hex")}${extension}`);
  },
});

const uploadMenuImage = multer({
  storage,
  limits: { fileSize: MAX_BYTES, files: 1 },
  fileFilter: (_request, file, done) => {
    if (!EXTENSION_BY_MIME[file.mimetype]) {
      const error = new Error("Unsupported image type.");
      error.code = "UNSUPPORTED_IMAGE_TYPE";
      return done(error);
    }

    return done(null, true);
  },
}).single("image");

/** Turns multer's errors into the API's error shape. */
const handleMenuImageUpload = (request, response, next) =>
  uploadMenuImage(request, response, (error) => {
    if (!error) {
      return next();
    }

    if (error.code === "LIMIT_FILE_SIZE") {
      return response.status(413).json({
        code: "IMAGE_TOO_LARGE",
        error: `The image is larger than ${MAX_BYTES / (1024 * 1024)} MB.`,
      });
    }

    if (error.code === "UNSUPPORTED_IMAGE_TYPE") {
      return response.status(415).json({
        code: "UNSUPPORTED_IMAGE_TYPE",
        error: "Only JPEG, PNG, WebP, GIF and AVIF images are accepted.",
      });
    }

    return next(error);
  });

module.exports = {
  MAX_BYTES,
  UPLOAD_ROOT,
  handleMenuImageUpload,
};
