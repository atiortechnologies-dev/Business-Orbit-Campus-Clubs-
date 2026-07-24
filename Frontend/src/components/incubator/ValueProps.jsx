import { useScrollReveal } from "@/hooks/useScrollReveal";
import { Globe2, Layers3, BarChart3 } from "lucide-react";

const cards = [
  {
    icon: Globe2,
    title: "Global Startup Network",
    desc: "Connect your incubator with universities, founders, mentors, investors, and innovation partners worldwide.",
  },
  {
    icon: Layers3,
    title: "Standardized Incubation Framework",
    desc: "Leverage BOCC's structured startup journey, evaluation process, and milestone-driven incubation model.",
  },
  {
    icon: BarChart3,
    title: "Institutional Analytics",
    desc: "Track startup progress, mentor engagement, funding readiness, and ecosystem performance with real-time dashboards.",
  },
];

export default function ValueProps() {
  const ref = useScrollReveal();
  return (
    <section ref={ref} id="value" className="py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="max-w-2xl mb-14">
          <span
            data-reveal
            className="text-xs font-semibold tracking-wider uppercase text-[#111111] bg-[#C6D82D]/15 px-3 py-1 rounded-full"
          >
            Why BOCC
          </span>
          <h2
            data-reveal
            data-delay="80"
            className="font-heading font-bold text-3xl lg:text-4xl tracking-tight text-[#111111] mt-4"
          >
            Why Incubators Choose BOCC
          </h2>
          <p data-reveal data-delay="140" className="text-[#666] mt-4 text-lg">
            We bridge academic theory and entrepreneurial execution through a
            proven incubation framework and an extensive global resource pool.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {cards.map((c, i) => (
            <div
              key={c.title}
              data-reveal
              data-delay={i * 100}
              className="group relative bg-[#FAFAFA] border border-[#EAEAEA] rounded-2xl p-8 hover:border-[#C6D82D] hover:shadow-xl hover:shadow-black/5 hover:-translate-y-1 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-white border border-[#EAEAEA] flex items-center justify-center mb-5 group-hover:bg-[#C6D82D] transition-colors duration-300">
                <c.icon className="w-6 h-6 text-[#111111]" />
              </div>
              <h3 className="font-heading font-semibold text-lg text-[#111111] mb-2">
                {c.title}
              </h3>
              <p className="text-sm text-[#666] leading-relaxed">{c.desc}</p>
              <div className="absolute top-8 right-8 text-5xl font-heading font-bold text-[#111111]/[0.04] group-hover:text-[#C6D82D]/20 transition-colors">
                0{i + 1}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}