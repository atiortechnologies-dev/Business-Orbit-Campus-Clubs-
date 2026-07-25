import { Link } from 'react-router-dom';
import { ArrowRight, FileText } from 'lucide-react';
import ComingSoon from '@/components/ui/ComingSoon';

const TRUST_ROW = [
  { value: '500+', label: 'Student Startups' },
  { value: '50+', label: 'Partner Institutions' },
  { value: '15+', label: 'Countries' },
];

export default function Hero() {
  return (
    <section id="hero" className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 overflow-hidden">
      <div className="relative max-w-7xl mx-auto px-6 lg:px-8 grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        <div className="flex flex-col gap-6">
          <span className="inline-flex w-fit items-center gap-2 px-3.5 py-1.5 rounded-full bg-accent-neon/15 border border-accent-neon/30 font-inter text-caption font-semibold tracking-wider uppercase text-text-heading">
            <span className="w-1.5 h-1.5 rounded-full bg-accent-neon" />
            Incubator Partnership
          </span>

          <h1 className="font-poppins font-bold text-4xl sm:text-5xl lg:text-[3.4rem] leading-[1.08] tracking-tight text-text-heading">
            Scale Your Incubator's Startup Ecosystem
          </h1>

          <p className="font-inter text-body lg:text-card text-text-body leading-relaxed max-w-xl">
            Partner with Atior Technologies to empower student
            entrepreneurs through a structured incubation framework, global mentor
            network, investor access, standardized startup curriculum, and
            institutional collaboration. Transform innovative ideas into
            investment-ready ventures while expanding your incubator's impact.
          </p>

          <div className="flex flex-wrap gap-4 mt-2">
            <Link to="/signup/incubator" className="group inline-flex items-center gap-2 bg-action-bg text-action-text font-poppins font-semibold text-small px-6 py-3.5 rounded-lg hover:opacity-90 transition-all">
              Become a Partner
              <ArrowRight size={16} strokeWidth={2} className="transition-transform group-hover:translate-x-1" />
            </Link>
            <ComingSoon label="View Partnership Deck" position="top" inline className="inline-flex items-center gap-2 bg-surface-white text-text-heading font-poppins font-semibold text-small px-6 py-3.5 rounded-lg border border-border-subtle">
              <FileText size={16} strokeWidth={2} />
              View Partnership Deck
            </ComingSoon>
          </div>

          <div className="flex items-center gap-6 mt-6 pt-6 border-t border-border-subtle">
            {TRUST_ROW.map((t, i) => (
              <div key={t.label} className="flex items-center gap-6">
                {i > 0 && <div className="w-px h-10 bg-border-subtle" />}
                <div>
                  <div className="font-poppins font-bold text-2xl text-text-heading">{t.value}</div>
                  <div className="font-inter text-caption text-text-muted">{t.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative">
          <div className="relative rounded-lg overflow-hidden border border-border-subtle shadow-card placeholder-box aspect-[4/3]">
            <div className="absolute top-4 left-4 bg-surface-white/90 backdrop-blur rounded-md px-3 py-2 shadow-card border border-border-subtle flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-accent-neon" />
              <span className="font-inter text-caption font-medium text-text-heading">Live incubator pipeline</span>
            </div>
            <div className="absolute bottom-4 right-4 bg-surface-white/90 backdrop-blur rounded-md px-3 py-2 shadow-card border border-border-subtle">
              <div className="font-inter text-caption text-text-muted">Funding readiness</div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <div className="w-20 h-1.5 rounded-full bg-border-subtle overflow-hidden">
                  <div className="w-[78%] h-full bg-accent-neon rounded-full" />
                </div>
                <span className="font-inter text-caption font-bold text-text-heading">78%</span>
              </div>
            </div>
          </div>
          <div className="absolute -inset-4 -z-10 rounded-full border border-accent-neon/20" />
        </div>
      </div>
    </section>
  );
}
