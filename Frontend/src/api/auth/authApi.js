import api from "../axiosInstance";

export const registerUser = (payload) => {
  return api.post("/auth/register", payload);
};

export const loginUser = (credentials) => {
  return api.post("/auth/login", credentials);
};

export const checkEmailExists = (email) => {
  return api.get("/auth/check-email", { params: { email } });
};

export const sendOtp = (email) => {
  return api.post("/auth/send-otp", { email });
};

export const verifyOtp = (email, otp) => {
  return api.post("/auth/verify-otp", { email, otp });
};

export const forgotPassword = (emailData) => {
  return api.post("/auth/forgot-password", emailData);
};

export const resetPassword = (data) => {
  return api.post("/auth/reset-password", data);
};

export const refreshAccessToken = () => {
  // Refresh token is read from the httpOnly cookie by the backend now.
  return api.post("/auth/refresh-token");
};

export const logoutUser = () => {
  return api.post("/auth/logout");
};

export const getMe = () => {
  return api.get("/auth/me");
};

export const getAllChapters = () => {
  return api.get("/auth/get-all-chapter");
};
