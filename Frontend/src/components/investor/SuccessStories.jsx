import { motion } from "framer-motion";
import { ArrowRight, TrendingUp, Users, Award } from "lucide-react";
import s1 from "@/assets/story-1.jpg";
import s2 from "@/assets/story-2.jpg";
import s3 from "@/assets/story-3.jpg";

const stories = [
  {
    img: s1,
    badge: "SaaS / FinTech",
    name: "EcoStream AI",
    metric: "150% YoY Revenue",
    mentor: "Traction",
    icon: TrendingUp,
  },
  {
    img: s2,
    badge: "HealthTech",
    name: "BioPulse Health",
    metric: "$500k Seed Raised",
    mentor: "Launch",
    icon: Award,
  },
  {
    img: s3,
    badge: "Supply Chain",
    name: "Nexus Logistics",
    metric: "20k Monthly Active Users",
    mentor: "Traction",
    icon: Users,
  },
];

export function SuccessStories() {
  return (
    <section id="stories" className="mx-auto max-w-7xl px-6 py-24">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
          Featured Success Stories
        </h2>

        <a
          href="#"
          className="rounded-md border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
        >
          View All Success Stories
        </a>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
        {stories.map((s, i) => (
          <motion.article
            key={s.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            whileHover={{ y: -4 }}
            className="overflow-hidden rounded-xl border border-border bg-card transition-shadow hover:shadow-[0_20px_50px_-25px_rgba(0,0,0,0.25)]"
          >
            <div className="aspect-[4/3] overflow-hidden bg-neutral">
              <img
                src={s.img}
                alt={s.name}
                width={800}
                height={600}
                loading="lazy"
                className="h-full w-full object-cover"
              />
            </div>

            <div className="p-5">
              <div className="flex items-center justify-between">
                <span className="inline-flex rounded-md bg-neutral px-2 py-1 text-[11px] font-medium text-foreground">
                  {s.badge}
                </span>

                <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                  <s.icon className="h-3.5 w-3.5" />
                  {s.mentor}
                </span>
              </div>

              <h3 className="mt-3 text-lg font-semibold text-foreground">
                {s.name}
              </h3>

              <p className="mt-1 text-[13px] text-muted-foreground">
                Metric: {s.metric}
              </p>

              <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
                <div className="flex gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-foreground" />
                  <span className="h-1.5 w-1.5 rounded-full bg-border" />
                  <span className="h-1.5 w-1.5 rounded-full bg-border" />
                </div>

                <a
                  href="#"
                  className="group inline-flex items-center gap-1 text-xs font-medium text-foreground"
                >
                  Investor Details
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </a>
              </div>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}