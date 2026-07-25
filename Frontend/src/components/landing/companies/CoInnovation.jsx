import { Check } from 'lucide-react';

const POINTS = ['Sponsored Projects', 'University Research', 'Innovation Labs', 'Product Validation', 'Prototype Development'];

export default function CoInnovation() {
  return (
    <section id="startup-journey" className="bg-canvas-bg py-20 lg:py-28" aria-labelledby="coinno-heading">
      <div className="mx-auto grid max-w-[1440px] grid-cols-1 items-center gap-12 px-6 lg:grid-cols-2 lg:gap-20 lg:px-10">
        <div className="order-2 lg:order-1 aspect-[4/3] placeholder-box rounded-lg" />

        <div className="order-1 lg:order-2">
          <span className="inline-flex items-center gap-2 font-inter text-caption font-medium uppercase tracking-[0.18em] text-text-muted">
            <span className="h-1.5 w-1.5 rounded-full bg-accent-neon" />
            R&amp;D Collaboration
          </span>
          <h2 id="coinno-heading" className="mt-4 font-poppins font-semibold text-3xl sm:text-4xl md:text-[2.75rem] md:leading-[1.15] tracking-tight text-text-heading">
            Co-Innovation &amp; Research
          </h2>
          <p className="mt-5 max-w-xl font-inter text-body sm:text-card leading-relaxed text-text-body">
            Partner directly with university labs and student research teams to validate ideas, build prototypes, and accelerate product development — all within a structured, IP-friendly framework.
          </p>

          <ul className="mt-8 space-y-3">
            {POINTS.map((point) => (
              <li key={point} className="flex items-center gap-3">
                <span className="inline-flex h-6 w-6 flex-none items-center justify-center rounded-full bg-accent-neon/15">
                  <Check size={14} strokeWidth={2} className="text-text-heading" />
                </span>
                <span className="font-inter text-[15px] font-medium text-text-body">{point}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
