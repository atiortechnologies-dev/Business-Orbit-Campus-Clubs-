import { Check, Briefcase, GraduationCap, Users, Building2, Wrench, BarChart3 } from "lucide-react";

const tiles = [
  { icon: Briefcase, label: "Student" },
  { icon: GraduationCap, label: "Mentors" },
  { icon: Users, label: "Investors" },
  { icon: Building2, label: "Campus & Orgs" },
  { icon: Wrench, label: "Incubators" },
  { icon: BarChart3, label: "Organisations" },
];

const bullets = [
  "Seamless collaboration between founders, mentors and investors",
  "One connected dashboard for capital, mentorship and community",
  "Curated access to opportunities, events and resources",
];

export default function Ecosystem() {
  return (
    <section className="py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-5 lg:px-10">
        <div className="bg-[#0d1220] text-white rounded-3xl p-8 lg:p-14 grid lg:grid-cols-2 gap-10">
          <div>
            <h2 className="text-3xl lg:text-4xl font-black">A Unified Ecosystem</h2>
            <p className="mt-4 text-white/70 leading-relaxed max-w-md">
              BOCC brings every stakeholder in the startup journey into one connected platform — so the right conversations happen at the right time.
            </p>
            <ul className="mt-8 space-y-3">
              {bullets.map((b) => (
                <li key={b} className="flex gap-3 text-sm text-white/80">
                  <Check size={18} className="text-white shrink-0 mt-0.5" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {tiles.map(({ icon: Icon, label }) => (
              <div key={label} className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col items-center justify-center text-center hover:bg-white/10 transition-colors">
                <Icon size={22} />
                <p className="mt-3 text-sm">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}