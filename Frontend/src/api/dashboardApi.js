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

// GET recent requests for dashboard widget
export const getRecentRequests = async () => {
  const res = await api.get("/requests/recent");
  return res?.data || res;
};

// GET upcoming meetings for dashboard widget
export const getUpcomingMeetings = async () => {
  const res = await api.get("/meetings/upcoming");
  return res?.data || res;
};

// GET recent chats for dashboard widget
export const getRecentChats = async () => {
  const res = await api.get("/chats/recent");
  return res?.data || res;
};
