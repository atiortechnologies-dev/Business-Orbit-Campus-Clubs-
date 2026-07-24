import { motion } from "framer-motion";
import {
  Sparkles,
  ShieldCheck,
  TrendingUp,
  Users,
} from "lucide-react";

const cards = [
  {
    icon: Sparkles,
    title: "Exclusive Deal Flow",
    desc: "Gain early access to carefully selected student startups before public fundraising.",
  },
  {
    icon: ShieldCheck,
    title: "De-Risked Ventures",
    desc: "Every startup is evaluated through BOCC's structured incubation and mentorship process.",
  },
  {
    icon: TrendingUp,
    title: "Verified Traction",
    desc: "Review startups backed by real validation, customer feedback, MVPs, and measurable progress.",
  },
  {
    icon: Users,
    title: "Ecosystem Synergy",
    desc: "Collaborate with universities, mentors, founders, and innovation partners within the BOCC network.",
  },
];

export function WhyInvest() {
  return (
    <section
      id="investors"
      className="mx-auto max-w-7xl px-6 py-24"
    >
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
          Why Invest Through BOCC?
        </h2>

        <p className="mt-4 text-[15px] text-muted-foreground">
          We bridge the gap between academic brilliance and market reality,
          ensuring your capital is placed in resilient, well-guided ventures.
        </p>
      </div>

      <div className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
        {cards.map((c, i) => (
          <motion.div
            key={c.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            whileHover={{ y: -4 }}
            className="rounded-xl border border-border bg-card p-6 transition-shadow hover:shadow-[0_10px_30px_-15px_rgba(0,0,0,0.15)]"
          >
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-neutral">
              <c.icon
                className="h-5 w-5 text-foreground"
                strokeWidth={1.75}
              />
            </div>

            <h3 className="mt-5 text-[17px] font-semibold text-foreground">
              {c.title}
            </h3>

            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {c.desc}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}