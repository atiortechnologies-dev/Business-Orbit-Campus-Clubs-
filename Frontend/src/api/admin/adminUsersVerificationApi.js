import api from "@/api/axiosInstance";

export const getVerificationQueue = () => {
  return api.get("/admin/users/verification");
};

export const getUserVerificationDetail = (id) => {
  return api.get(`/admin/users/verification/${id}`);
};

export const submitVerificationDecision = (id, payload) => {
  return api.post(`/admin/users/verification/${id}/decision`, payload);
};
