import api from "../axiosInstance";

// GET profile
export const getMyProfile = (role) => {
  return api.get(`/${role}/profile`);
};

// POST profile (Create)
export const createProfile = (role, profileData) => {
  return api.post(`/${role}/profile`, profileData);
};

// PUT profile (Update)
export const updateProfile = (role, profileData) => {
  return api.put(`/${role}/profile`, profileData);
};

// POST skip profile onboarding
export const skipProfile = (role) => {
  return api.post(`/${role}/profile/skip`);
};

// POST profile photo (multipart FormData) — field name must be "file" to
// match the backend's multer config, e.g. mentor.routes.js's
// `upload.single("file")` on this same path.
export const uploadProfilePhoto = (role, formData) => {
  return api.post(`/${role}/profile/photo`, formData);
};
