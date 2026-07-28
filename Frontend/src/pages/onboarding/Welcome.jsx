import { Link } from 'react-router-dom';
import { Sparkles, ArrowLeft, Users, Rocket, GraduationCap, CalendarDays, Clock3 } from 'lucide-react';
import ComingSoon from '@/components/ui/ComingSoon';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

const STATS = [
  { icon: Users, label: 'Members', value: '524' },
  { icon: Rocket, label: 'Active Startups', value: '12' },
  { icon: GraduationCap, label: 'Mentors', value: '45' },
  { icon: CalendarDays, label: 'Events Conducted', value: '82' },
];

export default function OnboardingWelcomePage() {
  useDocumentTitle('Welcome to Your Chapter — BOCC');

  return (
    <div className="flex-1 flex flex-col items-center px-4 py-12 bg-canvas-bg">
      <div className="w-full max-w-3xl flex flex-col gap-8">
        <section className="grid md:grid-cols-2 gap-8 items-center">
          <div className="flex flex-col gap-4">
            <span className="inline-flex w-fit items-center gap-2 px-3 py-1.5 rounded-full bg-accent-neon/15 border border-accent-neon/30 font-inter text-caption font-semibold text-text-heading">
              <Sparkles size={14} strokeWidth={2} />
              BOCC Membership Portal
            </span>
            <h1 className="font-poppins font-bold text-section text-text-heading">Welcome to BOCC!</h1>
            <p className="font-inter text-body text-text-body leading-relaxed">
              You&apos;re joining the Business Orbit Campus Club at your college. This chapter will be
              your home for startup building, mentorship, networking, events, and entrepreneurial
              opportunities.
            </p>
          </div>
          <div className="aspect-square rounded-lg border-2 border-dashed border-border-subtle bg-canvas-bg flex flex-col items-center justify-center gap-2">
            <Clock3 size={24} strokeWidth={2} className="text-text-muted" />
            <span className="font-inter text-small text-text-muted">Awaiting Verification</span>
          </div>
        </section>

        <section className="bg-surface-white border border-border-subtle rounded-xl shadow-card p-6">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <h2 className="font-poppins font-semibold text-card text-text-heading">Riverside Tech Chapter</h2>
              <p className="font-inter text-small text-text-muted">Your Campus</p>
            </div>
            <span className="font-inter text-caption font-semibold uppercase tracking-wide text-success bg-success/15 px-2.5 py-1 rounded-full shrink-0">
              Status: Active
            </span>
          </div>
          <p className="font-inter text-small text-text-body leading-relaxed mb-2">
            A premier engineering and management hub fostering innovation on campus.
          </p>
          <p className="font-inter text-small text-text-body leading-relaxed mb-2">
            Our chapter focuses on deep-tech startups, sustainable solutions, and industry-aligned mentorship.
          </p>
          <p className="font-inter text-small text-text-body leading-relaxed mb-4">
            Join a community of 500+ builders and thinkers.
          </p>
          <div className="border-t border-border-subtle pt-4">
            <p className="font-inter text-caption font-semibold uppercase tracking-wider text-text-muted mb-1.5">Mission Statement</p>
            <blockquote className="font-inter text-small text-text-body italic">
              &ldquo;Empowering the next generation of engineers to become visionary entrepreneurs
              through collaborative growth and orbit-shifting opportunities.&rdquo;
            </blockquote>
          </div>
        </section>

        <section className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {STATS.map(({ icon: Icon, label, value }) => (
            <div key={label} className="bg-surface-white border border-border-subtle rounded-lg p-5 text-center">
              <Icon size={20} strokeWidth={2} className="text-text-muted mx-auto mb-2" />
              <p className="font-poppins font-semibold text-card text-text-heading">{value}</p>
              <p className="font-inter text-caption text-text-muted">{label}</p>
            </div>
          ))}
        </section>

        <section className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <Link
            to="/login"
            className="inline-flex items-center gap-1.5 font-inter font-medium text-small text-text-body hover:text-text-heading transition-colors"
          >
            <ArrowLeft size={16} strokeWidth={2} />
            Back
          </Link>
          <div className="flex gap-3">
            <ComingSoon label="Request Chapter Change" position="top" inline className="border border-border-subtle text-text-heading font-inter font-medium text-small px-5 py-2.5 rounded-md">
              Request Chapter Change
            </ComingSoon>
            <Link
              to="/onboarding/verify-email"
              className="bg-action-bg text-action-text font-poppins font-semibold text-small px-5 py-2.5 rounded-md hover:opacity-90 transition-all"
            >
              Continue to Email Verification
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
