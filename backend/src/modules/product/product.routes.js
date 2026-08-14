import express from "express";
import multer from "multer";
import {
  createProductController,
  getAllProductsController,
  getProductByIdController,
  updateProductController,
  deleteProductController,
  uploadProductImageController,
  uploadProductVideoController,
  seedProductsController,
} from "./product.controller.js";

const router = express.Router();

/* ── Multer (memory storage → ImageKit) ──────────────────────────────────── */
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB for images
});

const uploadVideo = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 }, // 50 MB for videos
  fileFilter: (_req, file, cb) => {
    const allowed = /\.(mp4|mov|quicktime|m4v)$/i;
    if (!allowed.test(file.originalname)) {
      return cb(new Error("Only video files are allowed (mp4, mov, m4v)"));
    }
    cb(null, true);
  },
});

/* ── Routes ──────────────────────────────────────────────────────────────── */

// Special routes MUST come before /:id to avoid conflicts
router.post("/upload/image", upload.single("image"), uploadProductImageController);
router.post("/:id/upload-video", uploadVideo.single("video"), uploadProductVideoController);
router.post("/seed", seedProductsController);

// CRUD
router.get("/",     getAllProductsController);
router.get("/:id",  getProductByIdController);
router.post("/",    createProductController);
router.put("/:id",  updateProductController);
router.delete("/:id", deleteProductController);

export default router;
