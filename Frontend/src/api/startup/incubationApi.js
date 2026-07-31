import api from "../axiosInstance";

// POST /stages/launch/start
export const startLaunchStage = async () => {
  const res = await api.post("/stages/launch/start");
  return res?.data || res;
};

// GET /stages/launch
export const getLaunchOverview = async () => {
  const res = await api.get("/stages/launch");
  return res?.data || res;
};

// GET /stages/launch/checklist
export const getLaunchChecklist = async () => {
  const res = await api.get("/stages/launch/checklist");
  return res?.data || res;
};

// GET /stages/launch/submission
export const getLaunchSubmission = async () => {
  const res = await api.get("/stages/launch/submission");
  return res?.data || res;
};

// GET /stages/traction
export const getTractionOverview = async () => {
  const res = await api.get("/stages/traction");
  return res?.data || res;
};

// POST /stages/traction/start
export const startTractionStage = async () => {
  const res = await api.post("/stages/traction/start");
  return res?.data || res;
};

// GET /stages/traction/checklist
export const getTractionChecklist = async () => {
  const res = await api.get("/stages/traction/checklist");
  return res?.data || res;
};
