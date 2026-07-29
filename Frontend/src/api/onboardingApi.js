// src/api/onboardingApi.js
import axiosInstance from "./axiosInstance";

export const getOnboardingStatus = async () => {
  const response = await axiosInstance.get("/onboarding/status");
  return response?.data || response;
};
