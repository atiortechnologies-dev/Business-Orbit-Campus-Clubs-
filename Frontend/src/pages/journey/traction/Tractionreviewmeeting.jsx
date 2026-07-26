import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ChevronRight,
  Check,
  Video,
  Calendar,
  Clock,
  Hourglass,
  Link2,
  Globe,
  User,
  Building2,
  Mail,
  Info,
  ArrowLeft,
  ExternalLink,
} from 'lucide-react';
import DashboardShell from '@/components/dashboard/DashboardShell';
import Button from '@/components/ui/Button';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

const STEPS = [
  { label: 'Submission Completed', status: 'done' },
  { label: 'Under Review', status: 'done' },
  { label: 'Review Meeting', status: 'current' },
  { label: 'Stage Approved', status: 'upcoming' },
];

const AGENDA = [
  "Introduction and Stage 4 Progress Overview (5 mins)",
  'Deep-dive into User Acquisition and Retention Metrics (15 mins)',
  'Review of Customer Feedback and Pivot Decisions (10 mins)',
  "Resource Allocation and Roadmap for 'Launch' (10 mins)",
  'Next Steps & Decision Timeline (5 mins)',
];

const CHECKLIST = [
  { id: 'demo', label: 'Updated Product Demo (Video or Live)', done: false },
  { id: 'metrics', label: 'User Acquisition Metrics Spreadsheet', done: true },
  { id: 'feedback', label: 'Summarized Customer Feedback Log', done: false },
  { id: 'burn', label: 'Financial Burn Rate & Projections', done: false },
];

const SUMMARY = [
  { label: 'Submission Date', value: 'October 12, 2023' },
  { label: 'Stage', value: 'Stage 4 - Traction' },
  { label: 'Current Status', value: 'Meeting Scheduled' },
  { label: 'Reviewer', value: 'Dr. Sarah Jenkins' },
  { label: 'Reviewer Preliminary Notes', value: '"The user growth numbers look promising for month 3. I\'d like to discuss the specific churn triggers you\'ve identified during our call."', span: true },
  { label: 'Estimated Decision Timeline', value: '48 hours post-meeting' },
];

export default function TractionReviewMeetingPage() {
  useDocumentTitle('Traction Review Meeting — BOCC');
  const [checklist, setChecklist] = useState(CHECKLIST);

  const toggle = (id) =>
    setChecklist((prev) => prev.map((item) => (item.id === id ? { ...item, done: !item.done } : item)));

  return (
    <DashboardShell pageId="traction-review-meeting">
      <nav className="mb-2 flex items-center gap-2 text-text-muted font-inter font-normal text-small">
        <Link to="/dashboard" className="hover:text-text-heading transition-colors">Dashboard</Link>
        <ChevronRight size={14} strokeWidth={2} />
        <Link to="/journey/traction" className="hover:text-text-heading transition-colors">Traction</Link>
        <ChevronRight size={14} strokeWidth={2} />
        <span className="text-text-heading font-semibold">Review Meeting</span>
      </nav>

      <div className="mb-10">
        <h1 className="font-poppins font-semibold text-page text-text-heading mb-2">Traction Review Meeting</h1>
        <p className="font-inter text-body text-text-body max-w-2xl">
          Your submission has passed the initial review. A review meeting has been scheduled
          to discuss your traction progress before moving to the Launch stage.
        </p>
      </div>

      {/* Progress stepper */}
      <div className="mb-10 relative flex items-center justify-between">
        <div className="absolute top-5 left-0 w-full h-px bg-border-subtle -translate-y-1/2 z-0" />
        {STEPS.map((step) => (
          <div key={step.label} className="relative z-10 flex flex-col items-center text-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center border-4 border-canvas-bg ${
                step.status === 'done'
                  ? 'bg-brand-black text-white'
                  : step.status === 'current'
                  ? 'bg-surface-white border-2 border-brand-black ring-4 ring-brand-black/10'
                  : 'bg-surface-white border border-border-subtle'
              }`}
            >
              {step.status === 'done' && <Check size={18} strokeWidth={2} />}
              {step.status === 'current' && <span className="w-2.5 h-2.5 rounded-full bg-brand-black animate-pulse" />}
              {step.status === 'upcoming' && <span className="w-2.5 h-2.5 rounded-full bg-border-subtle" />}
            </div>
            <span
              className={`mt-3 font-inter text-caption ${
                step.status === 'upcoming' ? 'text-text-muted' : 'font-semibold text-text-heading'
              }`}
            >
              {step.label}
            </span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Left column */}
        <div className="lg:col-span-8 space-y-6">

          <section className="bg-surface-white border border-border-subtle rounded-lg p-8">
            <div className="flex justify-between items-start mb-6 gap-4 flex-wrap">
              <h3 className="font-poppins font-semibold text-body text-text-heading">Meeting Details</h3>
              <div className="flex gap-3">
                <Button size="sm">
                  <Video size={16} strokeWidth={2} />
                  Join Meeting
                </Button>
                <Button variant="outline" size="sm">
                  <Calendar size={16} strokeWidth={2} />
                  Add to Calendar
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-text-body font-inter text-small">
                  <Calendar size={18} strokeWidth={2} className="text-text-muted" />
                  <span><span className="font-semibold text-text-heading">Date:</span> October 24, 2023</span>
                </div>
                <div className="flex items-center gap-3 text-text-body font-inter text-small">
                  <Clock size={18} strokeWidth={2} className="text-text-muted" />
                  <span><span className="font-semibold text-text-heading">Time:</span> 10:00 AM – 10:45 AM (EST)</span>
                </div>
                <div className="flex items-center gap-3 text-text-body font-inter text-small">
                  <Hourglass size={18} strokeWidth={2} className="text-text-muted" />
                  <span><span className="font-semibold text-text-heading">Duration:</span> 45 Minutes</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-text-body font-inter text-small">
                  <Link2 size={18} strokeWidth={2} className="text-text-muted" />
                  <span><span className="font-semibold text-text-heading">Platform:</span> Google Meet</span>
                </div>
                <div className="flex items-center gap-3 text-text-body font-inter text-small overflow-hidden">
                  <Globe size={18} strokeWidth={2} className="text-text-muted shrink-0" />
                  <span className="text-brand-black underline truncate">meet.google.com/boc-trac-vsm</span>
                </div>
                <div className="flex items-center gap-3 text-text-body font-inter text-small">
                  <User size={18} strokeWidth={2} className="text-text-muted" />
                  <span><span className="font-semibold text-text-heading">Reviewer:</span> Dr. Sarah Jenkins</span>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-divider-line">
              <h4 className="font-inter font-semibold text-caption text-text-heading uppercase tracking-wider mb-3">
                Meeting Agenda
              </h4>
              <ul className="space-y-2 text-text-body font-inter text-small list-disc list-inside">
                {AGENDA.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </div>
          </section>

          <section className="bg-surface-white border border-border-subtle rounded-lg p-8">
            <h3 className="font-poppins font-semibold text-body text-text-heading mb-6">Preparation Checklist</h3>
            <div className="grid grid-cols-1 gap-3">
              {checklist.map((item) => (
                <label
                  key={item.id}
                  className={`flex items-center gap-4 p-4 border border-border-subtle rounded-lg cursor-pointer hover:bg-canvas-bg transition-all ${
                    item.done ? 'bg-canvas-bg opacity-70' : ''
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={item.done}
                    onChange={() => toggle(item.id)}
                    className="w-5 h-5 rounded border-border-subtle text-brand-black focus:ring-brand-black"
                  />
                  <span className="font-inter text-small text-text-body">{item.label}</span>
                </label>
              ))}
            </div>
          </section>

          <section className="bg-surface-white border border-border-subtle rounded-lg p-8">
            <h3 className="font-poppins font-semibold text-body text-text-heading mb-6">Submission Summary</h3>
            <div className="grid grid-cols-2 gap-y-6 gap-x-12">
              {SUMMARY.map(({ label, value, span }) => (
                <div key={label} className={span ? 'col-span-2' : ''}>
                  <p className="font-inter text-caption text-text-muted uppercase tracking-wider mb-1">{label}</p>
                  <p className={`font-inter text-small text-text-heading ${span ? 'italic' : ''}`}>{value}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right sidebar */}
        <div className="lg:col-span-4 space-y-6">

          <div className="bg-surface-white border-2 border-brand-black rounded-lg p-6">
            <div className="flex items-center gap-2 mb-6">
              <span className="w-3 h-3 bg-brand-black rounded-full" />
              <span className="font-inter font-semibold text-caption uppercase tracking-widest text-text-heading">
                Meeting Scheduled
              </span>
            </div>
            <div className="text-center py-4 border-y border-divider-line my-4">
              <p className="font-inter text-caption text-text-muted mb-2">Starts in:</p>
              <p className="font-poppins font-semibold text-headline-md text-text-heading tabular-nums">02d : 04h : 12m</p>
            </div>
            <p className="font-inter text-caption text-text-muted text-center">
              Please ensure you are connected 5 minutes early.
            </p>
          </div>

          <div className="bg-surface-white border border-border-subtle rounded-lg p-6">
            <h4 className="font-inter font-semibold text-caption text-text-muted uppercase tracking-wider mb-4">
              Assigned Reviewer
            </h4>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-full placeholder-box border border-border-subtle shrink-0" />
              <div>
                <p className="font-poppins font-semibold text-small text-text-heading">Dr. Sarah Jenkins</p>
                <p className="font-inter text-caption text-text-muted">Senior Venture Lead</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-3 font-inter text-small text-text-muted">
                <Building2 size={16} strokeWidth={2} />
                <span>Global Entrepreneurship Lab</span>
              </div>
              <div className="flex items-center gap-3 font-inter text-small text-text-muted">
                <Mail size={16} strokeWidth={2} />
                <span>s.jenkins@bocc-edu.org</span>
              </div>
            </div>
            <button
              type="button"
              className="w-full mt-6 py-2 font-poppins font-semibold text-small border border-border-subtle rounded-lg hover:bg-canvas-bg transition-all"
            >
              Send a message
            </button>
          </div>

          <div className="bg-canvas-bg border border-border-subtle rounded-lg p-6">
            <div className="flex items-center gap-2 mb-3">
              <Info size={16} strokeWidth={2} className="text-text-heading" />
              <h4 className="font-inter font-semibold text-caption text-text-heading uppercase">Post-Meeting Process</h4>
            </div>
            <p className="font-inter text-caption text-text-muted leading-relaxed">
              Following the traction review, the reviewer will submit a recommendation to the
              Stage Board. You will receive a final decision and feedback within 48 hours. If
              approved, you will be granted access to 'Stage 5 - Launch'.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-16 flex items-center justify-between border-t border-divider-line pt-8">
        <Link
          to="/dashboard"
          className="flex items-center gap-2 text-text-muted hover:text-text-heading transition-colors font-poppins font-semibold text-small"
        >
          <ArrowLeft size={18} strokeWidth={2} />
          Back to Dashboard
        </Link>
        <Link
          to="/build-startup/journey/traction/product-submission"
          className="flex items-center gap-2 text-text-heading font-poppins font-semibold text-small hover:underline"
        >
          View Submitted Documents
          <ExternalLink size={16} strokeWidth={2} />
        </Link>
      </div>
    </DashboardShell>
  );
}