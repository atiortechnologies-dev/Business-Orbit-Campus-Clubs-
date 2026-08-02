import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  ChevronRight,
  AlertCircle,
} from "lucide-react";
import AdminShell from "@/components/admin/AdminShell";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { getMeetingPrepareContext, scheduleMeeting } from "@/api/admin/adminMeetingApi";

const REVIEWERS = ["Sarah Jenkins", "Markus Vane", "Elena Rodriguez"];
const DURATIONS = ["30 minutes", "60 minutes", "90 minutes"];

// Simple static Oct 2024 grid — purely decorative
const CALENDAR_DAYS = Array.from({ length: 31 }, (_, i) => i + 1);
const CALENDAR_START_OFFSET = 2; // Oct 1 2024 was a Tuesday

export default function ScheduleMeetingPage() {
  useDocumentTitle("Schedule Review Meeting — BOCC Admin");
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const startup_id = searchParams.get("startup_id");
  const submission_id = searchParams.get("submission_id");

  const [contextData, setContextData] = useState(null);
  const [loadingContext, setLoadingContext] = useState(true);

  // Form state
  const [reviewer, setReviewer] = useState(REVIEWERS[0]);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [_duration, _setDuration] = useState(DURATIONS[1]);
  const [meetingLink, setMeetingLink] = useState("");
  const [agenda, setAgenda] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [scheduled, setScheduled] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const canSchedule = agenda.trim().length > 0 && date && time && meetingLink.trim().length > 0 && !isSubmitting;

  useEffect(() => {
    async function fetchContext() {
      if (!startup_id && !submission_id) {
        setLoadingContext(false);
        setErrorMsg("No startup_id or submission_id provided in URL.");
        return;
      }
      try {
        const res = await getMeetingPrepareContext({ startup_id, submission_id });
        setContextData(res.data.data);
      } catch (err) {
        console.error("Failed to load context", err);
        setErrorMsg("Failed to load meeting context.");
      } finally {
        setLoadingContext(false);
      }
    }
    fetchContext();
  }, [startup_id, submission_id]);

  // Ensure future dates logic for standard date picker constraint
  const today = new Date().toISOString().split("T")[0];

  async function handleSubmit(e) {
    e.preventDefault();
    if (!canSchedule || !contextData) return;
    
    setIsSubmitting(true);
    setErrorMsg("");
    setScheduled(false);

    try {
      // Create an ISO 8601 UTC date string
      const localDate = new Date(`${date}T${time}`);
      const meeting_date = localDate.toISOString();

      await scheduleMeeting({
        startup_id: contextData.startup._id,
        student_id: contextData.student._id,
        stage_submission_id: submission_id || undefined,
        meeting_date,
        agenda,
        meeting_link: meetingLink,
      });
      
      setScheduled(true);
    } catch (err) {
      console.error("Failed to schedule meeting", err);
      setErrorMsg(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to schedule meeting.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

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
      <h1 className="font-poppins font-semibold text-page text-text-heading mb-8">
        Schedule Review Meeting
      </h1>

      {scheduled && (
        <div className="mb-6 p-4 rounded-lg border border-success/30 bg-success/10 text-success font-inter text-small">
          Invitation sent — Meeting is on the calendar.
        </div>
      )}
      {errorMsg && (
        <div className="mb-6 p-4 rounded-lg border border-error/30 bg-error/15 text-error font-inter text-small flex items-center gap-2">
          <AlertCircle size={16} className="shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {loadingContext ? (
        <div className="p-4 text-text-muted">Loading meeting context...</div>
      ) : (
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
                  value={contextData?.startup?.startup_name || "Unknown"}
                  disabled
                />
                <Input
                  id="founder-name"
                  label="Primary Founder"
                  value={contextData?.student?.name || "Unknown"}
                  disabled
                />
              </div>

              <div>
                <label
                  htmlFor="reviewer"
                  className="text-caption font-medium text-text-heading font-inter block mb-1"
                >
                  Reviewer (You)
                </label>
                <select
                  id="reviewer"
                  value={reviewer}
                  onChange={(e) => setReviewer(e.target.value)}
                  className="w-full min-h-[44px] rounded-md border border-border-subtle bg-surface-white text-sm text-text-body font-inter px-3 focus:outline-none focus:ring-1 focus:ring-brand-black"
                >
                  {REVIEWERS.map((r) => (
                    <option key={r}>{r}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  id="meeting-date"
                  label="Meeting Date"
                  type="date"
                  value={date}
                  min={today}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
                <Input
                  id="meeting-time"
                  label="Meeting Time"
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-1 gap-4">
                <Input
                  id="meeting-link"
                  label="Meeting Link (Google Meet / Zoom)"
                  type="url"
                  placeholder="https://meet.google.com/..."
                  value={meetingLink}
                  onChange={(e) => setMeetingLink(e.target.value)}
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="agenda"
                  className="text-caption font-medium text-text-heading font-inter block mb-1"
                >
                  Agenda
                </label>
                <textarea
                  id="agenda"
                  value={agenda}
                  onChange={(e) => setAgenda(e.target.value)}
                  rows={5}
                  required
                  className="w-full rounded-md border border-border-subtle bg-surface-white text-sm text-text-body font-inter p-3 resize-none focus:outline-none focus:ring-1 focus:ring-brand-black"
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
                  {isSubmitting ? "Scheduling..." : "Schedule Meeting & Send Invitation"}
                </Button>
              </div>
            </form>
          </div>

          <div className="lg:col-span-5 space-y-6">
            <section className="bg-surface-white border border-border-subtle rounded-lg shadow-card overflow-hidden">
              <div className="px-6 py-4 border-b border-border-subtle bg-canvas-bg/50">
                <h3 className="font-poppins font-semibold text-body text-text-heading">
                  Context Summary
                </h3>
              </div>
              <div className="p-4 space-y-4">
                <div>
                  <p className="font-inter font-semibold text-small text-text-heading">
                    Current Stage: {contextData?.startup?.current_stage || "N/A"}
                  </p>
                  <p className="font-inter text-caption text-text-muted mt-1">
                    Industry: {contextData?.startup?.industry || "N/A"}
                  </p>
                </div>
                {contextData?.currentSubmission && (
                  <div>
                    <p className="font-inter font-semibold text-small text-text-heading">
                      Selected Submission
                    </p>
                    <p className="font-inter text-caption text-text-muted mt-1">
                      {contextData.currentSubmission.title}
                    </p>
                  </div>
                )}
                {contextData?.historicalSubmissions?.length > 0 && (
                  <div>
                    <p className="font-inter font-semibold text-small text-text-heading mb-2">
                      Recent Submissions
                    </p>
                    <div className="space-y-2">
                      {contextData.historicalSubmissions.map(sub => (
                        <div key={sub._id} className="text-caption text-text-muted bg-canvas-bg p-2 rounded">
                          {sub.title} - {sub.status}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </section>
            
            <section className="bg-surface-white border border-border-subtle rounded-lg p-6 shadow-card">
              <h3 className="font-poppins font-semibold text-body text-text-heading mb-4">
                October 2024
              </h3>
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
                        day === 11
                          ? "bg-brand-black text-white font-semibold"
                          : "text-text-body hover:bg-canvas-bg"
                      }`}
                    >
                      {day}
                    </span>
                    {day === 12 && (
                      <span className="absolute bottom-0.5 w-1 h-1 rounded-full bg-accent-neon" />
                    )}
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
