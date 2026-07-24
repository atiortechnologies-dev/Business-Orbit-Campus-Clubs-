import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

const faqs = [
  { q: "How do I apply to BOCC's startup programs?", a: "Applying is easy: sign up on our platform, complete the application form, and our team will review it within 5 business days. Once accepted, you'll join the next cohort." },
  { q: "Is there a cost to join the community?", a: "Our core community is free to join. Some premium programs and cohort-based accelerators may have a nominal fee, which is clearly outlined during application." },
  { q: "Can I apply as a non-student?", a: "Yes — while BOCC is campus-focused, we welcome recent graduates and adjacent early-stage founders through our extended network programs." },
  { q: "How does BOCC help with funding?", a: "We connect vetted startups with our investor network, host demo days, and provide fundraising coaching to help you land your first check." },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section className="py-20 lg:py-28">
      <div className="max-w-3xl mx-auto px-5 lg:px-10">
        <h2 className="text-3xl lg:text-4xl font-black text-center">Frequently Asked Questions</h2>
        <div className="mt-10 space-y-3">
          {faqs.map((f, i) => (
            <div key={f.q} className="bg-white rounded-xl border border-black/5">
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between px-5 py-4 text-left"
              >
                <span className="font-semibold text-sm">{f.q}</span>
                <ChevronDown size={18} className={`transition-transform ${open === i ? "rotate-180" : ""}`} />
              </button>
              <AnimatePresence initial={false}>
                {open === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <p className="px-5 pb-5 text-sm text-neutral-600 leading-relaxed">{f.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}