import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const faqs = [
  {
    q: "Who can join the IT Business Intel Campus Hub?",
    a: "Any enrolled university student with an idea — or just the curiosity to explore startups. No prior experience required.",
  },
  {
    q: "How long is the startup journey program?",
    a: "The core 5-stage journey runs an average of 12 Months, but you move at your own pace with mentor checkpoints along the way.",
  },
  {
    q: "Do I need a co-founder to apply?",
    a: "No. Many founders join solo and find co-founders inside the community. We'll help you assess whether a team is right for your venture.",
  },
  {
    q: "Is the grant funding dilutive?",
    a: "No. Our startup grants are non-dilutive — you keep full ownership of your company while you build.",
  },
];

export default function FAQ() {
  const [open, setOpen] = useState(0);

  return (
    <section className="py-20 md:py-28 bg-white">
      <div className="mx-auto max-w-3xl px-6 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
            FAQ
          </span>
          <h2 className="mt-3 text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-neutral-900">
            Frequently Asked Questions
          </h2>
        </motion.div>

        <div className="mt-12 divide-y divide-neutral-200 border-y border-neutral-200">
          {faqs.map((faq, idx) => {
            const isOpen = open === idx;
            return (
              <div key={idx}>
                <button
                  onClick={() => setOpen(isOpen ? -1 : idx)}
                  className="w-full flex items-center justify-between gap-4 py-5 md:py-6 text-left"
                >
                  <span className="text-base md:text-lg font-medium text-neutral-900">
                    {faq.q}
                  </span>
                  <ChevronDown
                    size={20}
                    className={cn(
                      "shrink-0 text-neutral-400 transition-transform duration-300",
                      isOpen && "rotate-180 text-neutral-900"
                    )}
                  />
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <p className="pb-5 md:pb-6 text-sm md:text-base text-neutral-500 leading-relaxed">
                        {faq.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}