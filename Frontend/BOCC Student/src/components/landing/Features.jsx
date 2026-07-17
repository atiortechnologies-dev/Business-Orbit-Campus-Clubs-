import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const features = [
  {
    eyebrow: "Feature 01",
    title: "Personalized Mentorship",
    desc: "Get matched with mentors who've built and scaled companies in your space. Weekly 1:1 sessions, async support, and honest feedback that moves you forward.",
    cta: "Meet the mentors",
    img: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80",
  },
  {
    eyebrow: "Feature 02",
    title: "Seamless Investor Access",
    desc: "Skip the cold outreach. We connect you with a curated network of angel investors and VCs actively backing campus founders — with prep, decks, and warm intros handled.",
    cta: "See investor network",
    reverse: true,
    img: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=800&q=80",
  },
];

export default function Features() {
  return (
    <section className="py-20 md:py-28 bg-neutral-50 border-y border-neutral-200">
      <div className="mx-auto max-w-7xl px-6 lg:px-10 space-y-20 md:space-y-28">
        {features.map((f, idx) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className={`grid lg:grid-cols-2 gap-10 lg:gap-16 items-center ${
              f.reverse ? "lg:[&>*:first-child]:order-2" : ""
            }`}
          >
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                {f.eyebrow}
              </span>
              <h3 className="mt-3 text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight text-neutral-900">
                {f.title}
              </h3>
              <p className="mt-4 text-base md:text-lg text-neutral-500 leading-relaxed max-w-lg">
                {f.desc}
              </p>
              <button className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-neutral-900 border-b-2 border-[#C8D400] pb-1 hover:gap-3 transition-all">
                {f.cta}
                <ArrowRight size={16} />
              </button>
            </div>
            <div className="overflow-hidden rounded-sm aspect-[4/3] w-full">
              <img src={f.img} alt={f.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}