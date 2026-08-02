import { Link } from "react-router-dom";
import {
  CheckCircle2,
  Award,
  Unlock,
  ArrowRight,
  ChevronRight,
  Clock,
  History,
  Star,
} from "lucide-react";
import DashboardShell from "@/components/dashboard/DashboardShell";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

const STATS = [
  { icon: Clock, label: "Review Time", value: "48 Hours" },
  { icon: History, label: "Attempts", value: "1 of 3" },
  { icon: Star, label: "Score", value: "Pass (Exceeds)" },
];

export default function IdeationReviewResultPage() {
  useDocumentTitle("Review Result — BOCC");

  return (
    <DashboardShell pageId="ideation-review-result">
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
        <span className="text-text-heading font-semibold">Review Result</span>
      </nav>

      <h1 className="font-poppins font-semibold text-page text-text-heading mb-1">
        Review Result
      </h1>
      <p className="font-inter text-body text-text-body mb-8 max-w-2xl">
        The evaluation of your Stage 1: Ideation submission is complete. Review
        the feedback below to understand the next steps in your venture-building
        journey.
      </p>

      <div className="bg-surface-white border border-border-subtle rounded-lg shadow-card overflow-hidden mb-8">
        <div className="h-1.5 bg-success" />
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <span className="inline-flex items-center gap-1.5 bg-success/10 text-success font-poppins font-semibold text-caption px-3 py-1 rounded-full mb-2">
                <CheckCircle2 size={14} strokeWidth={2} /> Idea Approved
              </span>
              <h2 className="font-poppins font-semibold text-section text-text-heading">
                Congratulations!
              </h2>
            </div>
            <div className="w-12 h-12 rounded-lg bg-canvas-bg border border-border-subtle flex items-center justify-center shrink-0">
              <Award size={22} strokeWidth={2} className="text-text-body" />
            </div>
          </div>

          <p className="font-inter text-caption text-text-muted uppercase tracking-wider mb-2">
            Reviewer Feedback
          </p>
          <blockquote className="italic font-inter text-body text-text-body bg-canvas-bg border-l-2 border-border-subtle rounded-md p-4 mb-6">
            "Your value proposition is exceptionally clear and addresses a
            high-impact pain point in the urban mobility sector. The initial
            market sizing is realistic. We recommend focusing on the specific
            regulatory hurdles in your next phase."
          </blockquote>

          <div className="flex items-start gap-3 bg-info/10 border border-info/30 rounded-lg p-4 mb-6">
            <Unlock
              size={20}
              strokeWidth={2}
              className="text-info shrink-0 mt-0.5"
            />
            <div>
              <h3 className="font-poppins font-semibold text-small text-text-heading">
                Stage 2: Validation Unlocked
              </h3>
              <p className="font-inter text-small text-text-body mt-1">
                You've demonstrated sufficient logic and market potential to
                proceed. You can now access the market-research tools and
                customer-interview frameworks.
              </p>
            </div>
          </div>

          <Link
            to="/build-startup/journey/validation"
            className="inline-flex items-center gap-2 bg-action-bg text-action-text px-6 py-2.5 rounded-md hover:opacity-90 active:scale-[0.98] transition-all font-poppins font-semibold text-small"
          >
            Begin Validation
            <ArrowRight size={16} strokeWidth={2} />
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {STATS.map(({ icon: Icon, label, value }) => (
          <div
            key={label}
            className="flex items-center gap-3 bg-surface-white border border-border-subtle rounded-lg shadow-card p-4"
          >
            <div className="w-10 h-10 rounded-md bg-canvas-bg border border-border-subtle flex items-center justify-center shrink-0">
              <Icon size={18} strokeWidth={2} className="text-text-body" />
            </div>
            <div>
              <p className="font-inter text-caption text-text-muted">{label}</p>
              <p className="font-poppins font-semibold text-small text-text-heading">
                {value}
              </p>
            </div>
          </div>
        ))}
      </div>
    </DashboardShell>
  );
}
