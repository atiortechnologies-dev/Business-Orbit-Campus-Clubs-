import { motion } from "framer-motion";
import { ArrowRight, Calendar, Star } from "lucide-react";

export default function BottomCTA() {
  return (
    <section className="relative py-24 md:py-32 bg-neutral-900 overflow-hidden">
      <motion.div
        aria-hidden
        animate={{ rotate: 360 }}
        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        className="absolute -top-16 -right-10 md:top-10 md:right-20 text-neutral-700"
      >
        <Star size={120} fill="currentColor" strokeWidth={0} />
      </motion.div>
      <motion.div
        aria-hidden
        animate={{ y: [0, -12, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-10 left-8 md:left-24 text-neutral-800"
      >
        <Star size={48} fill="currentColor" strokeWidth={0} />
      </motion.div>

      <div className="relative mx-auto max-w-4xl px-6 lg:px-10 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.1]"
        >
          Your Founder Journey Starts Here.
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mt-5 text-base md:text-lg text-neutral-400 max-w-xl mx-auto leading-relaxed"
        >
          Join a community of builders, mentors, and investors. Apply today and take the first step.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-9 flex flex-wrap items-center justify-center gap-4"
        >
          <button className="inline-flex items-center gap-2 px-7 py-3.5 bg-[#C8D400] text-neutral-900 text-sm font-semibold rounded-sm hover:bg-[#b5be00] transition-colors">
            Apply Now
            <ArrowRight size={16} />
          </button>
          <button className="inline-flex items-center gap-2 px-7 py-3.5 border border-neutral-600 text-white text-sm font-semibold rounded-sm hover:bg-neutral-800 transition-colors">
            <Calendar size={16} />
            View Events
          </button>
        </motion.div>
      </div>
    </section>
  );
}