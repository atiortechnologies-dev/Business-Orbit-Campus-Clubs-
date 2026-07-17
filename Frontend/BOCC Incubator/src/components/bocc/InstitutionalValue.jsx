import { useScrollReveal } from "@/hooks/useScrollReveal";
import { Check, Download } from "lucide-react";
import boccLogo from "@/assets/0cfb7d5fe_generated_7882728f.png";


const benefits = [
  "Standardized startup evaluation framework",
  "Dedicated mentor network",
  "Global investor connections",
  "Startup performance analytics",
  "Co-branding opportunities",
  "Access to BOCC innovation ecosystem",
];

export default function InstitutionalValue() {
  const ref = useScrollReveal();
  return (
    <section ref={ref} id="institutional" className="py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        {/* Left — dashboard visual */}
        <div data-reveal className="relative order-2 lg:order-1">
          <div className="relative rounded-2xl overflow-hidden border border-[#EAEAEA] shadow-2xl shadow-black/10 bg-[#FAFAFA]">
            <img
              src={boccLogo}
              alt="BOCC partner dashboard analytics"
              className="w-full aspect-[4/3] object-cover"
            />
            {/* floating stat */}
            <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur rounded-xl px-4 py-3 shadow-lg border border-[#EAEAEA]">
              <div className="text-xs text-[#888]">Funding Readiness</div>
              <div className="font-heading font-bold text-2xl text-[#111111]">
                92<span className="text-[#C6D82D]">%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right — content */}
        <div className="order-1 lg:order-2">
          <span data-reveal className="text-xs font-semibold tracking-wider uppercase text-[#111111] bg-[#C6D82D]/15 px-3 py-1 rounded-full">
            Institutional Value
          </span>
          <h2 data-reveal data-delay="80" className="font-heading font-bold text-3xl lg:text-4xl tracking-tight text-[#111111] mt-4">
            Expand Your Incubator's Impact
          </h2>
          <p data-reveal data-delay="140" className="text-[#666] mt-4 text-lg">
            Our partnership model is designed to enhance your existing
            capabilities while reducing administrative overhead.
          </p>

          <div className="mt-8 flex flex-col gap-3.5">
            {benefits.map((b, i) => (
              <div
                key={b}
                data-reveal
                data-delay={i * 60}
                className="flex items-center gap-3 group"
              >
                <span className="shrink-0 w-6 h-6 rounded-full bg-[#C6D82D] flex items-center justify-center">
                  <Check className="w-3.5 h-3.5 text-[#111111]" strokeWidth={3} />
                </span>
                <span className="text-sm text-[#333] font-medium">{b}</span>
              </div>
            ))}
          </div>

          <a
            href="#"
            data-reveal
            data-delay="200"
            className="inline-flex items-center gap-2 mt-8 text-sm font-semibold text-[#111111] border-b-2 border-[#C6D82D] pb-1 hover:gap-3 transition-all"
          >
            <Download className="w-4 h-4" />
            Download Partnership Brochure
          </a>
        </div>
      </div>
    </section>
  );
}