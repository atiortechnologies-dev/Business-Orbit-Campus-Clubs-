import api from "../axiosInstance";

// TODO(backend): new endpoint, not built yet. Should mirror
// getSubmissionDetail's existing journeyStages computation (real
// StartupStage docs, sorted by stage_number — Ideation/Validation/MVP/
// Traction/Launch & Pitch, same taxonomy used everywhere else in this app)
// but keyed by startup_id directly instead of via a submission. Each
// journeyStages entry needs a `submissionId` (or null) added so the
// frontend can link "View Details" only where a submission actually
// exists — getSubmissionDetail's journeyStages don't currently include
// this. Response should also include a `startup` object (name, founder,
// industry, chapter, chapterId, createdAt, progressPercentage, status).
export const getStartupById = (id) => {
  return api.get(`/admin/startups/${id}`);
};
