import { Link } from 'react-router-dom';
import { ChevronRight, MapPin, ClipboardCheck, LayoutGrid, Building2, Brain, Wallet, Calendar, Users, TrendingUp } from 'lucide-react';
import DashboardShell from '@/components/dashboard/DashboardShell';
import PlaceholderGraphic from '@/components/ui/PlaceholderGraphic';
import ComingSoon from '@/components/ui/ComingSoon';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

const FEATURES = [
  { icon: LayoutGrid, title: 'Program Overview', body: ['12 weeks intensive curriculum', 'Weekly product sprints', 'Direct access to VC network'] },
  { icon: Building2, title: 'Facilities', body: 'State-of-the-art coworking space, hardware labs, and high-speed fiber connectivity.' },
  { icon: Brain, title: 'Mentorship', body: '1-on-1 sessions with industry veterans from leading tech and VC firms.' },
  { icon: Wallet, title: 'Funding', body: '$50k equity-free seed grant for top performers, plus $250k follow-on investment options.' },
];

const TIMELINE = [
  { icon: ClipboardCheck, title: 'Application Period', date: 'Sept 01 – Oct 30, 2024', active: true },
  { icon: Users, title: 'Interviews & Selection', date: 'Nov 05 – Nov 20, 2024' },
  { icon: Calendar, title: 'Program Kickoff', date: 'Jan 10, 2025' },
];

const ALUMNI = ['Vortex.io', 'NEBULA', 'EcoStack', 'PrimeLog'];

export default function IncubatorProfilePage() {
  useDocumentTitle('TechScale Accelerator — BOCC');

  return (
    <DashboardShell pageId="incubator-profile">
      <nav className="mb-6 flex items-center gap-2 text-text-muted font-inter font-normal text-small">
        <Link to="/incubators" className="hover:text-text-heading transition-colors">Incubators</Link>
        <ChevronRight size={14} strokeWidth={2} />
        <span className="text-text-heading font-semibold">TechScale Accelerator</span>
      </nav>

      <div className="bg-surface-white border border-border-subtle rounded-lg overflow-hidden mb-8">
        <PlaceholderGraphic icon={Building2} label="Campus" className="h-40 rounded-none" />
        <div className="pt-6 pb-8 px-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="font-poppins font-semibold text-page text-text-heading">TechScale Accelerator</h1>
            <div className="flex items-center gap-3 mt-2">
              <span className="flex items-center gap-1 text-text-muted font-inter text-small"><MapPin size={16} strokeWidth={2} /> Silicon Valley / Remote</span>
              <span className="px-3 py-1 bg-canvas-bg text-text-muted font-inter text-caption rounded-full">EST. 2018</span>
            </div>
          </div>
          <div className="flex gap-3">
            <ComingSoon label="Visit Website" position="top" inline>
              <span className="px-6 py-2.5 border border-border-subtle rounded-lg font-poppins font-semibold text-small text-text-heading">Visit Website</span>
            </ComingSoon>
            <Link to="/incubators/apply" className="px-6 py-2.5 bg-action-bg text-action-text rounded-lg font-poppins font-semibold text-small hover:opacity-90 transition-all">
              Apply to Incubator
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-6">
          <section className="bg-surface-white border border-border-subtle rounded-lg p-8">
            <h3 className="font-poppins font-semibold text-card text-text-heading mb-4">About TechScale</h3>
            <p className="font-inter text-body text-text-body leading-relaxed">
              TechScale Accelerator is a premier 12-week program designed for early-stage student founders. We focus on scaling deep-tech and SaaS solutions through intensive product development workshops, rapid prototyping, and go-to-market strategies.
            </p>
          </section>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {FEATURES.map(({ icon: Icon, title, body }) => (
              <div key={title} className="bg-surface-white border border-border-subtle rounded-lg p-6">
                <div className="w-10 h-10 rounded-lg bg-canvas-bg flex items-center justify-center mb-4">
                  <Icon size={20} strokeWidth={2} className="text-text-heading" />
                </div>
                <h4 className="font-poppins font-semibold text-body text-text-heading mb-2">{title}</h4>
                {Array.isArray(body) ? (
                  <ul className="space-y-1.5 font-inter text-small text-text-body">
                    {body.map((b) => <li key={b} className="flex items-start gap-2"><TrendingUp size={16} strokeWidth={2} className="text-brand-black shrink-0 mt-0.5" /> {b}</li>)}
                  </ul>
                ) : (
                  <p className="font-inter text-small text-text-body">{body}</p>
                )}
              </div>
            ))}
          </div>

          <section className="bg-surface-white border border-border-subtle rounded-lg p-8">
            <h3 className="font-poppins font-semibold text-card text-text-heading mb-8">Cohort Timeline</h3>
            <div className="space-y-6">
              {TIMELINE.map(({ icon: Icon, title, date, active }) => (
                <div key={title} className="flex items-center gap-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${active ? 'bg-brand-black text-white' : 'bg-canvas-bg text-text-muted'}`}>
                    <Icon size={16} strokeWidth={2} />
                  </div>
                  <div>
                    <p className={`font-inter font-semibold text-small ${active ? 'text-text-heading' : 'text-text-muted'}`}>{title}</p>
                    <p className="font-inter text-caption text-text-muted">{date}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-surface-white border border-border-subtle rounded-lg p-8">
            <h3 className="font-poppins font-semibold text-card text-text-heading mb-6">Alumni Startups</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {ALUMNI.map((name) => (
                <div key={name} className="h-16 flex items-center justify-center bg-canvas-bg rounded-lg font-poppins font-bold text-text-muted italic">{name}</div>
              ))}
            </div>
          </section>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <div className="bg-surface-white border border-border-subtle rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <span className="font-inter text-caption text-text-muted">Status</span>
              <span className="px-3 py-1 bg-success/15 text-success font-poppins font-bold text-[10px] rounded-full">OPEN</span>
            </div>
            <div className="space-y-4">
              <div><p className="text-[10px] text-text-muted uppercase font-bold">Deadline</p><p className="font-inter font-bold text-text-heading">Oct 30, 2024</p></div>
              <div><p className="text-[10px] text-text-muted uppercase font-bold">Seats Available</p><p className="font-inter font-bold text-text-heading">15 Teams</p></div>
              <div><p className="text-[10px] text-text-muted uppercase font-bold">Target Stage</p><p className="font-inter font-bold text-text-heading">MVP / Seed</p></div>
            </div>
            <Link to="/incubators/apply" className="block text-center mt-6 py-3 bg-action-bg text-action-text rounded-lg font-poppins font-bold text-small hover:opacity-90 transition-all">
              Apply to Incubator
            </Link>
          </div>

          <div className="bg-surface-white border border-border-subtle rounded-lg p-6">
            <h4 className="font-poppins font-semibold text-body text-text-heading mb-4">Program Perks</h4>
            <div className="space-y-3 font-inter text-small text-text-body">
              <p>AWS Credits ($10,000 value)</p>
              <p>Global Alumni Network</p>
              <p>Legal &amp; IP Support</p>
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
