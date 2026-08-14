import mongoose from "mongoose";
import {
  createProduct,
  getAllProducts,
  getProductById,
  getProductBySlug,
  updateProduct,
  deleteProduct,
  uploadProductImage,
  uploadProductVideo,
  seedProducts,
} from "./product.service.js";

/* ── helpers ─────────────────────────────────────────────────────────────── */
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

const fail = (res, status, message, error = message) =>
  res.status(status).json({ success: false, message, data: null, error });

const ok = (res, data, message = "Success", status = 200) =>
  res.status(status).json({ success: true, message, data, error: null });

/* ── GET /api/products ───────────────────────────────────────────────────── */
export const getAllProductsController = async (req, res) => {
  try {
    const products = await getAllProducts(req.query);
    return ok(res, products, "Products fetched successfully");
  } catch (error) {
    return fail(res, 500, "Failed to fetch products", error.message);
  }
};

/* ── GET /api/products/:id ── by MongoDB id OR slug ────────────────────── */
export const getProductByIdController = async (req, res) => {
  try {
    const { id } = req.params;

    let product;
    if (isValidObjectId(id)) {
      product = await getProductById(id);
    }
    // fallback: treat as slug
    if (!product) {
      product = await getProductBySlug(id);
    }

    if (!product) return fail(res, 404, "Product not found");
    return ok(res, product, "Product fetched successfully");
  } catch (error) {
    return fail(res, 500, "Failed to fetch product", error.message);
  }
};

/* ── POST /api/products ── create ───────────────────────────────────────── */
export const createProductController = async (req, res) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      return fail(res, 400, "Product data is required");
    }
    const product = await createProduct(req.body);
    return ok(res, product, "Product created successfully", 201);
  } catch (error) {
    const status = error.message.includes("already exists") ? 409 : 500;
    return fail(res, status, error.message || "Failed to create product", error.message);
  }
};

/* ── PUT /api/products/:id ── update ────────────────────────────────────── */
export const updateProductController = async (req, res) => {
  try {
    const id = req.params.id || req.query.id;
    if (!id) return fail(res, 400, "Product ID is required");
    if (!isValidObjectId(id)) return fail(res, 400, "Invalid Product ID");

    if (!req.body || Object.keys(req.body).length === 0) {
      return fail(res, 400, "Update data is required");
    }

    const product = await updateProduct(id, req.body);
    return ok(res, product, "Product updated successfully");
  } catch (error) {
    return fail(res, 500, "Failed to update product", error.message);
  }
};

/* ── DELETE /api/products/:id ── delete ─────────────────────────────────── */
export const deleteProductController = async (req, res) => {
  try {
    const id = req.params.id || req.query.id;
    if (!id) return fail(res, 400, "Product ID is required");
    if (!isValidObjectId(id)) return fail(res, 400, "Invalid Product ID");

    const product = await deleteProduct(id);
    return ok(res, product, "Product deleted successfully");
  } catch (error) {
    return fail(res, 500, "Failed to delete product", error.message);
  }
};

/* ── POST /api/products/upload/image ── ImageKit upload ─────────────────── */
export const uploadProductImageController = async (req, res) => {
  try {
    if (!req.file) return fail(res, 400, "No image file provided");

    const result = await uploadProductImage(
      req.file.buffer,
      req.file.originalname,
      req.body?.slug || ""
    );
    return ok(res, result, "Image uploaded successfully", 201);
  } catch (error) {
    return fail(res, 500, "Image upload failed", error.message);
  }
};

/* ── POST /api/products/:id/upload-video ── Cloudinary upload ─────────── */
export const uploadProductVideoController = async (req, res) => {
  try {
    const { id } = req.params;
    if (!req.file) return fail(res, 400, "No video file provided");
    if (!id) return fail(res, 400, "Product ID is required");

    const product = await uploadProductVideo(id, req.file);
    return ok(res, product, "Video uploaded successfully", 201);
  } catch (error) {
    return fail(res, 500, "Video upload failed", error.message);
  }
};

/* ── POST /api/products/seed ── one-time seeder ─────────────────────────── */
export const seedProductsController = async (req, res) => {
  try {
    if (!req.body || !Array.isArray(req.body)) {
      return fail(res, 400, "Send an array of products in the request body");
    }
    const count = await seedProducts(req.body);
    return ok(res, { seeded: count }, `Seeded ${count} products`, 201);
  } catch (error) {
    const status = error.message.includes("already has") ? 409 : 500;
    return fail(res, status, "Seed failed", error.message);
  }
};
