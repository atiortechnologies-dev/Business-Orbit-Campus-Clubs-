import api from "@/api/axiosInstance";

/**
 * Fetch stage-specific meeting feedback for the logged-in student
 * @param {string} stage - e.g. "ideation", "validation", "mvp"
 */
export const getStudentStageFeedback = (stage = "ideation") => {
  return api.get(`/review/result/${stage}`);
};
