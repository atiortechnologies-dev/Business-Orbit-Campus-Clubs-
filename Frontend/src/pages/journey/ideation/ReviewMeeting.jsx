import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Video,
  ListChecks,
  CalendarCheck,
  ChevronRight,
  User,
  Loader2,
  AlertCircle,
  ExternalLink,
  Clock,
} from "lucide-react";
import DashboardShell from "@/components/dashboard/DashboardShell";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { getStudentMeetingDetails } from "@/api/startup/meetingApi";

export default function IdeationReviewMeetingPage() {
  useDocumentTitle("Review Meeting — BOCC");

  const [loading, setLoading] = useState(true);
  const [meetingData, setMeetingData] = useState(null);
  const [isApproved, setIsApproved] = useState(false);
  const [checklist, setChecklist] = useState({
    review: false,
    questions: false,
  });

  useEffect(() => {
    async function fetchMeeting() {
      try {
        setLoading(true);
        const res = await getStudentMeetingDetails();
        const resData = res?.data || res;

        setIsApproved(resData?.isApproved || false);
        setMeetingData(resData?.meeting || null);
      } catch (err) {
        console.error("Failed to load meeting details:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchMeeting();
  }, []);

  const toggleCheck = (item) =>
    setChecklist((prev) => ({ ...prev, [item]: !prev[item] }));

  if (loading) {
    return (
      <DashboardShell pageId="ideation-review-meeting">
        <div className="flex justify-center py-20">
          <Loader2 size={32} className="animate-spin text-text-muted" />
        </div>
      </DashboardShell>
    );
  }

  // Case 1: Stage Submission is not yet approved
  if (!isApproved) {
    return (
      <DashboardShell pageId="ideation-review-meeting">
        <nav className="mb-2 flex items-center gap-2 text-text-muted font-inter font-normal text-small">
          <Link
            to="/dashboard"
            className="hover:text-text-heading transition-colors"
          >
            Dashboard
          </Link>
          <ChevronRight size={14} strokeWidth={2} />
          <Link
            to="/build-startup/journey/ideation"
            className="hover:text-text-heading transition-colors"
          >
            Ideation
          </Link>
          <ChevronRight size={14} strokeWidth={2} />
          <span className="text-text-heading font-semibold">
            Review Meeting
          </span>
        </nav>

        <h1 className="font-poppins font-semibold text-page text-text-heading mb-1">
          Review Meeting
        </h1>

        <div className="mt-8 p-6 bg-surface-white border border-border-subtle rounded-lg shadow-card max-w-2xl text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-warning/10 text-warning mx-auto flex items-center justify-center">
            <AlertCircle size={24} />
          </div>
          <h2 className="font-poppins font-semibold text-section text-text-heading">
            Meeting Locked
          </h2>
          <p className="font-inter text-body text-text-body">
            Your stage submission must be reviewed and approved by the BOCC
            Admin team before a review meeting can be scheduled.
          </p>
          <div className="pt-2">
            <Link
              to="/build-startup/journey/ideation"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-black text-white rounded-md font-poppins font-semibold text-small hover:opacity-90 transition-opacity"
            >
              View Submission Status
            </Link>
          </div>
        </div>
      </DashboardShell>
    );
  }

  // Case 2: Approved, but admin hasn't scheduled a meeting yet
  if (isApproved && !meetingData) {
    return (
      <DashboardShell pageId="ideation-review-meeting">
        <nav className="mb-2 flex items-center gap-2 text-text-muted font-inter font-normal text-small">
          <Link
            to="/dashboard"
            className="hover:text-text-heading transition-colors"
          >
            Dashboard
          </Link>
          <ChevronRight size={14} strokeWidth={2} />
          <Link
            to="/build-startup/journey/ideation"
            className="hover:text-text-heading transition-colors"
          >
            Ideation
          </Link>
          <ChevronRight size={14} strokeWidth={2} />
          <span className="text-text-heading font-semibold">
            Review Meeting
          </span>
        </nav>

        <h1 className="font-poppins font-semibold text-page text-text-heading mb-1">
          Review Meeting
        </h1>

        <div className="mt-8 p-6 bg-surface-white border border-border-subtle rounded-lg shadow-card max-w-2xl space-y-4">
          <div className="flex items-center gap-3 text-info bg-info/10 p-4 rounded-lg border border-info/20">
            <Clock size={20} className="shrink-0" />
            <div>
              <p className="font-poppins font-semibold text-small">
                Stage Submission Approved!
              </p>
              <p className="font-inter text-caption text-text-body mt-0.5">
                Your idea has been approved. The admin team is currently setting
                up your review meeting schedule. Please check back shortly.
              </p>
            </div>
          </div>
        </div>
      </DashboardShell>
    );
  }

  // Safely parse Date & Time from scheduledAt or fallback meetingDate
  const dateSource = meetingData.scheduledAt || meetingData.meetingDate;
  const meetingDateObj = dateSource ? new Date(dateSource) : new Date();
  const isValidDate = !isNaN(meetingDateObj.getTime());

  const monthStr = isValidDate
    ? meetingDateObj.toLocaleString("default", { month: "short" }).toUpperCase()
    : "TBD";
  const dayStr = isValidDate ? meetingDateObj.getDate() : "--";
  const timeStr = isValidDate
    ? meetingDateObj.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "Time TBD";

  return (
    <DashboardShell pageId="ideation-review-meeting">
      <nav className="mb-2 flex items-center gap-2 text-text-muted font-inter font-normal text-small">
        <Link
          to="/dashboard"
          className="hover:text-text-heading transition-colors"
        >
          Dashboard
        </Link>
        <ChevronRight size={14} strokeWidth={2} />
        <Link
          to="/build-startup/journey/ideation"
          className="hover:text-text-heading transition-colors"
        >
          Ideation
        </Link>
        <ChevronRight size={14} strokeWidth={2} />
        <span className="text-text-heading font-semibold">Review Meeting</span>
      </nav>

      <h1 className="font-poppins font-semibold text-page text-text-heading mb-1">
        Review Meeting
      </h1>
      <p className="font-inter text-body text-text-body mb-8">
        Finalize your Stage 1 progress with your assigned reviewer.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Meeting Overview Card */}
        <div className="lg:col-span-5 bg-surface-white border border-border-subtle rounded-lg shadow-card p-6 flex flex-col gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-lg bg-brand-black flex flex-col items-center justify-center text-white shrink-0">
              <span className="font-inter text-caption uppercase">
                {monthStr}
              </span>
              <span className="font-poppins font-bold text-section leading-none">
                {dayStr}
              </span>
            </div>
            <div>
              <p className="font-poppins font-semibold text-card text-text-heading">
                {timeStr}
              </p>
              <p className="font-inter text-small text-text-muted">
                Duration:{" "}
                {meetingData.duration
                  ? `${meetingData.duration} mins`
                  : "30 mins"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-4 border-t border-divider-line">
            <div className="w-10 h-10 rounded-full bg-canvas-bg border border-border-subtle flex items-center justify-center shrink-0">
              <User size={18} strokeWidth={2} className="text-text-muted" />
            </div>
            <div>
              <p className="font-inter text-caption text-text-muted uppercase tracking-wider">
                Assigned Reviewer
              </p>
              <p className="font-poppins font-semibold text-body text-text-heading">
                {meetingData.reviewer?.name || "BOCC Reviewer"}
              </p>
              <p className="flex items-center gap-1.5 font-inter text-small text-text-muted mt-0.5">
                <Video size={14} strokeWidth={2} />{" "}
                {meetingData.platform || "Online Session"}
              </p>
            </div>
          </div>

          {meetingData.meetingLink && (
            <div className="pt-2">
              <a
                href={
                  meetingData.meetingLink.startsWith("http")
                    ? meetingData.meetingLink
                    : `https://${meetingData.meetingLink}`
                }
                target="_blank"
                rel="noreferrer"
                className="w-full flex items-center justify-center gap-2 bg-action-bg text-action-text py-3 rounded-md hover:opacity-90 active:scale-[0.98] transition-all font-poppins font-semibold text-small"
              >
                <span>Join Meeting Session</span>
                <ExternalLink size={16} />
              </a>
            </div>
          )}
        </div>

        {/* Right Section: Agenda & Prep Checklist */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-surface-white border border-border-subtle rounded-lg shadow-card p-6">
            <div className="flex items-center gap-2 mb-4">
              <ListChecks
                size={18}
                strokeWidth={2}
                className="text-text-body"
              />
              <h3 className="font-poppins font-semibold text-body text-text-heading">
                Agenda
              </h3>
            </div>
            <div className="space-y-4">
              {meetingData.agenda && meetingData.agenda.length > 0 ? (
                meetingData.agenda.map((item, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="w-6 h-6 rounded-full bg-canvas-bg border border-border-subtle flex items-center justify-center shrink-0 font-inter text-caption text-text-muted">
                      {String(i + 1).padStart(2, "0")}
                    </div>
                    <div>
                      <p className="font-inter text-small text-text-heading leading-relaxed">
                        {item}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="font-inter text-small text-text-muted">
                  No specific agenda provided.
                </p>
              )}
            </div>
          </div>

          <div className="bg-surface-white border border-border-subtle rounded-lg shadow-card p-6">
            <h3 className="font-poppins font-semibold text-body text-text-heading mb-4">
              Prep Checklist
            </h3>
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={checklist.review}
                  onChange={() => toggleCheck("review")}
                  className="w-4 h-4 accent-brand-black"
                />
                <span
                  className={`font-inter text-small ${
                    checklist.review
                      ? "text-text-muted line-through"
                      : "text-text-body"
                  }`}
                >
                  Review your submission details
                </span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={checklist.questions}
                  onChange={() => toggleCheck("questions")}
                  className="w-4 h-4 accent-brand-black"
                />
                <span
                  className={`font-inter text-small ${
                    checklist.questions
                      ? "text-text-muted line-through"
                      : "text-text-body"
                  }`}
                >
                  Prepare questions for your reviewer
                </span>
              </label>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-info/10 border border-info/30 rounded-lg p-4">
            <CalendarCheck
              size={20}
              strokeWidth={2}
              className="text-info shrink-0"
            />
            <p className="font-inter text-small text-text-body">
              Meeting details and invitations have been sent to your student
              email.
            </p>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
