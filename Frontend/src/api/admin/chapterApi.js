import api from "../axiosInstance";

// GET /api/admin/chapters
export const getChapters = async (params = {}) => {
  const res = await api.get("/admin/chapters", { params });
  return res?.data || res;
};

// POST /api/admin/chapters
export const createChapter = async (payload) => {
  const res = await api.post("/admin/chapters", payload);
  return res?.data || res;
};

// GET /api/admin/chapters/:chapterId
export const getChapterById = async (chapterId) => {
  const res = await api.get(`/admin/chapters/${chapterId}`);
  return res?.data || res;
};
