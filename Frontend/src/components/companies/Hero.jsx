import { motion } from 'framer-motion';
import { ArrowRight, Building2, Users } from 'lucide-react';
import FadeIn from './FadeIn';

import boccLogo from "@/assets/bocc-logo.png";
import tower from "@/assets/tower.png";

const STATS = [
  { value: '500+', label: 'Partnered Colleges' },
  { value: '15K+', label: 'Verified Students' },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};
const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-white" aria-labelledby="hero-heading">
      {/* subtle background accents */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -right-40 -top-40 h-[32rem] w-[32rem] rounded-full bg-lime/5 blur-3xl" />
        <div className="absolute -left-40 top-1/2 h-[28rem] w-[28rem] rounded-full bg-neutral-100/60 blur-3xl" />
      </div>

      <div className="relative mx-auto grid max-w-[1440px] grid-cols-1 items-center gap-12 px-6 py-16 lg:grid-cols-2 lg:gap-16 lg:px-10 lg:py-24">
        {/* Left content */}
        <motion.div variants={container} initial="hidden" animate="show" className="flex flex-col">
          <motion.span variants={item} className="inline-flex w-fit items-center gap-2 rounded-full border border-neutral-200 bg-white px-3.5 py-1.5 text-xs font-medium text-neutral-600">
            <span className="h-1.5 w-1.5 rounded-full bg-lime" />
            For Companies
          </motion.span>

          <motion.h1
            id="hero-heading"
            variants={item}
            className="mt-6 text-4xl font-semibold leading-[1.08] tracking-tight text-neutral-900 sm:text-5xl lg:text-[4rem] text-balance"
          >
            Bridge the Gap Between Campus and Industry
          </motion.h1>

          <motion.p variants={item} className="mt-6 max-w-xl text-base leading-relaxed text-neutral-500 sm:text-lg">
            Business Orbit Campus Club helps organizations discover talented students, innovative startups, campus ambassadors, research opportunities, and future employees through one unified ecosystem.
          </motion.p>

          <motion.div variants={item} className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href="#partners"
              className="group inline-flex h-12 items-center justify-center gap-2 rounded-full bg-neutral-900 px-7 text-sm font-medium text-white transition-all hover:bg-neutral-800 lime-focus"
            >
              Partner with BOCC
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </a>
            <a
              href="#talent"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-neutral-200 bg-white px-7 text-sm font-medium text-neutral-800 transition-all hover:border-neutral-300 hover:bg-neutral-50 lime-focus"
            >
              View Talent Pool
            </a>
          </motion.div>

          {/* Stats */}
          <motion.div variants={item} className="mt-12 grid max-w-md grid-cols-2 gap-4">
            {STATS.map((stat) => (
              <div key={stat.label} className="rounded-2xl border-l-2 border-lime bg-neutral-50/60 px-5 py-4">
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl">{stat.value}</span>
                </div>
                <p className="mt-1 text-sm text-neutral-500">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Right image */}
        <FadeIn delay={0.2} y={32} className="relative">
          <div className="relative overflow-hidden rounded-[1.75rem] border border-neutral-200 bg-neutral-50">
            <img
              src={tower}
              alt="Digital bridge connecting a university campus to a modern corporate headquarters, with lime-green data nodes flowing between them"
              className="aspect-[4/5] w-full object-cover"
              loading="eager"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-white/20 via-transparent to-transparent" />
          </div>

          {/* Floating accents */}
          <div className="absolute -left-4 top-8 hidden rounded-2xl border border-neutral-200 bg-white/90 px-4 py-3 shadow-sm backdrop-blur-sm lg:flex lg:items-center lg:gap-2.5">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-neutral-900 text-white">
              <Building2 className="h-4 w-4" />
            </span>
            <div>
              <p className="text-xs font-medium text-neutral-900">Companies</p>
              <p className="text-[11px] text-neutral-500">Hiring partners</p>
            </div>
          </div>
          <div className="absolute -bottom-4 right-6 hidden rounded-2xl border border-neutral-200 bg-white/90 px-4 py-3 shadow-sm backdrop-blur-sm lg:flex lg:items-center lg:gap-2.5">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-lime text-neutral-900">
              <Users className="h-4 w-4" />
            </span>
            <div>
              <p className="text-xs font-medium text-neutral-900">Students</p>
              <p className="text-[11px] text-neutral-500">Vetted talent</p>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}