import { useState } from "react";
import { ChevronDown } from "lucide-react";

const FAQS = [
  {
    q: "What is the time commitment for mentors?",
    a: "Mentors commit an average of 2-4 hours per month over a 12-month engagement cycle. Scheduling is flexible and coordinated through the Atior platform.",
  },
  {
    q: "How are mentors matched with startups?",
    a: "Our algorithm aligns mentor expertise with startup stage, industry, and specific needs. You can review and accept requests at your discretion.",
  },
  {
    q: "Do I need prior mentorship experience?",
    a: "No prior mentorship experience is required. We value real-world operational experience. Our onboarding includes a brief orientation to familiarize you with the workflow.",
  },
  {
    q: "Is there compensation for mentoring?",
    a: "Mentorship is voluntary. However, mentors gain equity-adjacent benefits through our advisor share program for exceptional engagements.",
  },
];

export default function FAQ() {
  const [open, setOpen] = useState(0);

  return (
    <section
      id="faq"
      className="py-20 lg:py-32 bg-surface-white border-y border-border-subtle"
    >
      <div className="mx-auto max-w-3xl px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="font-poppins font-semibold text-3xl md:text-4xl lg:text-5xl tracking-tight text-text-heading leading-[1.2]">
            Frequently Asked Questions
          </h2>
          <p className="mt-4 font-inter text-body md:text-card text-text-body leading-relaxed">
            Everything you need to know about the Atior mentorship program.
          </p>
        </div>
        <div className="space-y-3">
          {FAQS.map((faq, idx) => {
            const isOpen = open === idx;
            return (
              <div
                key={faq.q}
                className="border border-border-subtle bg-canvas-bg rounded-lg overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? -1 : idx)}
                  className="w-full flex items-center justify-between px-6 py-5 text-left"
                >
                  <span className="font-inter font-medium text-body text-text-heading pr-4">
                    {faq.q}
                  </span>
                  <ChevronDown
                    size={20}
                    strokeWidth={2}
                    className={`shrink-0 text-text-muted transition-transform duration-300 ${isOpen ? "rotate-180 text-text-heading" : ""}`}
                  />
                </button>
                <div
                  className={`grid transition-all duration-300 ease-in-out ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
                >
                  <div className="overflow-hidden">
                    <p className="px-6 pb-5 font-inter text-small text-text-muted leading-relaxed">
                      {faq.a}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
