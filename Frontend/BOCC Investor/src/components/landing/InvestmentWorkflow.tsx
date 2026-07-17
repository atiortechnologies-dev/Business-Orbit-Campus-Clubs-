import { motion } from "framer-motion";
import { Search, FileText, Handshake, LineChart, TrendingUp, ArrowRight } from "lucide-react";

const steps = [
  { n: "01", icon: Search, title: "View Startups", desc: "Browse curated lists of startups categorized by industry, stage, and traction score." },
  { n: "02", icon: FileText, title: "Review Pitch Deck", desc: "Analyze comprehensive data rooms including founder profiles, market research, and MVP results." },
  { n: "03", icon: Handshake, title: "Connect with Founders", desc: "Facilitate direct meetings and negotiate terms through our structured deal-flow process." },
  { n: "04", icon: LineChart, title: "Evaluate Opportunity", desc: "Use verified metrics, mentor reviews, and validated milestones to make an informed decision." },
  { n: "05", icon: TrendingUp, title: "Track Portfolio Growth", desc: "Monitor performance through live updates from the BOCC ecosystem dashboard." },
];

export function InvestmentWorkflow() {
  return (
    <section id="journey" className="mx-auto max-w-7xl px-6 py-24">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div className="max-w-xl">
          <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">Seamless Investment Workflow</h2>
          <p className="mt-4 text-[15px] text-muted-foreground">
            Our platform streamlines the entire investment lifecycle, from discovery to post-investment tracking.
          </p>
        </div>
        <a href="#" className="group inline-flex items-center gap-2 text-sm font-medium text-foreground">
          Explore the workflow in detail
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </a>
      </div>
      <div className="mt-12 grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-5">
        {steps.map((s, i) => (
          <motion.div
            key={s.n}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            className="border-t border-border pt-5"
          >
            <s.icon className="h-6 w-6 text-foreground" strokeWidth={1.75} />
            <div className="mt-4 text-xs font-semibold tracking-wider text-muted-foreground">{s.n}</div>
            <h3 className="mt-1 text-[15px] font-semibold text-foreground">{s.title}</h3>
            <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">{s.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}