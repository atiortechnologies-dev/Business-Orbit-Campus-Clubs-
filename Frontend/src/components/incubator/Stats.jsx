import { useScrollReveal } from "@/hooks/useScrollReveal";

const stats = [
  { value: "500+", label: "Student Startups" },
  { value: "100+", label: "Industry Mentors" },
  { value: "50+", label: "Partner Institutions" },
  { value: "15+", label: "Countries" },
];

export default function Stats() {
  const ref = useScrollReveal();
  return (
    <section ref={ref} id="stats" className="py-20 lg:py-28 bg-[#111111] relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "32px 32px" }} />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-64 bg-[#C6D82D]/10 blur-3xl rounded-full" />
      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-14">
          <span data-reveal className="text-xs font-semibold tracking-wider uppercase text-[#C6D82D]">
            Partnership Benefits
          </span>
          <h2 data-reveal data-delay="80" className="font-heading font-bold text-3xl lg:text-4xl tracking-tight text-white mt-3">
            A Network Built for Scale
          </h2>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((s, i) => (
            <div
              key={s.label}
              data-reveal
              data-delay={i * 100}
              className="text-center group"
            >
              <div className="font-heading font-bold text-5xl lg:text-6xl tracking-tight bg-gradient-to-b from-[#C6D82D] to-white bg-clip-text text-transparent">
                {s.value}
              </div>
              <div className="text-sm text-white/60 mt-2 font-medium">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}