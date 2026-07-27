import { Link } from 'react-router-dom';
import {
  PartyPopper,
  Check,
  Rocket,
  GraduationCap,
  CheckCircle2,
  ShieldCheck,
  Users,
  LineChart,
  Brain,
  Star,
  Award,
  LayoutDashboard,
} from 'lucide-react';
import DashboardShell from '@/components/dashboard/DashboardShell';
import ComingSoon from '@/components/ui/ComingSoon';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

const STAGES = ['Ideation', 'Validation', 'MVP', 'Traction', 'Launch'];

const STATS = [
  { label: 'Startup Name', value: 'Nexus Dynamics Ltd.' },
  { label: 'Launch Date', value: 'Nov 14, 2023' },
  { label: 'Total Journey Duration', value: '8 Months' },
  { label: 'Completed Stages', value: '5 / 5' },
  { label: 'Uploaded Deliverables', value: '42 Files' },
];

const ACHIEVEMENTS = [
  { icon: Rocket, title: 'Startup Successfully Launched', desc: 'Your venture is now live in the global marketplace with verified credentials.' },
  { icon: GraduationCap, title: 'BOCC Startup Graduate', desc: 'Earned full recognition from the Board of Commerce & Commercialization.' },
  { icon: CheckCircle2, title: 'Startup Journey Completed', desc: 'Mastered the end-to-end framework of modern venture building.' },
  { icon: ShieldCheck, title: 'Launch Successfully Verified', desc: 'Regulatory and operational compliance checks cleared for scaling.' },
];

const OPPORTUNITIES = [
  { icon: Users, title: 'Join BOCC Alumni', desc: 'Connect with thousands of successful founders globally.', cta: 'Access Network' },
  { icon: LineChart, title: 'Explore Investor Network', desc: 'Present your pitch deck to our curated list of VCs and Angels.', cta: 'View Investors' },
  { icon: Brain, title: 'Become a Mentor', desc: 'Give back by guiding the next generation of startup founders.', cta: 'Apply as Mentor' },
  { icon: Star, title: 'Apply for Showcase Events', desc: 'Get featured on our platform and annual demo days.', cta: 'Submit Entry' },
];

export default function JourneyCompletePage() {
  useDocumentTitle('Journey Complete — BOCC');

  return (
    <DashboardShell pageId="journey-complete">
      <section className="mb-12 text-center max-w-4xl mx-auto">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-canvas-bg rounded-full mb-6">
          <PartyPopper size={32} strokeWidth={2} className="text-text-heading" />
        </div>
        <h1 className="font-poppins font-semibold text-page text-text-heading mb-4">
          Congratulations! Your Startup Journey is Complete
        </h1>
        <p className="font-inter text-body text-text-body max-w-2xl mx-auto">
          You've successfully navigated the complex path from a simple spark of an idea to a
          fully verified and launched venture. Your journey as a founder within BOCC has only
          just begun.
        </p>
      </section>

      <section className="mb-16">
        <div className="relative flex justify-between items-start max-w-3xl mx-auto px-8">
          <div className="absolute top-5 left-8 right-8 h-1 bg-brand-black -z-0" />
          {STAGES.map((label) => (
            <div key={label} className="relative z-10 flex flex-col items-center gap-3">
              <div className="w-10 h-10 bg-brand-black text-white rounded-full flex items-center justify-center border-4 border-canvas-bg shadow-sm">
                <Check size={18} strokeWidth={2} />
              </div>
              <span className="font-inter font-semibold text-caption text-text-heading">{label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-16">
        <div className="lg:col-span-5 bg-surface-white border border-border-subtle p-8 rounded-lg flex flex-col justify-between">
          <div>
            <h3 className="font-poppins font-semibold text-body text-text-heading mb-6 border-b border-divider-line pb-4">
              Journey Statistics
            </h3>
            <div className="space-y-4">
              {STATS.map(({ label, value }) => (
                <div key={label} className="flex justify-between items-center py-2">
                  <span className="font-inter text-caption text-text-muted">{label}</span>
                  <span className="font-inter font-semibold text-small text-text-heading">{value}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-8 pt-4 border-t border-divider-line flex gap-4">
            <div className="flex-1 text-center">
              <p className="font-poppins font-semibold text-card text-text-heading">100%</p>
              <p className="font-inter text-caption text-text-muted uppercase tracking-widest">Progress</p>
            </div>
            <div className="w-px bg-border-subtle" />
            <div className="flex-1 text-center">
              <p className="font-poppins font-semibold text-card text-text-heading">A+</p>
              <p className="font-inter text-caption text-text-muted uppercase tracking-widest">Rating</p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
          {ACHIEVEMENTS.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="bg-canvas-bg border border-border-subtle p-6 rounded-lg hover:bg-surface-white transition-colors group">
              <div className="w-12 h-12 mb-4 flex items-center justify-center bg-surface-white border border-border-subtle rounded-full group-hover:scale-110 transition-transform">
                <Icon size={20} strokeWidth={2} className="text-text-heading" />
              </div>
              <h4 className="font-inter font-semibold text-small text-text-heading mb-2">{title}</h4>
              <p className="font-inter text-caption text-text-muted">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-16">
        <h3 className="font-poppins font-semibold text-body text-text-heading mb-8">Next Opportunities</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {OPPORTUNITIES.map(({ icon: Icon, title, desc, cta }) => (
            <div
              key={title}
              className="bg-surface-white border border-border-subtle p-6 rounded-lg flex flex-col items-center text-center hover:border-brand-black transition-all"
            >
              <div className="w-14 h-14 bg-canvas-bg rounded-xl mb-4 flex items-center justify-center">
                <Icon size={26} strokeWidth={2} className="text-text-heading" />
              </div>
              <h5 className="font-inter font-semibold text-small text-text-heading mb-2">{title}</h5>
              <p className="font-inter text-caption text-text-muted mb-6">{desc}</p>
              <ComingSoon label={title} position="top" inline className="mt-auto w-full">
                <span className="block w-full text-center py-2 border border-brand-black font-inter font-semibold text-caption rounded-lg hover:bg-brand-black hover:text-white transition-colors cursor-pointer">
                  {cta}
                </span>
              </ComingSoon>
            </div>
          ))}
        </div>
      </section>

      <footer className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-12 border-t border-divider-line pb-4">
        <ComingSoon label="View Certificate" position="top" inline>
          <span className="inline-flex items-center gap-3 bg-brand-black text-white px-10 py-4 rounded-lg font-poppins font-semibold text-body hover:opacity-90 transition-all cursor-pointer">
            <Award size={20} strokeWidth={2} />
            View Certificate
          </span>
        </ComingSoon>
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-3 bg-surface-white border-2 border-brand-black text-text-heading px-10 py-4 rounded-lg font-poppins font-semibold text-body hover:bg-canvas-bg transition-colors"
        >
          <LayoutDashboard size={20} strokeWidth={2} />
          Return to Dashboard
        </Link>
      </footer>
    </DashboardShell>
  );
}
