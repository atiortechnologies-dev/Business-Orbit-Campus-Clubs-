import api from "../axiosInstance";

// GET /api/startup/progress
export const getStartupProgress = async () => {
  const res = await api.get("/startup/progress");
  return res?.data || res;
};

// GET /api/startup/stages
export const getStartupStages = async () => {
  const res = await api.get("/startup/stages");
  return res?.data || res;
};
