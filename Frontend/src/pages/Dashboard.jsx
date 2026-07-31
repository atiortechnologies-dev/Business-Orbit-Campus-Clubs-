import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Zap,
  Lock,
  ArrowRight,
  BookOpen,
  FileText,
  CircleHelp,
  LifeBuoy,
  Check,
  Rocket,
  User,
  TrendingUp,
  Building2,
  Briefcase,
  Loader2,
} from "lucide-react";
import DashboardShell from "@/components/dashboard/DashboardShell";
import ComingSoon from "@/components/ui/ComingSoon";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { getDashboard, getActivityLog } from "@/api/dashboardApi";

const STAGES = [
  { label: "Ideation", status: "active" },
  { label: "Validation", status: "locked" },
  { label: "MVP", status: "locked" },
  { label: "Traction", status: "locked" },
  { label: "Launch & Pitch", status: "locked" },
];

export default function DashboardPage() {
  useDocumentTitle("Dashboard — BOCC Student Portal");
  const navigate = useNavigate();

  const [dashboardData, setDashboardData] = useState(null);
  const [activityLog, setActivityLog] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const [dashboardRes, activityRes] = await Promise.all([
          getDashboard(),
          getActivityLog(),
        ]);
        setDashboardData(dashboardRes?.data || dashboardRes);
        setActivityLog(activityRes?.data || activityRes || []);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);

        // Check for 403 onboarding redirects (e.g., missing profile or unverified email)
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
    fetchDashboardData();
  }, [navigate]);

  const userName = dashboardData?.studentProfile?.fullName || "Student";
  const currentStageName = dashboardData?.currentStage?.stageName || "Ideation";
  const progressPercent = dashboardData?.overallProgress || 0;

  return (
    <DashboardShell pageId="db">
      <div
        className="grid grid-cols-1 md:grid-cols-12"
        style={{ gap: "var(--spacing-gutter)" }}
      >
        <section className="md:col-span-12 lg:col-span-8 bg-surface-white border border-border-subtle rounded-lg p-6 shadow-card flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1 space-y-4 text-center md:text-left">
            <h3 className="text-text-heading font-poppins font-semibold text-page flex items-center gap-2">
              Welcome back,{" "}
              {loading ? (
                <Loader2 size={20} className="animate-spin text-text-muted" />
              ) : (
                userName
              )}
            </h3>

            <div className="space-y-1">
              <p className="text-text-body font-inter text-body">
                Current Stage:{" "}
                <span className="font-bold text-text-heading">
                  {currentStageName}
                </span>
              </p>
              <div className="w-full bg-divider-line h-2 rounded-full overflow-hidden">
                <div
                  className="bg-brand-black h-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <p className="text-text-muted font-inter font-semibold text-caption">
                Progress: {progressPercent}%
              </p>
            </div>

            <Link to="/build-startup/journey" className="inline-block mt-4">
              <button className="bg-action-bg text-action-text px-8 py-3 rounded-md hover:opacity-90 transition-colors active:scale-[0.98] font-poppins font-semibold text-body">
                Start Your Journey
              </button>
            </Link>
          </div>

          <svg
            viewBox="0 0 200 200"
            className="w-48 h-48 rounded-lg hidden md:block shrink-0"
            role="img"
            aria-label="Illustration of a radiating idea spark"
          >
            <circle
              cx="100"
              cy="100"
              r="90"
              fill="none"
              stroke="var(--color-border-subtle)"
              strokeWidth="1.5"
            />
            <circle
              cx="100"
              cy="100"
              r="62"
              fill="none"
              stroke="var(--color-border-subtle)"
              strokeWidth="1.5"
            />

            {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => {
              const rad = (deg * Math.PI) / 180;
              const x1 = 100 + Math.cos(rad) * 40;
              const y1 = 100 + Math.sin(rad) * 40;
              const x2 = 100 + Math.cos(rad) * 78;
              const y2 = 100 + Math.sin(rad) * 78;
              return (
                <line
                  key={deg}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke="var(--color-border-subtle)"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              );
            })}

            <circle cx="100" cy="100" r="32" fill="var(--color-brand-black)" />
            <circle cx="100" cy="100" r="11" fill="var(--color-accent-neon)" />

            <circle cx="167" cy="100" r="4" fill="var(--color-accent-neon)" />
            <circle cx="100" cy="18" r="3" fill="var(--color-border-subtle)" />
            <circle cx="33" cy="100" r="3" fill="var(--color-border-subtle)" />
          </svg>
        </section>

        <section className="md:col-span-12 lg:col-span-4 bg-brand-black text-white border border-border-subtle rounded-lg p-6 shadow-card flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-accent-neon">
              <Zap size={18} strokeWidth={2} />
              <span className="uppercase tracking-wider font-inter font-medium text-caption">
                Next Step
              </span>
            </div>
            <p className="leading-relaxed font-poppins font-semibold text-card text-white">
              Read the Ideation Guide and begin your startup journey
            </p>
          </div>

          <Link to="/build-startup/journey" className="block mt-8">
            <button className="w-full bg-white text-brand-black px-6 py-3 rounded-md hover:opacity-90 transition-colors active:scale-[0.98] font-poppins font-semibold text-body">
              Begin
            </button>
          </Link>
        </section>

        <section className="md:col-span-12 bg-surface-white border border-border-subtle rounded-lg p-6 shadow-card">
          <h4 className="text-text-heading font-poppins font-semibold text-section mb-8">
            Startup Progress
          </h4>

          <div className="flex flex-col md:flex-row justify-between items-center gap-4 relative">
            <div className="absolute top-1/2 left-0 w-full h-px bg-border-subtle -z-10 hidden md:block" />

            {STAGES.map(({ label, status }) => (
              <div
                key={label}
                className="flex flex-col items-center gap-3 px-4 text-center bg-surface-white z-10"
              >
                {status === "completed" && (
                  <div className="w-12 h-12 rounded-full bg-success text-white flex items-center justify-center">
                    <Check size={20} strokeWidth={2} />
                  </div>
                )}
                {status === "active" && (
                  <div className="w-12 h-12 rounded-full border-2 border-brand-black flex items-center justify-center bg-surface-white relative">
                    <div className="w-3.5 h-3.5 rounded-full bg-accent-neon animate-pulse" />
                  </div>
                )}
                {status === "locked" && (
                  <div className="w-12 h-12 rounded-full border border-border-subtle text-text-muted flex items-center justify-center bg-surface-white">
                    <Lock size={16} strokeWidth={2} />
                  </div>
                )}
                <span
                  className={`font-inter font-medium text-caption ${
                    status === "locked"
                      ? "text-text-muted"
                      : "text-text-heading"
                  }`}
                >
                  {label}
                </span>
              </div>
            ))}
          </div>
        </section>

        <section className="md:col-span-12">
          <h4 className="text-text-heading font-poppins font-semibold text-section mb-6">
            Quick Actions
          </h4>

          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5"
            style={{ gap: "var(--spacing-gutter)" }}
          >
            <Link
              to="/build-startup/journey"
              className="bg-surface-white border border-border-subtle rounded-lg p-6 shadow-card flex flex-col items-center text-center space-y-4 hover:border-brand-black transition-colors cursor-pointer group active:scale-[0.98]"
            >
              <div className="w-12 h-12 rounded-lg bg-canvas-bg border border-border-subtle flex items-center justify-center group-hover:scale-105 transition-transform">
                <Rocket
                  size={20}
                  strokeWidth={1.75}
                  className="text-text-heading"
                />
              </div>
              <div className="space-y-1">
                <h5 className="font-poppins font-medium text-card text-text-heading">
                  Build Startup
                </h5>
                <p className="text-text-muted font-inter font-normal text-small">
                  Step-by-step guidance.
                </p>
              </div>
              <span className="mt-2 text-text-heading hover:underline flex items-center gap-1 font-poppins font-semibold text-small">
                Open <ArrowRight size={14} strokeWidth={2} />
              </span>
            </Link>

            <Link
              to="/settings"
              className="bg-surface-white border border-border-subtle rounded-lg p-6 shadow-card flex flex-col items-center text-center space-y-4 hover:border-brand-black transition-colors cursor-pointer group active:scale-[0.98]"
            >
              <div className="w-12 h-12 rounded-lg bg-canvas-bg border border-border-subtle flex items-center justify-center group-hover:scale-105 transition-transform">
                <User
                  size={20}
                  strokeWidth={1.75}
                  className="text-text-heading"
                />
              </div>
              <div className="space-y-1">
                <h5 className="font-poppins font-medium text-card text-text-heading">
                  Profile
                </h5>
                <p className="text-text-muted font-inter font-normal text-small">
                  Manage your account.
                </p>
              </div>
              <span className="mt-2 text-text-heading hover:underline flex items-center gap-1 font-poppins font-semibold text-small">
                Edit <ArrowRight size={14} strokeWidth={2} />
              </span>
            </Link>

            {[
              {
                title: "Investors",
                sub: "Connect with funders.",
                cta: "Browse",
                icon: TrendingUp,
              },
              {
                title: "Incubators",
                sub: "Supportive ecosystems.",
                cta: "Explore",
                icon: Building2,
              },
              {
                title: "Freelancing",
                sub: "Monetize your skills.",
                cta: "Find Work",
                icon: Briefcase,
              },
            ].map(({ title, sub, cta, icon: Icon }) => (
              <ComingSoon key={title} label={title} position="top">
                <div className="w-full bg-surface-white border border-border-subtle rounded-lg p-6 shadow-card flex flex-col items-center text-center space-y-4 hover:border-border-subtle transition-colors cursor-not-allowed group">
                  <div className="w-12 h-12 rounded-lg bg-canvas-bg border border-border-subtle flex items-center justify-center">
                    <Icon
                      size={20}
                      strokeWidth={1.75}
                      className="text-text-muted"
                    />
                  </div>
                  <div className="space-y-1">
                    <h5 className="font-poppins font-medium text-card text-text-muted">
                      {title}
                    </h5>
                    <p className="text-text-muted font-inter font-normal text-small">
                      {sub}
                    </p>
                  </div>
                  <span className="mt-2 text-text-muted flex items-center gap-1 font-poppins font-semibold text-small">
                    {cta} <ArrowRight size={14} strokeWidth={2} />
                  </span>
                </div>
              </ComingSoon>
            ))}
          </div>
        </section>

        <section className="md:col-span-6 bg-surface-white border border-border-subtle rounded-lg p-6 shadow-card">
          <div className="flex justify-between items-center mb-6">
            <h4 className="text-text-heading font-poppins font-semibold text-section">
              Recent Notifications
            </h4>
            <Link
              to="/notifications"
              className="text-text-heading hover:underline font-poppins font-semibold text-small"
            >
              View All
            </Link>
          </div>

          <div className="space-y-4">
            {activityLog.length > 0 ? (
              activityLog.map((log, index) => (
                <div key={log._id || index} className="flex items-start gap-4 pb-4 border-b border-divider-line last:border-0 last:pb-0">
                  <div className="w-2 h-2 rounded-full bg-accent-neon mt-2 shrink-0" />
                  <div>
                    <p className="text-text-body font-inter font-normal text-body">
                      {log.action}
                    </p>
                    <span className="text-text-muted font-inter font-normal text-small">
                      {new Date(log.createdAt).toLocaleString()}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-text-muted font-inter text-small">
                No recent activity.
              </div>
            )}
          </div>
        </section>

        <section className="md:col-span-6 bg-surface-white border border-border-subtle rounded-lg p-6 shadow-card">
          <h4 className="text-text-heading font-poppins font-semibold text-section mb-6">
            Resources
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { icon: BookOpen, label: "Startup Guide" },
              { icon: FileText, label: "Templates" },
              { icon: CircleHelp, label: "FAQ" },
              { icon: LifeBuoy, label: "Support" },
            ].map(({ icon: Icon, label }) => (
              <ComingSoon key={label} label={label} position="top">
                <div className="flex items-center gap-3 p-3 rounded-md bg-canvas-bg border border-transparent transition-colors cursor-not-allowed w-full text-left">
                  <Icon size={20} strokeWidth={2} className="text-text-muted" />
                  <span className="font-inter font-medium text-body text-text-muted">
                    {label}
                  </span>
                </div>
              </ComingSoon>
            ))}
          </div>
        </section>
      </div>
    </DashboardShell>
  );
}
