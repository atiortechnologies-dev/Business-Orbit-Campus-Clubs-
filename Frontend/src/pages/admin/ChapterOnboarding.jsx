import { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import {
  ChevronRight,
  CheckCircle2,
  Circle,
  Users,
  GraduationCap,
  Rocket,
  CalendarPlus,
  Inbox,
  Edit,
  Eye,
  Copy,
  Share2,
  Ban,
  MapPin,
  Loader2,
} from "lucide-react";
import AdminShell from "@/components/admin/AdminShell";
import ComingSoon from "@/components/ui/ComingSoon";
import Badge from "@/components/ui/Badge";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { getChapterById } from "@/api/admin/adminChapterApi";

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

const SETUP_STEPS = [
  { label: "Chapter Created", done: true },
  { label: "Add Students", done: false },
  { label: "Invite Mentors", done: false },
  { label: "Approve Startup", done: false },
  { label: "Create Event", done: false },
  { label: "Chapter Ready", done: false },
];
const SETUP_PROGRESS = Math.round(
  (SETUP_STEPS.filter((s) => s.done).length / SETUP_STEPS.length) * 100,
);

const NEXT_STEPS = [
  {
    icon: Users,
    title: "Invite Students",
    description:
      "Start onboarding students to this chapter using the official registration link.",
    cta: "Invite Students",
  },
  {
    icon: GraduationCap,
    title: "Add Mentors",
    description:
      "Assign experienced mentors to guide students through the startup cycle.",
    cta: "Manage Mentors",
  },
  {
    icon: Rocket,
    title: "Review Startups",
    description:
      "No submissions yet. You can view the queue once students submit ideas.",
    cta: "View Startup Queue",
  },
  {
    icon: CalendarPlus,
    title: "Create Event",
    description: "Launch your first activity or workshop to kick off the program.",
    cta: "Create Event",
  },
];

export default function ChapterOnboardingPage() {
  useDocumentTitle("Chapter Initialized — BOCC Admin");
  const { chapterId } = useParams();
  const location = useLocation();

  const [chapterData, setChapterData] = useState(location.state?.chapter || null);
  const [status, setStatus] = useState(
    location.state?.chapter ? "ready" : "loading",
  );
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (location.state?.chapter) return;
    let cancelled = false;
    (async () => {
      try {
        // No GET /api/admin/chapters/:id endpoint exists yet, so arriving
        // here without navigation state (e.g. a page refresh) always
        // fails today. Once it exists, a successful response fills this
        // page in exactly the same way the just-created flow does.
        const res = await getChapterById(chapterId);
        const data = res?.data || res;
        if (!cancelled) {
          setChapterData(data);
          setStatus("ready");
        }
      } catch (err) {
        console.error("Failed to load chapter:", err);
        if (!cancelled) setStatus("error");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [chapterId, location.state]);

  if (status === "loading") {
    return (
      <AdminShell>
        <div className="min-h-[50vh] flex items-center justify-center">
          <Loader2 size={28} className="animate-spin text-text-muted" />
        </div>
      </AdminShell>
    );
  }

  if (status === "error") {
    return (
      <AdminShell>
        <div className="min-h-[50vh] flex flex-col items-center justify-center text-center gap-3">
          <Inbox size={32} className="text-text-muted" />
          <p className="font-poppins font-semibold text-card text-text-heading">
            Couldn't load this chapter
          </p>
          <Link
            to="/admin/chapters"
            className="font-poppins font-semibold text-small text-text-heading hover:opacity-80 transition-opacity"
          >
            Back to Chapters
          </Link>
        </div>
      </AdminShell>
    );
  }

  const chapter = {
    name: chapterData?.name || "New Chapter",
    institution: chapterData?.institution || "—",
    lead: chapterData?.lead_name || "—",
    leadEmail: chapterData?.lead_email || "—",
    location:
      [chapterData?.city, chapterData?.state || chapterData?.country]
        .filter(Boolean)
        .join(", ") || "—",
  };

  function handleCopyInvitation() {
    const link = `${window.location.origin}/signup/student?chapter=${chapterId}`;
    navigator.clipboard
      ?.writeText(link)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch((err) => console.error("Failed to copy invitation link:", err));
  }

  return (
    <AdminShell>
      <nav className="mb-6 flex items-center gap-2 text-text-muted font-inter font-normal text-small">
        <Link
          to="/admin/chapters"
          className="hover:text-text-heading transition-colors"
        >
          Chapters
        </Link>
        <ChevronRight size={14} strokeWidth={2} />
        <span className="text-text-heading font-semibold">
          Chapter Initialized
        </span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: chapter profile */}
        <div className="lg:col-span-3">
          <div className="bg-surface-white border border-border-subtle rounded-lg p-6 shadow-card lg:sticky lg:top-24 flex flex-col items-center text-center">
            <div className="w-20 h-20 rounded-xl bg-canvas-bg border border-border-subtle flex items-center justify-center font-poppins font-bold text-section text-text-heading mb-4">
              {initialsOf(chapter.name)}
            </div>
            <Badge variant="neutral" className="mb-2">
              New
            </Badge>
            <h1 className="font-poppins font-semibold text-card text-text-heading">
              {chapter.name}
            </h1>
            <p className="font-inter text-small text-text-muted mb-4">
              {chapter.institution}
            </p>
            <div className="w-full border-t border-divider-line pt-4 space-y-3 text-left">
              <div>
                <p className="font-inter text-caption text-text-muted uppercase tracking-wider mb-1">
                  Chapter Lead
                </p>
                <p className="font-inter text-small text-text-heading">
                  {chapter.lead}
                </p>
              </div>
              <div>
                <p className="font-inter text-caption text-text-muted uppercase tracking-wider mb-1">
                  Email
                </p>
                <p className="font-inter text-small text-text-heading truncate">
                  {chapter.leadEmail}
                </p>
              </div>
              <div>
                <p className="font-inter text-caption text-text-muted uppercase tracking-wider mb-1">
                  Location
                </p>
                <p className="flex items-center gap-1.5 font-inter text-small text-text-heading">
                  <MapPin size={14} strokeWidth={2} className="text-text-muted" />
                  {chapter.location}
                </p>
              </div>
              <div>
                <p className="font-inter text-caption text-text-muted uppercase tracking-wider mb-1">
                  Created
                </p>
                <p className="font-inter text-small text-text-heading">
                  {new Date().toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Center: onboarding content */}
        <div className="lg:col-span-6 space-y-6">
          {/* Success message */}
          <div className="bg-surface-white border border-border-subtle rounded-lg p-6 shadow-card flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-success/15 flex items-center justify-center shrink-0">
              <CheckCircle2 size={22} strokeWidth={2} className="text-success" />
            </div>
            <div>
              <h2 className="font-poppins font-semibold text-card text-text-heading mb-1">
                Chapter Created Successfully
              </h2>
              <p className="font-inter text-small text-text-muted">
                Your chapter has been initialized. Complete the remaining
                setup to begin onboarding members.
              </p>
            </div>
          </div>

          {/* Setup progress */}
          <div className="bg-surface-white border border-border-subtle rounded-lg p-6 shadow-card">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-inter font-semibold text-caption text-text-muted uppercase tracking-widest">
                Setup Progress
              </h3>
              <span className="font-inter font-semibold text-small text-text-heading">
                {SETUP_PROGRESS}%
              </span>
            </div>
            <div className="w-full h-2 bg-canvas-bg rounded-full overflow-hidden mb-6">
              <div
                className="bg-brand-black h-full rounded-full"
                style={{ width: `${SETUP_PROGRESS}%` }}
              />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {SETUP_STEPS.map(({ label, done }) => (
                <div
                  key={label}
                  className={`flex items-center gap-2 ${done ? "text-text-heading" : "text-text-muted"}`}
                >
                  {done ? (
                    <CheckCircle2 size={16} strokeWidth={2} />
                  ) : (
                    <Circle size={16} strokeWidth={2} />
                  )}
                  <span className="font-inter text-small">{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Empty state */}
          <div className="bg-surface-white border border-border-subtle rounded-lg shadow-card flex flex-col items-center text-center py-16 px-6">
            <div className="w-16 h-16 rounded-full bg-canvas-bg border border-border-subtle flex items-center justify-center mb-4">
              <Inbox size={26} strokeWidth={1.75} className="text-text-muted" />
            </div>
            <p className="font-inter text-body text-text-muted max-w-md">
              This chapter is currently empty. Students, startups and events
              will appear here once onboarding begins.
            </p>
          </div>

          {/* Next steps */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {NEXT_STEPS.map(({ icon: Icon, title, description, cta }) => (
              <div
                key={title}
                className="bg-surface-white border border-border-subtle rounded-lg p-6 shadow-card flex flex-col"
              >
                <div className="w-9 h-9 rounded-lg bg-canvas-bg border border-border-subtle flex items-center justify-center mb-3">
                  <Icon size={16} strokeWidth={2} className="text-text-heading" />
                </div>
                <h4 className="font-poppins font-semibold text-body text-text-heading mb-1">
                  {title}
                </h4>
                <p className="font-inter text-small text-text-muted mb-5 flex-1">
                  {description}
                </p>
                <ComingSoon label={cta} position="top" inline>
                  <span className="w-full flex items-center justify-center py-2.5 border border-border-subtle rounded-lg font-poppins font-semibold text-small text-text-heading">
                    {cta}
                  </span>
                </ComingSoon>
              </div>
            ))}
          </div>

          {/* Chapter activity */}
          <div className="bg-surface-white border border-border-subtle rounded-lg p-6 shadow-card">
            <h3 className="font-inter font-semibold text-caption text-text-muted uppercase tracking-widest mb-4">
              Chapter Activity
            </h3>
            <div className="flex items-center justify-center py-10 px-6 border border-dashed border-border-subtle rounded-lg">
              <p className="font-inter text-small text-text-muted text-center max-w-sm">
                No activity has been recorded yet. Recent approvals, student
                registrations, startup submissions, and events will appear
                here.
              </p>
            </div>
          </div>
        </div>

        {/* Right: quick actions + status */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-surface-white border border-border-subtle rounded-lg p-6 shadow-card">
            <h3 className="font-poppins font-semibold text-body text-text-heading mb-6">
              Quick Actions
            </h3>
            <div className="space-y-3">
              <ComingSoon label="Edit Chapter" position="top">
                <span className="flex items-center justify-between w-full p-3 border border-border-subtle rounded-lg font-poppins font-semibold text-small text-text-heading">
                  Edit Chapter <Edit size={16} strokeWidth={2} />
                </span>
              </ComingSoon>
              <Link
                to={`/admin/chapters/detail/${chapterId}`}
                className="flex items-center justify-between w-full p-3 border border-border-subtle rounded-lg font-poppins font-semibold text-small text-text-heading hover:bg-canvas-bg transition-colors"
              >
                View Details <Eye size={16} strokeWidth={2} />
              </Link>
              <button
                type="button"
                onClick={handleCopyInvitation}
                className="flex items-center justify-between w-full p-3 border border-border-subtle rounded-lg font-poppins font-semibold text-small text-text-heading hover:bg-canvas-bg transition-colors"
              >
                {copied ? "Copied!" : "Copy Invitation"}
                <Copy size={16} strokeWidth={2} />
              </button>
              <ComingSoon label="Share Registration" position="top">
                <span className="flex items-center justify-between w-full p-3 border border-border-subtle rounded-lg font-poppins font-semibold text-small text-text-heading">
                  Share Registration <Share2 size={16} strokeWidth={2} />
                </span>
              </ComingSoon>
              <div className="pt-3 mt-1 border-t border-divider-line">
                <ComingSoon label="Deactivate Chapter" position="top">
                  <span className="flex items-center justify-between w-full p-3 text-error rounded-lg font-poppins font-semibold text-small">
                    Deactivate Chapter <Ban size={16} strokeWidth={2} />
                  </span>
                </ComingSoon>
              </div>
            </div>
          </div>

          <div className="bg-canvas-bg border border-border-subtle rounded-lg p-6">
            <h3 className="font-inter font-semibold text-caption text-text-muted uppercase tracking-widest mb-3">
              System Status
            </h3>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-text-muted" />
              <span className="font-inter text-small text-text-body">
                Awaiting Onboarding
              </span>
            </div>
            <p className="font-inter text-caption text-text-muted leading-relaxed">
              Chapter ID: {chapterId}
              <br />
              Auth: Restricted Access
            </p>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
