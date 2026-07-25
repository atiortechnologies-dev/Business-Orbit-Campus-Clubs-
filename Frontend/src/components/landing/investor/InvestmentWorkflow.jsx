import { Search, FileText, Handshake, LineChart, TrendingUp } from 'lucide-react';

const STEPS = [
  { n: '01', icon: Search, title: 'View Startups', desc: 'Browse curated lists of startups categorized by industry, stage, and traction score.' },
  { n: '02', icon: FileText, title: 'Review Pitch Deck', desc: 'Analyze comprehensive data rooms including founder profiles, market research, and MVP results.' },
  { n: '03', icon: Handshake, title: 'Connect with Founders', desc: 'Facilitate direct meetings and negotiate terms through our structured deal-flow process.' },
  { n: '04', icon: LineChart, title: 'Evaluate Opportunity', desc: 'Use verified metrics, mentor reviews, and validated milestones to make an informed decision.' },
  { n: '05', icon: TrendingUp, title: 'Track Portfolio Growth', desc: 'Monitor performance through live updates from the BOCC ecosystem dashboard.' },
];

export default function InvestmentWorkflow() {
  return (
    <section id="journey" className="mx-auto max-w-7xl px-6 py-24">
      <div className="max-w-xl">
        <h2 className="font-poppins font-bold text-3xl md:text-4xl tracking-tight text-text-heading">
          Seamless Investment Workflow
        </h2>
        <p className="mt-4 font-inter text-small text-text-muted">
          Our platform streamlines the entire investment lifecycle, from
          discovery to post-investment tracking.
        </p>
      </div>

      <div className="mt-12 grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-5">
        {STEPS.map((s) => (
          <div key={s.n} className="border-t border-border-subtle pt-5">
            <s.icon size={24} strokeWidth={1.75} className="text-text-heading" />
            <div className="mt-4 font-inter text-caption font-semibold tracking-wider text-text-muted">{s.n}</div>
            <h3 className="mt-1 font-poppins font-semibold text-[15px] text-text-heading">{s.title}</h3>
            <p className="mt-2 font-inter text-[13px] leading-relaxed text-text-muted">{s.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
