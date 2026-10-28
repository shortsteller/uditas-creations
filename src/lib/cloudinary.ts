/**
 * Cloudinary Media Storage Helper for UDITAS CREATIONS
 * 
 * To connect your live Cloudinary account:
 * 1. Sign up for a free Cloudinary account at https://cloudinary.com/
 * 2. In Settings > Upload > Upload presets, create an 'Unsigned' upload preset (e.g. 'uditas_uploads')
 * 3. Add to your .env file:
 *    VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
 *    VITE_CLOUDINARY_UPLOAD_PRESET=uditas_uploads
 *    VITE_CLOUDINARY_API_KEY=your_api_key
 */

export const cloudinaryConfig = {
  cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || "",
  uploadPreset: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || "",
  apiKey: import.meta.env.VITE_CLOUDINARY_API_KEY || "",
};

export const isCloudinaryConfigured = Boolean(
  cloudinaryConfig.cloudName && cloudinaryConfig.uploadPreset
);

export interface CloudinaryTransformOptions {
  width?: number;
  height?: number;
  crop?: "fill" | "thumb" | "fit" | "scale" | "pad";
  quality?: "auto" | number;
  format?: "auto" | "webp" | "jpg" | "png";
  gravity?: "auto" | "face" | "center";
}

/**
 * Generate an optimized Cloudinary delivery URL with transformations.
 */
export function getCloudinaryUrl(
  publicIdOrUrl: string,
  options: CloudinaryTransformOptions = {}
): string {
  if (!publicIdOrUrl) return "";

  // If it's already an external or local image and not on Cloudinary, return as is
  if (!publicIdOrUrl.includes("res.cloudinary.com") && !publicIdOrUrl.startsWith("uditas/")) {
    return publicIdOrUrl;
  }

  const {
    width,
    height,
    crop = "fill",
    quality = "auto",
    format = "auto",
    gravity = "auto",
  } = options;

  const transformations: string[] = [];
  if (width) transformations.push(`w_${width}`);
  if (height) transformations.push(`h_${height}`);
  if (crop) transformations.push(`c_${crop}`);
  if (gravity) transformations.push(`g_${gravity}`);
  if (quality) transformations.push(`q_${quality}`);
  if (format) transformations.push(`f_${format}`);

  const transformString = transformations.length > 0 ? transformations.join(",") + "/" : "";

  if (publicIdOrUrl.startsWith("http")) {
    return publicIdOrUrl.replace("/upload/", `/upload/${transformString}`);
  }

  const cloud = cloudinaryConfig.cloudName || "uditas-creations";
  return `https://res.cloudinary.com/${cloud}/image/upload/${transformString}${publicIdOrUrl}`;
}

/**
 * Uploads an image file to Cloudinary via unsigned upload.
 * Falls back to local data URL if credentials are not configured yet.
 */
export async function uploadToCloudinary(
  file: File,
  onProgress?: (progress: number) => void
): Promise<{ url: string; publicId: string }> {
  if (!isCloudinaryConfigured) {
    // Simulated upload for preview mode
    return new Promise((resolve) => {
      let currentProgress = 0;
      const interval = setInterval(() => {
        currentProgress += 25;
        if (onProgress) onProgress(currentProgress);
        if (currentProgress >= 100) {
          clearInterval(interval);
          const reader = new FileReader();
          reader.onload = (e) => {
            resolve({
              url: (e.target?.result as string) || URL.createObjectURL(file),
              publicId: `local_preview_${Date.now()}`,
            });
          };
          reader.readAsDataURL(file);
        }
      }, 150);
    });
  }

  // Real upload to Cloudinary API
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", cloudinaryConfig.uploadPreset);

  const endpoint = `https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}/image/upload`;

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", endpoint);

    if (xhr.upload && onProgress) {
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percent = Math.round((event.loaded / event.total) * 100);
          onProgress(percent);
        }
      };
    }

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        const response = JSON.parse(xhr.responseText);
        resolve({
          url: response.secure_url,
          publicId: response.public_id,
        });
      } else {
        reject(new Error(`Cloudinary upload failed: ${xhr.statusText}`));
      }
    };

    xhr.onerror = () => reject(new Error("Network error during Cloudinary upload"));
    xhr.send(formData);
  });
}
