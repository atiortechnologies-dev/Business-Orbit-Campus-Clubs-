import { ArrowRight, Lightbulb } from 'lucide-react';
import FadeIn from './FadeIn';

export default function FinalCTA() {
  return (
    <section className="bg-white pb-24 pt-8 lg:pb-32" aria-labelledby="cta-heading">
      <div className="mx-auto max-w-[1440px] px-6 lg:px-10">
        <FadeIn>
          <div className="relative overflow-hidden rounded-[2rem] border border-neutral-200 bg-neutral-50/60 px-6 py-16 text-center sm:px-12 lg:py-24">
            {/* accents */}
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute left-1/2 top-0 h-40 w-[40rem] -translate-x-1/2 rounded-full bg-lime/10 blur-3xl" />
            </div>

            <div className="relative flex flex-col items-center">
              <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-neutral-200 bg-white text-neutral-900 shadow-sm">
                <Lightbulb className="h-6 w-6" />
              </span>

              <h2 id="cta-heading" className="mt-6 max-w-2xl text-3xl font-semibold tracking-tight text-neutral-900 sm:text-4xl lg:text-5xl lg:leading-[1.1] text-balance">
                Ready to Shape the Future?
              </h2>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-neutral-500 sm:text-lg">
                Join Business Orbit Campus Club and connect with India's brightest students, startups, mentors, and innovators.
              </p>

              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <a
                  href="#register"
                  className="group inline-flex h-12 items-center justify-center gap-2 rounded-full bg-neutral-900 px-7 text-sm font-medium text-white transition-all hover:bg-neutral-800 lime-focus"
                >
                  Partner with BOCC
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </a>
                <a
                  href="#contact"
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-neutral-200 bg-white px-7 text-sm font-medium text-neutral-800 transition-all hover:border-neutral-300 hover:bg-neutral-50 lime-focus"
                >
                  Talk to Our Team
                </a>
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}