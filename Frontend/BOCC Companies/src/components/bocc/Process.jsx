import { FileText, ClipboardCheck, Handshake, KanbanSquare, ArrowRight } from 'lucide-react';
import SectionHeading from './SectionHeading';
import FadeIn from './FadeIn';

const STEPS = [
  { num: '01', icon: FileText, title: 'Post Opportunity', desc: 'Share roles, projects, or research briefs across the BOCC network in minutes.' },
  { num: '02', icon: ClipboardCheck, title: 'Review Applications', desc: 'Browse verified student and startup profiles matched to your requirements.' },
  { num: '03', icon: Handshake, title: 'Hire & Collaborate', desc: 'Onboard talent or launch joint projects with structured agreements.' },
  { num: '04', icon: KanbanSquare, title: 'Manage Projects', desc: 'Track progress, milestones, and outcomes from a single dashboard.' },
];

export default function Process() {
  return (
    <section id="roles" className="bg-neutral-50/60 py-20 lg:py-28" aria-labelledby="process-heading">
      <div className="mx-auto max-w-[1440px] px-6 lg:px-10">
        <SectionHeading
          eyebrow="The Process"
          title="How Your Partnership Works"
          subtitle="A transparent four-step flow from posting an opportunity to delivering results."
        />

        <div className="relative mt-14">
          {/* connecting line (desktop) */}
          <div className="absolute left-0 right-0 top-12 hidden h-px bg-neutral-200 lg:block" />

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((step, i) => (
              <FadeIn key={step.num} delay={i * 0.1} className="relative">
                <div className="flex flex-col items-start">
                  <div className="relative z-10 flex h-24 w-24 items-center justify-center">
                    <span className="absolute inset-0 flex items-center justify-center text-5xl font-bold text-neutral-100">{step.num}</span>
                    <span className="relative inline-flex h-12 w-12 items-center justify-center rounded-xl border border-neutral-200 bg-white text-neutral-900 shadow-sm">
                      <step.icon className="h-5 w-5" />
                    </span>
                  </div>
                  <h3 className="mt-5 text-lg font-semibold tracking-tight text-neutral-900">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-neutral-500">{step.desc}</p>

                  {i < STEPS.length - 1 && (
                    <ArrowRight className="absolute -right-5 top-10 hidden h-5 w-5 text-neutral-300 lg:block" />
                  )}
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}