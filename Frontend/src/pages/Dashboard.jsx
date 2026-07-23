import {
  Zap,
  Lock,
  ArrowRight,
  BookOpen,
  FileText,
  CircleHelp,
  LifeBuoy,
  Check,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import DashboardShell from '@/components/dashboard/DashboardShell';
import ComingSoon from '@/components/ui/ComingSoon';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

const STAGES = [
  { label: 'Ideation', status: 'active' },
  { label: 'Validation', status: 'locked' },
  { label: 'MVP', status: 'locked' },
  { label: 'Traction', status: 'locked' },
  { label: 'Launch & Pitch', status: 'locked' },
];

export default function DashboardPage() {
  useDocumentTitle('Dashboard — BOCC Student Portal');

  return (
    <DashboardShell pageId="db">

      {/* 12-column grid */}
      <div
        className="grid grid-cols-1 md:grid-cols-12"
        style={{ gap: 'var(--spacing-gutter)' }}
      >

        {/* ── 1. Welcome Hero ───────────────────────────────────── */}
        <section className="md:col-span-12 lg:col-span-8 bg-surface-white border border-border-subtle rounded-lg p-6 shadow-card flex flex-col md:flex-row items-center gap-8">
          {/* Text block */}
          <div className="flex-1 space-y-4 text-center md:text-left">
            <h3 className="text-text-heading font-poppins font-semibold text-page">
              Welcome back, Alex
            </h3>

            <div className="space-y-1">
              <p className="text-text-body font-inter text-body-lg">
                Current Stage:{' '}
                <span className="font-bold text-text-heading">Ideation</span>
              </p>
              {/* Progress bar — 0% */}
              <div className="w-full bg-divider-line h-2 rounded-full overflow-hidden">
                <div className="bg-brand-black h-full w-[0%]" />
              </div>
              <p className="text-text-muted font-inter font-semibold text-caption">
                Progress: 0%
              </p>
            </div>

            <Link to="/build-startup/journey" className="inline-block mt-4">
              <button
                className="bg-action-bg text-action-text px-8 py-3 rounded-md hover:opacity-90 transition-colors active:scale-[0.98] font-poppins font-semibold text-body"
              >
                Start Your Journey
              </button>
            </Link>
          </div>

          {/* Placeholder image — hidden on mobile */}
          <div className="w-48 h-48 placeholder-box rounded-lg hidden md:block" />
        </section>

        {/* ── 4. Today's Next Step ──────────────────────────────── */}
        {/* This card is always brand-black (fixed token, not theme-reactive)
            — same "permanently dark surface" pattern as the sidebar. Every
            color inside it must be a fixed value too, not a theme-reactive
            token, or it'll invert against a background that never inverts.
            border-border-subtle below is the one exception worth watching:
            it's still theme-reactive and nearly disappears against this
            fixed-black card in dark mode (border-subtle → #2D2D2D, close to
            the card's #0B0B0B) — kept for now since it's a minor 1px seam,
            not a legibility bug like the ones fixed below, but flagged here
            for whoever revisits this file. */}
        <section className="md:col-span-12 lg:col-span-4 bg-brand-black text-white border border-border-subtle rounded-lg p-6 shadow-card flex flex-col justify-between">
          <div className="space-y-4">
            {/* "Next Step" eyebrow */}
            <div className="flex items-center gap-2 text-accent-neon">
              <Zap size={18} strokeWidth={2} />
              <span className="uppercase tracking-wider font-inter font-medium text-caption">
                Next Step
              </span>
            </div>
            <p className="leading-relaxed font-poppins font-semibold text-card text-white">
              Read the Ideation Guide and begin your startup journey
            </p>
          </div>

          <Link to="/build-startup/journey" className="block mt-8">
            {/* Fixed white/black, not bg-surface-white/hover:bg-canvas-bg —
                this button sits on the permanently-black card above, so its
                colors can't be theme-reactive either (see comment on the
                <section> above). */}
            <button
              className="w-full bg-white text-brand-black px-6 py-3 rounded-md hover:opacity-90 transition-colors active:scale-[0.98] font-poppins font-semibold text-body"
            >
              Begin
            </button>
          </Link>
        </section>

        {/* ── 2. Startup Progress ───────────────────────────────── */}
        <section className="md:col-span-12 bg-surface-white border border-border-subtle rounded-lg p-6 shadow-card">
          <h4 className="text-text-heading font-poppins font-semibold text-section mb-8">
            Startup Progress
          </h4>

          {/* Stages row */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 relative">
            {/* Connecting line — desktop only */}
            <div className="absolute top-1/2 left-0 w-full h-[1px] bg-border-subtle -z-10 hidden md:block" />

            {STAGES.map(({ label, status }) => (
              <div
                key={label}
                className="flex flex-col items-center gap-3 px-4 text-center bg-surface-white z-10"
              >
                {status === 'completed' && (
                  <div className="w-12 h-12 rounded-full bg-success text-white flex items-center justify-center">
                    <Check size={20} strokeWidth={2} />
                  </div>
                )}
                {status === 'active' && (
                  <div className="w-12 h-12 rounded-full border-2 border-brand-black flex items-center justify-center bg-surface-white relative">
                    <div className="w-3.5 h-3.5 rounded-full bg-accent-neon animate-pulse" />
                  </div>
                )}
                {status === 'locked' && (
                  <div className="w-12 h-12 rounded-full border border-border-subtle text-text-muted flex items-center justify-center bg-surface-white">
                    <Lock size={16} strokeWidth={2} />
                  </div>
                )}
                <span
                  className={`font-inter font-medium text-caption ${
                    status === 'locked' ? 'text-text-muted' : 'text-text-heading'
                  }`}
                >
                  {label}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* ── 3. Quick Actions ──────────────────────────────────── */}
        <section className="md:col-span-12">
          <h4 className="text-text-heading font-poppins font-semibold text-section mb-6">
            Quick Actions
          </h4>

          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5"
            style={{ gap: 'var(--spacing-gutter)' }}
          >
            {/* Build Startup */}
            <Link
              to="/build-startup/journey"
              className="bg-surface-white border border-border-subtle rounded-lg p-6 shadow-card flex flex-col items-center text-center space-y-4 hover:border-brand-black transition-colors cursor-pointer group active:scale-[0.98]"
            >
              <div className="w-12 h-12 placeholder-box rounded-lg group-hover:scale-105 transition-transform" />
              <div className="space-y-1">
                <h5 className="font-poppins font-medium text-card text-text-heading">
                  Build Startup
                </h5>
                <p className="text-text-muted font-inter font-normal text-small">
                  Step-by-step guidance.
                </p>
              </div>
              {/* text-text-heading, not text-brand-black — this card's
                  surface is theme-reactive (bg-surface-white), so a fixed
                  black label goes near-invisible once the card goes dark. */}
              <span className="mt-2 text-text-heading hover:underline flex items-center gap-1 font-poppins font-semibold text-small">
                Open <ArrowRight size={14} strokeWidth={2} />
              </span>
            </Link>

            {/* ComingSoon items */}
            {[
              { title: 'Investors',      sub: 'Connect with funders.',  cta: 'Browse' },
              { title: 'Incubators',     sub: 'Supportive ecosystems.', cta: 'Explore' },
              { title: 'Freelancing',    sub: 'Monetize your skills.',  cta: 'Find Work' },
              { title: 'Profile',        sub: 'Manage your account.',   cta: 'Edit' },
            ].map(({ title, sub, cta }) => (
              <ComingSoon key={title} label={title} position="top">
                <div
                  className="w-full bg-surface-white border border-border-subtle rounded-lg p-6 shadow-card flex flex-col items-center text-center space-y-4 hover:border-border-subtle transition-colors cursor-not-allowed group"
                >
                  <div className="w-12 h-12 placeholder-box rounded-lg" />
                  <div className="space-y-1">
                    <h5 className="font-poppins font-medium text-card text-text-muted">
                      {title}
                    </h5>
                    <p className="text-text-muted font-inter font-normal text-small">
                      {sub}
                    </p>
                  </div>
                  <span className="mt-2 text-text-muted flex items-center gap-1 font-poppins font-semibold text-small">
                    {cta} <ArrowRight size={14} strokeWidth={2} />
                  </span>
                </div>
              </ComingSoon>
            ))}
          </div>
        </section>

        {/* ── 5. Recent Notifications ───────────────────────────── */}
        <section className="md:col-span-6 bg-surface-white border border-border-subtle rounded-lg p-6 shadow-card">
          <div className="flex justify-between items-center mb-6">
            <h4 className="text-text-heading font-poppins font-semibold text-section">
              Recent Notifications
            </h4>
            <Link
              to="/notifications"
              className="text-text-heading hover:underline font-poppins font-semibold text-small"
            >
              View All
            </Link>
          </div>

          <div className="space-y-4">
            {/* Notification 1 — unread (accent neon dot) */}
            <div className="flex items-start gap-4 pb-4 border-b border-divider-line">
              <div className="w-2 h-2 rounded-full bg-accent-neon mt-2 shrink-0" />
              <div>
                <p className="text-text-body font-inter font-normal text-body">
                  New Startup Guide for 2024 is now available.
                </p>
                <span className="text-text-muted font-inter font-normal text-small">
                  2 hours ago
                </span>
              </div>
            </div>

            {/* Notification 2 — unread (accent neon dot) */}
            <div className="flex items-start gap-4 pb-4 border-b border-divider-line">
              <div className="w-2 h-2 rounded-full bg-accent-neon mt-2 shrink-0" />
              <div>
                <p className="text-text-body font-inter font-normal text-body">
                  Weekly Mentor Session recordings uploaded.
                </p>
                <span className="text-text-muted font-inter font-normal text-small">
                  Yesterday
                </span>
              </div>
            </div>

            {/* Notification 3 — read (subtle border/gray dot) */}
            <div className="flex items-start gap-4">
              <div className="w-2 h-2 rounded-full bg-border-subtle mt-2 shrink-0" />
              <div>
                <p className="text-text-body font-inter font-normal text-body">
                  Freelancing portal maintenance completed.
                </p>
                <span className="text-text-muted font-inter font-normal text-small">
                  2 days ago
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ── 6. Resources ──────────────────────────────────────── */}
        <section className="md:col-span-6 bg-surface-white border border-border-subtle rounded-lg p-6 shadow-card">
          <h4 className="text-text-heading font-poppins font-semibold text-section mb-6">
            Resources
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { icon: BookOpen,   label: 'Startup Guide' },
              { icon: FileText,   label: 'Templates' },
              { icon: CircleHelp, label: 'FAQ' },
              { icon: LifeBuoy,   label: 'Support' },
            ].map(({ icon: Icon, label }) => (
              <ComingSoon key={label} label={label} position="top">
                <div
                  className="flex items-center gap-3 p-3 rounded-md bg-canvas-bg border border-transparent transition-colors cursor-not-allowed w-full text-left"
                >
                  <Icon size={20} strokeWidth={2} className="text-text-muted" />
                  <span className="font-inter font-medium text-body text-text-muted">
                    {label}
                  </span>
                </div>
              </ComingSoon>
            ))}
          </div>
        </section>

      </div>
    </DashboardShell>
  );
}
