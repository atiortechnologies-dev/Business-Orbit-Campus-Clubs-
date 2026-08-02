import api from "../axiosInstance";

/**
 * Fetch the logged-in student's chapter profile
 * Route: GET /api/student/chapter
 */
export const getMyChapter = () => {
  return api.get("/student/chapter");
};

/**
 * Get statistics for a specific chapter
 * Route: GET /api/chapter/:chapterId/stats
 * @param {string} chapterId - MongoDB ID of the chapter
 */
export const getChapterStats = (chapterId) => {
  return api.get(`/chapter/${chapterId}/stats`);
};

/**
 * Request to change chapter
 * Route: POST /api/request-chapter-change
 */
export const requestChapterChange = (data) => {
  return api.post("/request-chapter-change", data);
};
