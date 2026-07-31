import api from "@/api/axiosInstance";

export const getStudentMeetingDetails = () => {
  return api.get("/meetings");
};
