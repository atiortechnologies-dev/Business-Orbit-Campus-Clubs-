import { useScrollReveal } from "@/hooks/useScrollReveal";

const steps = [
  { n: "1", title: "Startup Application", desc: "Students submit startup ideas and team details." },
  { n: "2", title: "Evaluation", desc: "Incubator managers review applications using BOCC's standardized assessment." },
  { n: "3", title: "Incubation", desc: "Selected startups receive structured mentorship, resources, and workshops." },
  { n: "4", title: "Growth", desc: "Teams validate products, connect with investors, and achieve milestones." },
  { n: "5", title: "Graduation", desc: "Investment-ready startups graduate into BOCC's global founder network." },
];

export default function Lifecycle() {
  const ref = useScrollReveal();
  return (
    <section ref={ref} id="lifecycle" className="py-20 lg:py-28 bg-[#FAFAFA] border-y border-[#EAEAEA]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span data-reveal className="text-xs font-semibold tracking-wider uppercase text-[#111111] bg-[#C6D82D]/15 px-3 py-1 rounded-full">
            The Framework
          </span>
          <h2 data-reveal data-delay="80" className="font-heading font-bold text-3xl lg:text-4xl tracking-tight text-[#111111] mt-4">
            The Incubation Lifecycle
          </h2>
          <p data-reveal data-delay="140" className="text-[#666] mt-4 text-lg">
            Our collaborative workflow ensures a seamless transition from campus
            application to successful graduation.
          </p>
        </div>

        {/* Desktop timeline */}
        <div className="hidden lg:grid grid-cols-5 gap-4 relative">
          {/* connecting line */}
          <div className="absolute top-7 left-[10%] right-[10%] h-0.5 bg-[#EAEAEA]" />
          <div className="absolute top-7 left-[10%] w-0 h-0.5 bg-[#C6D82D]" id="timeline-progress" style={{ width: "80%" }} />
          {steps.map((s, i) => (
            <div key={s.n} data-reveal data-delay={i * 120} className="relative flex flex-col items-center text-center">
              <div className="relative z-10 w-14 h-14 rounded-full bg-white border-2 border-[#EAEAEA] flex items-center justify-center font-heading font-bold text-xl text-[#111111] mb-5 hover:border-[#C6D82D] hover:bg-[#C6D82D] transition-all duration-300">
                {s.n}
              </div>
              <h3 className="font-heading font-semibold text-base text-[#111111] mb-1.5">{s.title}</h3>
              <p className="text-sm text-[#666] leading-relaxed px-2">{s.desc}</p>
            </div>
          ))}
        </div>

        {/* Mobile timeline */}
        <div className="lg:hidden flex flex-col gap-6">
          {steps.map((s, i) => (
            <div key={s.n} data-reveal data-delay={i * 80} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 shrink-0 rounded-full bg-white border-2 border-[#EAEAEA] flex items-center justify-center font-heading font-bold text-lg text-[#111111]">
                  {s.n}
                </div>
                {i < steps.length - 1 && <div className="w-0.5 flex-1 bg-[#EAEAEA] my-2" />}
              </div>
              <div className="pb-2">
                <h3 className="font-heading font-semibold text-base text-[#111111] mb-1">{s.title}</h3>
                <p className="text-sm text-[#666] leading-relaxed">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}