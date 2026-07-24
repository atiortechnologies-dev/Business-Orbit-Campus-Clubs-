import { motion } from "framer-motion";

export function CTA() {
  return (
    <section className="relative mx-auto max-w-7xl px-6 py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="relative mx-auto max-w-3xl text-center"
      >
        <div className="absolute -left-8 top-8 h-20 w-20 rounded-lg bg-neutral hidden md:block" />
        <div className="absolute -right-8 bottom-8 h-24 w-24 rounded-lg bg-accent/40 hidden md:block" />

        <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-5xl">
          Ready to Fuel the Next Wave of Innovation?
        </h2>

        <p className="mx-auto mt-5 max-w-xl text-[15px] text-muted-foreground">
          Join BOCC&apos;s trusted investor network and gain exclusive access
          to promising student-led startups backed by mentorship, validation,
          and university partnerships.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <a
            href="#register"
            className="rounded-md bg-foreground px-5 py-3 text-sm font-medium text-background transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            Join as an Investor
          </a>

          <a
            href="#contact"
            className="rounded-md border border-border bg-background px-5 py-3 text-sm font-medium text-foreground transition-colors hover:bg-muted"
          >
            Contact Investment Team
          </a>
        </div>

        <p className="mt-6 text-[11px] text-muted-foreground">
          * All investment opportunities are subject to verification and
          regulatory compliance.
        </p>
      </motion.div>
    </section>
  );
}