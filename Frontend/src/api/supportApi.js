import api from './axiosInstance';

export const supportApi = {
  requestAssistance: async (data) => {
    return await api.post('/assistance/request', data);
  },
  getAssistanceStatus: async () => {
    return await api.get('/assistance/status');
  },
  updateAssistance: async (requestId, data) => {
    return await api.put(`/assistance/${requestId}`, data);
  }
};
