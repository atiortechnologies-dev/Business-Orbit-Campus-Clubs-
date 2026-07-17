import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";

const stats = [
  { value: "5000+", label: "Students" },
  { value: "150+", label: "Mentors" },
  { value: "12 Months", label: "Average" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};
const itemVariants = {
  hidden: { y: 28, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: "spring", damping: 22, stiffness: 120 } },
};

export default function Hero() {
  return (
    <section className="relative pt-28 md:pt-36 pb-16 md:pb-24 bg-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center"
        >
          <div>
            <motion.div variants={itemVariants}>
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full bg-[#C8D400] text-neutral-900">
                <Sparkles size={12} />
                Join the club
              </span>
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="mt-6 text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight text-neutral-900 leading-[1.05]"
            >
              Turn Your Ideas Into Venture-Backed Startups.
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="mt-6 text-base md:text-lg text-neutral-500 max-w-xl leading-relaxed"
            >
              Structure, guidance, elite mentors, and a network of investors ready to back the next
              big thing from campus.
            </motion.p>

            <motion.div variants={itemVariants} className="mt-8 flex flex-wrap items-center gap-4">
              <button className="inline-flex items-center gap-2 px-6 py-3 bg-[#C8D400] text-neutral-900 text-sm font-semibold rounded-sm hover:bg-[#b5be00] transition-colors">
                Book Discovery Call
                <ArrowRight size={16} />
              </button>
              <button className="inline-flex items-center gap-2 px-6 py-3 border border-neutral-300 text-neutral-900 text-sm font-semibold rounded-sm hover:bg-neutral-50 transition-colors">
                Learn More
              </button>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="mt-12 flex flex-wrap gap-8 md:gap-12 pt-8 border-t border-neutral-200"
            >
              {stats.map((s) => (
                <div key={s.label}>
                  <div className="text-2xl md:text-3xl font-bold text-neutral-900">{s.value}</div>
                  <div className="text-xs md:text-sm text-neutral-500 mt-1">{s.label}</div>
                </div>
              ))}
            </motion.div>
          </div>

          <motion.div variants={itemVariants} className="lg:pl-8">
            <div className="relative overflow-hidden rounded-sm aspect-[4/5] lg:aspect-[5/6] w-full">
              <img
                src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=900&q=80"
                alt="Students collaborating"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-sm rounded-sm px-5 py-4 flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-[#C8D400]" />
                <span className="text-sm font-semibold text-neutral-900">Business Orbit Campus Club — BOCC</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}