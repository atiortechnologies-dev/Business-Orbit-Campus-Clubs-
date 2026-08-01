import api from "../axiosInstance";

export const getReviewQueue = () => {
  return api.get("/admin/reviews");
};

export const getSubmissionDetail = (submissionId) => {
  return api.get(`/admin/reviews/${submissionId}`);
};

export const submitReviewDecision = (submissionId, payload) => {
  return api.post(`/admin/reviews/${submissionId}/decision`, payload);
};
