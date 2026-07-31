import { Users, Handshake } from "lucide-react";
import ComingSoon from "@/components/ui/ComingSoon";
import PlaceholderGraphic from "@/components/ui/PlaceholderGraphic";

const FEATURES = [
  {
    eyebrow: "Feature 01",
    title: "Personalized Mentorship",
    desc: "Get matched with mentors who've built and scaled companies in your space. Weekly 1:1 sessions, async support, and honest feedback that moves you forward.",
    cta: "Meet the mentors",
    icon: Users,
  },
  {
    eyebrow: "Feature 02",
    title: "Seamless Investor Access",
    desc: "Skip the cold outreach. We connect you with a curated network of angel investors and VCs actively backing campus founders — with prep, decks, and warm intros handled.",
    cta: "See investor network",
    reverse: true,
    icon: Handshake,
  },
];

export default function Features() {
  return (
    <section className="py-20 md:py-28 bg-canvas-bg border-y border-border-subtle">
      <div className="mx-auto max-w-7xl px-6 lg:px-10 space-y-20 md:space-y-28">
        {FEATURES.map((f) => (
          <div
            key={f.title}
            className={`grid lg:grid-cols-2 gap-10 lg:gap-16 items-center ${f.reverse ? "lg:[&>*:first-child]:order-2" : ""}`}
          >
            <div>
              <span className="font-inter text-caption font-semibold uppercase tracking-wider text-text-muted">
                {f.eyebrow}
              </span>
              <h3 className="mt-3 font-poppins font-bold text-2xl md:text-3xl lg:text-4xl tracking-tight text-text-heading">
                {f.title}
              </h3>
              <p className="mt-4 font-inter text-body md:text-card text-text-body leading-relaxed max-w-lg">
                {f.desc}
              </p>
              <ComingSoon
                label={f.cta}
                position="top"
                inline
                className="mt-7 inline-flex items-center gap-2 font-poppins font-semibold text-small text-text-heading border-b-2 border-accent-neon pb-1"
              >
                {f.cta}
              </ComingSoon>
            </div>
            <PlaceholderGraphic
              icon={f.icon}
              label={f.title}
              className="aspect-[4/3] w-full rounded-lg"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
