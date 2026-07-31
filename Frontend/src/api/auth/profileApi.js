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

// PUT notification preferences
export const updateNotificationPreferences = (preferences) => {
  return api.put(`/profiles/notification-preferences`, preferences);
};

// DELETE my account
export const deleteMyAccount = (userId) => {
  return api.delete(`/users/${userId}`);
};

// POST profile photo
export const uploadProfilePhoto = (role, photoData) => {
  return api.post(`/${role}/profile/upload-photo`, photoData);
};

