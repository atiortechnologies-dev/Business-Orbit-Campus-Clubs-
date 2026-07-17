import { motion } from "framer-motion";

const stories = [
  {
    quote:
      "BOCC took me from a dorm-room idea to a seed round in under four months. The mentorship was the difference.",
    author: "Aisha K.",
    meta: "Founder, Lumen · 2025",
    img: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&q=80",
  },
  {
    quote:
      "The investor intros were real and warm. We closed our pre-seed with three partners from the network.",
    author: "Marcus T.",
    meta: "Founder, Cadence · 2024",
    img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80",
  },
  {
    quote:
      "The 5-stage journey kept us honest. We validated before we built, and it saved us months.",
    author: "Priya R.",
    meta: "Founder, Strata · 2025",
    img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&q=80",
  },
];

export default function SuccessStories() {
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
            Success Stories
          </span>
          <h2 className="mt-3 text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-neutral-900">
            Founder Success Stories
          </h2>
          <p className="mt-4 text-base md:text-lg text-neutral-500 leading-relaxed">
            Students who walked the path — and what they built along the way.
          </p>
        </motion.div>

        <div className="mt-14 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stories.map((s, idx) => (
            <motion.div
              key={s.author}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              className="bg-white border border-neutral-200 rounded-sm overflow-hidden flex flex-col"
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img src={s.img} alt={s.author} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="p-6 md:p-7 flex flex-col flex-1">
                <p className="text-sm md:text-base text-neutral-700 leading-relaxed flex-1">
                  "{s.quote}"
                </p>
                <div className="mt-6 pt-5 border-t border-neutral-200">
                  <div className="text-sm font-semibold text-neutral-900">{s.author}</div>
                  <div className="text-xs text-neutral-400 mt-0.5">{s.meta}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}