import { Check } from "lucide-react";

const STEPS = [
  "Basic Information",
  "Requirements & Eligibility",
  "Opportunity Description",
  "Preview & Publish",
];

export default function PostOpportunityStepper({ current }) {
  return (
    <div className="relative flex items-start justify-between max-w-3xl mx-auto py-4">
      <div className="absolute left-4 right-4 top-4 h-px bg-border-subtle" />
      {STEPS.map((label, i) => {
        const stepNum = i + 1;
        const done = stepNum < current;
        const active = stepNum === current;
        return (
          <div
            key={label}
            className="relative z-10 flex flex-col items-center gap-2 text-center px-2 bg-canvas-bg max-w-[110px]"
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-caption font-inter font-bold shrink-0 ${
                done
                  ? "bg-brand-black text-accent-neon"
                  : active
                    ? "bg-brand-black text-white"
                    : "border border-border-subtle text-text-muted"
              }`}
            >
              {done ? <Check size={16} strokeWidth={3} /> : stepNum}
            </div>
            <span
              className={`text-caption font-inter leading-tight ${active ? "font-bold text-text-heading" : done ? "font-semibold text-text-heading" : "text-text-muted"}`}
            >
              {label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
