import { Link } from "react-router-dom";
import {
  ShieldCheck,
  ArrowRight,
  ChevronRight,
  BookOpen,
  MessageSquare,
  History,
} from "lucide-react";
import DashboardShell from "@/components/dashboard/DashboardShell";
import ComingSoon from "@/components/ui/ComingSoon";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

const LINKS = [
  { icon: BookOpen, label: "Review Guidelines" },
  { icon: MessageSquare, label: "Mentor Chat" },
  { icon: History, label: "Submission History" },
];

export default function ValidationSubmissionConfirmationPage() {
  useDocumentTitle("Submission Received — BOCC");

  return (
    <DashboardShell pageId="validation-confirmation">
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
        <span className="text-text-heading font-semibold">Submitted</span>
      </nav>

      <div className="max-w-xl mx-auto text-center bg-surface-white border border-border-subtle rounded-lg shadow-card p-10 mt-8">
        <div className="w-16 h-16 rounded-full bg-info/10 flex items-center justify-center mx-auto mb-6">
          <ShieldCheck size={32} strokeWidth={2} className="text-info" />
        </div>

        <span className="inline-block bg-warning/10 text-warning font-poppins font-semibold text-caption px-3 py-1 rounded-full mb-4">
          Under Review
        </span>

        <h1 className="font-poppins font-semibold text-section text-text-heading mb-2">
          Stage 2 Submission Received
        </h1>
        <p className="font-inter text-body text-text-body">
          Your Validation report and evidence log have been sent for mentor
          review.
        </p>
        <p className="font-inter font-semibold text-body text-text-heading mt-1">
          Expected timeline: 3–5 business days.
        </p>

        <div className="bg-canvas-bg border border-border-subtle rounded-lg p-4 mt-6 text-left">
          <p className="font-inter text-small text-text-body">
            <strong className="text-text-heading">Submission Locked</strong> —
            your report and evidence can&apos;t be edited while under review.
            You&apos;ll be notified as soon as a decision is made.
          </p>
        </div>

        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 bg-action-bg text-action-text px-6 py-2.5 rounded-md hover:opacity-90 active:scale-[0.98] transition-all font-poppins font-semibold text-small mt-8"
        >
          Return to Dashboard
          <ArrowRight size={16} strokeWidth={2} />
        </Link>
      </div>

      <div className="flex flex-wrap justify-center gap-3 mt-6">
        {LINKS.map(({ icon: Icon, label }) => (
          <ComingSoon key={label} label={label} position="top" inline>
            <span className="flex items-center gap-1.5 bg-surface-white border border-border-subtle px-4 py-2 rounded-lg font-poppins font-semibold text-caption text-text-heading">
              <Icon size={14} strokeWidth={2} /> {label}
            </span>
          </ComingSoon>
        ))}
      </div>
    </DashboardShell>
  );
}
