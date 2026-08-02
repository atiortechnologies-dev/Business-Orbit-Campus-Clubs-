import { Link } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';
import ComingSoon from '@/components/ui/ComingSoon';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

export default function ApplicationRejectedPage() {
  useDocumentTitle('Application Not Approved — BOCC');

  return (
    <div className="flex-1 flex items-center justify-center px-4 py-12 bg-canvas-bg">
      <div className="w-full max-w-md bg-surface-white border border-border-subtle rounded-xl shadow-card p-8 text-center">
        <div className="w-16 h-16 rounded-full bg-error/10 flex items-center justify-center mx-auto mb-5">
          <AlertCircle size={32} strokeWidth={2} className="text-error" />
        </div>
        <span className="inline-block font-inter text-caption font-semibold uppercase tracking-wide text-error bg-error/15 px-3 py-1 rounded-full mb-3">
          Application Not Approved
        </span>
        <h1 className="font-poppins font-bold text-card text-text-heading mb-2">
          We could not approve this application
        </h1>
        <p className="font-inter text-small text-text-body leading-relaxed mb-5">
          Your submission did not pass the current review criteria. Please review the reason below
          and update the required details before resubmitting.
        </p>

        <div className="bg-canvas-bg border border-border-subtle rounded-lg p-4 text-left mb-4">
          <p className="font-poppins font-semibold text-small text-text-heading mb-1">Reason for review</p>
          <p className="font-inter text-small text-text-muted">
            One or more submitted documents were incomplete or did not meet the required format.
          </p>
        </div>

        <p className="font-inter text-small text-text-muted mb-6">
          Our support team can help you correct the issue quickly and guide you through the next step.
        </p>

        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            to="/login"
            className="flex-1 bg-action-bg text-action-text font-poppins font-semibold text-small px-5 py-2.5 rounded-md hover:opacity-90 transition-all"
          >
            Back to Dashboard
          </Link>
          <ComingSoon label="Contact Support" position="top" inline className="flex-1 flex items-center justify-center border border-border-subtle text-text-heading font-inter font-medium text-small px-5 py-2.5 rounded-md">
            Contact Support
          </ComingSoon>
        </div>
      </div>
    </div>
  );
}
