import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  Rocket,
  CheckCircle,
  Circle,
  Upload,
  Undo2,
  Loader2,
  Inbox,
  AlertCircle,
} from "lucide-react";
import AdminShell from "@/components/admin/AdminShell";
import Badge from "@/components/ui/Badge";
import ComingSoon from "@/components/ui/ComingSoon";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import {
  getMeetingById,
  postMeetingOutcome,
} from "@/api/admin/adminMeetingApi";

const STAGE_ORDER = [
  "ideation",
  "validation",
  "mvp",
  "incubation",
  "traction",
  "launch",
];

const STATUS_LABEL = {
  scheduled: "Upcoming",
  completed: "Completed",
  rescheduled: "Rescheduled",
  cancelled: "Cancelled",
};

function label(stage) {
  if (!stage) return "N/A";
  return stage.charAt(0).toUpperCase() + stage.slice(1);
}

export default function MeetingOutcomePage() {
  useDocumentTitle("Meeting Outcome — BOCC Admin");
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const meetingId = searchParams.get("id");

  const [meeting, setMeeting] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const [summary, setSummary] = useState("");
  const [strengths, setStrengths] = useState("");
  const [improvements, setImprovements] = useState("");
  const [actionItems, setActionItems] = useState("");
  const [decision, setDecision] = useState("approve");
  const [founderFeedback, setFounderFeedback] = useState("");
  const [internalNotes, setInternalNotes] = useState("");
  const [feedbackTouched, setFeedbackTouched] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [published, setPublished] = useState(false);
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const fetchMeeting = async () => {
      try {
        setIsLoading(true);
        setIsError(false);

        if (!meetingId) {
          setIsError(true);
          return;
        }

        // TODO(backend): GET /admin/meetings/:id doesn't exist yet.
        const res = await getMeetingById(meetingId);
        const payload = res?.data?.data || res?.data || res;

        if (isMounted && payload) {
          setMeeting(payload);
        }
      } catch (err) {
        console.error("Failed to load meeting for outcome recording:", err);
        if (isMounted) setIsError(true);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchMeeting();

    return () => {
      isMounted = false;
    };
  }, [meetingId]);

  const canPublish =
    founderFeedback.trim().length > 0 && !submitting && !published;

  const handlePublish = async (e) => {
    e.preventDefault();
    setFeedbackTouched(true);
    if (!canPublish) return;

    try {
      setSubmitting(true);
      setSubmitError("");

      // TODO(backend): POST /admin/meetings/:id/outcome doesn't exist yet,
      // and Meeting.js has no fields for any of this today. Needs a schema
      // addition (summary/strengths/improvements/actionItems/
      // feedbackForFounder/internalNotes/decision) plus the route.
      await postMeetingOutcome(meetingId, {
        summary,
        strengths,
        improvements,
        actionItems,
        decision,
        feedbackForFounder: founderFeedback,
        internalNotes,
      });

      setPublished(true);
      setTimeout(() => navigate(`/admin/meetings/detail?id=${meetingId}`), 2000);
    } catch (err) {
      console.error("Failed to publish meeting outcome:", err);
      setSubmitError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to publish this outcome. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <AdminShell>
        <div className="min-h-[50vh] flex items-center justify-center">
          <Loader2 size={28} className="animate-spin text-text-muted" />
        </div>
      </AdminShell>
    );
  }

  if (isError || !meeting) {
    return (
      <AdminShell>
        <div className="min-h-[50vh] flex flex-col items-center justify-center text-center gap-3">
          <Inbox size={32} className="text-text-muted" />
          <p className="font-poppins font-semibold text-card text-text-heading">
            Couldn't load this meeting
          </p>
          <p className="font-inter text-small text-text-muted max-w-sm">
            This meeting's details aren't available or the link is invalid.
          </p>
          <Link
            to="/admin/meetings"
            className="font-poppins font-semibold text-small text-text-heading hover:opacity-80 transition-opacity"
          >
            Back to Meetings
          </Link>
        </div>
      </AdminShell>
    );
  }

  const startup = meeting.startup_id || meeting.startup || {};
  const scheduledDate = meeting.scheduledAt ? new Date(meeting.scheduledAt) : null;
  const currentStageIdx = STAGE_ORDER.indexOf(meeting.stage);
  const nextStage =
    currentStageIdx >= 0 && currentStageIdx < STAGE_ORDER.length - 1
      ? STAGE_ORDER[currentStageIdx + 1]
      : null;

  return (
    <AdminShell>
      <div className="mb-6">
        <h1 className="font-poppins font-semibold text-page text-text-heading">
          Meeting Outcome
        </h1>
        <p className="font-inter text-body text-text-body mt-1">
          Record what happened and decide the next step for{" "}
          {startup.startup_name || startup.name || "this startup"}.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: startup context + journey */}
        <div className="lg:col-span-3 space-y-6">
          <section className="bg-surface-white border border-border-subtle rounded-lg p-6 shadow-card">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-11 h-11 rounded-lg bg-brand-black text-white flex items-center justify-center shrink-0">
                <Rocket size={20} strokeWidth={2} />
              </div>
              <div>
                <h3 className="font-poppins font-semibold text-body text-text-heading">
                  {startup.startup_name || startup.name || "Untitled Startup"}
                </h3>
                <p className="font-inter text-caption text-text-muted">
                  {startup.industry || "Industry N/A"}
                </p>
              </div>
            </div>
            <dl className="space-y-3 pt-4 border-t border-divider-line">
              <div className="flex justify-between">
                <dt className="font-inter text-small text-text-muted">Stage</dt>
                <dd>
                  <Badge variant="brand">{label(meeting.stage)}</Badge>
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="font-inter text-small text-text-muted">Founder</dt>
                <dd className="font-inter font-medium text-small text-text-heading">
                  {startup.student_id?.full_name || startup.founder || "N/A"}
                </dd>
              </div>
            </dl>
          </section>

          <section className="bg-surface-white border border-border-subtle rounded-lg p-6 shadow-card">
            <h3 className="font-inter font-semibold text-caption text-text-muted uppercase tracking-wider mb-4">
              Journey Timeline
            </h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <CheckCircle size={18} strokeWidth={2} className="text-brand-black shrink-0" />
                <div>
                  <p className="font-inter font-medium text-small text-text-heading">
                    Current Stage
                  </p>
                  <p className="font-inter text-caption text-text-muted">
                    {label(meeting.stage)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Circle size={18} strokeWidth={2} className="text-text-muted shrink-0" />
                <div>
                  <p className="font-inter font-medium text-small text-text-heading">
                    Next Stage
                  </p>
                  <p className="font-inter text-caption text-text-muted">
                    {nextStage ? label(nextStage) : "Final Stage"}
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Center: outcome recording form — the Publish action lives in the
            right-hand sticky panel since the decision/feedback fields it
            depends on are there, so this is a plain div, not a <form>. */}
        <div className="lg:col-span-5 space-y-6">
          <section className="bg-surface-white border border-border-subtle rounded-lg p-6 shadow-card space-y-5">
            <h3 className="font-poppins font-semibold text-body text-text-heading">
              Meeting Outcome Recording
            </h3>

            <div>
              <label
                htmlFor="summary"
                className="text-caption font-medium text-text-heading font-inter block mb-1"
              >
                Meeting Summary
              </label>
              <textarea
                id="summary"
                rows={3}
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                className="w-full rounded-md border border-border-subtle bg-surface-white text-sm text-text-body font-inter p-3 resize-none focus:outline-none focus:ring-1 focus:ring-brand-black"
              />
            </div>

            <div>
              <label
                htmlFor="strengths"
                className="text-caption font-medium text-text-heading font-inter block mb-1"
              >
                Strengths Observed
              </label>
              <textarea
                id="strengths"
                rows={3}
                value={strengths}
                onChange={(e) => setStrengths(e.target.value)}
                className="w-full rounded-md border border-border-subtle bg-surface-white text-sm text-text-body font-inter p-3 resize-none focus:outline-none focus:ring-1 focus:ring-brand-black"
              />
            </div>

            <div>
              <label
                htmlFor="improvements"
                className="text-caption font-medium text-text-heading font-inter block mb-1"
              >
                Improvement Suggestions
              </label>
              <textarea
                id="improvements"
                rows={3}
                value={improvements}
                onChange={(e) => setImprovements(e.target.value)}
                className="w-full rounded-md border border-border-subtle bg-surface-white text-sm text-text-body font-inter p-3 resize-none focus:outline-none focus:ring-1 focus:ring-brand-black"
              />
            </div>

            <div>
              <label
                htmlFor="action-items"
                className="text-caption font-medium text-text-heading font-inter block mb-1"
              >
                Action Items
              </label>
              <textarea
                id="action-items"
                rows={3}
                value={actionItems}
                onChange={(e) => setActionItems(e.target.value)}
                className="w-full rounded-md border border-border-subtle bg-surface-white text-sm text-text-body font-inter p-3 resize-none focus:outline-none focus:ring-1 focus:ring-brand-black"
              />
            </div>

            <div>
              <p className="text-caption font-medium text-text-heading font-inter mb-1">
                Upload Supporting Notes
              </p>
              <ComingSoon label="Upload Supporting Notes" position="top">
                <div className="w-full border-2 border-dashed border-border-subtle rounded-lg p-6 text-center flex flex-col items-center gap-2">
                  <Upload size={22} strokeWidth={2} className="text-text-muted" />
                  <p className="font-inter text-small text-text-muted">
                    PDF, DOCX or TXT up to 10MB
                  </p>
                </div>
              </ComingSoon>
            </div>
          </section>
        </div>

        {/* Right: recap + decision + publish */}
        <div className="lg:col-span-4">
          <section className="bg-surface-white border border-border-subtle rounded-lg p-6 shadow-card lg:sticky lg:top-24 space-y-6">
            <div>
              <h3 className="font-inter font-semibold text-caption text-text-muted uppercase tracking-wider mb-3">
                Meeting Details
              </h3>
              <dl className="space-y-2">
                <div className="flex justify-between">
                  <dt className="font-inter text-small text-text-muted">Date</dt>
                  <dd className="font-inter font-medium text-small text-text-heading">
                    {scheduledDate ? scheduledDate.toLocaleDateString() : "N/A"}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="font-inter text-small text-text-muted">Duration</dt>
                  <dd className="font-inter font-medium text-small text-text-heading">
                    {meeting.duration ? `${meeting.duration} min` : "N/A"}
                  </dd>
                </div>
                <div className="flex justify-between items-center">
                  <dt className="font-inter text-small text-text-muted">Status</dt>
                  <dd>
                    <Badge variant="info">
                      {STATUS_LABEL[meeting.status] || meeting.status}
                    </Badge>
                  </dd>
                </div>
              </dl>
            </div>

            <div className="pt-6 border-t border-divider-line">
              <h3 className="font-inter font-semibold text-caption text-text-muted uppercase tracking-wider mb-3">
                Outcome Decision
              </h3>
              <div className="space-y-2">
                <label className="flex items-start gap-3 p-3 border border-border-subtle rounded-md cursor-pointer has-[:checked]:border-brand-black has-[:checked]:bg-canvas-bg">
                  <input
                    type="radio"
                    name="decision"
                    value="approve"
                    checked={decision === "approve"}
                    onChange={() => setDecision("approve")}
                    className="mt-1 text-brand-black focus:ring-brand-black"
                  />
                  <span>
                    <span className="block font-inter font-semibold text-small text-text-heading">
                      Approve to {nextStage ? label(nextStage) : "Next Stage"}
                    </span>
                    <span className="block font-inter text-caption text-text-muted">
                      Startup clears this stage and advances.
                    </span>
                  </span>
                </label>
                <label className="flex items-start gap-3 p-3 border border-border-subtle rounded-md cursor-pointer has-[:checked]:border-brand-black has-[:checked]:bg-canvas-bg">
                  <input
                    type="radio"
                    name="decision"
                    value="request_changes"
                    checked={decision === "request_changes"}
                    onChange={() => setDecision("request_changes")}
                    className="mt-1 text-brand-black focus:ring-brand-black"
                  />
                  <span>
                    <span className="block font-inter font-semibold text-small text-text-heading">
                      Request Changes
                    </span>
                    <span className="block font-inter text-caption text-text-muted">
                      Startup stays at this stage pending revisions.
                    </span>
                  </span>
                </label>
              </div>
            </div>

            <div>
              <label
                htmlFor="founder-feedback"
                className="text-caption font-medium text-text-heading font-inter block mb-1"
              >
                Feedback for Founder <span className="text-error">*Required</span>
              </label>
              <textarea
                id="founder-feedback"
                rows={3}
                value={founderFeedback}
                onChange={(e) => setFounderFeedback(e.target.value)}
                onBlur={() => setFeedbackTouched(true)}
                className={`w-full rounded-md border bg-surface-white text-sm text-text-body font-inter p-3 resize-none focus:outline-none focus:ring-1 ${
                  feedbackTouched && !founderFeedback.trim()
                    ? "border-error focus:ring-error"
                    : "border-border-subtle focus:ring-brand-black"
                }`}
              />
              <p className="font-inter text-caption text-text-muted mt-1">
                This will be shared directly with the startup.
              </p>
              {feedbackTouched && !founderFeedback.trim() && (
                <p className="font-inter text-caption text-error mt-1 flex items-center gap-1">
                  <AlertCircle size={12} strokeWidth={2} /> Feedback for the founder is required.
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="internal-notes"
                className="text-caption font-medium text-text-heading font-inter block mb-1"
              >
                Internal Notes (Hidden)
              </label>
              <textarea
                id="internal-notes"
                rows={3}
                value={internalNotes}
                onChange={(e) => setInternalNotes(e.target.value)}
                className="w-full rounded-md border border-border-subtle bg-surface-white text-sm text-text-body font-inter p-3 resize-none focus:outline-none focus:ring-1 focus:ring-brand-black"
              />
              <p className="font-inter text-caption text-text-muted mt-1">
                Admin eyes only — never shown to the startup.
              </p>
            </div>

            {submitError && (
              <p className="font-inter text-small text-error">{submitError}</p>
            )}

            {published ? (
              <div className="p-4 bg-success/10 border border-success/30 rounded-md flex items-center gap-2 text-success font-inter text-small">
                <CheckCircle size={16} strokeWidth={2} /> Published — redirecting...
              </div>
            ) : (
              <button
                type="button"
                onClick={handlePublish}
                disabled={!canPublish}
                className="w-full py-3.5 bg-action-bg text-action-text font-poppins font-semibold text-small rounded-md flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <>
                    <Loader2 size={16} className="animate-spin" /> Publishing...
                  </>
                ) : (
                  <>
                    <Upload size={16} strokeWidth={2} /> Publish Result
                  </>
                )}
              </button>
            )}

            <button
              type="button"
              onClick={() => navigate(`/admin/meetings/detail?id=${meetingId}`)}
              className="w-full flex items-center justify-center gap-2 py-2.5 border border-border-subtle rounded-md font-inter font-medium text-small text-text-heading hover:bg-canvas-bg transition-colors"
            >
              <Undo2 size={16} strokeWidth={2} /> Back to Meeting
            </button>
          </section>
        </div>
      </div>
    </AdminShell>
  );
}
