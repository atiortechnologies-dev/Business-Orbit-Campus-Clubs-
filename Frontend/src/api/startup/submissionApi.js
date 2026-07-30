import api from "../axiosInstance";

// POST /api/submission/submit
export const submitIdea = async (submissionData) => {
  const res = await api.post("/startup/submit", submissionData);
  return res?.data || res;
};

// PUT /api/submission/save-draft
export const saveDraft = async (draftData) => {
  const res = await api.put("/startup/save-draft", draftData);
  return res?.data || res;
};

// GET /api/submission/submission-status
export const getSubmissionStatus = async () => {
  const res = await api.get("/startup/submission-status");
  return res?.data || res;
};
