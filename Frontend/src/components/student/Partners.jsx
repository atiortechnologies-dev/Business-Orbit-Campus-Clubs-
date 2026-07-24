import { motion } from "framer-motion";
import { Zap, Briefcase, ArrowUpRight } from "lucide-react";

const items = [
  {
    icon: Zap,
    title: "Powered by Atior Technologies",
    desc: "Backed by the infrastructure, capital, and network of a full-stack technology partner.",
    link: "Learn more",
  },
  {
    icon: Briefcase,
    title: "Freelance Opportunities",
    desc: "Earn while you build. Access vetted freelance gigs and real-world projects from day one.",
    link: "Browse gigs",
  },
];

export default function Partners() {
  return (
    <section className="py-20 md:py-28 bg-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl"
        >
          <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
            Partners & Opportunities
          </span>
          <h2 className="mt-3 text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-neutral-900">
            Backed by the best. Built for you.
          </h2>
        </motion.div>

        <div className="mt-14 grid md:grid-cols-2 gap-6">
          {items.map(({ icon: Icon, title, desc, link }, idx) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              className="group p-8 md:p-10 border border-neutral-200 rounded-sm hover:border-[#C8D400] transition-colors bg-white"
            >
              <div className="w-11 h-11 flex items-center justify-center rounded-sm bg-[#C8D400] text-neutral-900">
                <Icon size={20} strokeWidth={1.75} />
              </div>
              <h3 className="mt-5 text-xl md:text-2xl font-semibold text-neutral-900">{title}</h3>
              <p className="mt-3 text-sm md:text-base text-neutral-500 leading-relaxed">{desc}</p>
              <a
                href="#"
                className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-neutral-900 group-hover:gap-2.5 transition-all"
              >
                {link}
                <ArrowUpRight size={16} />
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}