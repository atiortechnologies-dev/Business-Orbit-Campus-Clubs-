import ComingSoon from "@/components/ui/ComingSoon";

const STAGES = [
  {
    num: "01",
    title: "Ideation & Problem Mapping",
    desc: "Find a real problem worth solving and shape your founding thesis.",
  },
  {
    num: "02",
    title: "Validation & Prototyping",
    desc: "Test assumptions with real users and build a clickable prototype.",
  },
  {
    num: "03",
    title: "MVP Development",
    desc: "Ship a minimum viable product with engineering and design support.",
  },
  {
    num: "04",
    title: "Traction & Early Users",
    desc: "Acquire your first customers and generate meaningful usage signals.",
  },
  {
    num: "05",
    title: "Launch & Planning",
    desc: "Go public, raise capital, and plan your path to scale.",
  },
];

export default function StartupJourney() {
  return (
    <section id="journey" className="py-20 md:py-28 bg-surface-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16">
          <div className="lg:col-span-4 lg:sticky lg:top-28 self-start">
            <span className="font-inter text-caption font-semibold uppercase tracking-wider text-text-muted">
              The Journey
            </span>
            <h2 className="mt-3 font-poppins font-bold text-3xl md:text-4xl lg:text-5xl tracking-tight text-text-heading leading-tight">
              The 5-Stage Startup Journey
            </h2>
            <p className="mt-4 font-inter text-body md:text-card text-text-body leading-relaxed">
              A proven, structured path that takes you from a blank page to a
              venture-backed company — in roughly 12 months.
            </p>
            <ComingSoon
              label="Book 1:1 Consultation"
              position="top"
              inline
              className="mt-8 inline-flex items-center gap-2 px-6 py-3 bg-action-bg text-action-text font-poppins font-semibold text-small rounded-md"
            >
              Book 1:1 Consultation
            </ComingSoon>
          </div>

          <div className="lg:col-span-8">
            <div className="relative pl-8 md:pl-10">
              <div className="absolute left-0 top-2 bottom-2 w-px bg-border-subtle" />
              {STAGES.map((stage) => (
                <div key={stage.num} className="relative pb-10 last:pb-0">
                  <div className="absolute -left-8 md:-left-10 top-1.5 w-4 h-4 rounded-full bg-accent-neon border-2 border-accent-neon" />
                  <div className="flex items-baseline gap-4">
                    <span className="font-poppins font-bold text-small text-text-muted tabular-nums">
                      {stage.num}
                    </span>
                    <div>
                      <h3 className="font-poppins font-semibold text-card md:text-section text-text-heading">
                        {stage.title}
                      </h3>
                      <p className="mt-2 font-inter text-small md:text-body text-text-muted leading-relaxed max-w-lg">
                        {stage.desc}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
