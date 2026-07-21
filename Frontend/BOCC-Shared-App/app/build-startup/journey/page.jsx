import {
  CircleCheck,
  Layers,
  TrendingUp,
  Rocket,
  Brain,
  Wrench,
  Building2,
  UserPlus,
  Megaphone,
  ArrowLeft,
  ChevronRight,
  Lightbulb,
  Lock,
  Users,
} from 'lucide-react';
import Link from 'next/link';
import DashboardShell from '@/components/dashboard/DashboardShell';
import ComingSoon from '@/components/ui/ComingSoon';

export const metadata = {
  title: 'Startup Journey — BOCC Campus Clubs',
  description: 'Your structured five-stage startup journey guided by BOCC.',
};

const STAGES = [
  { label: '1. Ideation', sub: 'Current - Not Started', active: true },
  { label: '2. Validation', sub: 'Locked', active: false },
  { label: '3. MVP', sub: 'Locked', active: false },
  { label: '4. Traction', sub: 'Locked', active: false },
  { label: '5. Launch & Pitch', sub: 'Locked', active: false },
];

const STATS = [
  { label: 'Current Status', value: 'Not Started' },
  { label: 'Current Stage',  value: 'Ideation' },
  { label: 'Progress',       value: '0%' },
  { label: 'Program Duration', value: '12 Months' },
];

const ACHIEVEMENTS = [
  { icon: Brain,     title: 'Validate Your Idea' },
  { icon: Wrench,    title: 'Build an MVP' },
  { icon: Users,     title: 'Work with Mentors' },
  { icon: Building2,  title: 'Get Incubated' },
  { icon: UserPlus,  title: 'Acquire First Users' },
  { icon: Megaphone, title: 'Pitch to Investors' },
];

export default function JourneyPage() {
  return (
    <DashboardShell pageId="journey">

      {/* ── Breadcrumb + page title ───────────────────────────────── */}
      <nav className="mb-2 flex items-center gap-2 text-text-muted font-inter font-normal text-small">
        <Link href="/dashboard" className="hover:text-text-heading transition-colors">Dashboard</Link>
        <ChevronRight size={14} strokeWidth={2} className="text-text-muted" />
        <span>Build Startup</span>
        <ChevronRight size={14} strokeWidth={2} className="text-text-muted" />
        <span className="text-text-heading font-semibold">Startup Journey</span>
      </nav>
      <h1 className="text-text-heading font-poppins font-semibold text-page mb-8">
        Startup Journey
      </h1>

      {/* ── Welcome Hero ───────────────────────────────────────────── */}
      <section
        className="grid grid-cols-1 md:grid-cols-12 bg-surface-white border border-border-subtle rounded-lg p-6 shadow-card mb-12 items-center"
        style={{ gap: 'var(--spacing-gutter)' }}
      >
        <div className="md:col-span-7 flex flex-col items-start gap-4">
          <h2 className="text-text-heading font-poppins font-semibold text-section leading-tight">
            Welcome to Your <br />Startup Journey 🚀
          </h2>
          <p className="text-text-body font-inter font-normal text-body max-w-lg">
            Every successful startup begins with one idea. BOCC will guide you through a
            structured five-stage journey over the next 12 months.
          </p>
          <ComingSoon label="Start Your Journey" position="top" inline>
            <span
              className="mt-4 bg-action-bg text-action-text px-8 py-3 rounded-md hover:bg-[#1F2937] active:scale-[0.98] transition-all font-poppins font-semibold text-body inline-block"
            >
              Start Your Journey
            </span>
          </ComingSoon>
        </div>
        {/* Placeholder box */}
        <div className="md:col-span-5 h-64 md:h-80 placeholder-box rounded-lg" />
      </section>

      {/* ── Journey Roadmap ────────────────────────────────────────── */}
      <section className="mb-12">
        <h3 className="text-text-heading font-poppins font-semibold text-section mb-6">
          Journey Roadmap
        </h3>
        <div className="relative flex flex-col md:flex-row justify-between gap-4 md:gap-0 items-start md:items-center">
          {/* Connecting line — desktop only */}
          <div className="hidden md:block absolute top-10 left-0 right-0 h-[1px] bg-border-subtle z-0" />

          {STAGES.map(({ label, sub, active }) => (
            <div
              key={label}
              className="relative z-10 flex md:flex-col items-center gap-4 md:w-1/5 text-center bg-canvas-bg px-4"
            >
              {active ? (
                <ComingSoon label="Ideation Stage Details" position="top">
                  <div className="w-20 h-20 rounded-full border-2 border-brand-black flex items-center justify-center bg-canvas-bg relative cursor-not-allowed mx-auto">
                    <div className="w-4 h-4 rounded-full bg-accent-neon animate-pulse" />
                  </div>
                </ComingSoon>
              ) : (
                <div className="w-20 h-20 rounded-full border border-border-subtle text-text-muted flex items-center justify-center bg-canvas-bg mx-auto">
                  <Lock size={20} strokeWidth={2} />
                </div>
              )}
              <div>
                <p
                  className={`font-inter font-medium text-caption ${
                    active ? 'text-text-heading font-semibold' : 'text-text-muted'
                  }`}
                >
                  {label}
                </p>
                <p className="text-text-muted font-inter font-normal text-small">{sub}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Overview stat cards ────────────────────────────────────── */}
      <section
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mb-12"
        style={{ gap: 'var(--spacing-gutter)' }}
      >
        {STATS.map(({ label, value }) => (
          <div key={label} className="bg-surface-white border border-border-subtle p-6 rounded-lg shadow-card">
            <p className="text-text-muted font-inter font-medium text-caption uppercase mb-1">{label}</p>
            <p className="text-text-heading font-poppins font-medium text-card">{value}</p>
          </div>
        ))}
      </section>

      {/* ── What You'll Achieve ───────────────────────────────────── */}
      <section className="mb-16">
        <h3 className="text-text-heading font-poppins font-semibold text-section mb-8">
          What You'll Achieve
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3" style={{ gap: 'var(--spacing-gutter)' }}>
          {ACHIEVEMENTS.map(({ icon: Icon, title }) => (
            <div
              key={title}
              className="p-6 bg-surface-white border border-border-subtle rounded-lg shadow-card flex flex-col gap-3 hover:border-text-muted transition-colors"
            >
              {/* Icon Swatch */}
              <div className="w-12 h-12 rounded-md bg-canvas-bg flex items-center justify-center border border-border-subtle">
                <Icon size={24} strokeWidth={2} className="text-text-body" />
              </div>
              <h4 className="text-text-heading font-inter font-semibold text-body">{title}</h4>
              {/* Thin progress bar placeholder */}
              <div className="h-1 bg-border-subtle w-full rounded" />
            </div>
          ))}
        </div>
      </section>

      {/* ── Final CTA ──────────────────────────────────────────────── */}
      <section className="flex flex-col items-center gap-6 py-12 border-t border-divider-line mt-12">
        <ComingSoon label="Start Your Journey" position="top" inline>
          <span
            className="bg-action-bg text-action-text px-12 py-4 rounded-md hover:bg-[#1F2937] active:scale-[0.98] transition-all shadow-sm font-poppins font-semibold text-body inline-block"
          >
            Start Your Journey
          </span>
        </ComingSoon>
        <Link
          href="/dashboard"
          className="text-text-body hover:text-brand-black transition-colors flex items-center gap-2 font-inter font-normal text-small"
        >
          <ArrowLeft size={16} strokeWidth={2} />
          Back to Dashboard
        </Link>
      </section>

    </DashboardShell>
  );
}
