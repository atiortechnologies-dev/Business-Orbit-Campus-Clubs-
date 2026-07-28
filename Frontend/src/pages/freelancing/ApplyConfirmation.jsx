import { Link } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';
import DashboardShell from '@/components/dashboard/DashboardShell';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

export default function ApplyConfirmationPage() {
  useDocumentTitle('Application Submitted — BOCC');

  return (
    <DashboardShell pageId="apply-confirmation">
      <section className="text-center max-w-md mx-auto py-16">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-brand-black rounded-full mb-6">
          <CheckCircle2 size={28} strokeWidth={2} className="text-accent-neon" />
        </div>
        <h1 className="font-poppins font-semibold text-page text-text-heading mb-3">Application Submitted Successfully</h1>
        <p className="font-inter text-body text-text-body mb-8">
          Your application has been sent to the company. You can track its progress under My Applications.
        </p>
        <div className="flex flex-col gap-3">
          <Link to="/freelancing/applications" className="w-full px-6 py-3 bg-action-bg text-action-text rounded-lg font-poppins font-semibold text-small hover:opacity-90 transition-all">
            Go to My Applications
          </Link>
          <Link to="/freelancing" className="w-full px-6 py-3 border border-border-subtle rounded-lg font-poppins font-semibold text-small text-text-heading hover:bg-canvas-bg transition-colors">
            Browse More Opportunities
          </Link>
        </div>
      </section>
    </DashboardShell>
  );
}
