// In-memory only, mirroring the rest of this app's no-backend pattern —
// but the 4-step wizard's Preview screen needs to reflect what earlier
// steps typed, so a plain shared module (not per-page local state) carries
// values between routes for the current session. Resets on full reload,
// same as everything else here that isn't backed by a real API yet.
export const postOpportunityDraft = {
  title: "",
  type: "Full-time",
  workMode: "Remote",
  location: "",
  salaryRange: "",
  overview: "",
  skills: [],
};

export function updateDraft(patch) {
  Object.assign(postOpportunityDraft, patch);
}
