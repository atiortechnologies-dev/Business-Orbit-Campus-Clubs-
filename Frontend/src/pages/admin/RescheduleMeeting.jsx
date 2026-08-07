import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Rocket, Info, Loader2, Inbox, AlertCircle } from "lucide-react";
import AdminShell from "@/components/admin/AdminShell";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import {
  getMeetingById,
  rescheduleMeeting,
} from "@/api/admin/adminMeetingApi";

const REASONS = [
  "Admin unavailable",
  "Founder requested",
  "Holiday",
  "Technical issue",
  "Scheduling conflict",
  "Other",
];

// Same platform list as ScheduleMeeting.jsx — kept identical across both
// meeting-scheduling screens rather than introducing a second, slightly
// different option set for the same concept.
const PLATFORMS = [
  "Google Meet",
  "Zoom",
  "Microsoft Teams",
  "In-Person — Room 402",
];

const DURATIONS_MIN = 15;
const DURATIONS_STEP = 15;

const CALENDAR_DAYS = Array.from({ length: 31 }, (_, i) => i + 1);
const CALENDAR_START_OFFSET = 2;

function label(stage) {
  if (!stage) return "N/A";
  return stage.charAt(0).toUpperCase() + stage.slice(1);
}

export default function RescheduleMeetingPage() {
  useDocumentTitle("Reschedule Meeting — BOCC Admin");
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const meetingId = searchParams.get("id");

  const [meeting, setMeeting] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const [reason, setReason] = useState(REASONS[0]);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [duration, setDuration] = useState(30);
  const [platform, setPlatform] = useState(PLATFORMS[0]);
  const [agenda, setAgenda] = useState("");
  const [notes, setNotes] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [rescheduled, setRescheduled] = useState(false);
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
          if (payload.duration) setDuration(payload.duration);
          if (payload.platform) setPlatform(payload.platform);
          if (payload.description) setAgenda(payload.description);
          if (payload.scheduledAt) {
            const d = new Date(payload.scheduledAt);
            setDate(d.toISOString().split("T")[0]);
            setTime(d.toTimeString().slice(0, 5));
          }
        }
      } catch (err) {
        console.error("Failed to load meeting to reschedule:", err);
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

  const canSubmit =
    reason && date && time && duration && platform && !submitting;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canSubmit) return;

    try {
      setSubmitting(true);
      setSubmitError("");

      // TODO(backend): POST /admin/meetings/:id/reschedule doesn't exist
      // yet — but Meeting.js is already schema-ready for this one
      // (rescheduleHistory[], "rescheduled" status both exist), so this is
      // just a controller/route, no model change needed.
      await rescheduleMeeting(meetingId, {
        reason,
        meeting_date: date,
        meeting_time: time,
        duration: Number(duration),
        platform,
        description: agenda,
        notes,
      });

      setRescheduled(true);
      setTimeout(
        () => navigate(`/admin/meetings/detail?id=${meetingId}`),
        2000,
      );
    } catch (err) {
      console.error("Failed to reschedule meeting:", err);
      setSubmitError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to reschedule this meeting. Please try again.",
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
  const currentScheduled = meeting.scheduledAt
    ? new Date(meeting.scheduledAt)
    : null;
  const previousReschedule =
    meeting.rescheduleHistory && meeting.rescheduleHistory.length > 0
      ? meeting.rescheduleHistory[meeting.rescheduleHistory.length - 1]
      : null;

  return (
    <AdminShell>
      <div className="mb-6">
        <h1 className="font-poppins font-semibold text-page text-text-heading">
          Reschedule Meeting
        </h1>
        <p className="font-inter text-body text-text-body mt-1">
          Update the schedule — the founder is notified automatically once
          saved.
        </p>
      </div>

      {rescheduled && (
        <div className="mb-6 p-4 rounded-lg border border-success/30 bg-success/10 text-success font-inter text-small">
          Meeting rescheduled — redirecting...
        </div>
      )}
      {submitError && (
        <div className="mb-6 p-4 rounded-lg border border-error/30 bg-error/10 text-error font-inter text-small flex items-center gap-2">
          <AlertCircle size={16} className="shrink-0" /> {submitError}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: target entity recap */}
        <div className="lg:col-span-3">
          <div className="bg-surface-white border border-border-subtle rounded-lg p-6 shadow-card lg:sticky lg:top-24">
            <div className="flex items-center gap-3 pb-4 mb-4 border-b border-divider-line">
              <div className="w-11 h-11 rounded-lg bg-brand-black text-white flex items-center justify-center shrink-0">
                <Rocket size={20} strokeWidth={2} />
              </div>
              <div>
                <h3 className="font-poppins font-semibold text-body text-text-heading">
                  {startup.startup_name || startup.name || "Untitled Startup"}
                </h3>
                <p className="font-inter text-caption text-text-muted">
                  {startup._id || startup.id || meetingId}
                </p>
              </div>
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
                <dt className="font-inter text-small text-text-muted">Stage</dt>
                <dd className="font-inter font-medium text-small text-text-heading">
                  {label(meeting.stage)}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="font-inter text-small text-text-muted">Current Date</dt>
                <dd className="font-inter font-medium text-small text-text-heading">
                  {currentScheduled ? currentScheduled.toLocaleDateString() : "N/A"}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="font-inter text-small text-text-muted">Current Time</dt>
                <dd className="font-inter font-medium text-small text-text-heading">
                  {currentScheduled
                    ? currentScheduled.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "N/A"}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="font-inter text-small text-text-muted">Platform</dt>
                <dd className="font-inter font-medium text-small text-text-heading">
                  {meeting.platform || "Not set"}
                </dd>
              </div>
              <div className="flex justify-between items-center">
                <dt className="font-inter text-small text-text-muted">Status</dt>
                <dd>
                  <Badge variant="info">Scheduled</Badge>
                </dd>
              </div>
            </dl>
            {previousReschedule && (
              <p className="mt-4 pt-4 border-t border-divider-line font-inter text-caption text-text-muted italic">
                Previous schedule:{" "}
                {previousReschedule.previousDate
                  ? new Date(previousReschedule.previousDate).toLocaleString()
                  : "N/A"}
              </p>
            )}
          </div>
        </div>

        {/* Center: reschedule form */}
        <form
          onSubmit={handleSubmit}
          className="lg:col-span-5 bg-surface-white border border-border-subtle rounded-lg p-6 shadow-card space-y-4"
        >
          <div>
            <label
              htmlFor="reason"
              className="text-caption font-medium text-text-heading font-inter block mb-1"
            >
              Reason for Rescheduling <span className="text-error">*</span>
            </label>
            <select
              id="reason"
              required
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full min-h-11 rounded-md border border-border-subtle bg-surface-white text-sm text-text-body font-inter px-3 focus:outline-none focus:ring-1 focus:ring-brand-black"
            >
              {REASONS.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="meeting-date"
                className="text-caption font-medium text-text-heading font-inter block mb-1"
              >
                Meeting Date <span className="text-error">*</span>
              </label>
              <input
                id="meeting-date"
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full min-h-11 rounded-md border border-border-subtle bg-surface-white text-sm text-text-body font-inter px-3 focus:outline-none focus:ring-1 focus:ring-brand-black"
              />
            </div>
            <div>
              <label
                htmlFor="meeting-time"
                className="text-caption font-medium text-text-heading font-inter block mb-1"
              >
                Meeting Time <span className="text-error">*</span>
              </label>
              <input
                id="meeting-time"
                type="time"
                required
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full min-h-11 rounded-md border border-border-subtle bg-surface-white text-sm text-text-body font-inter px-3 focus:outline-none focus:ring-1 focus:ring-brand-black"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="duration"
                className="text-caption font-medium text-text-heading font-inter block mb-1"
              >
                Duration (minutes)
              </label>
              <input
                id="duration"
                type="number"
                min={DURATIONS_MIN}
                step={DURATIONS_STEP}
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full min-h-11 rounded-md border border-border-subtle bg-surface-white text-sm text-text-body font-inter px-3 focus:outline-none focus:ring-1 focus:ring-brand-black"
              />
            </div>
            <div>
              <label
                htmlFor="platform"
                className="text-caption font-medium text-text-heading font-inter block mb-1"
              >
                Platform
              </label>
              <select
                id="platform"
                value={platform}
                onChange={(e) => setPlatform(e.target.value)}
                className="w-full min-h-11 rounded-md border border-border-subtle bg-surface-white text-sm text-text-body font-inter px-3 focus:outline-none focus:ring-1 focus:ring-brand-black"
              >
                {PLATFORMS.map((p) => (
                  <option key={p}>{p}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label
              htmlFor="agenda"
              className="text-caption font-medium text-text-heading font-inter block mb-1"
            >
              Meeting Agenda
            </label>
            <textarea
              id="agenda"
              rows={4}
              value={agenda}
              onChange={(e) => setAgenda(e.target.value)}
              className="w-full rounded-md border border-border-subtle bg-surface-white text-sm text-text-body font-inter p-3 resize-none focus:outline-none focus:ring-1 focus:ring-brand-black"
            />
          </div>

          <div>
            <label
              htmlFor="notes"
              className="text-caption font-medium text-text-heading font-inter block mb-1"
            >
              Meeting Notes (Optional)
            </label>
            <textarea
              id="notes"
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full rounded-md border border-border-subtle bg-surface-white text-sm text-text-body font-inter p-3 resize-none focus:outline-none focus:ring-1 focus:ring-brand-black"
            />
          </div>

          <div className="flex items-start gap-2 p-3 bg-canvas-bg border-l-4 border-border-subtle rounded">
            <Info size={16} strokeWidth={2} className="text-text-muted shrink-0 mt-0.5" />
            <p className="font-inter text-small text-text-muted">
              This action automatically updates the student's dashboard and
              sends a revised calendar invitation and meeting email.
            </p>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(`/admin/meetings/detail?id=${meetingId}`)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={!canSubmit}>
              {submitting ? (
                <span className="flex items-center gap-2">
                  <Loader2 size={16} className="animate-spin" /> Updating...
                </span>
              ) : (
                "Update Meeting Schedule"
              )}
            </Button>
          </div>
        </form>

        {/* Right: decorative calendar widget — not wired to the date field,
            same as ScheduleMeeting.jsx's calendar. */}
        <div className="lg:col-span-4">
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
                <span key={i} className="font-inter text-caption text-text-muted">
                  {d}
                </span>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: CALENDAR_START_OFFSET }).map((_, i) => (
                <span key={`pad-${i}`} />
              ))}
              {CALENDAR_DAYS.map((day) => (
                <div key={day} className="relative flex items-center justify-center">
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
        </div>
      </div>
    </AdminShell>
  );
}
