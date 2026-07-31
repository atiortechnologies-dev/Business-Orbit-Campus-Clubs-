import api from "./axiosInstance";

// GET /opportunities/search
export const searchOpportunities = async (query) => {
  const res = await api.get("/opportunities/search", { params: { q: query } });
  return res?.data || res;
};

// POST /opportunities/filter
export const filterOpportunities = async (filters) => {
  const res = await api.post("/opportunities/filter", filters);
  return res?.data || res;
};
