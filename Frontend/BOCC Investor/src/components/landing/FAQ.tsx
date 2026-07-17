import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

const faqs = [
  { q: "How does BOCC evaluate startups?", a: "Every startup progresses through our 5-stage framework: Ideation, Validation, MVP, Launch, and Traction. Only those passing mentor and metric checks reach investors." },
  { q: "What investment stages are available?", a: "You'll find pre-seed to Series A opportunities across sectors, all matched to your thesis and check size." },
  { q: "What industries are represented?", a: "SaaS, FinTech, HealthTech, EdTech, Climate, Supply Chain, and consumer — sourced from over 15 partner universities." },
  { q: "Is there a minimum investment requirement?", a: "There is no fixed floor. Angels typically start at $10k while syndicates and funds allocate larger tickets." },
  { q: "How are startups matched with investors?", a: "Our matching engine aligns startup traction and stage with your declared thesis, geography, and check size." },
  { q: "What support does BOCC provide after investment?", a: "Portfolio dashboards, quarterly founder reviews, mentor introductions, and follow-on round coordination." },
];

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="resources" className="mx-auto max-w-3xl px-6 py-24">
      <div className="text-center">
        <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">Investor FAQ</h2>
        <p className="mt-4 text-[15px] text-muted-foreground">
          Everything you need to know about partnering with the BOCC ecosystem.
        </p>
      </div>
      <div className="mt-10 divide-y divide-border rounded-xl border border-border bg-card">
        {faqs.map((f, i) => (
          <div key={f.q}>
            <button
              onClick={() => setOpen(open === i ? null : i)}
              className="flex w-full items-center justify-between px-5 py-4 text-left transition-colors hover:bg-neutral"
            >
              <span className="text-[14px] font-medium text-foreground">{f.q}</span>
              <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${open === i ? "rotate-180" : ""}`} />
            </button>
            <AnimatePresence initial={false}>
              {open === i && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  className="overflow-hidden"
                >
                  <p className="px-5 pb-5 text-[13.5px] leading-relaxed text-muted-foreground">{f.a}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </section>
  );
}