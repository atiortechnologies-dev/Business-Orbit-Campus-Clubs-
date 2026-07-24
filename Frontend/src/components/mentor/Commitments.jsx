import React from 'react';
import FadeIn from '@/components/motion/FadeIn';

/**
 * @typedef {import('react').SVGProps<SVGSVGElement>} SVGPropsType
 */

/** @type {(props: SVGPropsType) => React.ReactElement} */
const ClipboardList = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M9 2h6a2 2 0 0 1 2 2v0a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2v0a2 2 0 0 1 2-2z" />
    <rect x="6" y="6" width="12" height="16" rx="2" />
    <path d="M9 11h6" />
    <path d="M9 15h6" />
  </svg>
);

/** @type {(props: SVGPropsType) => React.ReactElement} */
const Share2 = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <circle cx="18" cy="5" r="3" />
    <circle cx="6" cy="12" r="3" />
    <circle cx="18" cy="19" r="3" />
    <path d="M8.5 10.5l6.5-4" />
    <path d="M8.5 13.5l6.5 4" />
  </svg>
);

/** @type {(props: SVGPropsType) => React.ReactElement} */
const Lightbulb = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M9 18h6" />
    <path d="M10 22h4" />
    <path d="M12 2a7 7 0 0 0-5 11.9A5 5 0 0 0 11 20h2a5 5 0 0 0 5-6.1A7 7 0 0 0 12 2z" />
  </svg>
);

/** @type {(props: SVGPropsType) => React.ReactElement} */
const Milestone = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M6 22V6h12v10" />
    <path d="M18 8l-6 4-6-4" />
    <path d="M12 12v10" />
  </svg>
);

/** @type {(props: SVGPropsType) => React.ReactElement} */
const Clock = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5" />
    <path d="M12 12l4 2" />
  </svg>
);

/** @type {(props: SVGPropsType) => React.ReactElement} */
const Calendar = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="4" y="5" width="16" height="15" rx="2" />
    <path d="M16 3v4" />
    <path d="M8 3v4" />
    <path d="M4 11h16" />
  </svg>
);

/** @type {(props: SVGPropsType) => React.ReactElement} */
const RefreshCw = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M21 10a9 9 0 1 0-1.73 5.39" />
    <polyline points="17 10 21 10 21 6" />
  </svg>
);

const commitments = [
  {
    icon: ClipboardList,
    title: 'Strategy Review',
    points: ['Quarterly business model assessment', 'Go-to-market strategy validation', 'Competitive positioning analysis'],
  },
  {
    icon: Share2,
    title: 'Network Access',
    points: ['Introductions to relevant investors', 'Industry-specific connections', 'Strategic partnership opportunities'],
  },
  {
    icon: Lightbulb,
    title: 'Critical Guidance',
    points: ['Product-market fit evaluation', 'Technical architecture review', 'Scaling strategy advisory'],
  },
  {
    icon: Milestone,
    title: 'Goal Setting',
    points: ['OKR framework establishment', 'Milestone definition and tracking', 'KPI monitoring setup'],
  },
];

const badges = [
  { icon: Clock, label: 'Avg. 2-4 Hours / Month' },
  { icon: Calendar, label: 'Flexible Scheduling' },
  { icon: RefreshCw, label: '12-Month Engagement Cycle' },
];

export default function Commitments() {
  return (
    <section id="commitments" className="py-20 lg:py-32 bg-white border-y border-[#EAEAEA]">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <FadeIn className="max-w-2xl mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight text-black leading-[1.2]">
            Mentor Commitments
          </h2>
          <p className="mt-4 text-base md:text-lg text-[#666666] leading-relaxed">
            Clear expectations that ensure meaningful outcomes for both mentors and founders.
          </p>
        </FadeIn>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {commitments.map((item, i) => {
            const Icon = item.icon;
            return (
              <FadeIn key={item.title} delay={i * 0.1}>
                <div className="h-full bg-[#F8F8F8] border border-[#EAEAEA] rounded-xl p-8 hover:-translate-y-1 hover:shadow-lg hover:shadow-black/5 transition-all duration-300">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="h-12 w-12 rounded-lg bg-white border border-[#EAEAEA] flex items-center justify-center">
                      <Icon className="text-black" style={{ width: 22, height: 22 }} />
                    </div>
                    <h3 className="text-lg font-semibold text-black">{item.title}</h3>
                  </div>
                  <ul className="space-y-3">
                    {item.points.map((point, j) => (
                      <li key={j} className="flex items-start gap-3">
                        <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[#C7D62F] flex-shrink-0" />
                        <span className="text-sm text-[#666666] leading-relaxed">{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </FadeIn>
            );
          })}
        </div>
        <FadeIn delay={0.2}>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {badges.map((badge, i) => {
              const Icon = badge.icon;
              return (
                <div key={i} className="flex items-center gap-3 bg-black px-6 py-4 rounded-xl">
                  <Icon width={18} height={18} className="text-[#C7D62F]" />
                  <span className="text-sm font-medium text-white">{badge.label}</span>
                </div>
              );
            })}
          </div>
        </FadeIn>
      </div>
    </section>
  );
}