import { ClipboardList, Share2, Lightbulb, Milestone, Clock, Calendar, RefreshCw } from 'lucide-react';

const COMMITMENTS = [
  { icon: ClipboardList, title: 'Strategy Review', points: ['Quarterly business model assessment', 'Go-to-market strategy validation', 'Competitive positioning analysis'] },
  { icon: Share2, title: 'Network Access', points: ['Introductions to relevant investors', 'Industry-specific connections', 'Strategic partnership opportunities'] },
  { icon: Lightbulb, title: 'Critical Guidance', points: ['Product-market fit evaluation', 'Technical architecture review', 'Scaling strategy advisory'] },
  { icon: Milestone, title: 'Goal Setting', points: ['OKR framework establishment', 'Milestone definition and tracking', 'KPI monitoring setup'] },
];

const BADGES = [
  { icon: Clock, label: 'Avg. 2-4 Hours / Month' },
  { icon: Calendar, label: 'Flexible Scheduling' },
  { icon: RefreshCw, label: '12-Month Engagement Cycle' },
];

export default function Commitments() {
  return (
    <section id="commitments" className="py-20 lg:py-32 bg-surface-white border-y border-border-subtle">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="max-w-2xl mb-16">
          <h2 className="font-poppins font-semibold text-3xl md:text-4xl lg:text-5xl tracking-tight text-text-heading leading-[1.2]">
            Mentor Commitments
          </h2>
          <p className="mt-4 font-inter text-body md:text-card text-text-body leading-relaxed">
            Clear expectations that ensure meaningful outcomes for both mentors and founders.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {COMMITMENTS.map(({ icon: Icon, title, points }) => (
            <div key={title} className="h-full bg-canvas-bg border border-border-subtle rounded-lg p-8 hover:-translate-y-1 hover:shadow-card transition-all duration-300">
              <div className="flex items-center gap-4 mb-6">
                <div className="h-12 w-12 rounded-md bg-surface-white border border-border-subtle flex items-center justify-center">
                  <Icon size={22} strokeWidth={2} className="text-text-heading" />
                </div>
                <h3 className="font-poppins font-semibold text-card text-text-heading">{title}</h3>
              </div>
              <ul className="space-y-3">
                {points.map((point) => (
                  <li key={point} className="flex items-start gap-3">
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-accent-neon flex-shrink-0" />
                    <span className="font-inter text-small text-text-muted leading-relaxed">{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {BADGES.map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-3 bg-brand-black px-6 py-4 rounded-lg">
              <Icon size={18} strokeWidth={2} className="text-accent-neon" />
              <span className="font-inter font-medium text-small text-white">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
