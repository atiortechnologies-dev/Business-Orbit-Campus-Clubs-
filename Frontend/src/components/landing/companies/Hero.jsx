import { Link } from 'react-router-dom';
import { ArrowRight, Building2, Users } from 'lucide-react';
import ComingSoon from '@/components/ui/ComingSoon';

const STATS = [
  { value: '500+', label: 'Partnered Colleges' },
  { value: '15K+', label: 'Verified Students' },
];

export default function Hero() {
  return (
    <section className="relative overflow-hidden" aria-labelledby="hero-heading">
      <div className="relative mx-auto grid max-w-[var(--spacing-container-max)] grid-cols-1 items-center gap-12 px-6 pt-28 pb-16 lg:grid-cols-2 lg:gap-16 lg:px-10 lg:pt-32 lg:pb-24">
        <div className="flex flex-col">
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-border-subtle bg-surface-white px-3.5 py-1.5 font-inter text-caption font-medium text-text-muted">
            <span className="h-1.5 w-1.5 rounded-full bg-accent-neon" />
            For Companies
          </span>

          <h1 id="hero-heading" className="mt-6 font-poppins font-semibold text-4xl leading-[1.08] tracking-tight text-text-heading sm:text-5xl lg:text-[4rem]">
            Bridge the Gap Between Campus and Industry
          </h1>

          <p className="mt-6 max-w-xl font-inter text-body sm:text-card leading-relaxed text-text-body">
            Business Orbit Campus Club helps organizations discover talented students, innovative startups, campus ambassadors, research opportunities, and future employees through one unified ecosystem.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link to="/signup/company" className="group inline-flex h-12 items-center justify-center gap-2 rounded-full bg-action-bg px-7 font-inter text-small font-medium text-action-text hover:opacity-90 transition-all">
              Partner with BOCC
              <ArrowRight size={16} strokeWidth={2} className="transition-transform group-hover:translate-x-0.5" />
            </Link>
            <ComingSoon label="View Talent Pool" position="top" inline className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-border-subtle bg-surface-white px-7 font-inter text-small font-medium text-text-heading">
              View Talent Pool
            </ComingSoon>
          </div>

          <div className="mt-12 grid max-w-md grid-cols-1 sm:grid-cols-2 gap-4">
            {STATS.map((stat) => (
              <div key={stat.label} className="rounded-lg border-l-2 border-accent-neon bg-canvas-bg px-5 py-4">
                <span className="font-poppins font-semibold text-2xl sm:text-3xl tracking-tight text-text-heading">{stat.value}</span>
                <p className="mt-1 font-inter text-small text-text-muted">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative">
          <div className="aspect-[4/5] placeholder-box rounded-lg" />

          <div className="absolute -left-4 top-8 hidden rounded-lg border border-border-subtle bg-surface-white/90 px-4 py-3 shadow-card backdrop-blur-sm lg:flex lg:items-center lg:gap-2.5">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-brand-black text-white">
              <Building2 size={16} strokeWidth={2} />
            </span>
            <div>
              <p className="font-inter text-caption font-medium text-text-heading">Companies</p>
              <p className="font-inter text-[11px] text-text-muted">Hiring partners</p>
            </div>
          </div>
          <div className="absolute -bottom-4 right-6 hidden rounded-lg border border-border-subtle bg-surface-white/90 px-4 py-3 shadow-card backdrop-blur-sm lg:flex lg:items-center lg:gap-2.5">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-accent-neon text-brand-black">
              <Users size={16} strokeWidth={2} />
            </span>
            <div>
              <p className="font-inter text-caption font-medium text-text-heading">Students</p>
              <p className="font-inter text-[11px] text-text-muted">Vetted talent</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
