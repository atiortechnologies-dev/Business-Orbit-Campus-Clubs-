import { Link } from 'react-router-dom';
import { ChevronRight, CheckCircle2, Hourglass, Users, Star, Lock, Info, Eye, Rocket } from 'lucide-react';
import DashboardShell from '@/components/dashboard/DashboardShell';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import ComingSoon from '@/components/ui/ComingSoon';
import PlaceholderGraphic from '@/components/ui/PlaceholderGraphic';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

const STEPS = [
  { key: 'submitted', label: 'Submission Completed', date: 'Oct 12, 2023', status: 'done' },
  { key: 'review', label: 'Under Review', date: 'Ongoing', status: 'current' },
  { key: 'meeting', label: 'Review Meeting', date: 'Pending', status: 'upcoming' },
  { key: 'approved', label: 'Stage Approved', date: 'Pending', status: 'upcoming' },
];

const STEP_ICON = { submitted: CheckCircle2, review: Hourglass, meeting: Users, approved: Star };

const SUMMARY = [
  { label: 'Submission Date', value: 'October 12, 2023' },
  { label: 'Stage Name', value: 'Stage 4: Traction' },
  { label: 'Expected Timeline', value: '5–7 business days from submission date.', span: true },
];

export default function TractionReviewPage() {
  useDocumentTitle('Traction Review — BOCC');

  const completedSteps = STEPS.filter((s) => s.status === 'done').length;
  const progressPercent = (completedSteps / (STEPS.length - 1)) * 100;

  return (
    <DashboardShell pageId="traction-review">
      <nav className="mb-2 flex items-center gap-2 text-text-muted font-inter font-normal text-small">
        <Link to="/dashboard" className="hover:text-text-heading transition-colors">Dashboard</Link>
        <ChevronRight size={14} strokeWidth={2} />
        <Link to="/build-startup/journey/traction" className="hover:text-text-heading transition-colors">Traction</Link>
        <ChevronRight size={14} strokeWidth={2} />
        <span className="text-text-heading font-semibold">Review</span>
      </nav>

      <div className="mb-8">
        <h1 className="font-poppins font-semibold text-page text-text-heading mb-2">Traction Review</h1>
        <p className="font-inter text-body text-text-body max-w-2xl">
          Your submission has been received and is currently being reviewed by the BOCC team.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Submission progress stepper */}
        <div className="col-span-12 bg-surface-white border border-border-subtle rounded-lg p-8">
          <div className="flex items-center justify-between mb-10">
            <h3 className="font-poppins font-semibold text-body text-text-heading">Submission Progress</h3>
            <Badge variant="brand">Active Stage</Badge>
          </div>

          <div className="relative flex items-center justify-between w-full">
            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-border-subtle -translate-y-1/2 z-0" />
            <div
              className="absolute top-1/2 left-0 h-0.5 bg-brand-black -translate-y-1/2 z-0 transition-all duration-1000 ease-in-out"
              style={{ width: `${progressPercent}%` }}
            />
            {STEPS.map((step) => {
              const Icon = STEP_ICON[step.key];
              const done = step.status === 'done';
              const current = step.status === 'current';
              return (
                <div
                  key={step.key}
                  className={`relative z-10 flex flex-col items-center text-center ${step.status === 'upcoming' ? 'opacity-40' : ''}`}
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center border-4 border-surface-white ${
                      done || current ? 'bg-brand-black text-white' : 'bg-surface-white border-2 border-border-subtle text-text-muted'
                    } ${current ? 'animate-pulse' : ''}`}
                  >
                    <Icon size={18} strokeWidth={2} />
                  </div>
                  <p className={`mt-4 font-inter text-caption ${done || current ? 'text-text-heading font-semibold' : 'text-text-muted'}`}>
                    {step.label}
                  </p>
                  <p className="text-[10px] text-text-muted font-inter">{step.date}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Submission summary */}
        <div className="col-span-12 lg:col-span-7 bg-surface-white border border-border-subtle rounded-lg p-8 flex flex-col justify-between">
          <div>
            <h4 className="font-poppins font-semibold text-card text-text-heading mb-6">Submission Summary</h4>
            <div className="grid grid-cols-2 gap-y-6">
              {SUMMARY.map(({ label, value, span }) => (
                <div key={label} className={span ? 'col-span-2' : ''}>
                  <p className="font-inter text-caption text-text-muted uppercase tracking-wider mb-1">{label}</p>
                  <p className="font-inter font-semibold text-small text-text-heading">{value}</p>
                </div>
              ))}
              <div>
                <p className="font-inter text-caption text-text-muted uppercase tracking-wider mb-1">Current Status</p>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-brand-black animate-pulse" />
                  <p className="font-inter font-semibold text-small text-text-heading">Under Review</p>
                </div>
              </div>
              <div>
                <p className="font-inter text-caption text-text-muted uppercase tracking-wider mb-1">Reviewer</p>
                <p className="font-inter font-semibold text-small text-text-muted italic">Assigned / Pending</p>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-divider-line flex gap-3">
            <ComingSoon label="View Submission" position="top" inline>
              <span className="inline-flex items-center gap-2 min-h-[44px] px-5 py-2.5 rounded-md bg-action-bg text-action-text font-poppins font-semibold text-sm cursor-pointer">
                <Eye size={16} strokeWidth={2} />
                View Submission
              </span>
            </ComingSoon>
            <Link to="/dashboard">
              <Button variant="outline">Go to Dashboard</Button>
            </Link>
          </div>
        </div>

        {/* Editing restricted / next stage preview */}
        <div className="col-span-12 lg:col-span-5 bg-canvas-bg border border-border-subtle rounded-lg p-8 flex flex-col">
          <div className="w-12 h-12 rounded-full border border-brand-black flex items-center justify-center mb-6">
            <Lock size={20} strokeWidth={2} className="text-brand-black" />
          </div>
          <h4 className="font-poppins font-semibold text-card text-text-heading mb-3">Editing Restricted</h4>
          <p className="font-inter text-small text-text-body mb-6 leading-relaxed">
            While your traction data is being evaluated, the submission form is locked to
            ensure review integrity. No further edits can be made at this time.
          </p>

          <div className="bg-surface-white border border-border-subtle p-4 rounded-lg mb-8">
            <div className="flex items-start gap-3">
              <Info size={16} strokeWidth={2} className="text-text-muted shrink-0 mt-0.5" />
              <p className="font-inter text-small text-text-muted">
                Once approved, you will receive an invitation for the review meeting. The{' '}
                <strong className="text-text-heading font-semibold">Launch</strong> stage will
                unlock immediately after meeting completion.
              </p>
            </div>
          </div>

          <PlaceholderGraphic
            icon={Rocket}
            label="Stage 5: Launch (Preview)"
            className="mt-auto aspect-video rounded-lg"
          />
        </div>
      </div>

      <div className="mt-12 text-center border-t border-divider-line pt-10 pb-4">
        <p className="font-inter text-caption text-text-muted">BOCC Student Portal © 2024</p>
        <p className="font-inter text-[10px] text-text-muted opacity-60 mt-2 uppercase tracking-[0.2em]">
          Excellence through precision
        </p>
      </div>
    </DashboardShell>
  );
}
