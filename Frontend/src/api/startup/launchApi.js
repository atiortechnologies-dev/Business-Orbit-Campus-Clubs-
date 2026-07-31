import api from "../axiosInstance";

export const getPitchDeck = async () => {
  const res = await api.get("/stages/launch/pitch-deck");
  return res?.data || res;
};

export const uploadPitchDeck = async (formData) => {
  const res = await api.post("/stages/launch/pitch-deck/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res?.data || res;
};

export const deletePitchDeck = async (documentId) => {
  const res = await api.delete(`/stages/launch/pitch-deck/${documentId}`);
  return res?.data || res;
};

export const submitPitchDeck = async () => {
  const res = await api.post("/stages/launch/pitch-deck/submit");
  return res?.data || res;
};

export const getInsights = async () => {
  const res = await api.get("/stages/launch/insights");
  return res?.data || res;
};

export const saveInsights = async (data) => {
  const res = await api.post("/stages/launch/insights/save", data);
  return res?.data || res;
};

export const submitInsights = async (data) => {
  const res = await api.post("/stages/launch/insights/submit", data);
  return res?.data || res;
};
