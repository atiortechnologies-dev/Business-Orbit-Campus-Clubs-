import { Fragment } from 'react';
import { UserPlus, BadgeCheck, MessageSquare, Compass, Flag, ArrowRight } from 'lucide-react';
import FadeIn from '@/components/motion/FadeIn';

const steps = [
  { icon: UserPlus, label: 'Request', description: 'Receive tailored match requests based on your expertise and domain alignment.' },
  { icon: BadgeCheck, label: 'Accept', description: 'Review startup profiles and accept engagements that fit your schedule.' },
  { icon: MessageSquare, label: 'Chat', description: 'Initiate structured conversations through the Atior mentorship platform.' },
  { icon: Compass, label: 'Guide', description: 'Provide strategic guidance across sprints, milestones, and key pivots.' },
  { icon: Flag, label: 'Complete', description: 'Close the engagement with measurable outcomes and structured feedback.' },
];

export default function Workflow() {
  return (
    <section id="workflow" className="py-20 lg:py-32 bg-[#F8F8F8]">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <FadeIn className="max-w-2xl mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight text-black leading-[1.2]">
            Mentorship Workflow
          </h2>
          <p className="mt-4 text-base md:text-lg text-[#666666] leading-relaxed">
            A streamlined five-step process designed for impact and efficiency.
          </p>
        </FadeIn>

        <FadeIn delay={0.1}>
          {/* Desktop — horizontal */}
          <div className="hidden md:flex items-start justify-between">
            {steps.map((step, i) => {
              const Icon = step.icon;
              return (
                <Fragment key={step.label}>
                  <div className="flex-1 flex flex-col items-center text-center max-w-[220px]">
                    <div className="h-16 w-16 rounded-lg bg-white border border-[#EAEAEA] flex items-center justify-center mb-5">
                      <Icon size={26} className="text-black" />
                    </div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-black mb-2 block">
                      Step {i + 1}
                    </span>
                    <h3 className="text-base font-semibold text-black mb-2">{step.label}</h3>
                    <p className="text-sm text-[#666666] leading-relaxed">{step.description}</p>
                  </div>
                  {i < steps.length - 1 && (
                    <div className="flex items-center pt-8 px-1">
                      <ArrowRight size={20} className="text-[#EAEAEA]" />
                    </div>
                  )}
                </Fragment>
              );
            })}
          </div>

          {/* Mobile — vertical */}
          <div className="md:hidden space-y-8">
            {steps.map((step, i) => {
              const Icon = step.icon;
              return (
                <div key={step.label} className="flex gap-4">
                  <div className="flex-shrink-0 h-16 w-16 rounded-lg bg-white border border-[#EAEAEA] flex items-center justify-center">
                    <Icon size={26} className="text-black" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-black block mb-1">
                      Step {i + 1}
                    </span>
                    <h3 className="text-base font-semibold text-black mb-2">{step.label}</h3>
                    <p className="text-sm text-[#666666] leading-relaxed">{step.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </FadeIn>
      </div>
    </section>
  );
}