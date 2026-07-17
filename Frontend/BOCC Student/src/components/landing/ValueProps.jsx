import { motion } from "framer-motion";
import {
  Map,
  Users,
  LineChart,
  Award,
  Network,
  Rocket,
} from "lucide-react";

const valueProps = [
  { icon: Map, title: "Structured Roadmap", desc: "A clear, stage-by-stage path from idea to launch." },
  { icon: Users, title: "Curated Mentorship", desc: "1:1 guidance from founders, operators, and investors." },
  { icon: LineChart, title: "Smart Investor Services", desc: "Warm intros to investors who actually write checks." },
  { icon: Award, title: "Elite Startup Grants", desc: "Non-dilutive funding to help you build your MVP." },
  { icon: Network, title: "Networking", desc: "A vetted community of peers, alumni, and partners." },
  { icon: Rocket, title: "Launch Support", desc: "Go-to-market help, PR, and scale-readiness coaching." },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const itemVariants = {
  hidden: { y: 24, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: "spring", damping: 20, stiffness: 120 } },
};

export default function ValueProps() {
  return (
    <section className="py-20 md:py-28 bg-neutral-50 border-y border-neutral-200">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl"
        >
          <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
            Why BOCC
          </span>
          <h2 className="mt-3 text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-neutral-900">
            Why Start at BOCC?
          </h2>
          <p className="mt-4 text-base md:text-lg text-neutral-500 leading-relaxed">
            Everything a student founder needs — under one roof, built for momentum.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-neutral-200 border border-neutral-200 rounded-sm overflow-hidden"
        >
          {valueProps.map(({ icon: Icon, title, desc }) => (
            <motion.div
              key={title}
              variants={itemVariants}
              className="group bg-white p-8 md:p-10 hover:bg-neutral-50 transition-colors"
            >
              <div className="w-11 h-11 flex items-center justify-center rounded-sm border border-neutral-200 text-neutral-900 group-hover:border-[#C8D400] group-hover:bg-[#C8D400]/10 transition-colors">
                <Icon size={20} strokeWidth={1.75} />
              </div>
              <h3 className="mt-5 text-lg font-semibold text-neutral-900">{title}</h3>
              <p className="mt-2 text-sm text-neutral-500 leading-relaxed">{desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}