import { Link } from 'react-router-dom';
import { Rocket, Lightbulb, Users, TrendingUp } from 'lucide-react';
import Logo from '@/components/ui/Logo';

const STATS = [
  { value: '500+', label: 'Startups' },
  { value: '50+', label: 'Campuses' },
  { value: '200+', label: 'Mentors' },
  { value: '80+', label: 'Investors' },
];

// Same orbit motif as Login's illustration (a central hub with campus
// clubs orbiting it), reused here at hero scale with lucide icons on the
// nodes — this page and Login are both genuinely about the brand itself,
// so the reuse is deliberate rather than the generic-fallback kind
// CONTRIBUTING.md warns against (see ForgotPassword/ResetPassword's own
// bespoke motifs for the contrast).
const ORBIT_NODES = [
  { icon: Rocket, angle: -60 },
  { icon: Lightbulb, angle: 180 },
  { icon: Users, angle: 20 },
  { icon: TrendingUp, angle: 100 },
];

export default function Hero() {
  return (
    <section id="about" className="relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-5 lg:px-10 pt-28 pb-16 lg:pt-32 lg:pb-24 grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <h1 className="font-poppins font-bold text-4xl sm:text-5xl lg:text-6xl leading-[1.05] tracking-tight text-text-heading">
            Turn Ideas into Successful <span className="block">Startups</span>
          </h1>

          <p className="mt-6 font-inter text-body text-text-body max-w-lg leading-relaxed">
            Empowering the next generation of campus entrepreneurs with a curated
            platform of mentors, resources and industry partners.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/role-selection"
              className="bg-action-bg text-action-text px-6 py-3 rounded-md font-poppins font-semibold text-small hover:opacity-90 active:scale-[0.98] transition-all shadow-card"
            >
              Start Your Journey
            </Link>
            <a
              href="#ecosystem"
              className="border border-border-subtle text-text-heading px-6 py-3 rounded-md font-poppins font-medium text-small hover:bg-canvas-bg transition-colors"
            >
              Explore Programs
            </a>
          </div>

          <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-3">
            {STATS.map((s) => (
              <div key={s.label} className="bg-surface-white rounded-lg px-4 py-3 border border-border-subtle">
                <div className="font-poppins font-bold text-card text-text-heading">{s.value}</div>
                <div className="font-inter text-caption text-text-muted mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative aspect-square max-w-md mx-auto w-full">
          <div className="absolute inset-0 rounded-full border border-border-subtle" />
          <div className="absolute inset-8 rounded-full border border-border-subtle" />
          <div className="absolute inset-16 rounded-full border border-border-subtle" />

          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <Logo variant="mark" size={140} />
          </div>

          {ORBIT_NODES.map(({ icon: Icon, angle }) => {
            const rad = (angle * Math.PI) / 180;
            const r = 45;
            const x = 50 + r * Math.cos(rad);
            const y = 50 + r * Math.sin(rad);
            return (
              <div
                key={angle}
                className="absolute w-12 h-12 bg-surface-white rounded-full border border-border-subtle flex items-center justify-center shadow-card"
                style={{ left: `${x}%`, top: `${y}%`, transform: 'translate(-50%,-50%)' }}
              >
                <Icon size={18} strokeWidth={2} className="text-text-body" />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
