import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const stages = [
  { num: "01", title: "Ideation & Problem Mapping", desc: "Find a real problem worth solving and shape your founding thesis." },
  { num: "02", title: "Validation & Prototyping", desc: "Test assumptions with real users and build a clickable prototype." },
  { num: "03", title: "MVP Development", desc: "Ship a minimum viable product with engineering and design support." },
  { num: "04", title: "Traction & Early Users", desc: "Acquire your first customers and generate meaningful usage signals." },
  { num: "05", title: "Launch & Planning", desc: "Go public, raise capital, and plan your path to scale." },
];

export default function StartupJourney() {
  return (
    <section className="py-20 md:py-28 bg-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-4 lg:sticky lg:top-28 self-start"
          >
            <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
              The Journey
            </span>
            <h2 className="mt-3 text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-neutral-900 leading-tight">
              The 5-Stage Startup Journey
            </h2>
            <p className="mt-4 text-base md:text-lg text-neutral-500 leading-relaxed">
              A proven, structured path that takes you from a blank page to a venture-backed
              company — in roughly 12 Months.
            </p>
            <button className="mt-8 inline-flex items-center gap-2 px-6 py-3 bg-[#C8D400] text-neutral-900 text-sm font-semibold rounded-sm hover:bg-[#b5be00] transition-colors">
              Book 1:1 Consultation
              <ArrowRight size={16} />
            </button>
          </motion.div>

          <div className="lg:col-span-8">
            <div className="relative pl-8 md:pl-10">
              <div className="absolute left-0 top-2 bottom-2 w-px bg-neutral-200" />
              {stages.map((stage, idx) => (
                <motion.div
                  key={stage.num}
                  initial={{ opacity: 0, x: 24 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.08 }}
                  className="relative pb-10 last:pb-0"
                >
                  <div className="absolute -left-8 md:-left-10 top-1.5 w-4 h-4 rounded-full bg-[#C8D400] border-2 border-[#C8D400]" />
                  <div className="flex items-baseline gap-4">
                    <span className="text-sm font-bold text-neutral-400 tabular-nums">{stage.num}</span>
                    <div>
                      <h3 className="text-xl md:text-2xl font-semibold text-neutral-900">
                        {stage.title}
                      </h3>
                      <p className="mt-2 text-sm md:text-base text-neutral-500 leading-relaxed max-w-lg">
                        {stage.desc}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}