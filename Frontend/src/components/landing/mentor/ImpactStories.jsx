import { Quote, User } from 'lucide-react';
import PlaceholderGraphic from '@/components/ui/PlaceholderGraphic';

const TESTIMONIALS = [
  { quote: 'Mentoring through Atior connected me with a founder who is now raising Series A. The caliber of talent here is unmatched.', name: 'Sarah Chen', role: 'Partner at Vertex Capital' },
  { quote: 'The structured workflow made mentorship effortless. I could focus on giving value, not managing logistics.', name: 'Marcus Reid', role: 'CTO at Nuvola Systems' },
  { quote: 'Watching my mentee pivot from concept to revenue in eight months was the most rewarding professional experience.', name: 'Aisha Patel', role: 'Founder, Ex-Google' },
];

export default function ImpactStories() {
  return (
    <section id="impact-stories" className="py-20 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="max-w-2xl mb-16">
          <h2 className="font-poppins font-semibold text-3xl md:text-4xl lg:text-5xl tracking-tight text-text-heading leading-[1.2]">
            Impact Stories
          </h2>
          <p className="mt-4 font-inter text-body md:text-card text-text-body leading-relaxed">
            Real outcomes from mentors who shaped tomorrow's leaders.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t) => (
            <div key={t.name} className="group h-full bg-surface-white border border-border-subtle rounded-lg overflow-hidden hover:-translate-y-1 hover:shadow-card transition-all duration-300">
              <PlaceholderGraphic icon={User} iconSize={22} className="aspect-square" />
              <div className="p-6">
                <Quote size={24} strokeWidth={2} className="text-accent-neon mb-4" />
                <p className="font-inter text-small text-text-heading leading-relaxed mb-6">{t.quote}</p>
                <div className="pt-4 border-t border-border-subtle">
                  <p className="font-poppins font-semibold text-small text-text-heading">{t.name}</p>
                  <p className="font-inter text-caption text-text-muted">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
