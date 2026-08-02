import { FileText, ClipboardCheck, Handshake, KanbanSquare, ArrowRight } from 'lucide-react';
import SectionHeading from './SectionHeading';

const STEPS = [
  { num: '01', icon: FileText, title: 'Post Opportunity', desc: 'Share roles, projects, or research briefs across the BOCC network in minutes.' },
  { num: '02', icon: ClipboardCheck, title: 'Review Applications', desc: 'Browse verified student and startup profiles matched to your requirements.' },
  { num: '03', icon: Handshake, title: 'Hire & Collaborate', desc: 'Onboard talent or launch joint projects with structured agreements.' },
  { num: '04', icon: KanbanSquare, title: 'Manage Projects', desc: 'Track progress, milestones, and outcomes from a single dashboard.' },
];

export default function Process() {
  return (
    <section id="roles" className="bg-canvas-bg py-20 lg:py-28" aria-labelledby="process-heading">
      <div className="mx-auto max-w-[var(--spacing-container-max)] px-6 lg:px-10">
        <SectionHeading
          eyebrow="The Process"
          title="How Your Partnership Works"
          subtitle="A transparent four-step flow from posting an opportunity to delivering results."
        />

        <div className="relative mt-14">
          <div className="absolute left-0 right-0 top-12 hidden h-px bg-border-subtle lg:block" />

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((step, i) => (
              <div key={step.num} className="relative flex flex-col items-start">
                <div className="relative z-10 flex h-24 w-24 items-center justify-center">
                  <span className="absolute inset-0 flex items-center justify-center font-poppins font-bold text-5xl text-border-subtle">{step.num}</span>
                  <span className="relative inline-flex h-12 w-12 items-center justify-center rounded-md border border-border-subtle bg-surface-white text-text-heading shadow-card">
                    <step.icon size={20} strokeWidth={2} />
                  </span>
                </div>
                <h3 className="mt-5 font-poppins font-semibold text-card tracking-tight text-text-heading">{step.title}</h3>
                <p className="mt-2 font-inter text-small leading-relaxed text-text-muted">{step.desc}</p>

                {i < STEPS.length - 1 && (
                  <ArrowRight size={20} strokeWidth={2} className="absolute -right-5 top-10 hidden text-border-subtle lg:block" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
