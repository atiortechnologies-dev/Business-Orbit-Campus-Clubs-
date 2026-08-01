import api from "./axiosInstance";

/**
 * Get signed upload params from Express API
 */
export const getCloudinarySignature = (folder = "profile_photos") => {
  return api.post("/uploads/cloudinary-signature", { folder });
};

/**
 * Direct file upload to Cloudinary using signed payload
 */
export const uploadToCloudinary = async (file, folder = "profile_photos") => {
  // 1. Get pre-signed signature from Express
  const res = await getCloudinarySignature(folder);
  const { signature, timestamp, cloudName, apiKey } = res?.data || res;

  // 2. Prepare multipart/form-data for Cloudinary
  const formData = new FormData();
  formData.append("file", file);
  formData.append("api_key", apiKey);
  formData.append("timestamp", timestamp);
  formData.append("signature", signature);
  formData.append("folder", folder);

  // 3. POST directly to Cloudinary's upload API
  const uploadRes = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`,
    {
      method: "POST",
      body: formData,
    },
  );

  if (!uploadRes.ok) {
    throw new Error("Failed to upload image to Cloudinary.");
  }

  const data = await uploadRes.json();
  return data.secure_url; // Returns public Cloudinary image URL
};
