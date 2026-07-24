import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import heroImg from "@/assets/hero-dashboard.jpg";

const stats = [
  { value: "500+", label: "Pre-Vetted Student Startups" },
  { value: "$12M+", label: "Capital Facilitated" },
  { value: "45%", label: "Avg. Startup Growth Rate" },
];

export function Hero() {
  return (
    <section className="mx-auto max-w-7xl px-6 pt-16 pb-24 md:pt-20 md:pb-28">
      <div className="grid grid-cols-1 gap-12 md:grid-cols-2 md:gap-16 items-start">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="max-w-xl"
        >
          <span className="inline-flex items-center rounded-full border border-border px-3 py-1 text-xs font-medium text-muted-foreground">
            For Investors &amp; Venture Partners
          </span>

          <h1 className="mt-6 text-5xl font-bold leading-[1.05] tracking-tight text-foreground md:text-6xl">
            Identify and Invest in the Next Generation of Campus Founders
          </h1>

          <p className="mt-6 text-base leading-relaxed text-muted-foreground md:text-[17px]">
            BOCC connects visionary investors with carefully vetted student
            startups emerging from leading universities. Gain early access to
            innovative ventures, review investment-ready opportunities, and
            support the next generation of entrepreneurs through the BOCC
            ecosystem.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#register"
              className="group inline-flex items-center gap-2 rounded-md bg-foreground px-5 py-3 text-sm font-medium text-background transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              Join as an Investor
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </a>

            <a
              href="#directory"
              className="inline-flex items-center rounded-md border border-border bg-background px-5 py-3 text-sm font-medium text-foreground transition-colors hover:bg-muted"
            >
              View Startup Directory
            </a>
          </div>

          <div className="mt-12 grid grid-cols-3 gap-6 border-t border-border pt-8">
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.1, duration: 0.5 }}
              >
                <div className="text-3xl font-bold text-foreground md:text-4xl">
                  {s.value}
                </div>

                <div className="mt-1 text-[11px] uppercase tracking-wider text-muted-foreground">
                  {s.label}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{
            duration: 0.7,
            ease: "easeOut",
            delay: 0.1,
          }}
          className="relative"
        >
          <div className="overflow-hidden rounded-2xl border border-border bg-neutral shadow-[0_20px_60px_-20px_rgba(0,0,0,0.15)]">
            <img
              src={heroImg}
              alt="Investor dashboard interface"
              width={1280}
              height={960}
              className="w-full h-auto"
            />
          </div>

          <div className="absolute -bottom-4 -right-4 -z-10 h-32 w-32 rounded-full bg-accent/40 blur-3xl" />
        </motion.div>
      </div>
    </section>
  );
}