import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  TrendingUp,
  Target,
  ShieldCheck,
  BarChart3,
  MessageSquare,
  GitBranch,
  ChevronRight,
  Check,
  MousePointerClick,
  Lock,
  Lightbulb,
  PlayCircle,
  Clock,
  ListChecks,
} from 'lucide-react';
import DashboardShell from '@/components/dashboard/DashboardShell';
import ComingSoon from '@/components/ui/ComingSoon';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

const OBJECTIVES = [
  'Master various user acquisition channels and conversion optimization techniques.',
  'Implement systematic feedback loops to drive product iteration.',
  'Understand key performance indicators (KPIs) for early-stage growth.',
];

const SUCCESS_CRITERIA = [
  { title: 'User Base Growth', desc: 'Minimum of 50 active users engaged with the core value proposition.' },
  { title: 'Feedback Saturation', desc: 'At least 15 detailed qualitative interviews conducted.' },
];

const DELIVERABLES = [
  { icon: BarChart3, title: 'User Acquisition Data', desc: 'CSV or Dashboard export of conversion rates.', href: '/build-startup/journey/traction/acquisition-tracker' },
  { icon: MessageSquare, title: 'Customer Feedback Log', desc: 'Summary of user pain points and suggestions.', href: '/build-startup/journey/traction/feedback-upload' },
  { icon: GitBranch, title: 'Updated Product Version', desc: 'Link to latest build with feedback-driven changes.', href: '/build-startup/journey/traction/product-submission' },
];

const ROADMAP = [
  { title: 'Ideation', date: 'Completed Sep 12', status: 'completed' },
  { title: 'Validation', date: 'Completed Oct 05', status: 'completed' },
  { title: 'Prototype', date: 'Completed Nov 20', status: 'completed' },
  { title: 'Traction', date: 'Current Stage', status: 'current' },
  { title: 'Launch', date: 'Locked', status: 'locked' },
];

export default function TractionStagePage() {
  useDocumentTitle('Stage 4: Traction — BOCC');
  const [starting, setStarting] = useState(false);

  const handleStart = () => {
    setStarting(true);
    setTimeout(() => setStarting(false), 1000);
  };

  return (
    <DashboardShell pageId="traction-stage">
      <nav className="mb-2 flex items-center gap-2 text-text-muted font-inter font-normal text-small">
        <Link to="/dashboard" className="hover:text-text-heading transition-colors">Dashboard</Link>
        <ChevronRight size={14} strokeWidth={2} />
        <Link to="/build-startup/journey" className="hover:text-text-heading transition-colors">Startup Journey</Link>
        <ChevronRight size={14} strokeWidth={2} />
        <span className="text-text-heading font-semibold">Traction</span>
      </nav>

      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-lg bg-brand-black flex items-center justify-center shrink-0">
          <TrendingUp size={20} strokeWidth={2} className="text-accent-neon" />
        </div>
        <h1 className="font-poppins font-semibold text-page text-text-heading">Stage 4: Traction</h1>
      </div>

      <div className="mb-8 bg-surface-white border border-border-subtle rounded-lg p-8 flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-56 aspect-square shrink-0 rounded-lg placeholder-box border border-border-subtle flex items-center justify-center">
          <span className="font-inter text-caption text-text-muted text-center px-2">Stage Visual</span>
        </div>

        <div className="flex-1">
          <p className="font-inter text-body text-text-body max-w-2xl mb-6">
            Validate your product in the real world by acquiring users, collecting feedback,
            and continuously improving your solution before launch.
          </p>

          <div className="flex flex-wrap gap-x-10 gap-y-3">
            <div className="flex items-center gap-2">
              <Clock size={18} strokeWidth={2} className="text-text-muted" />
              <span className="font-inter text-small text-text-body">
                <span className="font-semibold text-text-heading">Est. Completion:</span> 4 Weeks
              </span>
            </div>
            <div className="flex items-center gap-2">
              <ListChecks size={18} strokeWidth={2} className="text-text-muted" />
              <span className="font-inter text-small text-text-body">
                <span className="font-semibold text-text-heading">3 Deliverables</span> Required
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left column: stage details */}
        <div className="lg:col-span-8 space-y-6">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-surface-white border border-border-subtle rounded-lg shadow-card p-6">
              <div className="flex items-center gap-2 mb-4">
                <Target size={18} strokeWidth={2} className="text-text-body" />
                <h3 className="font-poppins font-semibold text-body text-text-heading">Learning Objectives</h3>
              </div>
              <div className="space-y-3">
                {OBJECTIVES.map((text, i) => (
                  <div key={text} className="flex gap-3">
                    <span className="font-poppins font-semibold text-small text-text-muted shrink-0">
                      {String(i + 1).padStart(2, '0')}.
                    </span>
                    <p className="font-inter text-small text-text-body">{text}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-surface-white border border-border-subtle rounded-lg shadow-card p-6">
              <div className="flex items-center gap-2 mb-4">
                <ShieldCheck size={18} strokeWidth={2} className="text-text-body" />
                <h3 className="font-poppins font-semibold text-body text-text-heading">Success Criteria</h3>
              </div>
              <div className="space-y-3">
                {SUCCESS_CRITERIA.map(({ title, desc }) => (
                  <div key={title} className="bg-canvas-bg rounded-lg border-l-4 border-brand-black p-3">
                    <p className="font-poppins font-semibold text-small text-text-heading">{title}</p>
                    <p className="font-inter text-caption text-text-muted mt-0.5">{desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-surface-white border border-border-subtle rounded-lg shadow-card overflow-hidden">
            <div className="px-6 py-4 bg-canvas-bg border-b border-border-subtle flex items-center justify-between">
              <h3 className="font-poppins font-semibold text-body text-text-heading">Stage Deliverables</h3>
              <span className="bg-brand-black text-white px-2 py-1 rounded text-[10px] font-poppins font-semibold uppercase tracking-wider">
                Required
              </span>
            </div>
            <div className="divide-y divide-border-subtle">
              {DELIVERABLES.map(({ icon: Icon, title, desc, href }) => {
                const row = (
                  <>
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-md bg-canvas-bg border border-border-subtle flex items-center justify-center shrink-0">
                        <Icon size={18} strokeWidth={2} className="text-text-muted" />
                      </div>
                      <div>
                        <p className="font-poppins font-semibold text-small text-text-heading">{title}</p>
                        <p className="font-inter text-caption text-text-muted">{desc}</p>
                      </div>
                    </div>
                    <ChevronRight
                      size={18}
                      strokeWidth={2}
                      className="text-text-muted opacity-0 group-hover:opacity-100 transition-opacity"
                    />
                  </>
                );

                return href ? (
                  <Link
                    key={title}
                    to={href}
                    className="px-6 py-4 flex items-center justify-between hover:bg-canvas-bg transition-colors group"
                  >
                    {row}
                  </Link>
                ) : (
                  <ComingSoon key={title} label={title} position="left" className="flex items-center justify-between px-6 py-4 hover:bg-canvas-bg transition-colors group w-full">
                    {row}
                  </ComingSoon>
                );
              })}
            </div>
          </div>

        </div>

        {/* Right column: progress, roadmap, mentor tip */}
        <div className="lg:col-span-4 space-y-6">

          <div className="bg-surface-white border-2 border-brand-black rounded-lg p-6">
            <p className="font-inter font-semibold text-caption text-text-muted uppercase tracking-wider mb-4">
              Next Milestone
            </p>
            <div className="flex justify-between items-end mb-3">
              <span className="font-poppins font-semibold text-body text-text-heading">Stage 4: Traction</span>
              <span className="font-inter text-caption text-text-muted">Locked</span>
            </div>
            <div className="h-2 bg-canvas-bg rounded-full overflow-hidden mb-4">
              <div className="h-full bg-brand-black rounded-full transition-all" style={{ width: '75%' }} />
            </div>

            <Link
              to="/build-startup/journey/traction/acquisition-tracker"
              onClick={handleStart}
              className="w-full flex items-center justify-center gap-2 bg-action-bg text-action-text px-6 py-3 rounded-md hover:opacity-90 active:scale-[0.98] transition-all font-poppins font-semibold text-small"
            >
              {starting ? (
                'Loading...'
              ) : (
                <>
                  Start Traction Stage
                  <PlayCircle size={16} strokeWidth={2} />
                </>
              )}
            </Link>

            <p className="font-inter text-[11px] text-center text-text-muted leading-relaxed mt-3">
              By starting this stage, you commit to the deliverables listed.
              The stage duration is approximately 4 weeks.
            </p>
          </div>

          <div className="bg-surface-white border border-border-subtle rounded-lg shadow-card p-6">
            <h3 className="font-poppins font-semibold text-body text-text-heading mb-5">Program Roadmap</h3>
            <div className="space-y-6">
              {ROADMAP.map((stage, i) => {
                const isLast = i === ROADMAP.length - 1;
                return (
                  <div key={stage.title} className="flex gap-4 relative">
                    {!isLast && (
                      <div className="absolute left-[15px] top-8 bottom-[-24px] w-px bg-border-subtle" />
                    )}
                    <div
                      className={`z-10 w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                        stage.status === 'completed'
                          ? 'bg-brand-black text-white'
                          : stage.status === 'current'
                          ? 'border-2 border-brand-black bg-surface-white text-text-heading'
                          : 'bg-canvas-bg text-text-muted'
                      }`}
                    >
                      {stage.status === 'completed' && <Check size={16} strokeWidth={2} />}
                      {stage.status === 'current' && <MousePointerClick size={16} strokeWidth={2} />}
                      {stage.status === 'locked' && <Lock size={16} strokeWidth={2} />}
                    </div>
                    <div>
                      <p className={`font-poppins font-semibold text-small ${
                        stage.status === 'locked' ? 'text-text-muted' : 'text-text-heading'
                      }`}>
                        {stage.title}
                      </p>
                      <p className={`font-inter text-caption mt-0.5 ${
                        stage.status === 'current' ? 'text-text-heading font-semibold italic' : 'text-text-muted'
                      }`}>
                        {stage.date}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-canvas-bg border border-border-subtle rounded-lg p-5">
            <div className="flex items-center gap-2 mb-2">
              <Lightbulb size={16} strokeWidth={2} className="text-text-muted" />
              <p className="font-inter font-semibold text-caption text-text-muted uppercase tracking-wider">Mentor Tip</p>
            </div>
            <p className="font-inter text-small text-text-body italic">
              "Don't scale too early. Focus on finding 10 users who absolutely love your
              product rather than 1000 who just find it 'okay'."
            </p>
          </div>

        </div>
      </div>
    </DashboardShell>
  );
}