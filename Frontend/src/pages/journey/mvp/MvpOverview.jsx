import { Link } from "react-router-dom";
import {
  Wrench,
  Clock,
  CheckCircle2,
  Lightbulb,
  ChevronRight,
  ArrowRight,
} from "lucide-react";
import DashboardShell from "@/components/dashboard/DashboardShell";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

const OBJECTIVES = [
  {
    title: "Core Feature Identification",
    desc: 'Distinguishing "must-haves" from "nice-to-haves."',
  },
  {
    title: "Early Validation",
    desc: "Building a feedback loop with your first test users.",
  },
  {
    title: "Iterative Cycles",
    desc: "Learning to release, measure, and improve rapidly.",
  },
];

const DELIVERABLES = ["Working MVP", "Feature List", "User Log", "Bug Tracker"];

export default function MvpOverviewPage() {
  useDocumentTitle("Stage 3: MVP — BOCC");

  return (
    <DashboardShell pageId="mvp-overview">
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
        <span className="text-text-heading font-semibold">MVP</span>
      </nav>

      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-brand-black flex items-center justify-center shrink-0">
            <Wrench size={20} strokeWidth={2} className="text-accent-neon" />
          </div>
          <h1 className="font-poppins font-semibold text-page text-text-heading">
            Stage 3: Build Your MVP
          </h1>
        </div>
        <Link
          to="/build-startup/journey/mvp/choose-product-type"
          className="inline-flex items-center gap-2 bg-action-bg text-action-text px-6 py-2.5 rounded-md hover:opacity-90 active:scale-[0.98] transition-all font-poppins font-semibold text-small shrink-0"
        >
          Continue
          <ArrowRight size={16} strokeWidth={2} />
        </Link>
      </div>
      <p className="font-inter text-body text-text-body max-w-2xl mb-8">
        An MVP (Minimum Viable Product) is the most basic version of your
        product that allows you to collect the maximum amount of validated
        learning about customers with the least effort.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
        <div className="lg:col-span-7 bg-surface-white border border-border-subtle rounded-lg shadow-card p-6">
          <h3 className="font-poppins font-semibold text-body text-text-heading mb-1">
            Development Roadmap
          </h3>
          <p className="font-inter text-small text-text-muted mb-4">
            Visualizing your product architecture and core flow.
          </p>
          {/* "Assembling blocks" motif, same line-art language as the app's other illustrations. This box is a FIXED brand-black surface (like the sidebar) — every white here must be literal, not the theme-reactive surface-white token, or it'll invert against a background that never does. See Sidebar.jsx for the same rule. */}
          <svg
            viewBox="0 0 400 200"
            className="w-full h-48 rounded-lg"
            role="img"
            aria-label="Illustration of building blocks assembling into a product"
          >
            <rect
              x="0"
              y="0"
              width="400"
              height="200"
              rx="8"
              fill="var(--color-brand-black)"
            />

            {/* Guide lines from incoming blocks to the assembled cluster */}
            <line
              x1="60"
              y1="40"
              x2="150"
              y2="90"
              stroke="white"
              strokeOpacity="0.15"
              strokeWidth="1.5"
              strokeDasharray="4 4"
            />
            <line
              x1="330"
              y1="50"
              x2="235"
              y2="95"
              stroke="white"
              strokeOpacity="0.15"
              strokeWidth="1.5"
              strokeDasharray="4 4"
            />
            <line
              x1="70"
              y1="165"
              x2="155"
              y2="125"
              stroke="white"
              strokeOpacity="0.15"
              strokeWidth="1.5"
              strokeDasharray="4 4"
            />

            {/* Assembled cluster, center */}
            <rect x="152" y="82" width="46" height="46" rx="6" fill="white" />
            <rect
              x="202"
              y="82"
              width="46"
              height="46"
              rx="6"
              fill="var(--color-accent-neon)"
            />
            <rect
              x="152"
              y="132"
              width="46"
              height="46"
              rx="6"
              fill="white"
              fillOpacity="0.6"
            />
            <rect
              x="202"
              y="132"
              width="46"
              height="46"
              rx="6"
              fill="white"
              fillOpacity="0.3"
            />

            {/* Incoming blocks, still in transit */}
            <rect
              x="36"
              y="18"
              width="30"
              height="30"
              rx="5"
              fill="none"
              stroke="white"
              strokeOpacity="0.4"
              strokeWidth="2"
            />
            <rect
              x="312"
              y="30"
              width="26"
              height="26"
              rx="5"
              fill="white"
              fillOpacity="0.25"
            />
            <rect
              x="44"
              y="148"
              width="24"
              height="24"
              rx="5"
              fill="none"
              stroke="var(--color-accent-neon)"
              strokeOpacity="0.6"
              strokeWidth="2"
            />
          </svg>
        </div>
        <div className="lg:col-span-5 bg-surface-white border border-border-subtle rounded-lg shadow-card p-6">
          <h3 className="font-poppins font-semibold text-body text-text-heading mb-4">
            Learning Objectives
          </h3>
          <div className="space-y-3">
            {OBJECTIVES.map(({ title, desc }, i) => (
              <div key={title} className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-canvas-bg border border-border-subtle flex items-center justify-center shrink-0 font-inter text-caption text-text-muted">
                  {i + 1}
                </div>
                <p className="font-inter text-small text-text-body">
                  <strong className="text-text-heading font-semibold">
                    {title}:
                  </strong>{" "}
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="flex items-center gap-3 bg-surface-white border border-border-subtle rounded-lg shadow-card p-5">
          <div className="w-10 h-10 rounded-md bg-canvas-bg border border-border-subtle flex items-center justify-center shrink-0">
            <Clock size={18} strokeWidth={2} className="text-text-body" />
          </div>
          <div>
            <p className="font-inter text-caption text-text-muted uppercase tracking-wider">
              Duration
            </p>
            <p className="font-poppins font-semibold text-body text-text-heading">
              2–4 Weeks
            </p>
          </div>
        </div>
        <div className="bg-surface-white border border-border-subtle rounded-lg shadow-card p-5">
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle2
              size={16}
              strokeWidth={2}
              className="text-text-body"
            />
            <p className="font-inter font-semibold text-caption text-text-muted uppercase tracking-wider">
              Key Deliverables
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5">
            {DELIVERABLES.map((d) => (
              <p key={d} className="font-inter text-small text-text-body">
                {d}
              </p>
            ))}
          </div>
        </div>
        <div className="bg-canvas-bg border border-border-subtle rounded-lg p-5">
          <div className="flex items-center gap-2 mb-2">
            <Lightbulb size={16} strokeWidth={2} className="text-text-muted" />
            <p className="font-inter font-semibold text-caption text-text-muted uppercase tracking-wider">
              Mentor Tip
            </p>
          </div>
          <p className="font-inter text-small text-text-body italic">
            "If you aren't embarrassed by the first version of your product, you
            shipped too late."
          </p>
          <p className="font-inter text-caption text-text-muted mt-1">
            — Reid Hoffman
          </p>
        </div>
      </div>
    </DashboardShell>
  );
}
