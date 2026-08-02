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

// Helper to map frontend launch payload to backend schema
const mapLaunchPayload = (payload) => {
  return {
    startup_name: payload.startupName,
    product_name: payload.productName,
    launch_date: payload.launchDate
      ? new Date(payload.launchDate).toISOString()
      : undefined,
    industry: payload.industry,
    team_size: payload.teamSize ? parseInt(payload.teamSize, 10) : undefined,
    funding_status: payload.funding,
    website_url: payload.websiteUrl || undefined,
    product_url: payload.liveUrl || undefined,
    app_store_url: payload.storeLink || undefined,
    demo_video_url: payload.demoUrl || undefined,
    description: payload.description || undefined,
    notes: payload.notes || undefined,
    social: {
      linkedin: payload.linkedin || undefined,
      instagram: payload.instagram || undefined,
      twitter: payload.twitter || undefined,
      youtube: payload.youtube || undefined,
    },
  };
};

// POST /stages/launch/submission/draft
export const saveLaunchDraft = async (payload) => {
  const mappedPayload = mapLaunchPayload(payload);
  const res = await api.post("/stages/launch/submission/draft", mappedPayload);
  return res?.data || res;
};

// POST /stages/launch/submission/submit
export const submitLaunch = async (payload) => {
  const mappedPayload = mapLaunchPayload(payload);
  const res = await api.post("/stages/launch/submission/submit", mappedPayload);
  return res?.data || res;
};
