import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ChevronRight,
  Link2,
  FileText,
  DollarSign,
  AlertCircle,
} from "lucide-react";
import AdminShell from "@/components/admin/AdminShell";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import ComingSoon from "@/components/ui/ComingSoon";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import api from "@/api/axiosInstance";

const REVIEWERS = ["Sarah Jenkins", "Markus Vane", "Elena Rodriguez"];
const DURATIONS = ["30 minutes", "60 minutes", "90 minutes"];
const PLATFORMS = [
  "Google Meet",
  "Zoom",
  "Microsoft Teams",
  "In-Person — Room 402",
];

const UPCOMING_MEETINGS = [
  {
    startup: "Solaris BioTech",
    time: "10:00 – 11:00 AM",
    reviewer: "Sarah Jenkins",
  },
  {
    startup: "Quantum Fintech",
    time: "1:30 – 2:30 PM",
    reviewer: "Markus Vane",
  },
  {
    startup: "NeuralPulse AI",
    time: "Pending schedule — drafting agenda",
    current: true,
  },
  {
    startup: "GreenGrid Analytics",
    time: "4:00 – 5:00 PM",
    reviewer: "Sarah Jenkins",
  },
];

// Simple static Oct 2024 grid — no date-picker library, matches the "only
// react/vite/express" tech constraint. Purely decorative context for the
// form's date field, not wired to it (the date field is a plain text input
// like every other stub form field in this app).
const CALENDAR_DAYS = Array.from({ length: 31 }, (_, i) => i + 1);
const CALENDAR_START_OFFSET = 2; // Oct 1 2024 was a Tuesday

export default function ScheduleMeetingPage() {
  useDocumentTitle("Schedule Review Meeting — BOCC Admin");
  const navigate = useNavigate();

  const [reviewer, setReviewer] = useState(REVIEWERS[0]);
  const [date, setDate] = useState("2024-11-04");
  const [time, setTime] = useState("14:00");
  const [duration, setDuration] = useState(DURATIONS[1]);
  const [platform, setPlatform] = useState(PLATFORMS[0]);
  const [agenda, setAgenda] = useState(
    "1. Review technical audit findings\n2. Discuss OAuth2 implementation timeline\n3. Confirm Traction-stage funding eligibility\n4. Q&A",
  );
  const [scheduled, setScheduled] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const canSchedule = agenda.trim().length > 0;

  async function handleSubmit(e) {
    e.preventDefault();
    if (!canSchedule) return;
    try {
      setErrorMsg("");
      setScheduled(false);
      await api.post("/request-meeting", {
        reviewer,
        date,
        time,
        duration,
        platform,
        agenda,
      });
      setScheduled(true);
    } catch (err) {
      console.error("Failed to schedule meeting", err);
      setErrorMsg(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to schedule meeting.",
      );
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
          Invitation sent — NeuralPulse AI's review meeting is on the calendar.
        </div>
      )}
      {errorMsg && (
        <div className="mb-6 p-4 rounded-lg border border-error/30 bg-error/15 text-error font-inter text-small flex items-center gap-2">
          <AlertCircle size={16} className="shrink-0" />
          <span>{errorMsg}</span>
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
                value="NeuralPulse AI"
                disabled
              />
              <Input
                id="founder-name"
                label="Primary Founder"
                value="Dr. Aris Thorne"
                disabled
              />
            </div>

            <div>
              <label
                htmlFor="reviewer"
                className="text-caption font-medium text-text-heading font-inter block mb-1"
              >
                Reviewer
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
                onChange={(e) => setDate(e.target.value)}
              />
              <Input
                id="meeting-time"
                label="Meeting Time"
                type="time"
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
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full min-h-[44px] rounded-md border border-border-subtle bg-surface-white text-sm text-text-body font-inter px-3 focus:outline-none focus:ring-1 focus:ring-brand-black"
                >
                  {DURATIONS.map((d) => (
                    <option key={d}>{d}</option>
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
                    onChange={(e) => setPlatform(e.target.value)}
                    className="flex-1 min-h-[44px] rounded-md border border-border-subtle bg-surface-white text-sm text-text-body font-inter px-3 focus:outline-none focus:ring-1 focus:ring-brand-black"
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
                    <span className="min-h-[44px] px-3 flex items-center border border-border-subtle rounded-md text-text-muted">
                      <Link2 size={16} strokeWidth={2} />
                    </span>
                  </ComingSoon>
                </div>
              </div>
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
                Schedule Meeting &amp; Send Invitation
              </Button>
            </div>
          </form>

          <section className="bg-canvas-bg border border-border-subtle rounded-lg p-6">
            <h3 className="font-poppins font-semibold text-body text-text-heading mb-2">
              Review Protocol Reminder
            </h3>
            <p className="font-inter text-small text-text-muted mb-4">
              Confirm the founder's financials are current before finalizing any
              Traction-stage meeting.
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

        <div className="lg:col-span-5 space-y-6">
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

          <section className="bg-surface-white border border-border-subtle rounded-lg shadow-card overflow-hidden">
            <div className="px-6 py-4 border-b border-border-subtle bg-canvas-bg/50">
              <h3 className="font-poppins font-semibold text-body text-text-heading">
                Upcoming Review Meetings
              </h3>
            </div>
            <div className="divide-y divide-border-subtle">
              {UPCOMING_MEETINGS.map(
                ({ startup, time: t, reviewer: r, current }) => (
                  <div
                    key={startup}
                    className={`p-4 ${current ? "bg-canvas-bg" : ""}`}
                  >
                    <p className="font-inter font-semibold text-small text-text-heading">
                      {startup}{" "}
                      {current && <span className="text-accent-neon">●</span>}
                    </p>
                    <p className="font-inter text-caption text-text-muted">
                      {t}
                      {r ? ` · ${r}` : ""}
                    </p>
                  </div>
                ),
              )}
            </div>
          </section>
        </div>
      </div>
    </AdminShell>
  );
}
