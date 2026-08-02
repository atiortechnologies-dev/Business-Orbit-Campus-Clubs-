import { Map, Users, LineChart, Award, Network, Rocket } from 'lucide-react';

const VALUE_PROPS = [
  { icon: Map, title: 'Structured Roadmap', desc: 'A clear, stage-by-stage path from idea to launch.' },
  { icon: Users, title: 'Curated Mentorship', desc: '1:1 guidance from founders, operators, and investors.' },
  { icon: LineChart, title: 'Smart Investor Services', desc: 'Warm intros to investors who actually write checks.' },
  { icon: Award, title: 'Elite Startup Grants', desc: 'Non-dilutive funding to help you build your MVP.' },
  { icon: Network, title: 'Networking', desc: 'A vetted community of peers, alumni, and partners.' },
  { icon: Rocket, title: 'Launch Support', desc: 'Go-to-market help, PR, and scale-readiness coaching.' },
];

export default function ValueProps() {
  return (
    <section className="py-20 md:py-28 bg-canvas-bg border-y border-border-subtle">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="max-w-2xl">
          <span className="font-inter text-caption font-semibold uppercase tracking-wider text-text-muted">Why BOCC</span>
          <h2 className="mt-3 font-poppins font-bold text-3xl md:text-4xl lg:text-5xl tracking-tight text-text-heading">
            Why Start at BOCC?
          </h2>
          <p className="mt-4 font-inter text-body md:text-card text-text-body leading-relaxed">
            Everything a student founder needs — under one roof, built for momentum.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-border-subtle border border-border-subtle rounded-md overflow-hidden">
          {VALUE_PROPS.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="group bg-surface-white p-8 md:p-10 hover:bg-canvas-bg transition-colors">
              <div className="w-11 h-11 flex items-center justify-center rounded-md border border-border-subtle text-text-heading group-hover:border-accent-neon transition-colors">
                <Icon size={20} strokeWidth={1.75} />
              </div>
              <h3 className="mt-5 font-poppins font-semibold text-card text-text-heading">{title}</h3>
              <p className="mt-2 font-inter text-small text-text-muted leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
