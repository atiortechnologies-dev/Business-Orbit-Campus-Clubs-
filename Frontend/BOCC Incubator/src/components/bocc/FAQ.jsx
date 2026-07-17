import { useState } from "react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { Plus, Minus } from "lucide-react";

const faqs = [
  {
    q: "Who can become a BOCC incubation partner?",
    a: "Any university incubator, accelerator, innovation hub, or campus entrepreneurship cell committed to supporting student-led startups can apply. We partner with institutions of all sizes that share our vision for structured, global incubation.",
  },
  {
    q: "What resources are provided?",
    a: "Partners gain access to BOCC's standardized curriculum, mentor network, investor connections, analytics dashboards, evaluation rubrics, co-branding rights, and the full innovation ecosystem toolkit.",
  },
  {
    q: "Is there any partnership fee?",
    a: "BOCC offers flexible partnership tiers. Some core resources are available at no cost to qualifying academic institutions, while premium features and dedicated support are available through tiered plans. Contact our partnerships team for details.",
  },
  {
    q: "How does BOCC support startup evaluation?",
    a: "We provide standardized scoring rubrics and assessment frameworks that incubator managers use to objectively evaluate ventures at each stage of the journey, ensuring consistency and quality benchmarks across the network.",
  },
  {
    q: "Can existing incubators integrate with BOCC?",
    a: "Absolutely. BOCC is designed to enhance, not replace, your existing programs. Our framework integrates alongside your current processes, adding structure, global reach, and institutional analytics without disruption.",
  },
];

export default function FAQ() {
  const ref = useScrollReveal();
  const [open, setOpen] = useState(0);

  return (
    <section ref={ref} id="faq" className="py-20 lg:py-28">
      <div className="max-w-3xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-14">
          <span data-reveal className="text-xs font-semibold tracking-wider uppercase text-[#111111] bg-[#C6D82D]/15 px-3 py-1 rounded-full">
            FAQ
          </span>
          <h2 data-reveal data-delay="80" className="font-heading font-bold text-3xl lg:text-4xl tracking-tight text-[#111111] mt-4">
            Frequently Asked Questions
          </h2>
          <p data-reveal data-delay="140" className="text-[#666] mt-4 text-lg">
            Everything you need to know about the incubator partnership program.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          {faqs.map((f, i) => {
            const isOpen = open === i;
            return (
              <div
                key={i}
                data-reveal
                data-delay={i * 60}
                className={`border rounded-2xl overflow-hidden transition-all duration-300 ${
                  isOpen ? "border-[#C6D82D] bg-[#FAFAFA]" : "border-[#EAEAEA] bg-white hover:border-[#111111]/20"
                }`}
              >
                <button
                  onClick={() => setOpen(isOpen ? -1 : i)}
                  className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left"
                >
                  <span className="font-heading font-semibold text-base text-[#111111]">{f.q}</span>
                  <span className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-colors ${isOpen ? "bg-[#C6D82D]" : "bg-[#FAFAFA]"}`}>
                    {isOpen ? <Minus className="w-4 h-4 text-[#111111]" /> : <Plus className="w-4 h-4 text-[#111111]" />}
                  </span>
                </button>
                <div
                  className="grid transition-all duration-300 ease-out"
                  style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
                >
                  <div className="overflow-hidden">
                    <p className="px-6 pb-5 text-sm text-[#666] leading-relaxed">{f.a}</p>
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