import api from '../axiosInstance';

export const getChapters = async (params = {}) => {
  const res = await api.get('/admin/chapters', { params });
  return res.data;
};

export const getChapterOverview = async (id) => {
  const res = await api.get(`/admin/chapters/${id}/overview`);
  return res.data;
};

export const getChapterStudents = async (id, params = {}) => {
  const res = await api.get(`/admin/chapters/${id}/students`, { params });
  return res.data;
};

export const getChapterStartups = async (id, params = {}) => {
  const res = await api.get(`/admin/chapters/${id}/startups`, { params });
  return res.data;
};

export const getChapterEvents = async (id, params = {}) => {
  const res = await api.get(`/admin/chapters/${id}/events`, { params });
  return res.data;
};

export const getOpportunitiesQueue = async (params = {}) => {
  const res = await api.get('/admin/opportunities', { params });
  return res.data;
};

export const getOpportunityDetails = async (id) => {
  const res = await api.get(`/admin/opportunities/${id}`);
  return res.data;
};

export const getAllUsers = async (params = {}) => {
  const res = await api.get('/admin/users/all', { params });
  return res.data;
};

export const submitOpportunityDecision = async (id, payload) => {
  const res = await api.patch(`/admin/opportunities/${id}`, payload);
  return res.data;
};

export const getAdminSettings = async () => {
  const res = await api.get('/admin/settings');
  return res.data;
};

export const updateAdminSettings = async (payload) => {
  const { profile, platform, notifications } = payload;
  const requests = [];
  
  if (profile) {
    requests.push(api.put('/admin/settings/profile', {
      full_name: profile.fullName,
      phone: profile.phone,
      designation: profile.designation
    }));
  }
  
  if (platform) {
    requests.push(api.put('/admin/settings/platform', {
      platform_name: platform.name,
      support_email: platform.supportEmail,
      timezone: platform.timezone,
      allow_new_registrations: platform.newRegistrations,
      require_email_verification: platform.emailVerificationRequired,
      maintenance_mode: platform.maintenanceMode,
      public_profiles_visible: platform.publicProfilesVisible
    }));
  }
  
  if (notifications) {
    const notifsArray = Object.keys(notifications.events).map(event => ({
      event_category: event,
      in_app_enabled: notifications.inApp ? notifications.events[event] : false,
      email_enabled: notifications.email ? notifications.events[event] : false
    }));
    requests.push(api.put('/admin/settings/notifications', { notifications: notifsArray }));
  }
  
  await Promise.all(requests);
  return { success: true };
};

export const getAuditLogs = async (params = {}) => {
  const res = await api.get('/admin/audit-logs', { params });
  return res.data;
};
