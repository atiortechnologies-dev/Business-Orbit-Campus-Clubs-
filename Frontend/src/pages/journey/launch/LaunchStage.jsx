import { Link } from 'react-router-dom';
import { ChevronRight, ArrowRight, Rocket, CheckCircle2 } from 'lucide-react';
import DashboardShell from '@/components/dashboard/DashboardShell';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

const LAUNCH_STEPS = [
  {
    title: 'Launch Submission',
    path: '/build-startup/journey/launch/submission',
    description: 'Provide final product links, release details, and launch strategy summaries.',
    completed: false,
  },
  {
    title: 'Final Pitch Deck Upload',
    path: '/build-startup/journey/launch/pitch-deck',
    description: 'Upload your finalized pitch deck for investor presentations and committee review.',
    completed: false,
  },
  {
    title: 'Launch Insights & Proof Upload',
    path: '/build-startup/journey/launch/proof-upload',
    description: 'Upload photos, videos, media coverage, and social proof from your launch event.',
    completed: false,
  },
];

export default function LaunchStagePage() {
  useDocumentTitle('Launch Stage — BOCC');

  return (
    <DashboardShell pageId="launch-stage">
      <nav className="mb-2 flex items-center gap-2 text-text-muted font-inter font-normal text-small">
        <Link to="/dashboard" className="hover:text-text-heading transition-colors">Dashboard</Link>
        <ChevronRight size={14} strokeWidth={2} />
        <Link to="/build-startup/journey" className="hover:text-text-heading transition-colors">Startup Journey</Link>
        <ChevronRight size={14} strokeWidth={2} />
        <span className="text-text-heading font-semibold">Launch</span>
      </nav>

      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-lg bg-brand-black flex items-center justify-center shrink-0">
          <Rocket size={20} strokeWidth={2} className="text-accent-neon" />
        </div>
        <h1 className="font-poppins font-semibold text-page text-text-heading">Stage 5: Launch</h1>
      </div>
      <p className="font-inter text-body text-text-body max-w-2xl mb-8">
        Prepare your startup for public launch. Submit your final product details, upload your
        investor pitch deck, and share proof of your launch event.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {LAUNCH_STEPS.map((step, index) => (
          <div key={step.path} className="bg-surface-white border border-border-subtle rounded-lg p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="font-inter font-semibold text-caption text-text-muted uppercase tracking-wider">
                  Step 0{index + 1}
                </span>
                {step.completed ? (
                  <CheckCircle2 size={20} className="text-brand-black" />
                ) : (
                  <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded bg-canvas-bg text-text-muted border border-border-subtle">
                    In Progress
                  </span>
                )}
              </div>
              <h3 className="font-poppins font-semibold text-card text-text-heading mb-2">
                {step.title}
              </h3>
              <p className="font-inter text-small text-text-body mb-6">
                {step.description}
              </p>
            </div>
            <Link
              to={step.path}
              className="inline-flex items-center gap-2 font-poppins font-semibold text-small text-text-heading hover:opacity-80 transition-opacity"
            >
              Start Step <ArrowRight size={16} strokeWidth={2} />
            </Link>
          </div>
        ))}
      </div>

      <div className="bg-canvas-bg border border-border-subtle rounded-lg p-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-surface-white border border-border-subtle flex items-center justify-center text-brand-black shrink-0">
            <Rocket size={24} strokeWidth={2} />
          </div>
          <div>
            <h4 className="font-poppins font-semibold text-body text-text-heading">Ready for Market Entry?</h4>
            <p className="font-inter text-small text-text-muted">
              Complete all three steps to submit your startup for the final Demo Day evaluation.
            </p>
          </div>
        </div>
        <Link
          to="/build-startup/journey/launch/submission"
          className="bg-action-bg text-action-text px-6 py-3 rounded-md hover:opacity-90 active:scale-[0.98] transition-all font-poppins font-semibold text-small shrink-0"
        >
          Begin Submission
        </Link>
      </div>
    </DashboardShell>
  );
}
