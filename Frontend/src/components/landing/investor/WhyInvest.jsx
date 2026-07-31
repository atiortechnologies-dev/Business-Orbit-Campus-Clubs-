import { Sparkles, ShieldCheck, TrendingUp, Users } from "lucide-react";

const CARDS = [
  {
    icon: Sparkles,
    title: "Exclusive Deal Flow",
    desc: "Gain early access to carefully selected student startups before public fundraising.",
  },
  {
    icon: ShieldCheck,
    title: "De-Risked Ventures",
    desc: "Every startup is evaluated through BOCC's structured incubation and mentorship process.",
  },
  {
    icon: TrendingUp,
    title: "Verified Traction",
    desc: "Review startups backed by real validation, customer feedback, MVPs, and measurable progress.",
  },
  {
    icon: Users,
    title: "Ecosystem Synergy",
    desc: "Collaborate with universities, mentors, founders, and innovation partners within the BOCC network.",
  },
];

export default function WhyInvest() {
  return (
    <section id="investors" className="mx-auto max-w-7xl px-6 py-24">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="font-poppins font-bold text-3xl md:text-4xl tracking-tight text-text-heading">
          Why Invest Through BOCC?
        </h2>
        <p className="mt-4 font-inter text-small text-text-muted">
          We bridge the gap between academic brilliance and market reality,
          ensuring your capital is placed in resilient, well-guided ventures.
        </p>
      </div>

      <div className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
        {CARDS.map(({ icon: Icon, title, desc }) => (
          <div
            key={title}
            className="rounded-lg border border-border-subtle bg-surface-white p-6 hover:-translate-y-1 hover:shadow-card transition-all"
          >
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-canvas-bg">
              <Icon
                size={20}
                strokeWidth={1.75}
                className="text-text-heading"
              />
            </div>
            <h3 className="mt-5 font-poppins font-semibold text-[17px] text-text-heading">
              {title}
            </h3>
            <p className="mt-2 font-inter text-small leading-relaxed text-text-muted">
              {desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
