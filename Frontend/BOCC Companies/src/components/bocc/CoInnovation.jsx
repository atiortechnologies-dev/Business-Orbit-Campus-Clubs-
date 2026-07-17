import { ArrowRight, Calendar } from "lucide-react";
import FadeIn from './FadeIn';

import bundles from "@/assets/bundles.png";

const POINTS = [
  'Sponsored Projects',
  'University Research',
  'Innovation Labs',
  'Product Validation',
  'Prototype Development',
];

export default function CoInnovation() {
  return (
    <section id="startup-journey" className="bg-neutral-50/60 py-20 lg:py-28" aria-labelledby="coinno-heading">
      <div className="mx-auto grid max-w-[1440px] grid-cols-1 items-center gap-12 px-6 lg:grid-cols-2 lg:gap-20 lg:px-10">
        {/* Left image */}
        <FadeIn y={32} className="relative order-2 lg:order-1">
          <div className="overflow-hidden rounded-[1.5rem] border border-neutral-200 bg-white lg:-ml-6">
            <img
              src={bundles}
              alt="3D abstract innovation lab with floating geometric shapes connected by lime-green neural lines"
              className="aspect-[4/3] w-full object-cover"
              loading="lazy"
            />
          </div>
        </FadeIn>

        {/* Right content */}
        <FadeIn delay={0.1} className="order-1 lg:order-2">
          <span className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-neutral-500">
            <span className="h-1.5 w-1.5 rounded-full bg-lime" />
            R&D Collaboration
          </span>
          <h2 id="coinno-heading" className="mt-4 text-3xl font-semibold tracking-tight text-neutral-900 sm:text-4xl md:text-[2.75rem] md:leading-[1.15] text-balance">
            Co-Innovation &amp; Research
          </h2>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-neutral-500 sm:text-lg">
            Partner directly with university labs and student research teams to validate ideas, build prototypes, and accelerate product development — all within a structured, IP-friendly framework.
          </p>

          <ul className="mt-8 space-y-3">
            {POINTS.map((point) => (
              <li key={point} className="flex items-center gap-3">
                <span className="inline-flex h-6 w-6 flex-none items-center justify-center rounded-full bg-lime/15 text-neutral-900">
                  <span className="h-3.5 w-3.5" />
                </span>
                <span className="text-[15px] font-medium text-neutral-700">{point}</span>
              </li>
            ))}
          </ul>
        </FadeIn>
      </div>
    </section>
  );
}