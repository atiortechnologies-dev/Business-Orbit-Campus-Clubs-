import api from "../axiosInstance";

export const adminSettingsApi = {
  getSettings: () => api.get("/admin/settings"),
  updatePlatformSettings: (data) => api.put("/admin/settings/platform", data),
  exportConfig: () => api.get("/admin/settings/export-config"),
  updateProfile: (data) => api.put("/admin/settings/profile", data),
  updateNotifications: (data) => api.put("/admin/settings/notifications", data),
  getLoginHistory: () => api.get("/admin/settings/login-history"),
  logoutAllDevices: () => api.post("/admin/settings/logout-all-devices"),
  changePassword: (data) => api.post("/admin/settings/change-password", data),
  downloadSystemLogs: () => api.get("/admin/settings/download-system-logs"),
};

export const adminAuditLogApi = {
  getLogs: (params) => api.get("/admin/audit-log", { params }),
  getPulse: () => api.get("/admin/audit-log/pulse"),
  getVolumeTrend: () => api.get("/admin/audit-log/volume-trend"),
  exportLogs: (params) => api.get("/admin/audit-log/export", { params }),
};

export const adminStatsApi = {
  getStatistics: () => api.get("/admin/statistics"),
  // Include endpoints for features if we need them, but the prompt says 25 orphaned endpoints.
};

export const adminChapterApi = {
  getChangeRequests: () => api.get("/chapter-change-requests"),
  approveChangeRequest: (id) =>
    api.put(`/chapter-change-requests/${id}/approve`),
  rejectChangeRequest: (id) => api.put(`/chapter-change-requests/${id}/reject`),
  bulkApproveRequests: (data) => api.post("/bulk-approve", data),
};

export const adminUserApi = {
  getUsers: () => api.get("/admin/users"),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
};
