import { ArrowRight, Users, Handshake } from "lucide-react";
import PlaceholderGraphic from "@/components/ui/PlaceholderGraphic";

const STATS = [
  { value: "500+", label: "Expert Mentors" },
  { value: "1,200+", label: "Startup Guides" },
];

export default function Hero() {
  return (
    <section
      id="top"
      className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-canvas-bg rounded-full px-4 py-2 mb-6">
              <span className="h-2 w-2 rounded-full bg-accent-neon" />
              <span className="font-inter text-caption font-semibold uppercase tracking-wider text-text-heading">
                Mentorship Program 2024
              </span>
            </div>
            <h1 className="font-poppins font-bold text-4xl md:text-5xl lg:text-6xl xl:text-7xl tracking-tight text-text-heading leading-[1.1]">
              Shape the Future of Campus Innovation
            </h1>
            <p className="mt-6 font-inter text-body md:text-card text-text-body leading-relaxed max-w-xl">
              Join Atior Technologies' elite mentorship program and guide the
              next generation of founders. Share your expertise, build
              meaningful connections, and leave a lasting impact on the
              innovation ecosystem.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href="#cta"
                className="inline-flex items-center gap-2 bg-action-bg text-action-text font-poppins font-semibold px-7 py-3.5 rounded-md hover:opacity-90 transition-all"
              >
                Apply to Mentor
                <ArrowRight size={18} strokeWidth={2} />
              </a>
              <a
                href="#impact-stories"
                className="inline-flex items-center gap-2 border border-border-subtle bg-surface-white text-text-heading font-poppins font-semibold px-7 py-3.5 rounded-md hover:bg-canvas-bg transition-colors"
              >
                View Ecosystem
              </a>
            </div>
            <div className="mt-12 flex items-center">
              {STATS.map((stat, i) => (
                <div
                  key={stat.label}
                  className={`flex flex-col ${i > 0 ? "pl-8 border-l border-border-subtle" : ""} ${i < STATS.length - 1 ? "pr-8" : ""}`}
                >
                  <span className="font-poppins font-bold text-3xl md:text-4xl text-text-heading">
                    {stat.value}
                  </span>
                  <span className="font-inter text-caption uppercase tracking-wider text-text-muted mt-1">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <PlaceholderGraphic
              icon={Handshake}
              label="Mentor Network"
              className="aspect-[4/3] rounded-lg"
            />
            <div className="absolute -bottom-6 -left-6 bg-surface-white border border-border-subtle rounded-lg p-5 shadow-card hidden sm:block">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-canvas-bg flex items-center justify-center">
                  <Users
                    size={20}
                    strokeWidth={2}
                    className="text-text-heading"
                  />
                </div>
                <div>
                  <p className="font-poppins font-semibold text-small text-text-heading">
                    Active Community
                  </p>
                  <p className="font-inter text-caption text-text-muted">
                    1,700+ members
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
