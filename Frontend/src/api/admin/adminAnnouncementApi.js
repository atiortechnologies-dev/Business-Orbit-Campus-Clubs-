import api from "../axiosInstance";

// GET /api/admin/announcements
export const getAnnouncements = async (params = {}) => {
  const res = await api.get("/admin/announcements", { params });
  return res?.data || res;
};

// POST /api/admin/announcements
export const createAnnouncement = async (payload) => {
  const res = await api.post("/admin/announcements", payload);
  return res?.data || res;
};
