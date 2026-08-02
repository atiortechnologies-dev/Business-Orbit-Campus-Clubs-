import { Globe2, Layers3, BarChart3 } from 'lucide-react';

const CARDS = [
  { icon: Globe2, title: 'Global Startup Network', desc: 'Connect your incubator with universities, founders, mentors, investors, and innovation partners worldwide.' },
  { icon: Layers3, title: 'Standardized Incubation Framework', desc: "Leverage BOCC's structured startup journey, evaluation process, and milestone-driven incubation model." },
  { icon: BarChart3, title: 'Institutional Analytics', desc: 'Track startup progress, mentor engagement, funding readiness, and ecosystem performance with real-time dashboards.' },
];

export default function ValueProps() {
  return (
    <section id="value" className="py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="max-w-2xl mb-14">
          <span className="font-inter text-caption font-semibold tracking-wider uppercase text-text-heading bg-accent-neon/15 px-3 py-1 rounded-full">
            Why BOCC
          </span>
          <h2 className="font-poppins font-bold text-3xl lg:text-4xl tracking-tight text-text-heading mt-4">
            Why Incubators Choose BOCC
          </h2>
          <p className="font-inter text-card text-text-body mt-4">
            We bridge academic theory and entrepreneurial execution through a
            proven incubation framework and an extensive global resource pool.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {CARDS.map(({ icon: Icon, title, desc }, i) => (
            <div key={title} className="group relative bg-canvas-bg border border-border-subtle rounded-lg p-8 hover:border-accent-neon hover:shadow-card hover:-translate-y-1 transition-all duration-300">
              <div className="w-12 h-12 rounded-md bg-surface-white border border-border-subtle flex items-center justify-center mb-5 group-hover:bg-accent-neon transition-colors duration-300">
                <Icon size={24} strokeWidth={2} className="text-text-heading" />
              </div>
              <h3 className="font-poppins font-semibold text-card text-text-heading mb-2">{title}</h3>
              <p className="font-inter text-small text-text-muted leading-relaxed">{desc}</p>
              <div className="absolute top-8 right-8 font-poppins font-bold text-5xl text-text-heading/[0.04] group-hover:text-accent-neon/20 transition-colors">
                0{i + 1}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
