import { Sparkles, BadgeCheck, FlaskConical } from 'lucide-react';
import SectionHeading from './SectionHeading';

const CARDS = [
  { icon: Sparkles, title: 'Fresh Perspectives', description: 'Help companies access young innovators and student talent with the latest skills and ideas.' },
  { icon: BadgeCheck, title: 'Verified Talent Pipeline', description: 'Connect with verified startups and students who have been screened for quality and readiness.' },
  { icon: FlaskConical, title: 'Research & Innovation', description: 'Collaborate with universities on real-world R&D projects that drive measurable outcomes.' },
];

export default function ValueProposition() {
  return (
    <section id="partners" className="bg-surface-white py-20 lg:py-28" aria-labelledby="value-heading">
      <div className="mx-auto max-w-[1440px] px-6 lg:px-10">
        <SectionHeading
          eyebrow="Why BOCC"
          title="Why Leading Companies Choose BOCC"
          subtitle="A single ecosystem that turns campus energy into corporate advantage — vetted, structured, and ready to scale."
        />

        <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-3">
          {CARDS.map(({ icon: Icon, title, description }) => (
            <article key={title} className="group h-full rounded-lg border border-border-subtle bg-surface-white p-8 transition-all duration-200 hover:-translate-y-1 hover:border-accent-neon">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-md border border-border-subtle bg-canvas-bg text-text-heading transition-colors group-hover:border-accent-neon group-hover:bg-accent-neon/10">
                <Icon size={20} strokeWidth={2} />
              </span>
              <h3 className="mt-6 font-poppins font-semibold text-xl tracking-tight text-text-heading">{title}</h3>
              <p className="mt-3 font-inter text-[15px] leading-relaxed text-text-muted">{description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
