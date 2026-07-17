import { useScrollReveal } from "@/hooks/useScrollReveal";
import { ArrowRight, FileText } from "lucide-react";
import aec3a2bfc_generated_70267289 from "@/assets/aec3a2bfc_generated_70267289.png";


export default function Hero() {
  const ref = useScrollReveal("stagger");

  return (
    <section
      ref={ref}
      id="hero"
      className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 overflow-hidden"
    >
      {/* soft background accents */}
      <div className="absolute top-20 -right-32 w-96 h-96 rounded-full bg-[#C6D82D]/10 blur-3xl pointer-events-none" />
      <div className="absolute top-40 -left-20 w-72 h-72 rounded-full bg-black/[0.03] blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8 grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        {/* Left */}
        <div className="flex flex-col gap-6">
          <span
            data-reveal
            className="inline-flex w-fit items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#C6D82D]/15 border border-[#C6D82D]/30 text-[#111111] text-xs font-semibold tracking-wider uppercase"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-lime-accent" />
            Incubator Partnership
          </span>

          <h1
            data-reveal
            data-delay="80"
            className="font-heading font-bold text-4xl sm:text-5xl lg:text-[3.4rem] leading-[1.08] tracking-tight text-[#111111] text-balance"
          >
            Scale Your Incubator's{" "}
            <span className="relative inline-block">
              Startup Ecosystem
              <svg
                className="absolute -bottom-2 left-0 w-full"
                viewBox="0 0 300 12"
                fill="none"
                preserveAspectRatio="none"
              >
                <path
                  d="M2 9C70 3 230 3 298 9"
                  stroke="#C6D82D"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </h1>

          <p
            data-reveal
            data-delay="160"
            className="text-base lg:text-lg text-[#666] leading-relaxed max-w-xl"
          >
            Partner with Atior Technologies to empower student
            entrepreneurs through a structured incubation framework, global mentor
            network, investor access, standardized startup curriculum, and
            institutional collaboration. Transform innovative ideas into
            investment-ready ventures while expanding your incubator's impact.
          </p>

          <div data-reveal data-delay="240" className="flex flex-wrap gap-4 mt-2">
            <a
              href="#final-cta"
              className="group inline-flex items-center gap-2 bg-[#111111] text-white font-semibold text-sm px-6 py-3.5 rounded-xl hover:bg-[#C6D82D] hover:text-[#111111] transition-all duration-300 shadow-lg shadow-black/10 hover:shadow-[#C6D82D]/40 hover:-translate-y-0.5"
            >
              Become a Partner
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </a>
            <a
              href="#value"
              className="group inline-flex items-center gap-2 bg-white text-[#111111] font-semibold text-sm px-6 py-3.5 rounded-xl border border-[#EAEAEA] hover:border-[#111111] hover:bg-[#FAFAFA] transition-all duration-300"
            >
              <FileText className="w-4 h-4" />
              View Partnership Deck
            </a>
          </div>

          {/* mini trust row */}
          <div
            data-reveal
            data-delay="320"
            className="flex items-center gap-6 mt-6 pt-6 border-t border-[#EAEAEA]"
          >
            <div>
              <div className="font-heading font-bold text-2xl text-[#111111]">
                500+
              </div>
              <div className="text-xs text-[#888]">Student Startups</div>
            </div>
            <div className="w-px h-10 bg-[#EAEAEA]" />
            <div>
              <div className="font-heading font-bold text-2xl text-[#111111]">
                50+
              </div>
              <div className="text-xs text-[#888]">Partner Institutions</div>
            </div>
            <div className="w-px h-10 bg-[#EAEAEA]" />
            <div>
              <div className="font-heading font-bold text-2xl text-[#111111]">
                15+
              </div>
              <div className="text-xs text-[#888]">Countries</div>
            </div>
          </div>
        </div>

        {/* Right — floating visual */}
        <div data-reveal data-delay="200" className="relative">
          <div className="relative rounded-2xl overflow-hidden border border-[#EAEAEA] shadow-2xl shadow-black/10 bg-[#FAFAFA]">
            <img
              src={aec3a2bfc_generated_70267289}
              alt="BOCC incubator ecosystem visualization"
              className="w-full aspect-[4/3] object-cover"
            />
            {/* floating mini cards */}
            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur rounded-xl px-3 py-2 shadow-lg border border-[#EAEAEA] flex items-center gap-2 animate-[float_4s_ease-in-out_infinite]">
              <span className="w-2 h-2 rounded-full bg-lime-accent" />
              <span className="text-xs font-medium text-[#111111]">
                Live incubator pipeline
              </span>
            </div>
            <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur rounded-xl px-3 py-2 shadow-lg border border-[#EAEAEA]">
              <div className="text-xs text-[#888]">Funding readiness</div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <div className="w-20 h-1.5 rounded-full bg-[#EAEAEA] overflow-hidden">
                  <div className="w-[78%] h-full bg-lime-accent rounded-full" />
                </div>
                <span className="text-xs font-bold text-[#111111]">78%</span>
              </div>
            </div>
          </div>
          {/* orbit ring */}
          <div className="absolute -inset-4 -z-10 rounded-full border border-[#C6D82D]/20" />
        </div>
      </div>
    </section>
  );
}