import Product from "./product.model.js";
import {
  deleteInventoryRecordByProductId,
  ensureInventoryRecordForProduct,
} from "../operations/inventory/ops-inventory.service.js";
import { saveToDisk, deleteFromDisk } from "../../shared/utils/local-storage.js";

/* ── helpers ─────────────────────────────────────────────────────────────── */
async function getNextNumericId() {
  const last = await Product.findOne().sort({ id: -1 }).select("id").lean();
  return last?.id ? last.id + 1 : 1;
}

const hasOwn = (value, key) => Object.prototype.hasOwnProperty.call(value, key);

const normalizeProductPayload = (data = {}) => {
  const payload = { ...data };

  if (hasOwn(payload, "stock")) {
    const stock = Number(payload.stock);
    payload.stock = Number.isFinite(stock) && stock >= 0 ? Math.floor(stock) : 0;
  }

  return payload;
};

/**
 * Throws if Selling Price > Original Price on the resolved values.
 * Used by create + update — `existing` lets updates compare against
 * the stored doc when only one of price/orig is in the payload.
 */
const assertPriceNotAboveOrig = (payload, existing = null) => {
  const price = hasOwn(payload, "price")
    ? Number(payload.price)
    : existing?.price;
  const orig = hasOwn(payload, "orig")
    ? Number(payload.orig)
    : existing?.orig;

  if (Number.isFinite(price) && Number.isFinite(orig) && orig > 0 && price > orig) {
    const err = new Error("Selling Price cannot be greater than Original Price.");
    err.statusCode = 400;
    throw err;
  }
};

/** 
 * DEPRECATED: Syncing via yt-dlp is unreliable.
 * Switching to direct video uploads.
 */
const syncInstagramVideo = async (product, oldUrl = null) => {
  // Logic disabled as per request to simplify and use direct uploads
  return;
};

/* ── CRUD ────────────────────────────────────────────────────────────────── */
export const createProduct = async (data) => {
  if (!data.name || !data.price) {
    throw new Error("name and price are required");
  }
  if (!data.slug) {
    throw new Error("slug is required");
  }
  if (!data.sku || !String(data.sku).trim()) {
    throw new Error("sku is required");
  }

  const duplicate = await Product.findOne({ slug: data.slug });
  if (duplicate) {
    throw new Error(`Slug "${data.slug}" already exists`);
  }
  const dupSku = await Product.findOne({ sku: String(data.sku).trim() });
  if (dupSku) {
    throw new Error(`SKU "${data.sku}" already exists`);
  }

  const numericId = await getNextNumericId();
  const payload = normalizeProductPayload(data);
  assertPriceNotAboveOrig(payload);
  const product = new Product({ id: numericId, ...payload });
  await product.save();
  await ensureInventoryRecordForProduct(product, { syncAvailable: true });
  
  // Background sync Instagram video (don't block the initial response)
  if (product.instagramVideoUrl) {
    syncInstagramVideo(product).catch(e => console.error("CreateProduct Sync Error:", e));
  }

  return product;
};

export const getAllProducts = async (filters = {}) => {
  const { category, cat, brand, isFeatured, isActive, slug } = filters;
  const query = {};

  if (category) query.cat = category;
  if (cat)      query.cat = cat;
  if (brand)    query.brand = brand;
  if (slug)     query.slug = slug;
  if (isFeatured !== undefined) query.isFeatured = isFeatured;
  if (isActive  !== undefined) query.isActive   = isActive;

  return Product.find(query).sort({ id: 1 });
};

export const getProductById = async (id) => {
  return Product.findById(id);
};

export const getProductBySlug = async (slug) => {
  return Product.findOne({ slug });
};

export const updateProduct = async (id, data) => {
  const payload = normalizeProductPayload(data);
  const shouldSyncAvailable = hasOwn(payload, "stock");
  const product = await Product.findById(id);
  if (!product) throw new Error("Product not found");

  if (hasOwn(payload, "sku")) {
    if (!payload.sku || !String(payload.sku).trim()) {
      throw new Error("sku cannot be empty");
    }
    const dupSku = await Product.findOne({ sku: String(payload.sku).trim(), _id: { $ne: id } });
    if (dupSku) throw new Error(`SKU "${payload.sku}" already exists`);
  }

  assertPriceNotAboveOrig(payload, product);

  const oldUrl = product.instagramVideoUrl;
  Object.assign(product, payload);
  await product.save();

  await ensureInventoryRecordForProduct(product, {
    syncAvailable: shouldSyncAvailable,
  });

  // Sync Instagram video if URL changed
  if (product.instagramVideoUrl !== oldUrl || (product.instagramVideoUrl && !product.instagramVideoDirectUrl)) {
    syncInstagramVideo(product, oldUrl).catch(e => console.error("UpdateProduct Sync Error:", e));
  }

  return product;
};

export const deleteProduct = async (id) => {
  const product = await Product.findByIdAndDelete(id);
  if (!product) throw new Error("Product not found");

  await deleteInventoryRecordByProductId(id);

  // Cleanup the product video from local disk (no-op for old Cloudinary URLs).
  if (product.instagramVideoDirectUrl) {
    console.log(`  [Cleanup] Removing video for product ${id} from disk…`);
    deleteFromDisk(product.instagramVideoDirectUrl).catch(e => console.warn("DeleteProduct Video Cleanup Error:", e));
  }

  return product;
};

/**
 * Upload a product reel video to local disk under media/products/<slug>/:
 * 1. Save new video file to disk
 * 2. Delete old video if it exists
 * 3. Update product record
 *
 * Note: unlike Cloudinary, we don't auto-generate a poster frame server-side.
 * `instagramVideoThumbnail` is left empty — the storefront <video> can use its
 * own poster/first-frame, or a cover image can be uploaded separately.
 */
export const uploadProductVideo = async (productId, videoFile) => {
  const product = await Product.findById(productId);
  if (!product) throw new Error("Product not found");

  const slug = product.slug || `product-${product.id || productId}`;
  console.log(`  ↑  Saving product video to media/products/${slug}/…`);

  const oldVideoUrl = product.instagramVideoDirectUrl;

  // 1. Save new video
  const { url: directVideoUrl } = await saveToDisk(
    videoFile.buffer,
    `products/${slug}`,
    videoFile.originalname || `reel-${Date.now()}.mp4`,
    { filename: `reel-${Date.now()}${(videoFile.originalname || "").match(/\.[a-z0-9]+$/i)?.[0] || ".mp4"}` }
  );

  // 2. Delete old video if it exists (no-op for old Cloudinary URLs)
  if (oldVideoUrl && oldVideoUrl !== directVideoUrl) {
    console.log(`  [Cleanup] Replacing old product video…`);
    await deleteFromDisk(oldVideoUrl).catch(console.error);
  }

  // 3. Update product
  product.instagramVideoDirectUrl = directVideoUrl;
  product.instagramVideoCloudinaryPublicId = ""; // legacy field, no longer used
  product.instagramVideoThumbnail = "";
  product.instagramVideoUrl = ""; // clear legacy Instagram URL

  await product.save();
  return product;
};

/* ── Image upload (local disk) ──────────────────────────────────────────────
 * Stored under media/products/<slug>/ when a slug is supplied by the caller,
 * otherwise media/products/_unsorted/. Returns { path } = the public /media URL
 * the dashboard saves into the product's img/hoverImg/gallery fields.
 */
export const uploadProductImage = async (fileBuffer, originalName, slug = "") => {
  const folder = slug ? `products/${slug}` : "products/_unsorted";

  const { url, relativePath } = await saveToDisk(fileBuffer, folder, originalName);

  return {
    success:  true,
    filename: relativePath.split("/").pop(),
    path:     url,
  };
};

/* ── Seed ────────────────────────────────────────────────────────────────── */
export const seedProducts = async (data) => {
  if (!Array.isArray(data) || data.length === 0) {
    throw new Error("Seed data is empty or invalid");
  }

  const count = await Product.countDocuments();
  if (count > 0) {
    throw new Error(
      `DB already has ${count} products. Drop the collection first to re-seed.`
    );
  }

  const products = await Product.insertMany(data.map(normalizeProductPayload));
  await Promise.all(
    products.map((product) =>
      ensureInventoryRecordForProduct(product, { syncAvailable: true })
    )
  );
  return data.length;
};
