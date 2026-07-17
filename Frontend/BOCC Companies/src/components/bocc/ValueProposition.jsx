import { Sparkles, BadgeCheck, FlaskConical } from 'lucide-react';
import SectionHeading from './SectionHeading';
import FadeIn from './FadeIn';

const CARDS = [
  {
    icon: Sparkles,
    title: 'Fresh Perspectives',
    description: 'Help companies access young innovators and student talent with the latest skills and ideas.',
  },
  {
    icon: BadgeCheck,
    title: 'Verified Talent Pipeline',
    description: 'Connect with verified startups and students who have been screened for quality and readiness.',
  },
  {
    icon: FlaskConical,
    title: 'Research & Innovation',
    description: 'Collaborate with universities on real-world R&D projects that drive measurable outcomes.',
  },
];

export default function ValueProposition() {
  return (
    <section id="partners" className="bg-white py-20 lg:py-28" aria-labelledby="value-heading">
      <div className="mx-auto max-w-[1440px] px-6 lg:px-10">
        <SectionHeading
          eyebrow="Why BOCC"
          title="Why Leading Companies Choose BOCC"
          subtitle="A single ecosystem that turns campus energy into corporate advantage — vetted, structured, and ready to scale."
        />

        <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-3">
          {CARDS.map((card, i) => (
            <FadeIn key={card.title} delay={i * 0.08}>
              <article className="group h-full rounded-2xl border border-neutral-200 bg-white p-8 transition-all duration-200 hover:-translate-y-1 hover:border-lime">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl border border-neutral-200 bg-neutral-50 text-neutral-900 transition-colors group-hover:border-lime group-hover:bg-lime/10">
                  <card.icon className="h-5 w-5" />
                </span>
                <h3 className="mt-6 text-xl font-semibold tracking-tight text-neutral-900">{card.title}</h3>
                <p className="mt-3 text-[15px] leading-relaxed text-neutral-500">{card.description}</p>
              </article>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}