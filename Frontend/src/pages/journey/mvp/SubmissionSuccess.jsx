import { Link } from 'react-router-dom';
import { CheckCircle2, ArrowRight, ChevronRight, Calendar, ShieldCheck } from 'lucide-react';
import DashboardShell from '@/components/dashboard/DashboardShell';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

// Builds a minimal .ics file client-side and triggers a download — no backend or calendar-API integration needed for a single manual event.
function downloadReviewMeetingIcs() {
  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//BOCC//Journey//EN',
    'BEGIN:VEVENT',
    'UID:mvp-review-meeting@bocc',
    'DTSTART:20261024T140000Z',
    'DTEND:20261024T143000Z',
    'SUMMARY:BOCC MVP Review Meeting',
    'DESCRIPTION:Technical review of your submitted MVP.',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');

  const blob = new Blob([ics], { type: 'text/calendar' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'mvp-review-meeting.ics';
  a.click();
  URL.revokeObjectURL(url);
}

export default function MvpSubmissionSuccessPage() {
  useDocumentTitle('MVP Submitted — BOCC');

  return (
    <DashboardShell pageId="mvp-submission-success">
      <nav className="mb-2 flex items-center gap-2 text-text-muted font-inter font-normal text-small">
        <Link to="/dashboard" className="hover:text-text-heading transition-colors">Dashboard</Link>
        <ChevronRight size={14} strokeWidth={2} />
        <Link to="/build-startup/journey/mvp" className="hover:text-text-heading transition-colors">MVP</Link>
        <ChevronRight size={14} strokeWidth={2} />
        <span className="text-text-heading font-semibold">Submitted</span>
      </nav>

      <div className="max-w-xl mx-auto text-center bg-surface-white border border-border-subtle rounded-lg shadow-card p-10 mt-8">
        <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 size={32} strokeWidth={2} className="text-success" />
        </div>

        <span className="inline-block bg-warning/10 text-warning font-poppins font-semibold text-caption px-3 py-1 rounded-full mb-4">
          Technical Review
        </span>

        <h1 className="font-poppins font-semibold text-section text-text-heading mb-2">
          MVP Submitted Successfully
        </h1>
        <p className="font-inter text-body text-text-body">
          Submission ID: <span className="font-semibold text-text-heading">SUB-9921</span>
        </p>
        <p className="font-inter font-semibold text-body text-text-heading mt-1">
          Expected review timeline: 5 business days.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6 text-left">
          <div className="flex items-center gap-3 bg-canvas-bg border border-border-subtle rounded-lg p-4">
            <Calendar size={18} strokeWidth={2} className="text-text-muted shrink-0" />
            <div>
              <p className="font-inter text-caption text-text-muted">Next Review Meeting</p>
              <p className="font-poppins font-semibold text-small text-text-heading">Oct 24</p>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-canvas-bg border border-border-subtle rounded-lg p-4">
            <ShieldCheck size={18} strokeWidth={2} className="text-text-muted shrink-0" />
            <div>
              <p className="font-inter text-caption text-text-muted">Next Step</p>
              <p className="font-poppins font-semibold text-small text-text-heading">Incubation Proof</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-8">
          <Link
            to="/build-startup/journey/mvp/incubation-proof"
            className="inline-flex items-center gap-2 bg-action-bg text-action-text px-6 py-2.5 rounded-md hover:opacity-90 active:scale-[0.98] transition-all font-poppins font-semibold text-small"
          >
            View Submission
            <ArrowRight size={16} strokeWidth={2} />
          </Link>
          <Link
            to="/dashboard"
            className="font-poppins font-semibold text-small text-text-heading hover:opacity-80 transition-opacity px-6 py-2.5"
          >
            Return to Dashboard
          </Link>
        </div>
      </div>

      <div className="flex justify-center mt-6">
        <button
          type="button"
          onClick={downloadReviewMeetingIcs}
          className="flex items-center gap-1.5 bg-surface-white border border-border-subtle px-4 py-2 rounded-lg font-poppins font-semibold text-caption text-text-heading hover:bg-canvas-bg transition-colors"
        >
          <Calendar size={14} strokeWidth={2} /> Add to Calendar
        </button>
      </div>
    </DashboardShell>
  );
}
