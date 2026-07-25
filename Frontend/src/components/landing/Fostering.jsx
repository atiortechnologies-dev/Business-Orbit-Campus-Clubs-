import { GraduationCap, Compass, Rocket } from 'lucide-react';

const ITEMS = [
  { icon: GraduationCap, title: 'University Hub', desc: 'Connect with top universities and student innovators across campuses worldwide.' },
  { icon: Compass, title: 'Campus Ecosystem', desc: 'Access resources, mentors and programs tailored to student entrepreneurs.' },
  { icon: Rocket, title: 'Launch Support', desc: 'Everything you need to go from campus idea to funded, growing startup.' },
];

export default function Fostering() {
  return (
    <section className="py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-5 lg:px-10 grid lg:grid-cols-2 gap-10 items-center">
        <div className="aspect-[4/3] placeholder-box rounded-lg" />

        <div>
          <p className="font-inter text-caption uppercase tracking-widest text-text-muted mb-3">About Us</p>
          <h2 className="font-poppins font-bold text-3xl lg:text-4xl leading-tight text-text-heading">Fostering Innovation Across Campus Borders</h2>
          <p className="mt-4 font-inter text-body text-text-body leading-relaxed">
            At the core of what we do, BOCC is a mission-driven platform dedicated to nurturing startups from every corner of the campus world. We provide the tools, mentorship and network to help early-stage founders build, launch and scale.
          </p>
          <div className="mt-6 space-y-3">
            {ITEMS.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex gap-4 bg-surface-white border border-border-subtle rounded-lg p-4">
                <div className="w-10 h-10 rounded-md bg-canvas-bg flex items-center justify-center shrink-0">
                  <Icon size={18} strokeWidth={2} className="text-text-body" />
                </div>
                <div className="min-w-0">
                  <div className="font-poppins font-semibold text-small text-text-heading">{title}</div>
                  <p className="font-inter text-small text-text-muted mt-1">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
