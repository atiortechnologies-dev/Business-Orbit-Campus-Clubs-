import api from "../axiosInstance";

export const addTractionMetric = async (payload) => {
  const res = await api.post("/traction/metrics", payload);
  return res?.data || res;
};

export const getTractionMetrics = async () => {
  const res = await api.get("/traction/metrics");
  return res?.data || res;
};

export const updateTractionMetric = async (metricId, payload) => {
  const res = await api.put(`/traction/metrics/${metricId}`, payload);
  return res?.data || res;
};

export const deleteTractionMetric = async (metricId) => {
  const res = await api.delete(`/traction/metrics/${metricId}`);
  return res?.data || res;
};

export const submitTraction = async (payload) => {
  const res = await api.post("/traction/submission", payload);
  return res?.data || res;
};

export const getTractionSubmission = async () => {
  const res = await api.get("/traction/submission");
  return res?.data || res;
};

export const updateTractionSubmission = async (submissionId, payload) => {
  const res = await api.put(`/traction/submission/${submissionId}`, payload);
  return res?.data || res;
};

export const deleteTractionDocument = async (documentId) => {
  const res = await api.delete(`/traction/submission/document/${documentId}`);
  return res?.data || res;
};

export const getTractionReviewStatus = async () => {
  const res = await api.get("/traction/review/status");
  return res?.data || res;
};

export const getTractionReviewTimeline = async () => {
  const res = await api.get("/traction/review/timeline");
  return res?.data || res;
};

export const getTractionReviewComments = async () => {
  const res = await api.get("/traction/review/comments");
  return res?.data || res;
};

export const getTractionReviewMeetingDetails = async () => {
  const res = await api.get("/traction/review-meeting/details");
  return res?.data || res;
};

export const getTractionReviewMeetingJoinLink = async () => {
  const res = await api.get("/traction/review-meeting/join-link");
  return res?.data || res;
};

export const confirmTractionReviewAttendance = async () => {
  const res = await api.post("/traction/review-meeting/confirm-attendance");
  return res?.data || res;
};

export const getTractionResult = async () => {
  const res = await api.get("/traction/result");
  return res?.data || res;
};

export const getTractionApproval = async () => {
  const res = await api.get("/traction/approval");
  return res?.data || res;
};

