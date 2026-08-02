import { Link } from "react-router-dom";
import {
  ChevronRight,
  ArrowRight,
  Rocket,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import DashboardShell from "@/components/dashboard/DashboardShell";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import api from "@/api/axiosInstance";
import { useEffect, useState } from "react";

const LAUNCH_STEPS = [
  {
    title: "Launch Submission",
    path: "/build-startup/journey/launch/submission",
    description:
      "Provide final product links, release details, and launch strategy summaries.",
    completed: false,
  },
  {
    title: "Final Pitch Deck Upload",
    path: "/build-startup/journey/launch/pitch-deck",
    description:
      "Upload your finalized pitch deck for investor presentations and committee review.",
    completed: false,
  },
  {
    title: "Launch Insights & Proof Upload",
    path: "/build-startup/journey/launch/proof-upload",
    description:
      "Upload photos, videos, media coverage, and social proof from your launch event.",
    completed: false,
  },
];

export default function LaunchStagePage() {
  useDocumentTitle("Launch Stage — BOCC");
  const [stats, setStats] = useState(null);
  const [statsError, setStatsError] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    api
      .get("/stages/launch/statistics")
      .then((res) => setStats(res.data))
      .catch((err) => {
        console.error("Failed to fetch launch stats:", err);
        setStatsError(
          err.response?.data?.message || err.message || "Failed to load stats.",
        );
      });
  }, []);

  const handleApply = (endpoint, successMessage) => {
    setErrorMsg("");
    setSuccessMsg("");
    api
      .post(endpoint, {})
      .then(() => {
        setSuccessMsg(successMessage);
        setTimeout(() => setSuccessMsg(""), 3000);
      })
      .catch((err) => {
        setErrorMsg(
          err?.response?.data?.message || err?.message || `Failed to apply.`,
        );
      });
  };

  return (
    <DashboardShell pageId="launch-stage">
      <nav className="mb-2 flex items-center gap-2 text-text-muted font-inter font-normal text-small">
        <Link
          to="/dashboard"
          className="hover:text-text-heading transition-colors"
        >
          Dashboard
        </Link>
        <ChevronRight size={14} strokeWidth={2} />
        <Link
          to="/build-startup/journey"
          className="hover:text-text-heading transition-colors"
        >
          Startup Journey
        </Link>
        <ChevronRight size={14} strokeWidth={2} />
        <span className="text-text-heading font-semibold">Launch</span>
      </nav>

      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-lg bg-brand-black flex items-center justify-center shrink-0">
          <Rocket size={20} strokeWidth={2} className="text-accent-neon" />
        </div>
        <h1 className="font-poppins font-semibold text-page text-text-heading">
          Stage 5: Launch
        </h1>
      </div>
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8">
        <p className="font-inter text-body text-text-body max-w-2xl">
          Prepare your startup for public launch. Submit your final product
          details, upload your investor pitch deck, and share proof of your
          launch event.
        </p>
        {statsError ? (
          <div className="bg-error/15 border border-error/30 p-4 rounded-lg flex items-center justify-center shadow-sm shrink-0 min-w-[200px]">
            <p className="font-inter text-small text-error">{statsError}</p>
          </div>
        ) : (
          stats && (
            <div className="bg-surface-white border border-border-subtle p-4 rounded-lg flex items-center gap-6 shadow-sm shrink-0">
              <div>
                <p className="font-inter text-caption text-text-muted uppercase">
                  Alumni Joined
                </p>
                <p className="font-poppins font-bold text-body">
                  {stats.alumniCount || 0}
                </p>
              </div>
              <div>
                <p className="font-inter text-caption text-text-muted uppercase">
                  Showcase Active
                </p>
                <p className="font-poppins font-bold text-body">
                  {stats.showcaseCount || 0}
                </p>
              </div>
            </div>
          )
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {LAUNCH_STEPS.map((step, index) => (
          <div
            key={step.path}
            className="bg-surface-white border border-border-subtle rounded-lg p-8 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="font-inter font-semibold text-caption text-text-muted uppercase tracking-wider">
                  Step 0{index + 1}
                </span>
                {step.completed ? (
                  <CheckCircle2 size={20} className="text-brand-black" />
                ) : (
                  <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded bg-canvas-bg text-text-muted border border-border-subtle">
                    In Progress
                  </span>
                )}
              </div>
              <h3 className="font-poppins font-semibold text-card text-text-heading mb-2">
                {step.title}
              </h3>
              <p className="font-inter text-small text-text-body mb-6">
                {step.description}
              </p>
            </div>
            <Link
              to={step.path}
              className="inline-flex items-center gap-2 font-poppins font-semibold text-small text-text-heading hover:opacity-80 transition-opacity"
            >
              Start Step <ArrowRight size={16} strokeWidth={2} />
            </Link>
          </div>
        ))}
      </div>

      <div className="bg-canvas-bg border border-border-subtle rounded-lg p-8 flex items-center justify-between mb-10">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-surface-white border border-border-subtle flex items-center justify-center text-brand-black shrink-0">
            <Rocket size={24} strokeWidth={2} />
          </div>
          <div>
            <h4 className="font-poppins font-semibold text-body text-text-heading">
              Ready for Market Entry?
            </h4>
            <p className="font-inter text-small text-text-muted">
              Complete all three steps to submit your startup for the final Demo
              Day evaluation.
            </p>
          </div>
        </div>
        <Link
          to="/build-startup/journey/launch/submission"
          className="bg-action-bg text-action-text px-6 py-3 rounded-md hover:opacity-90 active:scale-[0.98] transition-all font-poppins font-semibold text-small shrink-0"
        >
          Begin Submission
        </Link>
      </div>

      <h3 className="font-poppins font-semibold text-card text-text-heading mb-4">
        Post-Launch Opportunities
      </h3>

      {errorMsg && (
        <div className="mb-6 p-3 bg-error/15 border border-error/30 text-error rounded-md text-small flex items-center gap-2">
          <AlertCircle size={16} className="shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {successMsg && (
        <div className="mb-6 p-3 bg-success/15 border border-success/30 text-success rounded-md text-small flex items-center gap-2">
          <CheckCircle2 size={16} className="shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-surface-white border border-border-subtle rounded-lg p-6 flex flex-col justify-between">
          <div>
            <h4 className="font-poppins font-semibold text-body mb-2">
              Join Alumni Network
            </h4>
            <p className="font-inter text-small text-text-muted mb-4">
              Connect with past founders, get exclusive resources, and stay
              involved.
            </p>
          </div>
          <button
            onClick={() =>
              handleApply(
                "/stages/launch/alumni/join",
                "Successfully joined Alumni Network!",
              )
            }
            className="w-full bg-canvas-bg border border-border-subtle text-text-heading font-inter font-medium text-small px-4 py-2 rounded-md hover:bg-border-subtle transition-colors"
          >
            Apply Now
          </button>
        </div>

        <div className="bg-surface-white border border-border-subtle rounded-lg p-6 flex flex-col justify-between">
          <div>
            <h4 className="font-poppins font-semibold text-body mb-2">
              Become a Mentor
            </h4>
            <p className="font-inter text-small text-text-muted mb-4">
              Give back to the community by mentoring early-stage startups.
            </p>
          </div>
          <button
            onClick={() =>
              handleApply(
                "/stages/launch/mentor/apply",
                "Mentor application submitted!",
              )
            }
            className="w-full bg-canvas-bg border border-border-subtle text-text-heading font-inter font-medium text-small px-4 py-2 rounded-md hover:bg-border-subtle transition-colors"
          >
            Apply Now
          </button>
        </div>

        <div className="bg-surface-white border border-border-subtle rounded-lg p-6 flex flex-col justify-between">
          <div>
            <h4 className="font-poppins font-semibold text-body mb-2">
              Demo Day Showcase
            </h4>
            <p className="font-inter text-small text-text-muted mb-4">
              Apply to pitch your startup at the upcoming Demo Day event.
            </p>
          </div>
          <button
            onClick={() =>
              handleApply(
                "/stages/launch/showcase/apply",
                "Showcase application submitted!",
              )
            }
            className="w-full bg-action-bg text-action-text font-inter font-medium text-small px-4 py-2 rounded-md hover:opacity-90 transition-opacity"
          >
            Apply Now
          </button>
        </div>
      </div>
    </DashboardShell>
  );
}
