import { useScrollReveal } from "@/hooks/useScrollReveal";
import { ArrowRight, Calendar } from "lucide-react";

export default function FinalCTA() {
  const ref = useScrollReveal();
  return (
    <section ref={ref} id="final-cta" className="py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div
          data-reveal
          className="relative overflow-hidden rounded-3xl bg-[#111111] px-8 py-16 lg:px-16 lg:py-20 text-center"
        >
          {/* decorative */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#C6D82D]/15 blur-3xl rounded-full" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-[#C6D82D]/10 blur-3xl rounded-full" />
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "28px 28px" }} />

          <div className="relative max-w-2xl mx-auto">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#C6D82D]/15 border border-[#C6D82D]/30 text-[#C6D82D] text-xs font-semibold tracking-wider uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-lime-accent" />
              Join the Network
            </span>
            <h2 className="font-heading font-bold text-3xl lg:text-5xl tracking-tight text-white mt-6 text-balance">
              Ready to Build the Next Generation of Startups?
            </h2>
            <p className="text-white/70 mt-5 text-lg">
              Partner with Atior Technologies to strengthen your incubation
              ecosystem, empower founders, and create lasting innovation impact.
            </p>
            <div className="flex flex-wrap justify-center gap-4 mt-9">
              <a
                href="#"
                className="group inline-flex items-center gap-2 bg-[#C6D82D] text-[#111111] font-semibold text-sm px-7 py-3.5 rounded-xl hover:bg-white transition-all duration-300 shadow-lg hover:shadow-[#C6D82D]/40 hover:-translate-y-0.5"
              >
                Become a Partner
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </a>
              <a
                href="#"
                className="group inline-flex items-center gap-2 bg-transparent text-white font-semibold text-sm px-7 py-3.5 rounded-xl border border-white/20 hover:bg-white/10 hover:border-white/40 transition-all duration-300"
              >
                <Calendar className="w-4 h-4" />
                Book a Demo
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}