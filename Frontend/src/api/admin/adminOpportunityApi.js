import api from "../axiosInstance";

export const adminOpportunityApi = {
  getOpportunities: (params) => api.get("/admin/opportunities", { params }),
  getOpportunityDetails: (id) => api.get(`/admin/opportunities/${id}`),
  bulkApprove: (data) => api.post("/admin/opportunities/bulk-approve", data),
  approve: (id) => api.post(`/admin/opportunities/${id}/approve`),
  reject: (id, data) => api.post(`/admin/opportunities/${id}/reject`, data),
  requestChanges: (id, data) => api.post(`/admin/opportunities/${id}/request-changes`, data),
  addNote: (id, data) => api.post(`/admin/opportunities/${id}/notes`, data),
};
