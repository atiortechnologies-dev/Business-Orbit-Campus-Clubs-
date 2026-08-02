import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Brain,
  Wrench,
  Building2,
  UserPlus,
  Megaphone,
  ArrowLeft,
  ChevronRight,
  Lock,
  Users,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import DashboardShell from "@/components/dashboard/DashboardShell";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { getStartupProgress, getStartupStages } from "@/api/startup/startupApi";

const ACHIEVEMENTS = [
  { icon: Brain, title: "Validate Your Idea" },
  { icon: Wrench, title: "Build an MVP" },
  { icon: Users, title: "Work with Mentors" },
  { icon: Building2, title: "Get Incubated" },
  { icon: UserPlus, title: "Acquire First Users" },
  { icon: Megaphone, title: "Pitch to Investors" },
];

export default function JourneyPage() {
  useDocumentTitle("Startup Journey — BOCC");
  const navigate = useNavigate();

  const [progressData, setProgressData] = useState(null);
  const [stagesData, setStagesData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchJourneyData() {
      try {
        setLoading(true);
        const [progressRes, stagesRes] = await Promise.all([
          getStartupProgress(),
          getStartupStages(),
        ]);

        const progressPayload = progressRes?.data || progressRes;
        const stagesPayload = stagesRes?.data || stagesRes;

        setProgressData(progressPayload);
        setStagesData(stagesPayload?.stages || []);
      } catch (err) {
        console.error("Failed to fetch startup journey data:", err);

        // Catch onboarding / 403 redirect responses
        const redirectDestination =
          err.data?.data?.redirect_to ||
          err.data?.redirect_to ||
          err.response?.data?.data?.redirect_to ||
          err.response?.data?.redirect_to;

        if (redirectDestination) {
          navigate(redirectDestination, { replace: true });
        }
      } finally {
        setLoading(false);
      }
    }

    fetchJourneyData();
  }, [navigate]);

  // Format dynamic stat cards from API response
  const currentStageName = progressData?.currentStage?.stageName || "Ideation";
  const currentStageNumber = progressData?.currentStage?.stageNumber || 1;
  const rawProgress = progressData?.completionPercentage ?? 0;
  const submissionStatus = progressData?.submissionStatus || "not_started";

  const activeStagePath = `/build-startup/journey/${currentStageName.toLowerCase()}`;

  const formatStatusLabel = (status) => {
    switch (status) {
      case "pending_review":
      case "under_review":
        return "Under Review";
      case "approved":
        return "Approved";
      case "rejected":
        return "Needs Revision";
      default:
        return "Not Started";
    }
  };

  const STATS = [
    { label: "Current Status", value: formatStatusLabel(submissionStatus) },
    {
      label: "Current Stage",
      value: `${currentStageNumber}. ${currentStageName}`,
    },
    { label: "Progress", value: `${rawProgress}%` },
    { label: "Program Duration", value: "12 Months" },
  ];

  return (
    <DashboardShell pageId="journey">
      <nav className="mb-2 flex items-center gap-2 text-text-muted font-inter font-normal text-small">
        <Link
          to="/dashboard"
          className="hover:text-text-heading transition-colors"
        >
          Dashboard
        </Link>
        <ChevronRight size={14} strokeWidth={2} className="text-text-muted" />
        <span>Build Startup</span>
        <ChevronRight size={14} strokeWidth={2} className="text-text-muted" />
        <span className="text-text-heading font-semibold">Startup Journey</span>
      </nav>

      <h1 className="text-text-heading font-poppins font-semibold text-page mb-8">
        Startup Journey
      </h1>

      <section
        className="grid grid-cols-1 md:grid-cols-12 bg-surface-white border border-border-subtle rounded-lg p-6 shadow-card mb-12 items-center"
        style={{ gap: "var(--spacing-gutter)" }}
      >
        <div className="md:col-span-7 flex flex-col items-start gap-4">
          <h2 className="text-text-heading font-poppins font-semibold text-section leading-tight">
            Welcome to Your <br />
            Startup Journey 🚀
          </h2>
          <p className="text-text-body font-inter font-normal text-body max-w-lg">
            Every successful startup begins with one idea. BOCC will guide you
            through a structured five-stage journey over the next 12 months.
          </p>
          <Link
            to={activeStagePath}
            className="mt-4 bg-action-bg text-action-text px-8 py-3 rounded-md hover:opacity-90 active:scale-[0.98] transition-all font-poppins font-semibold text-body inline-block"
          >
            {submissionStatus === "not_started"
              ? "Start Your Journey"
              : "Continue Active Stage"}
          </Link>
        </div>

        <svg
          viewBox="0 0 400 320"
          className="md:col-span-5 w-full h-64 md:h-80 rounded-lg"
          role="img"
          aria-label="Illustration of a path rising through five stages toward a flag"
        >
          <path
            d="M 30 280 C 90 280, 90 220, 130 210 S 190 190, 200 150 S 250 110, 260 90 S 320 60, 340 40"
            fill="none"
            stroke="var(--color-border-subtle)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray="1 14"
          />

          <circle cx="30" cy="280" r="9" fill="var(--color-brand-black)" />
          <circle
            cx="130"
            cy="210"
            r="8"
            fill="var(--color-surface-white)"
            stroke="var(--color-brand-black)"
            strokeWidth="2"
          />
          <circle
            cx="200"
            cy="150"
            r="8"
            fill="var(--color-surface-white)"
            stroke="var(--color-brand-black)"
            strokeWidth="2"
          />
          <circle
            cx="260"
            cy="90"
            r="8"
            fill="var(--color-surface-white)"
            stroke="var(--color-brand-black)"
            strokeWidth="2"
          />

          <circle cx="340" cy="40" r="10" fill="var(--color-accent-neon)" />
          <line
            x1="340"
            y1="40"
            x2="340"
            y2="14"
            stroke="var(--color-brand-black)"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <path
            d="M 340 14 L 366 21 L 340 28 Z"
            fill="var(--color-brand-black)"
          />
        </svg>
      </section>

      <section className="mb-12">
        <h3 className="text-text-heading font-poppins font-semibold text-section mb-6">
          Journey Roadmap
        </h3>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 size={32} className="animate-spin text-text-muted" />
          </div>
        ) : (
          <div className="relative flex flex-col md:flex-row justify-between gap-4 md:gap-0 items-start md:items-center">
            <div className="hidden md:block absolute top-10 left-0 right-0 h-px bg-border-subtle z-0" />

            {stagesData.map((stage) => {
              const isActive = stage.status === "active";
              const isCompleted =
                stage.status === "approved" || stage.status === "completed";
              const stagePath = `/build-startup/journey/${stage.stageName.toLowerCase()}`;

              return (
                <div
                  key={stage.stageNumber}
                  className="relative z-10 flex md:flex-col items-center gap-4 md:w-1/5 text-center bg-canvas-bg px-4"
                >
                  {isCompleted ? (
                    <Link
                      to={stagePath}
                      className="w-20 h-20 rounded-full border-2 border-success bg-success/10 text-success flex items-center justify-center mx-auto hover:scale-105 transition-transform"
                    >
                      <CheckCircle2 size={24} strokeWidth={2.5} />
                    </Link>
                  ) : isActive ? (
                    <Link
                      to={stagePath}
                      className="w-20 h-20 rounded-full border-2 border-brand-black flex items-center justify-center bg-canvas-bg relative mx-auto hover:opacity-80 transition-opacity"
                    >
                      <div className="w-4 h-4 rounded-full bg-accent-neon animate-pulse" />
                    </Link>
                  ) : (
                    <div className="w-20 h-20 rounded-full border border-border-subtle text-text-muted flex items-center justify-center bg-canvas-bg mx-auto">
                      <Lock size={20} strokeWidth={2} />
                    </div>
                  )}

                  <div>
                    <p
                      className={`font-inter font-medium text-caption ${
                        isActive || isCompleted
                          ? "text-text-heading font-semibold"
                          : "text-text-muted"
                      }`}
                    >
                      {stage.stageNumber}. {stage.stageName}
                    </p>
                    <p className="text-text-muted font-inter font-normal text-small capitalize">
                      {isActive
                        ? `Current - ${formatStatusLabel(submissionStatus)}`
                        : isCompleted
                          ? "Completed"
                          : "Locked"}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      <section
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mb-12"
        style={{ gap: "var(--spacing-gutter)" }}
      >
        {STATS.map(({ label, value }) => (
          <div
            key={label}
            className="bg-surface-white border border-border-subtle p-6 rounded-lg shadow-card"
          >
            <p className="text-text-muted font-inter font-medium text-caption uppercase mb-1">
              {label}
            </p>
            <p className="text-text-heading font-poppins font-medium text-card">
              {value}
            </p>
          </div>
        ))}
      </section>

      <section className="mb-16">
        <h3 className="text-text-heading font-poppins font-semibold text-section mb-8">
          What You'll Achieve
        </h3>
        <div
          className="grid grid-cols-1 md:grid-cols-3"
          style={{ gap: "var(--spacing-gutter)" }}
        >
          {ACHIEVEMENTS.map(({ icon: Icon, title }) => (
            <div
              key={title}
              className="p-6 bg-surface-white border border-border-subtle rounded-lg shadow-card flex flex-col gap-3 hover:border-text-muted transition-colors"
            >
              <div className="w-12 h-12 rounded-md bg-canvas-bg flex items-center justify-center border border-border-subtle">
                <Icon size={24} strokeWidth={2} className="text-text-body" />
              </div>
              <h4 className="text-text-heading font-poppins font-semibold text-body">
                {title}
              </h4>
              <div className="h-1 bg-border-subtle w-full rounded" />
            </div>
          ))}
        </div>
      </section>

      <section className="flex flex-col items-center gap-6 py-12 border-t border-divider-line mt-12">
        <Link
          to={activeStagePath}
          className="bg-action-bg text-action-text px-12 py-4 rounded-md hover:opacity-90 active:scale-[0.98] transition-all shadow-sm font-poppins font-semibold text-body inline-block"
        >
          {submissionStatus === "not_started"
            ? "Start Your Journey"
            : "Continue Active Stage"}
        </Link>
        <Link
          to="/dashboard"
          className="text-text-body hover:text-text-heading transition-colors flex items-center gap-2 font-inter font-normal text-small"
        >
          <ArrowLeft size={16} strokeWidth={2} />
          Back to Dashboard
        </Link>
      </section>
    </DashboardShell>
  );
}
