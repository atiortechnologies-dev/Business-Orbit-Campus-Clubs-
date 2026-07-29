import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Sparkles,
  ArrowLeft,
  Users,
  Rocket,
  GraduationCap,
  CalendarDays,
  Clock3,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { getMyChapter, getChapterStats } from "@/api/auth/studentChapterApi";

export default function OnboardingWelcomePage() {
  useDocumentTitle("Welcome to Your Chapter — BOCC");
  const navigate = useNavigate();

  // Component States
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [chapter, setChapter] = useState(null);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchChapterAndStats = async () => {
      try {
        setLoading(true);
        setError(null);

        // 1. Fetch Assigned Chapter Details via Axios
        const chapterRes = await getMyChapter();
        const chapterData = chapterRes.data;
        setChapter(chapterData);

        // 2. Fetch Chapter Stats if chapterId exists
        if (chapterData?.chapterId) {
          const statsRes = await getChapterStats(chapterData.chapterId);
          setStats(statsRes.data);
        }
      } catch (err) {
        setError(err.message || "An unexpected error occurred.");
      } finally {
        setLoading(false);
      }
    };

    fetchChapterAndStats();
  }, []);

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-text-muted mb-2" />
        <p className="font-inter text-small text-text-muted">
          Loading chapter details...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh] px-4">
        <AlertCircle className="w-10 h-10 text-error mb-2" />
        <p className="font-inter text-body text-text-heading font-medium mb-4">
          {error}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="bg-action-bg text-action-text font-poppins text-small px-4 py-2 rounded-md"
        >
          Retry
        </button>
      </div>
    );
  }

  const statItems = [
    { icon: Users, label: "Members", value: stats?.totalMembers ?? "—" },
    {
      icon: Rocket,
      label: "Active Startups",
      value: stats?.activeStartups ?? "—",
    },
    { icon: GraduationCap, label: "Mentors", value: stats?.mentors ?? "—" },
    {
      icon: CalendarDays,
      label: "Events Conducted",
      value: stats?.eventsConducted ?? "—",
    },
  ];

  return (
    <div className="flex-1 flex flex-col items-center px-4 py-12 bg-canvas-bg">
      <div className="w-full max-w-3xl flex flex-col gap-8">
        {/* Header Section */}
        <section className="grid md:grid-cols-2 gap-8 items-center">
          <div className="flex flex-col gap-4">
            <span className="inline-flex w-fit items-center gap-2 px-3 py-1.5 rounded-full bg-accent-neon/15 border border-accent-neon/30 font-inter text-caption font-semibold text-text-heading">
              <Sparkles size={14} strokeWidth={2} />
              BOCC Membership Portal
            </span>
            <h1 className="font-poppins font-bold text-section text-text-heading">
              Welcome to BOCC!
            </h1>
            <p className="font-inter text-body text-text-body leading-relaxed">
              You&apos;re joining the Business Orbit Campus Club at{" "}
              <span className="font-semibold text-text-heading">
                {chapter?.collegeName || "your college"}
              </span>
              . This chapter will be your home for startup building, mentorship,
              networking, events, and entrepreneurial opportunities.
            </p>
          </div>
          <div className="aspect-square rounded-lg border-2 border-dashed border-border-subtle bg-canvas-bg flex flex-col items-center justify-center gap-2">
            <Clock3 size={24} strokeWidth={2} className="text-text-muted" />
            <span className="font-inter text-small text-text-muted">
              {chapter?.registrationStatus || "Awaiting Verification"}
            </span>
          </div>
        </section>

        {/* Chapter Details Card */}
        <section className="bg-surface-white border border-border-subtle rounded-xl shadow-card p-6">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <h2 className="font-poppins font-semibold text-card text-text-heading">
                {chapter?.chapterName || "Your Chapter"}
              </h2>
              <p className="font-inter text-small text-text-muted">
                {chapter?.collegeName || "Your Campus"}
              </p>
            </div>
            <span
              className={`font-inter text-caption font-semibold uppercase tracking-wide px-2.5 py-1 rounded-full shrink-0 ${
                chapter?.status === "Active"
                  ? "text-success bg-success/15"
                  : "text-text-muted bg-border-subtle"
              }`}
            >
              Status: {chapter?.status || "Active"}
            </span>
          </div>

          <p className="font-inter text-small text-text-body leading-relaxed mb-4 whitespace-pre-line">
            {chapter?.description ||
              "No description provided for this chapter yet."}
          </p>

          {chapter?.mission && (
            <div className="border-t border-border-subtle pt-4">
              <p className="font-inter text-caption font-semibold uppercase tracking-wider text-text-muted mb-1.5">
                Mission Statement
              </p>
              <blockquote className="font-inter text-small text-text-body italic">
                &ldquo;{chapter.mission}&rdquo;
              </blockquote>
            </div>
          )}
        </section>

        {/* Chapter Statistics */}
        <section className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {statItems.map(({ icon: Icon, label, value }) => (
            <div
              key={label}
              className="bg-surface-white border border-border-subtle rounded-lg p-5 text-center"
            >
              <Icon
                size={20}
                strokeWidth={2}
                className="text-text-muted mx-auto mb-2"
              />
              <p className="font-poppins font-semibold text-card text-text-heading">
                {value}
              </p>
              <p className="font-inter text-caption text-text-muted">{label}</p>
            </div>
          ))}
        </section>

        {/* Navigation & Actions */}
        <section className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <Link
            to="/login"
            className="inline-flex items-center gap-1.5 font-inter font-medium text-small text-text-body hover:text-text-heading transition-colors"
          >
            <ArrowLeft size={16} strokeWidth={2} />
            Back
          </Link>
          <div>
            <button
              onClick={() => navigate("/onboarding/verify-email")}
              className="bg-action-bg text-action-text font-poppins font-semibold text-small px-5 py-2.5 rounded-md hover:opacity-90 transition-all"
            >
              Continue to Email Verification
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
