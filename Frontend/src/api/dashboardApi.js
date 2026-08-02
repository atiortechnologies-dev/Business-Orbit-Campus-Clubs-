import api from "./axiosInstance";

// GET Dashboard
export const getDashboard = async () => {
  const res = await api.get("/student/dashboard");
  return res?.data || res;
};

// GET student profile
export const getStudentProfile = async () => {
  const res = await api.get("/student/profile-details");
  return res?.data || res;
};

// PUT profile (Update)
export const updateProfile = async (profileData) => {
  const res = await api.put("/student/profile-details", profileData);
  return res?.data || res;
};
