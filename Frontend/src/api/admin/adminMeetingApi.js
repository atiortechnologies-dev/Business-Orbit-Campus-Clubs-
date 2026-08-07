import api from "@/api/axiosInstance";

export const getMeetingPrepareContext = (params) => {
  return api.get("/admin/meetings/prepare", { params });
};

export const scheduleMeeting = (payload) => {
  return api.post("/admin/meetings/schedule", payload);
};

// TODO(backend): new endpoint, not built yet. Should mirror getReviewQueue's
// shape — { success, data: { meetings: [...], counts: { today, upcoming,
// completed, rescheduled } } }. Query params: chapter, stage, status, date, sort.
export const getMeetings = (params) => {
  return api.get("/admin/meetings", { params });
};

// TODO(backend): new endpoint, not built yet. Response should populate
// startup/founder/chapter (like getChapterDetails populates lead_id) plus the
// linked submission's pitch fields (problem statement, solution, audience,
// value prop, competitors, documents) the same way getSubmissionDetail does.
export const getMeetingById = (id) => {
  return api.get(`/admin/meetings/${id}`);
};

// TODO(backend): new endpoint, not built yet, and Meeting.js has no fields
// for any of this today (no summary/strengths/improvements/actionItems/
// feedbackForFounder/internalNotes/decision) — needs both a schema addition
// and the route, not just the route.
export const postMeetingOutcome = (id, payload) => {
  return api.post(`/admin/meetings/${id}/outcome`, payload);
};

// TODO(backend): new endpoint, not built yet — but Meeting.js is already
// schema-ready for this one (rescheduleHistory[], "rescheduled" status both
// exist already), so this is just a controller/route, no model change needed.
export const rescheduleMeeting = (id, payload) => {
  return api.post(`/admin/meetings/${id}/reschedule`, payload);
};

// TODO(backend): new endpoint, not built yet. Should set status to
// "cancelled" (already a valid enum value on Meeting.js).
export const cancelMeeting = (id, payload) => {
  return api.post(`/admin/meetings/${id}/cancel`, payload);
};
