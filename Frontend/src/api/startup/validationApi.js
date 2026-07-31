import api from "../axiosInstance";

export const getSurveys = () => api.get("/surveys");
export const createSurvey = (data) => api.post("/surveys", data);
export const updateSurvey = (surveyId, data) =>
  api.put(`/surveys/${surveyId}`, data);
export const deleteSurvey = (surveyId) => api.delete(`/surveys/${surveyId}`);

export const submitValidationReport = (payload) =>
  api.post("/report/submit", payload);
export const getMeetingFeedback = () => api.get("/meeting/feedback");
