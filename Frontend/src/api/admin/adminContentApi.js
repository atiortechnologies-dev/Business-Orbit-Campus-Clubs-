import api from "../axiosInstance";

export const adminFaqApi = {
  getFaqs: (params) => api.get("/admin/faqs", { params }),
  createFaq: (data) => api.post("/admin/faqs", data),
  updateFaq: (id, data) => api.put(`/admin/faqs/${id}`, data),
  deleteFaq: (id) => api.delete(`/admin/faqs/${id}`),
};

export const adminStatisticApi = {
  getStatistics: (params) => api.get("/admin/statistics", { params }),
  createStatistic: (data) => api.post("/admin/statistics", data),
  updateStatistic: (id, data) => api.put(`/admin/statistics/${id}`, data),
  deleteStatistic: (id) => api.delete(`/admin/statistics/${id}`),
};

export const adminPartnerLogoApi = {
  getPartnerLogos: (params) => api.get("/admin/partner-logos", { params }),
  createPartnerLogo: (data) => api.post("/admin/partner-logos", data),
  updatePartnerLogo: (id, data) => api.put(`/admin/partner-logos/${id}`, data),
  deletePartnerLogo: (id) => api.delete(`/admin/partner-logos/${id}`),
};

export const adminSuccessStoryApi = {
  getSuccessStories: (params) => api.get("/admin/success-stories", { params }),
  createSuccessStory: (data) => api.post("/admin/success-stories", data),
  updateSuccessStory: (id, data) => api.put(`/admin/success-stories/${id}`, data),
  deleteSuccessStory: (id) => api.delete(`/admin/success-stories/${id}`),
};

export const adminFeaturedStartupApi = {
  getFeaturedStartups: (params) => api.get("/admin/featured-startups", { params }),
  createFeaturedStartup: (data) => api.post("/admin/featured-startups", data),
  updateFeaturedStartup: (id, data) => api.put(`/admin/featured-startups/${id}`, data),
  deleteFeaturedStartup: (id) => api.delete(`/admin/featured-startups/${id}`),
};
