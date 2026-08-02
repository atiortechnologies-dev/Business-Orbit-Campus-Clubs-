import { Fragment } from "react";
import {
  UserPlus,
  BadgeCheck,
  MessageSquare,
  Compass,
  Flag,
  ArrowRight,
} from "lucide-react";

const STEPS = [
  {
    icon: UserPlus,
    label: "Request",
    description:
      "Receive tailored match requests based on your expertise and domain alignment.",
  },
  {
    icon: BadgeCheck,
    label: "Accept",
    description:
      "Review startup profiles and accept engagements that fit your schedule.",
  },
  {
    icon: MessageSquare,
    label: "Chat",
    description:
      "Initiate structured conversations through the Atior mentorship platform.",
  },
  {
    icon: Compass,
    label: "Guide",
    description:
      "Provide strategic guidance across sprints, milestones, and key pivots.",
  },
  {
    icon: Flag,
    label: "Complete",
    description:
      "Close the engagement with measurable outcomes and structured feedback.",
  },
];

export default function Workflow() {
  return (
    <section id="workflow" className="py-20 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="max-w-2xl mb-16">
          <h2 className="font-poppins font-semibold text-3xl md:text-4xl lg:text-5xl tracking-tight text-text-heading leading-[1.2]">
            Mentorship Workflow
          </h2>
          <p className="mt-4 font-inter text-body md:text-card text-text-body leading-relaxed">
            A streamlined five-step process designed for impact and efficiency.
          </p>
        </div>

        <div className="hidden md:flex items-start justify-between">
          {STEPS.map((step, i) => (
            <Fragment key={step.label}>
              <div className="flex-1 flex flex-col items-center text-center max-w-[220px]">
                <div className="h-16 w-16 rounded-lg bg-surface-white border border-border-subtle flex items-center justify-center mb-5">
                  <step.icon
                    size={26}
                    strokeWidth={2}
                    className="text-text-heading"
                  />
                </div>
                <span className="font-inter text-caption font-semibold uppercase tracking-wider text-text-heading mb-2 block">
                  Step {i + 1}
                </span>
                <h3 className="font-poppins font-semibold text-body text-text-heading mb-2">
                  {step.label}
                </h3>
                <p className="font-inter text-small text-text-muted leading-relaxed">
                  {step.description}
                </p>
              </div>
              {i < STEPS.length - 1 && (
                <div className="flex items-center pt-8 px-1">
                  <ArrowRight
                    size={20}
                    strokeWidth={2}
                    className="text-border-subtle"
                  />
                </div>
              )}
            </Fragment>
          ))}
        </div>

        <div className="md:hidden space-y-8">
          {STEPS.map((step, i) => (
            <div key={step.label} className="flex gap-4">
              <div className="flex-shrink-0 h-16 w-16 rounded-lg bg-surface-white border border-border-subtle flex items-center justify-center">
                <step.icon
                  size={26}
                  strokeWidth={2}
                  className="text-text-heading"
                />
              </div>
              <div>
                <span className="font-inter text-caption font-semibold uppercase tracking-wider text-text-heading block mb-1">
                  Step {i + 1}
                </span>
                <h3 className="font-poppins font-semibold text-body text-text-heading mb-2">
                  {step.label}
                </h3>
                <p className="font-inter text-small text-text-muted leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
