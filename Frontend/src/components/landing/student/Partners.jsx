import { Zap, Briefcase } from "lucide-react";
import ComingSoon from "@/components/ui/ComingSoon";

const ITEMS = [
  {
    icon: Zap,
    title: "Powered by Atior Technologies",
    desc: "Backed by the infrastructure, capital, and network of a full-stack technology partner.",
    link: "Learn more",
  },
  {
    icon: Briefcase,
    title: "Freelance Opportunities",
    desc: "Earn while you build. Access vetted freelance gigs and real-world projects from day one.",
    link: "Browse gigs",
  },
];

export default function Partners() {
  return (
    <section className="py-20 md:py-28 bg-surface-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="max-w-2xl">
          <span className="font-inter text-caption font-semibold uppercase tracking-wider text-text-muted">
            Partners &amp; Opportunities
          </span>
          <h2 className="mt-3 font-poppins font-bold text-3xl md:text-4xl lg:text-5xl tracking-tight text-text-heading">
            Backed by the best. Built for you.
          </h2>
        </div>

        <div className="mt-14 grid md:grid-cols-2 gap-6">
          {ITEMS.map(({ icon: Icon, title, desc, link }) => (
            <div
              key={title}
              className="group p-8 md:p-10 border border-border-subtle rounded-md hover:border-accent-neon transition-colors bg-surface-white"
            >
              <div className="w-11 h-11 flex items-center justify-center rounded-md bg-accent-neon text-brand-black">
                <Icon size={20} strokeWidth={1.75} />
              </div>
              <h3 className="mt-5 font-poppins font-semibold text-card md:text-section text-text-heading">
                {title}
              </h3>
              <p className="mt-3 font-inter text-small md:text-body text-text-muted leading-relaxed">
                {desc}
              </p>
              <ComingSoon
                label={link}
                position="top"
                inline
                className="mt-6 inline-flex items-center gap-1.5 font-poppins font-semibold text-small text-text-heading"
              >
                {link}
              </ComingSoon>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
