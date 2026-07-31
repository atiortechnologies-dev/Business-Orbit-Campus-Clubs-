import api from "../axiosInstance";

export const getMvpStage = async () => {
  const res = await api.get("/stages/mvp");
  return res?.data || res;
};

export const getMvpChecklist = async () => {
  const res = await api.get("/stages/mvp/checklist");
  return res?.data || res;
};

export const getMvpMeeting = async () => {
  const res = await api.get("/mvp/meeting");
  return res?.data || res;
};

export const rescheduleMvpMeeting = async (payload) => {
  const res = await api.post("/mvp/reschedule", payload);
  return res?.data || res;
};

export const getMvpReview = async () => {
  const res = await api.get("/mvp/review");
  return res?.data || res;
};
