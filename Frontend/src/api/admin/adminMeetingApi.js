import api from "@/api/axiosInstance";

export const getMeetingPrepareContext = (params) => {
  return api.get("/admin/meetings/prepare", { params });
};

export const scheduleMeeting = (payload) => {
  return api.post("/admin/meetings/schedule", payload);
};
