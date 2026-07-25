import { Check, Briefcase, GraduationCap, TrendingUp, Building2, Wrench, BarChart3 } from 'lucide-react';

const TILES = [
  { icon: Briefcase, label: 'Student' },
  { icon: GraduationCap, label: 'Mentors' },
  { icon: TrendingUp, label: 'Investors' },
  { icon: Building2, label: 'Campus & Orgs' },
  { icon: Wrench, label: 'Incubators' },
  { icon: BarChart3, label: 'Companies' },
];

const BULLETS = [
  'Seamless collaboration between founders, mentors and investors',
  'One connected dashboard for capital, mentorship and community',
  'Curated access to opportunities, events and resources',
];

// Fixed brand-black panel, same pattern as Dashboard's "Next Step" card —
// every color inside it is a fixed value (white/opacity), never a
// theme-reactive token, since this surface never inverts.
export default function Ecosystem() {
  return (
    <section id="ecosystem" className="py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-5 lg:px-10">
        <div className="bg-brand-black text-white rounded-lg p-8 lg:p-14 grid lg:grid-cols-2 gap-10">
          <div>
            <h2 className="font-poppins font-bold text-3xl lg:text-4xl">A Unified Ecosystem</h2>
            <p className="mt-4 font-inter text-body text-white/70 leading-relaxed max-w-md">
              BOCC brings every stakeholder in the startup journey into one connected platform — so the right conversations happen at the right time.
            </p>
            <ul className="mt-8 space-y-3">
              {BULLETS.map((b) => (
                <li key={b} className="flex gap-3 font-inter text-small text-white/80">
                  <Check size={18} strokeWidth={2} className="text-accent-neon shrink-0 mt-0.5" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {TILES.map(({ icon: Icon, label }) => (
              <div key={label} className="bg-white/5 border border-white/10 rounded-lg p-6 flex flex-col items-center justify-center text-center hover:bg-white/10 transition-colors">
                <Icon size={22} strokeWidth={2} />
                <p className="mt-3 font-inter text-small">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
