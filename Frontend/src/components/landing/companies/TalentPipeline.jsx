import { Check } from 'lucide-react';

const POINTS = ['Campus Hiring', 'Internship Programs', 'Startup Collaborations', 'Student Clubs'];

export default function TalentPipeline() {
  return (
    <section id="talent" className="bg-surface-white py-20 lg:py-28" aria-labelledby="talent-heading">
      <div className="mx-auto grid max-w-[1440px] grid-cols-1 items-center gap-12 px-6 lg:grid-cols-2 lg:gap-20 lg:px-10">
        <div>
          <span className="inline-flex items-center gap-2 font-inter text-caption font-medium uppercase tracking-[0.18em] text-text-muted">
            <span className="h-1.5 w-1.5 rounded-full bg-accent-neon" />
            Recruitment Ecosystem
          </span>
          <h2 id="talent-heading" className="mt-4 font-poppins font-semibold text-3xl sm:text-4xl md:text-[2.75rem] md:leading-[1.15] tracking-tight text-text-heading">
            Strategic Talent Pipeline
          </h2>
          <p className="mt-5 max-w-xl font-inter text-body sm:text-card leading-relaxed text-text-body">
            BOCC's recruitment ecosystem gives companies structured access to pre-screened talent across every stage — from first-year interns to startup founders ready to build. We bridge the gap between academic potential and industry readiness.
          </p>

          <ul className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {POINTS.map((point) => (
              <li key={point} className="flex items-center gap-3">
                <span className="inline-flex h-6 w-6 flex-none items-center justify-center rounded-full bg-accent-neon/15 text-text-heading">
                  <Check size={14} strokeWidth={2} />
                </span>
                <span className="font-inter text-[15px] font-medium text-text-body">{point}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="aspect-[4/3] placeholder-box rounded-lg" />
      </div>
    </section>
  );
}
