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

// POST /api/startups/filter
export const filterStartups = async (filters) => {
  const res = await api.post("/startups/filter", filters);
  return res?.data || res;
};

export const getStagesProgress = () => {
  return api.get("/stages/progress");
};
