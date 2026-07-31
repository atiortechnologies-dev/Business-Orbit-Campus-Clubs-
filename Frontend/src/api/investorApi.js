import api from "../axiosInstance";

// POST /watchlist
export const addToWatchlist = async (startupId) => {
  const res = await api.post("/watchlist", { startupId });
  return res?.data || res;
};

// DELETE /watchlist/:startupId
export const removeFromWatchlist = async (startupId) => {
  const res = await api.delete(`/watchlist/${startupId}`);
  return res?.data || res;
};

// GET /watchlist
export const getWatchlist = async () => {
  const res = await api.get("/watchlist");
  return res?.data || res;
};

// GET /dashboard/stats
export const getInvestorStats = async () => {
  const res = await api.get("/dashboard/stats");
  return res?.data || res;
};

// GET /pitches
export const getPitches = async (params) => {
  const res = await api.get("/pitches", { params });
  return res?.data || res;
};

// GET /startups/search
export const searchStartups = async (query) => {
  const res = await api.get("/startups/search", { params: { q: query } });
  return res?.data || res;
};

// POST /pitch/view
export const trackPitchView = async (startupId) => {
  const res = await api.post("/pitch/view", { startupId });
  return res?.data || res;
};
