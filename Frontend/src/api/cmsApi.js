import api from "./axiosInstance";

export const cmsApi = {
  // FAQs
  getFaqs: () => api.get("/faqs"),
  getFaqById: (id) => api.get(`/faqs/${id}`),
  createFaq: (data) => api.post("/faqs", data),
  updateFaq: (id, data) => api.put(`/faqs/${id}`, data),
  deleteFaq: (id) => api.delete(`/faqs/${id}`),

  // Partner Logos
  getPartnerLogos: () => api.get("/partner-logos"),
  getPartnerLogoById: (id) => api.get(`/partner-logos/${id}`),
  createPartnerLogo: (formData) =>
    api.post("/partner-logos", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  updatePartnerLogo: (id, formData) =>
    api.put(`/partner-logos/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  deletePartnerLogo: (id) => api.delete(`/partner-logos/${id}`),

  // Success Stories
  getSuccessStories: () => api.get("/success-stories"),
  getSuccessStoryById: (id) => api.get(`/success-stories/${id}`),
  createSuccessStory: (formData) =>
    api.post("/success-stories", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  updateSuccessStory: (id, formData) =>
    api.put(`/success-stories/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  deleteSuccessStory: (id) => api.delete(`/success-stories/${id}`),

  // Featured Startups
  getFeaturedStartups: () => api.get("/featured-startups"),
  getFeaturedStartupById: (id) => api.get(`/featured-startups/${id}`),
  createFeaturedStartup: (formData) =>
    api.post("/featured-startups", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  updateFeaturedStartup: (id, formData) =>
    api.put(`/featured-startups/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  deleteFeaturedStartup: (id) => api.delete(`/featured-startups/${id}`),
};
