import { Target, Users, Activity, TrendingUp } from 'lucide-react';

const CARDS = [
  { icon: Target, title: 'Identify Top Talent', description: 'Discover high-potential founders early. Gain first access to emerging talent before they hit the market.' },
  { icon: Users, title: 'Elite Network', description: 'Connect with a curated community of industry leaders, investors, and serial entrepreneurs.' },
  { icon: Activity, title: 'Innovation Pulse', description: 'Stay at the forefront of technology trends through exposure to cutting-edge campus research.' },
  { icon: TrendingUp, title: 'Thought Leadership', description: 'Amplify your expertise by contributing to workshops, panels, and published insights.' },
];

export default function WhyMentor() {
  return (
    <section id="why-mentor" className="py-20 lg:py-32 bg-surface-white border-y border-border-subtle">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="max-w-2xl mb-16">
          <h2 className="font-poppins font-semibold text-3xl md:text-4xl lg:text-5xl tracking-tight text-text-heading leading-[1.2]">
            Why Mentor with Atior?
          </h2>
          <p className="mt-4 font-inter text-body md:text-card text-text-body leading-relaxed">
            Empower the next wave of innovators while elevating your own trajectory.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {CARDS.map(({ icon: Icon, title, description }) => (
            <div key={title} className="group h-full bg-canvas-bg border border-border-subtle rounded-lg p-8 hover:-translate-y-1 hover:shadow-card transition-all duration-300">
              <div className="h-14 w-14 rounded-md bg-surface-white border border-border-subtle flex items-center justify-center mb-6 group-hover:bg-accent-neon transition-colors">
                <Icon size={24} strokeWidth={2} className="text-text-heading" />
              </div>
              <h3 className="font-poppins font-semibold text-card text-text-heading mb-3">{title}</h3>
              <p className="font-inter text-small text-text-muted leading-relaxed">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
