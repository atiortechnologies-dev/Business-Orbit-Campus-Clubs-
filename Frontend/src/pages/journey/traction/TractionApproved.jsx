import { Link } from 'react-router-dom';
import {
  ChevronRight,
  Check,
  MessageCircle,
  CheckCircle2,
  Rocket,
  ArrowRight,
  Trophy,
  Award,
} from 'lucide-react';
import DashboardShell from '@/components/dashboard/DashboardShell';
import PlaceholderGraphic from '@/components/ui/PlaceholderGraphic';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

const STEPS = ['Submission Completed', 'Under Review', 'Review Meeting Completed', 'Stage Approved'];

const APPROVAL_SUMMARY = [
  { label: 'Submission Date', value: 'October 12, 2023' },
  { label: 'Approval Date', value: 'November 05, 2023' },
  { label: 'Reviewer', value: 'Dr. Sarah Jenkins' },
  { label: 'Stage Completed', value: 'Traction (Stage 4)' },
];

const KEY_FEEDBACK = [
  'Excellent customer validation process and metrics collection.',
  'Strong market traction evidenced by pilot users.',
  'MVP improvements highly appreciated by the review board.',
];

const NEXT_STAGE = [
  { label: 'Purpose', value: 'Final market entry and scaling strategy implementation.' },
  { label: 'Deliverables', value: 'Go-To-Market Plan, Sales Pipeline, Growth Roadmap.' },
  { label: 'Timeline', value: 'Estimated 12 weeks to graduation.' },
];

const JOURNEY_PROGRESS = [
  { label: 'Ideation', status: 'Done' },
  { label: 'Validation', status: 'Done' },
  { label: 'Prototype', status: 'Done' },
  { label: 'Traction', status: 'Approved', emphasis: true },
  { label: 'Launch', status: 'Unlocked', pending: true },
];

const MILESTONES = [
  { label: 'Traction Approved', time: 'Today, 2:30 PM', latest: true },
  { label: 'Launch Stage Activated', time: 'Today, 2:31 PM' },
  { label: 'Review Completed', time: 'Yesterday' },
];

export default function TractionApprovedPage() {
  useDocumentTitle('Traction Approved — BOCC');

  return (
    <DashboardShell pageId="traction-approved">
      <nav className="mb-2 flex items-center gap-2 text-text-muted font-inter font-normal text-small">
        <Link to="/dashboard" className="hover:text-text-heading transition-colors">Dashboard</Link>
        <ChevronRight size={14} strokeWidth={2} />
        <Link to="/build-startup/journey/traction" className="hover:text-text-heading transition-colors">Traction</Link>
        <ChevronRight size={14} strokeWidth={2} />
        <span className="text-text-heading font-semibold">Approved</span>
      </nav>

      <div className="mb-10">
        <p className="font-inter font-semibold text-caption text-text-heading uppercase tracking-widest mb-2">
          Congratulations!
        </p>
        <h1 className="font-poppins font-semibold text-page text-text-heading mb-3">Traction Approved</h1>
        <p className="font-inter text-body text-text-body max-w-2xl">
          Your startup has successfully completed the Traction stage. You can now begin the
          final Launch stage of your startup journey.
        </p>
      </div>

      {/* Progress timeline — all complete */}
      <div className="mb-10 grid grid-cols-4 gap-6 relative">
        <div className="absolute top-6 left-0 w-full h-0.5 bg-brand-black/30 z-0" />
        {STEPS.map((label) => (
          <div key={label} className="relative z-10 flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full bg-brand-black text-white flex items-center justify-center mb-3 border-4 border-canvas-bg">
              <Check size={20} strokeWidth={2} />
            </div>
            <p className="font-inter font-semibold text-caption text-text-heading">{label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Left column */}
        <div className="lg:col-span-8 space-y-6">

          <div className="bg-surface-white border border-border-subtle rounded-lg p-8 flex flex-col md:flex-row gap-6 items-center">
            <PlaceholderGraphic icon={Award} label="Achievement Badge" className="w-32 h-32 shrink-0 rounded-lg" />
            <div className="flex-1 grid grid-cols-2 gap-4 w-full">
              {APPROVAL_SUMMARY.map(({ label, value }) => (
                <div key={label}>
                  <p className="font-inter text-caption text-text-muted uppercase tracking-wider mb-1">{label}</p>
                  <p className="font-inter text-small text-text-heading">{value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-surface-white border border-border-subtle rounded-lg p-8">
              <h3 className="font-poppins font-semibold text-body text-text-heading mb-6 flex items-center gap-2">
                <MessageCircle size={18} strokeWidth={2} />
                Key Feedback
              </h3>
              <ul className="space-y-4">
                {KEY_FEEDBACK.map((text) => (
                  <li key={text} className="flex items-start gap-3">
                    <CheckCircle2 size={18} strokeWidth={2} className="text-text-muted shrink-0 mt-0.5" />
                    <p className="font-inter text-small text-text-body">{text}</p>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-surface-white border border-border-subtle rounded-lg p-8">
              <h3 className="font-poppins font-semibold text-body text-text-heading mb-2 flex items-center gap-2">
                <Rocket size={18} strokeWidth={2} />
                Stage 5 – Launch
              </h3>
              <p className="font-inter font-semibold text-caption text-text-muted mb-6">NEXT UP IN YOUR JOURNEY</p>
              <div className="space-y-4">
                {NEXT_STAGE.map(({ label, value }) => (
                  <div key={label}>
                    <p className="font-inter text-caption text-text-muted uppercase tracking-wider">{label}</p>
                    <p className="font-inter text-small text-text-heading">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-4">
            <Link
              to="/build-startup/journey/launch"
              className="inline-flex items-center gap-3 bg-brand-black text-white px-8 py-4 rounded-lg font-poppins font-semibold text-body hover:opacity-90 active:scale-[0.98] transition-all"
            >
              Start Launch Stage
              <ArrowRight size={20} strokeWidth={2} />
            </Link>
          </div>
        </div>

        {/* Right sidebar */}
        <div className="lg:col-span-4 space-y-6">

          <div className="bg-surface-white border border-border-subtle rounded-lg p-6">
            <h4 className="font-inter font-semibold text-caption text-text-muted uppercase tracking-wider mb-4">
              Startup Journey Progress
            </h4>
            <div className="flex items-end gap-2 mb-2">
              <span className="font-poppins font-semibold text-card text-text-heading">80%</span>
              <span className="font-inter text-small text-text-muted mb-1">Completed</span>
            </div>
            <div className="w-full bg-canvas-bg rounded-full h-3 mb-6 overflow-hidden">
              <div className="bg-brand-black h-full rounded-full" style={{ width: '80%' }} />
            </div>
            <ul className="space-y-3">
              {JOURNEY_PROGRESS.map(({ label, status, emphasis, pending }) => (
                <li key={label} className="flex items-center justify-between font-inter text-small">
                  <span className="flex items-center gap-2 text-text-body">
                    <CheckCircle2
                      size={18}
                      strokeWidth={2}
                      className={pending ? 'text-text-muted' : 'text-brand-black'}
                    />
                    {label}
                  </span>
                  <span className={emphasis || pending ? 'font-semibold text-text-heading' : 'text-text-muted'}>
                    {status}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-brand-black text-white rounded-lg p-6 text-center">
            <div className="w-20 h-20 mx-auto mb-4 bg-white flex items-center justify-center rounded-full">
              <Trophy size={36} strokeWidth={2} className="text-brand-black" />
            </div>
            <h4 className="font-poppins font-semibold text-body mb-2">Launch Stage Unlocked</h4>
            <span className="inline-block px-4 py-1 bg-white text-brand-black rounded-full font-inter font-semibold text-caption uppercase tracking-wider">
              Ready for Launch
            </span>
          </div>

          <div className="bg-surface-white border border-border-subtle rounded-lg p-6">
            <h4 className="font-inter font-semibold text-caption text-text-muted uppercase tracking-wider mb-6 border-b border-divider-line pb-2">
              Recent Milestones
            </h4>
            <div className="space-y-6">
              {MILESTONES.map((item) => (
                <div key={item.label} className="relative pl-6 border-l-2 border-border-subtle">
                  <div
                    className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full border-4 border-canvas-bg ${
                      item.latest ? 'bg-brand-black' : 'bg-border-subtle'
                    }`}
                  />
                  <p className="font-inter font-semibold text-caption text-text-heading leading-none mb-1">{item.label}</p>
                  <p className="font-inter text-small text-text-muted">{item.time}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
