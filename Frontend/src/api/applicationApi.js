import api from "./axiosInstance";

export const filterApplications = async (filters) => {
  const res = await api.post("/applications/filter", filters);
  return res?.data || res;
};

export const getApplicationStatus = async () => {
  const res = await api.get("/applications/status");
  return res?.data || res;
};

export const getApplicationInterviews = async () => {
  const res = await api.get("/applications/interviews");
  return res?.data || res;
};

export const uploadResume = async (formData) => {
  const res = await api.post("/applications/upload-resume", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res?.data || res;
};

export const uploadApplicationDocument = async (formData) => {
  const res = await api.post("/applications/upload-document", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res?.data || res;
};

export const withdrawApplication = async (reason) => {
  const res = await api.post("/withdraw", { reason });
  return res?.data || res;
};
