import api from "../axiosInstance";

export const getReviewQueue = async () => {
  const res = await api.get("/admin/reviews");
  return res.data;
};

export const getSubmissionDetail = async (submissionId) => {
  const res = await api.get(`/admin/reviews/${submissionId}`);
  return res.data;
};

export const submitReviewDecision = async (submissionId, payload) => {
  const res = await api.post(`/admin/reviews/${submissionId}/decision`, payload);
  return res.data;
};
