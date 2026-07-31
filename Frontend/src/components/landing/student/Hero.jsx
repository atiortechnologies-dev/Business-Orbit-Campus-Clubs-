import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, LayoutDashboard } from "lucide-react";
import PlaceholderGraphic from "@/components/ui/PlaceholderGraphic";

const STATS = [
  { value: "5000+", label: "Students" },
  { value: "150+", label: "Mentors" },
  { value: "12 Months", label: "Average" },
];

export default function Hero() {
  return (
    <section className="relative pt-28 md:pt-36 pb-16 md:pb-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div>
            <span className="inline-flex items-center gap-1.5 font-poppins font-semibold text-caption uppercase tracking-wider px-3 py-1 rounded-full bg-accent-neon text-brand-black">
              <Sparkles size={12} strokeWidth={2} />
              Join the club
            </span>

            <h1 className="mt-6 font-poppins font-bold text-4xl sm:text-5xl lg:text-6xl xl:text-7xl leading-[1.05] tracking-tight text-text-heading">
              Turn Your Ideas Into Venture-Backed Startups.
            </h1>

            <p className="mt-6 font-inter text-body md:text-card text-text-body max-w-xl leading-relaxed">
              Structure, guidance, elite mentors, and a network of investors
              ready to back the next big thing from campus.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                to="/signup/student"
                className="inline-flex items-center gap-2 px-6 py-3 bg-action-bg text-action-text font-poppins font-semibold text-small rounded-md hover:opacity-90 transition-all"
              >
                Book Discovery Call
                <ArrowRight size={16} strokeWidth={2} />
              </Link>
              <a
                href="#journey"
                className="inline-flex items-center gap-2 px-6 py-3 border border-border-subtle text-text-heading font-poppins font-semibold text-small rounded-md hover:bg-canvas-bg transition-colors"
              >
                Learn More
              </a>
            </div>

            <div className="mt-12 flex flex-wrap gap-8 md:gap-12 pt-8 border-t border-border-subtle">
              {STATS.map((s) => (
                <div key={s.label}>
                  <div className="font-poppins font-bold text-2xl md:text-3xl text-text-heading">
                    {s.value}
                  </div>
                  <div className="font-inter text-caption md:text-small text-text-muted mt-1">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:pl-8">
            <PlaceholderGraphic
              icon={LayoutDashboard}
              label="Product Preview"
              className="overflow-hidden rounded-lg aspect-[4/5] lg:aspect-[5/6] w-full"
            >
              <div className="absolute bottom-4 left-4 right-4 bg-surface-white/90 backdrop-blur-sm rounded-md px-5 py-4 flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-accent-neon" />
                <span className="font-poppins font-semibold text-small text-text-heading">
                  Business Orbit Campus Clubs — BOCC
                </span>
              </div>
            </PlaceholderGraphic>
          </div>
        </div>
      </div>
    </section>
  );
}
