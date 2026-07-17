import { Check } from 'lucide-react';
import FadeIn from './FadeIn';
import blocksbox from "@/assets/blocksbox.png";

const POINTS = [
  'Campus Hiring',
  'Internship Programs',
  'Startup Collaborations',
  'Student Clubs',
];

export default function TalentPipeline() {
  return (
    <section id="talent" className="bg-white py-20 lg:py-28" aria-labelledby="talent-heading">
      <div className="mx-auto grid max-w-[1440px] grid-cols-1 items-center gap-12 px-6 lg:grid-cols-2 lg:gap-20 lg:px-10">
        {/* Left content */}
        <FadeIn>
          <span className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-neutral-500">
            <span className="h-1.5 w-1.5 rounded-full bg-lime" />
            Recruitment Ecosystem
          </span>
          <h2 id="talent-heading" className="mt-4 text-3xl font-semibold tracking-tight text-neutral-900 sm:text-4xl md:text-[2.75rem] md:leading-[1.15] text-balance">
            Strategic Talent Pipeline
          </h2>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-neutral-500 sm:text-lg">
            BOCC's recruitment ecosystem gives companies structured access to pre-screened talent across every stage — from first-year interns to startup founders ready to build. We bridge the gap between academic potential and industry readiness.
          </p>

          <ul className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {POINTS.map((point) => (
              <li key={point} className="flex items-center gap-3">
                <span className="inline-flex h-6 w-6 flex-none items-center justify-center rounded-full bg-lime/15 text-neutral-900">
                  <Check className="h-3.5 w-3.5" />
                </span>
                <span className="text-[15px] font-medium text-neutral-700">{point}</span>
              </li>
            ))}
          </ul>
        </FadeIn>

        {/* Right image */}
        <FadeIn delay={0.1} y={32} className="relative">
          <div className="overflow-hidden rounded-[1.5rem] border border-neutral-200 bg-neutral-50">
            <img
              src={blocksbox}
              alt="3D glass cubes arranged in a grid, one highlighted in lime green to represent verified talent"
              className="aspect-[4/3] w-full object-cover"
              loading="lazy"
            />
          </div>
        </FadeIn>
      </div>
    </section>
  );
}