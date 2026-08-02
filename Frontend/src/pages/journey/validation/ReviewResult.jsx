import { useState } from "react";
import { Link } from "react-router-dom";
import {
  CheckCircle2,
  Edit3,
  XCircle,
  ArrowRight,
  ChevronRight,
  LifeBuoy,
} from "lucide-react";
import DashboardShell from "@/components/dashboard/DashboardShell";
import Badge from "@/components/ui/Badge";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

const TABS = [
  {
    key: "approved",
    label: "Approved",
    badgeVariant: "success",
    icon: CheckCircle2,
    heading: "Validation Approved",
    feedback:
      '"Your survey sample size and interview depth clearly support the problem/solution fit. The pivot-or-persevere logic is well reasoned — proceed to MVP with confidence."',
    action: { label: "Go to Stage 3: MVP", to: "/build-startup/journey/mvp" },
  },
  {
    key: "revision",
    label: "Revision Required",
    badgeVariant: "warning",
    icon: Edit3,
    heading: "Needs Refinement",
    feedback:
      '"Your survey sample skews toward one demographic. Re-run outreach to widen the respondent pool before we can confirm problem/solution fit."',
    action: {
      label: "Edit & Resubmit",
      to: "/build-startup/journey/validation/report-submission",
    },
  },
  {
    key: "rejected",
    label: "Rejected",
    badgeVariant: "error",
    icon: XCircle,
    heading: "Not Yet Validated",
    feedback:
      '"The evidence collected doesn\'t yet support the core hypothesis. We recommend a working session with your mentor before resubmitting."',
    action: { label: "Contact Support", to: null },
  },
];

export default function ValidationReviewResultPage() {
  useDocumentTitle("Review Result — BOCC");
  const [activeTab, setActiveTab] = useState("approved");
  const tab = TABS.find((t) => t.key === activeTab);

  return (
    <DashboardShell pageId="validation-review-result">
      <nav className="mb-2 flex items-center gap-2 text-text-muted font-inter font-normal text-small">
        <Link
          to="/dashboard"
          className="hover:text-text-heading transition-colors"
        >
          Dashboard
        </Link>
        <ChevronRight size={14} strokeWidth={2} />
        <Link
          to="/build-startup/journey/validation"
          className="hover:text-text-heading transition-colors"
        >
          Validation
        </Link>
        <ChevronRight size={14} strokeWidth={2} />
        <span className="text-text-heading font-semibold">Review Result</span>
      </nav>

      <h1 className="font-poppins font-semibold text-page text-text-heading mb-1">
        Review Result
      </h1>
      <p className="font-inter text-body text-text-body mb-6 max-w-2xl">
        The evaluation of your Stage 2: Validation submission is complete.
      </p>

      <div className="flex gap-2 mb-6 border-b border-divider-line">
        {TABS.map(({ key, label }) => (
          <button
            key={key}
            type="button"
            onClick={() => setActiveTab(key)}
            className={`px-4 py-2.5 font-poppins font-semibold text-small border-b-2 transition-colors ${
              activeTab === key
                ? "border-brand-black text-text-heading"
                : "border-transparent text-text-muted hover:text-text-heading"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="bg-surface-white border border-border-subtle rounded-lg shadow-card p-6 max-w-2xl">
        <div className="flex items-center gap-3 mb-4">
          <Badge variant={tab.badgeVariant}>{tab.label}</Badge>
        </div>
        <h2 className="font-poppins font-semibold text-section text-text-heading mb-4">
          {tab.heading}
        </h2>

        <p className="font-inter text-caption text-text-muted uppercase tracking-wider mb-2">
          Reviewer Feedback
        </p>
        <blockquote className="italic font-inter text-body text-text-body bg-canvas-bg border-l-2 border-border-subtle rounded-md p-4 mb-6">
          {tab.feedback}
        </blockquote>

        {tab.action.to ? (
          <Link
            to={tab.action.to}
            className="inline-flex items-center gap-2 bg-action-bg text-action-text px-6 py-2.5 rounded-md hover:opacity-90 active:scale-[0.98] transition-all font-poppins font-semibold text-small"
          >
            {tab.action.label}
            <ArrowRight size={16} strokeWidth={2} />
          </Link>
        ) : (
          <span className="inline-flex items-center gap-2 border border-border-subtle text-text-heading px-6 py-2.5 rounded-md font-poppins font-semibold text-small">
            <LifeBuoy size={16} strokeWidth={2} />
            {tab.action.label}
          </span>
        )}
      </div>
    </DashboardShell>
  );
}
