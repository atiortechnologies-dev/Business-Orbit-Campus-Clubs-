import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  ChevronRight,
  Link2,
  FileText,
  DollarSign,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import AdminShell from "@/components/admin/AdminShell";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import ComingSoon from "@/components/ui/ComingSoon";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import {
  getMeetingPrepareContext,
  scheduleMeeting,
} from "@/api/admin/adminMeetingApi";

const STAGES = [
  { value: "ideation", label: "Ideation" },
  { value: "validation", label: "Validation" },
  { value: "mvp", label: "MVP" },
  { value: "incubation", label: "Incubation" },
  { value: "traction", label: "Traction" },
  { value: "launch", label: "Launch" },
];

const DURATIONS = [
  { label: "30 minutes", value: 30 },
  { label: "60 minutes", value: 60 },
  { label: "90 minutes", value: 90 },
];

const PLATFORMS = [
  "Google Meet",
  "Zoom",
  "Microsoft Teams",
  "In-Person — Room 402",
];

const CALENDAR_DAYS = Array.from({ length: 31 }, (_, i) => i + 1);
const CALENDAR_START_OFFSET = 2;

export default function ScheduleMeetingPage() {
  useDocumentTitle("Schedule Review Meeting — BOCC Admin");
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const submissionId =
    searchParams.get("submissionId") || searchParams.get("id");
  const startupIdParam = searchParams.get("startupId");

  const [loading, setLoading] = useState(true);
  const [contextData, setContextData] = useState(null);
  const [notApprovedError, setNotApprovedError] = useState("");

  // Form State
  const [reviewerId, setReviewerId] = useState("");
  const [stage, setStage] = useState("ideation");
  const [title, setTitle] = useState("");
  const [date, setDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  });
  const [time, setTime] = useState("14:00");
  const [duration, setDuration] = useState(DURATIONS[1].value);
  const [platform, setPlatform] = useState(PLATFORMS[0]);
  const [description, setDescription] = useState(
    "1. Review technical audit findings\n2. Discuss implementation timeline\n3. Confirm stage eligibility\n4. Q&A",
  );

  const [submitting, setSubmitting] = useState(false);
  const [scheduled, setScheduled] = useState(false);

  useEffect(() => {
    async function loadContext() {
      try {
        setLoading(true);
        setNotApprovedError("");
        const res = await getMeetingPrepareContext({
          submissionId,
          startupId: startupIdParam,
        });
        const data = res?.data || res;
        setContextData(data);

        if (data?.startup?.stage) {
          setStage(data.startup.stage);
        }
        if (data?.startup?.name) {
          setTitle(`Stage Review: ${data.startup.name}`);
        }

        if (data?.reviewers?.length > 0) {
          setReviewerId(data.reviewers[0].id || data.reviewers[0]._id);
        }
      } catch (err) {
        console.error("Failed to load scheduling context:", err);
        setNotApprovedError(
          err?.response?.data?.message ||
            "Meetings can only be scheduled for approved startup ideas.",
        );
      } finally {
        setLoading(false);
      }
    }

    loadContext();
  }, [submissionId, startupIdParam]);

  const canSchedule =
    description.trim().length > 0 && !submitting && !notApprovedError;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const resolvedStartupId =
      contextData?.startup?.id || contextData?.startup?._id || startupIdParam;

    if (!canSchedule || !resolvedStartupId) return;

    try {
      setSubmitting(true);

      await scheduleMeeting({
        startup_id: resolvedStartupId,
        reviewer_id: reviewerId,
        stage,
        title: title || `Stage Review: ${contextData?.startup?.name}`,
        meeting_date: date,
        meeting_time: time,
        duration: Number(duration),
        platform,
        description,
      });

      setScheduled(true);
      setTimeout(() => navigate("/admin/reviews"), 2000);
    } catch (err) {
      console.error("Failed to schedule meeting:", err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <AdminShell>
        <div className="flex justify-center py-20">
          <Loader2 size={32} className="animate-spin text-text-muted" />
        </div>
      </AdminShell>
    );
  }

  const startup = contextData?.startup || {};
  const reviewers = contextData?.reviewers || [];
  const upcomingMeetings = contextData?.upcomingMeetings || [];

  return (
    <AdminShell>
      <nav className="mb-6 flex items-center gap-2 text-text-muted font-inter text-small">
        <Link
          to="/admin/reviews"
          className="hover:text-text-heading transition-colors"
        >
          Startup Reviews
        </Link>
        <ChevronRight size={14} strokeWidth={2} />
        <span>Review Queue</span>
        <ChevronRight size={14} strokeWidth={2} />
        <span className="text-text-heading font-semibold">
          Schedule Review Meeting
        </span>
      </nav>

      <div className="mb-8">
        <h1 className="font-poppins font-semibold text-page text-text-heading">
          Schedule Review Meeting
        </h1>
        <p className="font-inter text-body text-text-body mt-1">
          Configure session details and invite the founding team for a
          performance review.
        </p>
      </div>

      {notApprovedError && (
        <div className="mb-6 p-4 rounded-lg border border-error/30 bg-error/10 text-error font-inter text-small flex items-center gap-3">
          <AlertTriangle size={20} className="shrink-0" />
          <div>
            <p className="font-poppins font-semibold">Approval Required</p>
            <p className="mt-0.5">{notApprovedError}</p>
          </div>
        </div>
      )}

      {scheduled && (
        <div className="mb-6 p-4 rounded-lg border border-success/30 bg-success/10 text-success font-inter text-small">
          Invitation sent — {startup.name}'s review meeting is scheduled!
          Redirecting...
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 space-y-6">
          <form
            onSubmit={handleSubmit}
            className="bg-surface-white border border-border-subtle rounded-lg p-6 shadow-card space-y-4"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                id="startup-name"
                label="Startup Name"
                value={startup.name || "N/A"}
                disabled
              />
              <Input
                id="founder-name"
                label="Primary Founder"
                value={startup.founder || "N/A"}
                disabled
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="stage"
                  className="text-caption font-medium text-text-heading font-inter block mb-1"
                >
                  Startup Stage
                </label>
                <select
                  id="stage"
                  value={stage}
                  disabled={!!notApprovedError}
                  onChange={(e) => setStage(e.target.value)}
                  className="w-full min-h-11 rounded-md border border-border-subtle bg-surface-white text-sm text-text-body font-inter px-3 focus:outline-none focus:ring-1 focus:ring-brand-black disabled:opacity-50"
                >
                  {STAGES.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="reviewer"
                  className="text-caption font-medium text-text-heading font-inter block mb-1"
                >
                  Reviewer (Host)
                </label>
                <select
                  id="reviewer"
                  value={reviewerId}
                  disabled={!!notApprovedError}
                  onChange={(e) => setReviewerId(e.target.value)}
                  className="w-full min-h-11 rounded-md border border-border-subtle bg-surface-white text-sm text-text-body font-inter px-3 focus:outline-none focus:ring-1 focus:ring-brand-black disabled:opacity-50"
                >
                  {reviewers.map((r) => (
                    <option key={r.id || r._id} value={r.id || r._id}>
                      {r.name || r.full_name} ({r.role})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <Input
              id="title"
              label="Meeting Title"
              placeholder="e.g. Stage Review Meeting"
              value={title}
              disabled={!!notApprovedError}
              onChange={(e) => setTitle(e.target.value)}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                id="meeting-date"
                label="Meeting Date"
                type="date"
                disabled={!!notApprovedError}
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
              <Input
                id="meeting-time"
                label="Meeting Time"
                type="time"
                disabled={!!notApprovedError}
                value={time}
                onChange={(e) => setTime(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="duration"
                  className="text-caption font-medium text-text-heading font-inter block mb-1"
                >
                  Duration
                </label>
                <select
                  id="duration"
                  value={duration}
                  disabled={!!notApprovedError}
                  onChange={(e) => setDuration(Number(e.target.value))}
                  className="w-full min-h-11 rounded-md border border-border-subtle bg-surface-white text-sm text-text-body font-inter px-3 focus:outline-none focus:ring-1 focus:ring-brand-black disabled:opacity-50"
                >
                  {DURATIONS.map((d) => (
                    <option key={d.value} value={d.value}>
                      {d.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label
                  htmlFor="platform"
                  className="text-caption font-medium text-text-heading font-inter block mb-1"
                >
                  Platform
                </label>
                <div className="flex gap-2">
                  <select
                    id="platform"
                    value={platform}
                    disabled={!!notApprovedError}
                    onChange={(e) => setPlatform(e.target.value)}
                    className="flex-1 min-h-11 rounded-md border border-border-subtle bg-surface-white text-sm text-text-body font-inter px-3 focus:outline-none focus:ring-1 focus:ring-brand-black disabled:opacity-50"
                  >
                    {PLATFORMS.map((p) => (
                      <option key={p}>{p}</option>
                    ))}
                  </select>
                  <ComingSoon
                    label="Generate Meeting Link"
                    position="top"
                    inline
                  >
                    <span className="min-h-11 px-3 flex items-center border border-border-subtle rounded-md text-text-muted">
                      <Link2 size={16} strokeWidth={2} />
                    </span>
                  </ComingSoon>
                </div>
              </div>
            </div>

            <div>
              <label
                htmlFor="description"
                className="text-caption font-medium text-text-heading font-inter block mb-1"
              >
                Agenda / Description
              </label>
              <textarea
                id="description"
                value={description}
                disabled={!!notApprovedError}
                onChange={(e) => setDescription(e.target.value)}
                rows={5}
                className="w-full rounded-md border border-border-subtle bg-surface-white text-sm text-text-body font-inter p-3 resize-none focus:outline-none focus:ring-1 focus:ring-brand-black disabled:opacity-50"
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/admin/reviews")}
              >
                Cancel
              </Button>
              <Button type="submit" variant="primary" disabled={!canSchedule}>
                {submitting ? (
                  <span className="flex items-center gap-2">
                    <Loader2 size={16} className="animate-spin" /> Scheduling...
                  </span>
                ) : (
                  "Schedule Meeting & Send Invitation"
                )}
              </Button>
            </div>
          </form>

          <section className="bg-canvas-bg border border-border-subtle rounded-lg p-6">
            <h3 className="font-poppins font-semibold text-body text-text-heading mb-2">
              Review Protocol Reminder
            </h3>
            <p className="font-inter text-small text-text-muted mb-4">
              Confirm the founder's deliverables are reviewed before finalizing
              any meeting.
            </p>
            <div className="flex gap-2">
              <ComingSoon label="View Protocol Docs" position="top" inline>
                <span className="flex items-center gap-1.5 px-3 py-2 bg-surface-white border border-border-subtle rounded-md font-inter font-medium text-caption text-text-heading">
                  <FileText size={14} strokeWidth={2} /> View Protocol Docs
                </span>
              </ComingSoon>
              <ComingSoon label="Check Financials" position="top" inline>
                <span className="flex items-center gap-1.5 px-3 py-2 bg-surface-white border border-border-subtle rounded-md font-inter font-medium text-caption text-text-heading">
                  <DollarSign size={14} strokeWidth={2} /> Check Financials
                </span>
              </ComingSoon>
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-5 space-y-6">
          <section className="bg-surface-white border border-border-subtle rounded-lg p-6 shadow-card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-poppins font-semibold text-body text-text-heading">
                Availability Calendar
              </h3>
              <span className="font-inter text-caption text-text-muted">
                Current Month
              </span>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center mb-2">
              {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
                <span
                  key={i}
                  className="font-inter text-caption text-text-muted"
                >
                  {d}
                </span>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: CALENDAR_START_OFFSET }).map((_, i) => (
                <span key={`pad-${i}`} />
              ))}
              {CALENDAR_DAYS.map((day) => (
                <div
                  key={day}
                  className="relative flex items-center justify-center"
                >
                  <span
                    className={`w-8 h-8 flex items-center justify-center rounded-full font-inter text-small ${
                      day === new Date().getDate()
                        ? "bg-brand-black text-white font-semibold"
                        : "text-text-body hover:bg-canvas-bg"
                    }`}
                  >
                    {day}
                  </span>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-surface-white border border-border-subtle rounded-lg shadow-card overflow-hidden">
            <div className="px-6 py-4 border-b border-border-subtle bg-canvas-bg/50">
              <h3 className="font-poppins font-semibold text-body text-text-heading">
                Upcoming Review Meetings
              </h3>
            </div>
            <div className="divide-y divide-border-subtle">
              {upcomingMeetings.length > 0 ? (
                upcomingMeetings.map((m) => (
                  <div key={m.id || m._id} className="p-4">
                    <p className="font-inter font-semibold text-small text-text-heading">
                      {m.startup}
                    </p>
                    <p className="font-inter text-caption text-text-muted">
                      {m.date} at {m.time} · {m.reviewer}
                    </p>
                  </div>
                ))
              ) : (
                <div className="p-4 font-inter text-caption text-text-muted">
                  No upcoming meetings scheduled.
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </AdminShell>
  );
}
