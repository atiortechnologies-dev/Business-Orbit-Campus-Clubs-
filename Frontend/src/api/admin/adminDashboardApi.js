import api from "../axiosInstance";

export const getAdminOverview = async () => {
  const response = await api.get("/admin/overview");
  return response?.data || response;
};
