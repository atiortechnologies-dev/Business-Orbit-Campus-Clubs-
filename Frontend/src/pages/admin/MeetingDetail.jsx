import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  ChevronRight,
  Rocket,
  FileText,
  ExternalLink,
  Copy,
  Check,
  CalendarClock,
  RefreshCcw,
  XCircle,
  Loader2,
  Inbox,
} from "lucide-react";
import AdminShell from "@/components/admin/AdminShell";
import Badge from "@/components/ui/Badge";
import Input from "@/components/ui/Input";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import ComingSoon from "@/components/ui/ComingSoon";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { getMeetingById, cancelMeeting } from "@/api/admin/adminMeetingApi";

const STATUS_VARIANT = {
  scheduled: "info",
  completed: "success",
  rescheduled: "warning",
  cancelled: "neutral",
};

const STATUS_LABEL = {
  scheduled: "Upcoming",
  completed: "Completed",
  rescheduled: "Rescheduled",
  cancelled: "Cancelled",
};

const JOURNEY_STEPS = [
  "Application Submitted",
  "Initial Review",
  "Meeting",
  "Decision",
];

function initialsOf(name = "") {
  return (
    name
      .trim()
      .split(/\s+/)
      .map((p) => p[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() || "?"
  );
}

export default function MeetingDetailPage() {
  useDocumentTitle("Meeting Details — BOCC Admin");
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const meetingId = searchParams.get("id");

  const [meeting, setMeeting] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const [linkCopied, setLinkCopied] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [cancelError, setCancelError] = useState("");

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

        // TODO(backend): GET /admin/meetings/:id doesn't exist yet — see
        // adminMeetingApi.js's getMeetingById for the expected response shape.
        const res = await getMeetingById(meetingId);
        const payload = res?.data?.data || res?.data || res;

        if (isMounted && payload) {
          setMeeting(payload);
        }
      } catch (err) {
        console.error("Failed to load meeting details:", err);
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

  const handleCopyLink = () => {
    if (!meeting?.meeting_link) return;
    navigator.clipboard.writeText(meeting.meeting_link);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  };

  const handleCancel = async () => {
    if (!meetingId) return;
    try {
      setCancelling(true);
      setCancelError("");
      // TODO(backend): POST /admin/meetings/:id/cancel doesn't exist yet.
      await cancelMeeting(meetingId);
      setCancelOpen(false);
      navigate("/admin/meetings");
    } catch (err) {
      console.error("Failed to cancel meeting:", err);
      setCancelError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to cancel this meeting. Please try again.",
      );
    } finally {
      setCancelling(false);
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
  const submission = meeting.submission || {};
  const scheduledDate = meeting.scheduledAt ? new Date(meeting.scheduledAt) : null;
  const createdDate = meeting.createdAt ? new Date(meeting.createdAt) : null;
  const attendees = meeting.attendees || [];
  const competitors = submission.competitors || [];
  const documents = submission.documents || [];

  // Journey step index derived from meeting status — best-effort mapping
  // since there's no real event/decision log on the backend yet.
  const journeyIndex =
    meeting.status === "completed" ? 3 : meeting.status === "cancelled" ? 1 : 2;

  return (
    <AdminShell>
      <nav className="mb-6 flex items-center gap-2 text-text-muted font-inter text-small">
        <Link
          to="/admin/meetings"
          className="hover:text-text-heading transition-colors"
        >
          Meetings
        </Link>
        <ChevronRight size={14} strokeWidth={2} />
        <span className="text-text-heading font-semibold">
          {startup.startup_name || startup.name || meeting.title || "Meeting"}
        </span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: startup context + journey */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-surface-white border border-border-subtle rounded-lg p-6 shadow-card lg:sticky lg:top-24">
            <div className="flex flex-col items-center text-center pb-6 border-b border-divider-line mb-6">
              <div className="w-14 h-14 rounded-xl bg-brand-black text-white flex items-center justify-center mb-3">
                <Rocket size={22} strokeWidth={2} />
              </div>
              <h1 className="font-poppins font-semibold text-card text-text-heading">
                {startup.startup_name || startup.name || "Untitled Startup"}
              </h1>
              <Badge variant="brand" className="mt-2">
                {meeting.stage
                  ? meeting.stage.charAt(0).toUpperCase() + meeting.stage.slice(1)
                  : "Stage N/A"}
              </Badge>
            </div>
            <dl className="space-y-3">
              <div className="flex justify-between">
                <dt className="font-inter text-small text-text-muted">Founder</dt>
                <dd className="font-inter font-medium text-small text-text-heading">
                  {startup.student_id?.full_name || startup.founder || "N/A"}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="font-inter text-small text-text-muted">Chapter</dt>
                <dd className="font-inter font-medium text-small text-text-heading">
                  {startup.chapter || "N/A"}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="font-inter text-small text-text-muted">Institution</dt>
                <dd className="font-inter font-medium text-small text-text-heading">
                  {startup.institution || "N/A"}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="font-inter text-small text-text-muted">Submitted</dt>
                <dd className="font-inter font-medium text-small text-text-heading">
                  {submission.submitted_at
                    ? new Date(submission.submitted_at).toLocaleDateString()
                    : "N/A"}
                </dd>
              </div>
            </dl>
          </div>

          <div className="bg-surface-white border border-border-subtle rounded-lg p-6 shadow-card">
            <h3 className="font-poppins font-semibold text-body text-text-heading mb-5">
              Startup Journey
            </h3>
            <div className="space-y-0">
              {JOURNEY_STEPS.map((step, i) => {
                const status =
                  i < journeyIndex
                    ? "done"
                    : i === journeyIndex
                      ? "active"
                      : "pending";
                return (
                  <div key={step} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                          status === "done"
                            ? "bg-success text-white"
                            : status === "active"
                              ? "bg-brand-black text-white"
                              : "bg-canvas-bg border border-border-subtle text-text-muted"
                        }`}
                      >
                        {status === "active" && (
                          <div className="w-2 h-2 rounded-full bg-accent-neon" />
                        )}
                      </div>
                      {i < JOURNEY_STEPS.length - 1 && (
                        <div className="w-px flex-1 min-h-6 bg-border-subtle" />
                      )}
                    </div>
                    <p
                      className={`font-inter text-small pb-6 ${
                        status === "pending"
                          ? "text-text-muted"
                          : "text-text-heading font-medium"
                      }`}
                    >
                      {step}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Center: submitted pitch details */}
        <div className="lg:col-span-5 space-y-6">
          <section className="bg-surface-white border border-border-subtle rounded-lg p-6 shadow-card">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-poppins font-semibold text-body text-text-heading">
                Submitted Pitch Details
              </h3>
              <ComingSoon label="Open Full Form" position="top" inline>
                <span className="flex items-center gap-1.5 font-inter font-medium text-caption text-text-heading">
                  Full Form <ExternalLink size={14} strokeWidth={2} />
                </span>
              </ComingSoon>
            </div>
            <div className="space-y-5">
              <div>
                <p className="font-inter text-caption text-text-muted uppercase tracking-wider mb-1">
                  Problem Statement
                </p>
                <p className="font-inter text-small text-text-body leading-relaxed">
                  {submission.problem_statement || "Not provided."}
                </p>
              </div>
              <div>
                <p className="font-inter text-caption text-text-muted uppercase tracking-wider mb-1">
                  Proposed Solution
                </p>
                <p className="font-inter text-small text-text-body leading-relaxed">
                  {submission.proposed_solution || "Not provided."}
                </p>
              </div>
              <div>
                <p className="font-inter text-caption text-text-muted uppercase tracking-wider mb-1">
                  Target Audience
                </p>
                <p className="font-inter text-small text-text-body leading-relaxed">
                  {submission.target_audience || "Not provided."}
                </p>
              </div>
              <div>
                <p className="font-inter text-caption text-text-muted uppercase tracking-wider mb-1">
                  Value Proposition
                </p>
                <p className="font-inter text-small text-text-body leading-relaxed">
                  {submission.value_proposition || "Not provided."}
                </p>
              </div>
              {competitors.length > 0 && (
                <div>
                  <p className="font-inter text-caption text-text-muted uppercase tracking-wider mb-2">
                    Competitors
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {competitors.map((c) => (
                      <span
                        key={c}
                        className="px-2.5 py-1 rounded-full bg-canvas-bg border border-border-subtle font-inter text-caption text-text-body"
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>

          <section className="bg-surface-white border border-border-subtle rounded-lg shadow-card overflow-hidden">
            <div className="px-6 py-4 border-b border-border-subtle bg-canvas-bg/50">
              <h3 className="font-poppins font-semibold text-body text-text-heading">
                Supporting Documents
              </h3>
            </div>
            {documents.length > 0 ? (
              <div className="divide-y divide-border-subtle">
                {documents.map((doc) => (
                  <div key={doc.name || doc} className="p-4 flex items-center gap-3">
                    <div className="w-9 h-9 rounded bg-canvas-bg text-text-muted flex items-center justify-center shrink-0">
                      <FileText size={16} strokeWidth={2} />
                    </div>
                    <p className="flex-1 font-inter font-medium text-small text-text-heading truncate">
                      {doc.name || doc}
                    </p>
                    <ComingSoon label="Download" position="top" inline>
                      <span className="font-inter font-medium text-caption text-text-heading">
                        Download
                      </span>
                    </ComingSoon>
                  </div>
                ))}
              </div>
            ) : (
              <p className="p-4 font-inter text-small text-text-muted">
                No supporting documents on file.
              </p>
            )}
          </section>
        </div>

        {/* Right: meeting info + actions */}
        <div className="lg:col-span-4 space-y-6">
          <section className="bg-surface-white border border-border-subtle rounded-lg p-6 shadow-card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-poppins font-semibold text-body text-text-heading">
                {meeting.title || "Review Meeting"}
              </h3>
              <Badge variant={STATUS_VARIANT[meeting.status] || "neutral"}>
                {STATUS_LABEL[meeting.status] || meeting.status}
              </Badge>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="font-inter text-caption text-text-muted uppercase tracking-wider mb-1">
                  Date
                </p>
                <p className="font-inter font-medium text-small text-text-heading">
                  {scheduledDate ? scheduledDate.toLocaleDateString() : "N/A"}
                </p>
              </div>
              <div>
                <p className="font-inter text-caption text-text-muted uppercase tracking-wider mb-1">
                  Time
                </p>
                <p className="font-inter font-medium text-small text-text-heading">
                  {scheduledDate
                    ? scheduledDate.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "N/A"}
                </p>
              </div>
              <div>
                <p className="font-inter text-caption text-text-muted uppercase tracking-wider mb-1">
                  Duration
                </p>
                <p className="font-inter font-medium text-small text-text-heading">
                  {meeting.duration ? `${meeting.duration} min` : "N/A"}
                </p>
              </div>
              <div>
                {/* TODO(backend): `platform` isn't a field on Meeting.js yet. */}
                <p className="font-inter text-caption text-text-muted uppercase tracking-wider mb-1">
                  Platform
                </p>
                <p className="font-inter font-medium text-small text-text-heading">
                  {meeting.platform || "Not set"}
                </p>
              </div>
            </div>

            {/* TODO(backend): `meeting_link` isn't a field on Meeting.js yet. */}
            <div className="mb-4">
              <Input
                id="meeting-link"
                label="Meeting Link"
                readOnly
                value={meeting.meeting_link || "Not yet generated"}
                rightSlot={
                  meeting.meeting_link ? (
                    <button
                      type="button"
                      onClick={handleCopyLink}
                      aria-label="Copy meeting link"
                      className="hover:text-text-heading transition-colors"
                    >
                      {linkCopied ? (
                        <Check size={16} strokeWidth={2} className="text-success" />
                      ) : (
                        <Copy size={16} strokeWidth={2} />
                      )}
                    </button>
                  ) : null
                }
              />
            </div>

            {/* TODO(backend): `attendees` isn't a field on Meeting.js yet. */}
            <div>
              <p className="font-inter text-caption text-text-muted uppercase tracking-wider mb-2">
                Attendees
              </p>
              {attendees.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {attendees.map((a, i) => (
                    <div
                      key={a.id || a.email || i}
                      className="flex items-center gap-1.5 pl-1 pr-2.5 py-1 rounded-full bg-canvas-bg border border-border-subtle"
                    >
                      <span className="w-5 h-5 rounded-full bg-brand-black text-white flex items-center justify-center font-poppins font-bold text-[10px]">
                        {initialsOf(a.name || a)}
                      </span>
                      <span className="font-inter text-caption text-text-body">
                        {a.name || a}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="font-inter text-small text-text-muted">
                  No attendees on record yet.
                </p>
              )}
            </div>
          </section>

          <section className="bg-surface-white border border-border-subtle rounded-lg p-6 shadow-card">
            <h3 className="font-poppins font-semibold text-body text-text-heading mb-4">
              Meeting Timeline
            </h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <CalendarClock
                  size={16}
                  strokeWidth={2}
                  className="text-text-muted mt-0.5 shrink-0"
                />
                <div>
                  <p className="font-inter font-medium text-small text-text-heading">
                    Scheduled
                  </p>
                  <p className="font-inter text-caption text-text-muted">
                    {createdDate ? createdDate.toLocaleString() : "N/A"}
                  </p>
                </div>
              </div>
              <p className="font-inter text-caption text-text-muted italic">
                Full activity log coming soon.
              </p>
            </div>
          </section>

          <section className="bg-surface-white border border-border-subtle rounded-lg p-6 shadow-card space-y-3">
            <button
              type="button"
              onClick={() => navigate(`/admin/meetings/outcome?id=${meetingId}`)}
              className="w-full py-2.5 bg-action-bg text-action-text rounded-md font-poppins font-semibold text-small hover:opacity-90 transition-opacity"
            >
              Complete Meeting
            </button>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() =>
                  navigate(`/admin/meetings/reschedule?id=${meetingId}`)
                }
                className="flex items-center justify-center gap-1.5 py-2.5 border border-border-subtle rounded-md font-poppins font-semibold text-small text-text-heading hover:bg-canvas-bg transition-colors"
              >
                <RefreshCcw size={15} strokeWidth={2} /> Reschedule
              </button>
              <button
                type="button"
                onClick={() => setCancelOpen(true)}
                className="flex items-center justify-center gap-1.5 py-2.5 border border-error text-error rounded-md font-poppins font-semibold text-small hover:bg-error/5 transition-colors"
              >
                <XCircle size={15} strokeWidth={2} /> Cancel
              </button>
            </div>
          </section>
        </div>
      </div>

      <Modal
        isOpen={cancelOpen}
        onClose={() => setCancelOpen(false)}
        title="Cancel this meeting?"
      >
        <p className="font-inter text-small text-text-body mb-4">
          This will mark the meeting as cancelled and notify the founder. This
          can't be undone from here.
        </p>
        {cancelError && (
          <p className="font-inter text-small text-error mb-4">{cancelError}</p>
        )}
        <div className="flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={() => setCancelOpen(false)}
            disabled={cancelling}
          >
            Keep Meeting
          </Button>
          <button
            type="button"
            onClick={handleCancel}
            disabled={cancelling}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 min-h-11 rounded-md font-poppins font-semibold text-sm bg-error text-white hover:opacity-90 transition-opacity disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {cancelling ? (
              <span className="flex items-center gap-2">
                <Loader2 size={16} className="animate-spin" /> Cancelling...
              </span>
            ) : (
              "Cancel Meeting"
            )}
          </button>
        </div>
      </Modal>
    </AdminShell>
  );
}
