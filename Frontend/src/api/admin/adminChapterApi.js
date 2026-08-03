import api from "../axiosInstance";

export const getChapters = async () => {
  const res = await api.get("/admin/chapters");
  return res.data;
};

export const getChapterById = async (id) => {
  if (!id) {
    throw new Error("Chapter ID is required");
  }
  const res = await api.get(`/admin/chapters/${id}`);
  return res.data;
};

export const createChapter = async (chapterData) => {
  const res = await api.post("/admin/chapters", chapterData);
  return res;
};
