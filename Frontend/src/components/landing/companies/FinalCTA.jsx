import { Link } from 'react-router-dom';
import { ArrowRight, Lightbulb } from 'lucide-react';
import ComingSoon from '@/components/ui/ComingSoon';

export default function FinalCTA() {
  return (
    <section className="pb-24 pt-8 lg:pb-32" aria-labelledby="cta-heading">
      <div className="mx-auto max-w-[1440px] px-6 lg:px-10">
        <div className="relative overflow-hidden rounded-lg border border-border-subtle bg-canvas-bg px-6 py-16 text-center sm:px-12 lg:py-24">
          <div className="relative flex flex-col items-center">
            <span className="inline-flex h-14 w-14 items-center justify-center rounded-lg border border-border-subtle bg-surface-white text-text-heading shadow-card">
              <Lightbulb size={24} strokeWidth={2} />
            </span>

            <h2 id="cta-heading" className="mt-6 max-w-2xl font-poppins font-semibold text-3xl sm:text-4xl lg:text-5xl lg:leading-[1.1] tracking-tight text-text-heading">
              Ready to Shape the Future?
            </h2>
            <p className="mt-5 max-w-xl font-inter text-body sm:text-card leading-relaxed text-text-body">
              Join Business Orbit Campus Club and connect with India's brightest students, startups, mentors, and innovators.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link to="/signup/company" className="group inline-flex h-12 items-center justify-center gap-2 rounded-full bg-action-bg px-7 font-inter text-small font-medium text-action-text hover:opacity-90 transition-all">
                Partner with BOCC
                <ArrowRight size={16} strokeWidth={2} className="transition-transform group-hover:translate-x-0.5" />
              </Link>
              <ComingSoon label="Talk to Our Team" position="top" inline className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-border-subtle bg-surface-white font-inter text-small font-medium text-text-heading px-7">
                Talk to Our Team
              </ComingSoon>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
