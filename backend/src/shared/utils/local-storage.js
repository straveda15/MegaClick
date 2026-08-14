import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

/**
 * Local disk storage — replaces Cloudinary/ImageKit.
 *
 * Files live under MEDIA_ROOT and are served by Express at the `/media/...`
 * URL prefix (see express.static wiring in src/app.js). What we store in the DB
 * is the public URL/path returned by saveToDisk().
 *
 * MEDIA_ROOT defaults to <Backend>/public/media so it is committed to git and
 * shipped by the deploy pipeline. Set UPLOAD_DIR to move it outside the repo
 * (e.g. /var/www/everlive-uploads) if runtime uploads must survive a fresh
 * `git clone` on deploy — no code change needed.
 */

const __dirname = path.dirname(fileURLToPath(import.meta.url));
// src/shared/utils → Backend root is three levels up
const BACKEND_ROOT = path.resolve(__dirname, "../../../");

export const MEDIA_ROOT = process.env.UPLOAD_DIR
  ? path.resolve(process.env.UPLOAD_DIR)
  : path.join(BACKEND_ROOT, "public", "media");

// Optional absolute base (e.g. https://api.everlive.com). When empty we store
// root-relative paths like /media/products/shilajit/main-123.png, which work as
// long as the storefront hits the same host that serves the API.
const PUBLIC_BASE = (process.env.MEDIA_BASE_URL || "").replace(/\/+$/, "");

// Ensure the root exists so express.static has something to serve on boot.
fs.mkdirSync(MEDIA_ROOT, { recursive: true });

/** slug/filename → filesystem-safe (lowercase, hyphens, no traversal). */
const sanitize = (name) =>
  String(name || "")
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9._-]/g, "")
    .replace(/^\.+/, ""); // never allow a name starting with dots

/** Clean each path segment of a subfolder like "products/shilajit". */
const safeSubfolder = (subfolder) =>
  String(subfolder || "")
    .split("/")
    .map(sanitize)
    .filter(Boolean)
    .join("/");

/**
 * Write a buffer to <MEDIA_ROOT>/<subfolder>/<filename>.
 *
 * @param {Buffer} buffer        - file contents
 * @param {string} subfolder     - e.g. "products/shilajit", "reels", "banners"
 * @param {string} originalName  - original upload filename (for extension/base)
 * @param {object} [opts]
 * @param {string} [opts.filename] - force an exact filename (else base-<ts><ext>)
 * @returns {Promise<{ url: string, relativePath: string, absolutePath: string }>}
 */
export const saveToDisk = async (buffer, subfolder, originalName, opts = {}) => {
  const folder = safeSubfolder(subfolder) || "misc";
  const dir = path.join(MEDIA_ROOT, folder);
  await fs.promises.mkdir(dir, { recursive: true });

  const rawExt = path.extname(originalName || ""); // keep original case to strip correctly
  const ext = rawExt.toLowerCase();
  const base = sanitize(path.basename(originalName || "file", rawExt)) || "file";
  const filename = opts.filename
    ? sanitize(opts.filename)
    : `${base}-${Date.now()}${ext}`;

  const absolutePath = path.join(dir, filename);
  await fs.promises.writeFile(absolutePath, buffer);

  const relativePath = `/media/${folder}/${filename}`;
  return {
    url: PUBLIC_BASE ? PUBLIC_BASE + relativePath : relativePath,
    relativePath,
    absolutePath,
  };
};

/**
 * Delete a file previously saved by saveToDisk, given its stored URL or path.
 * No-ops (safely) on URLs that don't point at our /media store — e.g. leftover
 * Cloudinary/ImageKit URLs from before the migration.
 */
export const deleteFromDisk = async (urlOrPath) => {
  if (!urlOrPath) return;
  try {
    let p = String(urlOrPath);
    if (PUBLIC_BASE && p.startsWith(PUBLIC_BASE)) p = p.slice(PUBLIC_BASE.length);

    const marker = "/media/";
    const idx = p.indexOf(marker);
    if (idx === -1) return; // not a locally-stored asset — nothing to delete

    const rel = p.slice(idx + marker.length);
    const absolutePath = path.resolve(MEDIA_ROOT, rel);

    // Guard against path traversal — must stay inside MEDIA_ROOT.
    if (absolutePath !== MEDIA_ROOT && !absolutePath.startsWith(MEDIA_ROOT + path.sep)) {
      return;
    }
    await fs.promises.unlink(absolutePath).catch(() => {});
  } catch (err) {
    console.warn("[local-storage] delete failed:", err.message);
  }
};
