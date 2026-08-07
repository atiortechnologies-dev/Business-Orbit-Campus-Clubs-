import api from "@/api/axiosInstance";

export const beginValidationStage = () => {
  return api.post("/student/validation/begin");
};
