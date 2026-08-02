import { Link } from 'react-router-dom';
import { CheckCircle2, ArrowRight, ChevronRight } from 'lucide-react';
import DashboardShell from '@/components/dashboard/DashboardShell';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

export default function SubmissionConfirmationPage() {
  useDocumentTitle('Idea Submitted — BOCC');

  return (
    <DashboardShell pageId="idea-confirmation">
      <nav className="mb-2 flex items-center gap-2 text-text-muted font-inter font-normal text-small">
        <Link to="/dashboard" className="hover:text-text-heading transition-colors">Dashboard</Link>
        <ChevronRight size={14} strokeWidth={2} />
        <Link to="/build-startup/journey/ideation" className="hover:text-text-heading transition-colors">Ideation</Link>
        <ChevronRight size={14} strokeWidth={2} />
        <span className="text-text-heading font-semibold">Submitted</span>
      </nav>

      <div className="max-w-xl mx-auto text-center bg-surface-white border border-border-subtle rounded-lg shadow-card p-10 mt-8">
        <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 size={32} strokeWidth={2} className="text-success" />
        </div>

        <span className="inline-block bg-warning/10 text-warning font-poppins font-semibold text-caption px-3 py-1 rounded-full mb-4">
          Under Review
        </span>

        <h1 className="font-poppins font-semibold text-section text-text-heading mb-2">
          Idea Submitted Successfully
        </h1>
        <p className="font-inter text-body text-text-body">
          The BOCC team will review your idea and schedule a discussion.
        </p>
        <p className="font-inter font-semibold text-body text-text-heading mt-1">
          Expected timeline: 3–5 business days.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-8">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 bg-action-bg text-action-text px-6 py-2.5 rounded-md hover:opacity-90 active:scale-[0.98] transition-all font-poppins font-semibold text-small"
          >
            Return to Dashboard
            <ArrowRight size={16} strokeWidth={2} />
          </Link>
          <Link
            to="/build-startup/journey/ideation/submit"
            className="font-poppins font-semibold text-small text-text-heading hover:opacity-80 transition-opacity px-6 py-2.5"
          >
            View Submission
          </Link>
        </div>
      </div>

      <p className="text-center font-inter text-small text-text-muted mt-6">
        Have questions? Contact the Ideation Support Office.
      </p>
    </DashboardShell>
  );
}
