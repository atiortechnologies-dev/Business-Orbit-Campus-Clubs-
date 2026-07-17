import { Target, Users, Activity, TrendingUp } from 'lucide-react';
import FadeIn from '@/components/motion/FadeIn';

const cards = [
  {
    icon: Target,
    title: 'Identify Top Talent',
    description: 'Discover high-potential founders early. Gain first access to emerging talent before they hit the market.',
  },
  {
    icon: Users,
    title: 'Elite Network',
    description: 'Connect with a curated community of industry leaders, investors, and serial entrepreneurs.',
  },
  {
    icon: Activity,
    title: 'Innovation Pulse',
    description: 'Stay at the forefront of technology trends through exposure to cutting-edge campus research.',
  },
  {
    icon: TrendingUp,
    title: 'Thought Leadership',
    description: 'Amplify your expertise by contributing to workshops, panels, and published insights.',
  },
];

export default function WhyMentor() {
  return (
    <section id="why-mentor" className="py-20 lg:py-32 bg-white border-y border-[#EAEAEA]">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <FadeIn className="max-w-2xl mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight text-black leading-[1.2]">
            Why Mentor with Atior?
          </h2>
          <p className="mt-4 text-base md:text-lg text-[#666666] leading-relaxed">
            Empower the next wave of innovators while elevating your own trajectory.
          </p>
        </FadeIn>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((card, i) => {
            const Icon = card.icon;
            return (
              <FadeIn key={card.title} delay={i * 0.1}>
                <div className="group h-full bg-[#F8F8F8] border border-[#EAEAEA] rounded-xl p-8 hover:-translate-y-2 hover:shadow-lg hover:shadow-black/5 transition-all duration-300">
                  <div className="h-14 w-14 rounded-lg bg-white border border-[#EAEAEA] flex items-center justify-center mb-6 group-hover:bg-[#C7D62F] transition-colors">
                    <Icon size={24} className="text-black" />
                  </div>
                  <h3 className="text-lg font-semibold text-black mb-3">{card.title}</h3>
                  <p className="text-sm text-[#666666] leading-relaxed">{card.description}</p>
                </div>
              </FadeIn>
            );
          })}
        </div>
      </div>
    </section>
  );
}