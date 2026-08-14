import { v2 as cloudinary } from "cloudinary";

/**
 * Lazy-initializes Cloudinary on first use.
 * This ensures process.env variables are available.
 */
let _cloudinaryConfigured = false;
function configureCloudinary() {
  if (!_cloudinaryConfigured) {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
      console.warn("[Cloudinary] Missing one or more environment variables!");
    } else {
      console.log("[Cloudinary] Configuring with Cloud Name:", cloudName);
    }

    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
      secure: true
    });
    _cloudinaryConfigured = true;
  }
  return cloudinary;
}

/**
 * Uploads a Buffer to Cloudinary using upload_stream.
 * 
 * @param {Buffer} buffer - The file content to upload.
 * @param {string} folder - Destination folder in Cloudinary.
 * @param {string} publicId - Optional public ID (filename).
 * @returns {Promise<{url: string, publicId: string}>}
 */
export const uploadToCloudinary = async (buffer, folder = "reels", publicId = null) => {
  const c = configureCloudinary();
  
  return new Promise((resolve, reject) => {
    const options = {
      folder: folder,
      resource_type: "auto", // Automatically detect if it's a video
    };
    
    if (publicId) {
      options.public_id = publicId.split(".")[0]; // Cloudinary doesn't like extensions in public_id
    }

    const uploadStream = c.uploader.upload_stream(
      options,
      (error, result) => {
        if (error) {
          console.error("[CloudinaryUtils] Upload failed:", error);
          return reject(error);
        }
        resolve({
          url: result.secure_url,
          publicId: result.public_id,
        });
      }
    );
    
    uploadStream.end(buffer);
  });
};

/**
 * Deletes a file from Cloudinary by its public ID.
 * 
 * @param {string} publicId - The public ID of the file to delete.
 * @param {string} resourceType - 'image', 'video', or 'raw'. Defaults to 'video'.
 */
export const deleteFromCloudinary = async (publicId, resourceType = "video") => {
  if (!publicId) return;
  
  const c = configureCloudinary();
  try {
    const result = await c.uploader.destroy(publicId, { resource_type: resourceType });
    if (result.result !== "ok") {
      console.warn(`[CloudinaryUtils] Delete returned status: ${result.result} for ${publicId}`);
    }
    return result;
  } catch (err) {
    console.error(`[CloudinaryUtils] Delete failed for ${publicId}:`, err.message);
    throw err;
  }
};

/**
 * Generates a thumbnail URL for a video at a specific offset (default 0).
 */
export const getVideoThumbnail = (publicId) => {
  const c = configureCloudinary();
  return c.url(publicId, {
    resource_type: "video",
    format: "jpg",
    transformation: [
      { start_offset: 0, width: 640, crop: "scale", quality: "auto", fetch_format: "auto" }
    ]
  });
};
