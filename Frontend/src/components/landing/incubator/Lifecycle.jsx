const STEPS = [
  {
    n: "1",
    title: "Startup Application",
    desc: "Students submit startup ideas and team details.",
  },
  {
    n: "2",
    title: "Evaluation",
    desc: "Incubator managers review applications using BOCC's standardized assessment.",
  },
  {
    n: "3",
    title: "Incubation",
    desc: "Selected startups receive structured mentorship, resources, and workshops.",
  },
  {
    n: "4",
    title: "Growth",
    desc: "Teams validate products, connect with investors, and achieve milestones.",
  },
  {
    n: "5",
    title: "Graduation",
    desc: "Investment-ready startups graduate into BOCC's global founder network.",
  },
];

export default function Lifecycle() {
  return (
    <section
      id="lifecycle"
      className="py-20 lg:py-28 bg-surface-white border-y border-border-subtle"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="font-inter text-caption font-semibold tracking-wider uppercase text-text-heading bg-accent-neon/15 px-3 py-1 rounded-full">
            The Framework
          </span>
          <h2 className="font-poppins font-bold text-3xl lg:text-4xl tracking-tight text-text-heading mt-4">
            The Incubation Lifecycle
          </h2>
          <p className="font-inter text-card text-text-body mt-4">
            Our collaborative workflow ensures a seamless transition from campus
            application to successful graduation.
          </p>
        </div>

        <div className="hidden lg:grid grid-cols-5 gap-4 relative">
          <div className="absolute top-7 left-[10%] right-[10%] h-0.5 bg-border-subtle" />
          <div
            className="absolute top-7 left-[10%] h-0.5 bg-accent-neon"
            style={{ width: "80%" }}
          />
          {STEPS.map((s) => (
            <div
              key={s.n}
              className="relative flex flex-col items-center text-center"
            >
              <div className="relative z-10 w-14 h-14 rounded-full bg-surface-white border-2 border-border-subtle flex items-center justify-center font-poppins font-bold text-xl text-text-heading mb-5 hover:border-accent-neon hover:bg-accent-neon transition-all duration-300">
                {s.n}
              </div>
              <h3 className="font-poppins font-semibold text-body text-text-heading mb-1.5">
                {s.title}
              </h3>
              <p className="font-inter text-small text-text-muted leading-relaxed px-2">
                {s.desc}
              </p>
            </div>
          ))}
        </div>

        <div className="lg:hidden flex flex-col gap-6">
          {STEPS.map((s, i) => (
            <div key={s.n} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 shrink-0 rounded-full bg-surface-white border-2 border-border-subtle flex items-center justify-center font-poppins font-bold text-body text-text-heading">
                  {s.n}
                </div>
                {i < STEPS.length - 1 && (
                  <div className="w-0.5 flex-1 bg-border-subtle my-2" />
                )}
              </div>
              <div className="pb-2">
                <h3 className="font-poppins font-semibold text-body text-text-heading mb-1">
                  {s.title}
                </h3>
                <p className="font-inter text-small text-text-muted leading-relaxed">
                  {s.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
