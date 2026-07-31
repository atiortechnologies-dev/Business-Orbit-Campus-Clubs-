import { useState } from "react";
import { ChevronDown } from "lucide-react";

const FAQS = [
  {
    q: "How does BOCC evaluate startups?",
    a: "Every startup progresses through our 5-stage framework: Ideation, Validation, MVP, Launch, and Traction. Only those passing mentor and metric checks reach investors.",
  },
  {
    q: "What investment stages are available?",
    a: "You'll find pre-seed to Series A opportunities across sectors, all matched to your thesis and check size.",
  },
  {
    q: "What industries are represented?",
    a: "SaaS, FinTech, HealthTech, EdTech, Climate, Supply Chain, and consumer — sourced from over 15 partner universities.",
  },
  {
    q: "Is there a minimum investment requirement?",
    a: "There is no fixed floor. Angels typically start at $10k while syndicates and funds allocate larger tickets.",
  },
  {
    q: "How are startups matched with investors?",
    a: "Our matching engine aligns startup traction and stage with your declared thesis, geography, and check size.",
  },
  {
    q: "What support does BOCC provide after investment?",
    a: "Portfolio dashboards, quarterly founder reviews, mentor introductions, and follow-on round coordination.",
  },
];

export default function FAQ() {
  const [open, setOpen] = useState(0);

  return (
    <section id="faq" className="mx-auto max-w-3xl px-6 py-24">
      <div className="text-center">
        <h2 className="font-poppins font-bold text-3xl md:text-4xl tracking-tight text-text-heading">
          Investor FAQ
        </h2>
        <p className="mt-4 font-inter text-small text-text-muted">
          Everything you need to know about partnering with the BOCC ecosystem.
        </p>
      </div>

      <div className="mt-10 divide-y divide-border-subtle rounded-lg border border-border-subtle bg-surface-white">
        {FAQS.map((faq, idx) => {
          const isOpen = open === idx;
          return (
            <div key={faq.q}>
              <button
                type="button"
                onClick={() => setOpen(isOpen ? -1 : idx)}
                className="flex w-full items-center justify-between px-5 py-4 text-left hover:bg-canvas-bg transition-colors"
              >
                <span className="font-inter text-[14px] font-medium text-text-heading">
                  {faq.q}
                </span>
                <ChevronDown
                  size={16}
                  strokeWidth={2}
                  className={`text-text-muted transition-transform ${isOpen ? "rotate-180" : ""}`}
                />
              </button>
              <div
                className={`grid transition-all duration-300 ease-in-out ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
              >
                <div className="overflow-hidden">
                  <p className="px-5 pb-5 font-inter text-[13.5px] leading-relaxed text-text-muted">
                    {faq.a}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
