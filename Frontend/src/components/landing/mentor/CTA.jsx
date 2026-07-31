import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export default function CTA() {
  return (
    <section id="cta" className="py-20 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="relative bg-brand-black rounded-lg px-8 py-16 md:px-16 md:py-24 text-center overflow-hidden">
          <div className="relative z-10">
            <h2 className="font-poppins font-bold text-3xl md:text-4xl lg:text-5xl tracking-tight text-white leading-[1.2] max-w-3xl mx-auto">
              Ready to Guide the Next Big Thing?
            </h2>
            <p className="mt-6 font-inter text-body md:text-card text-white/60 leading-relaxed max-w-2xl mx-auto">
              Join 500+ expert mentors shaping the future of campus innovation.
              Your experience can be the catalyst that turns a vision into
              reality.
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <Link
                to="/signup/mentor"
                className="inline-flex items-center gap-2 bg-accent-neon text-brand-black font-poppins font-semibold px-8 py-4 rounded-md hover:opacity-90 transition-all"
              >
                Apply Now
                <ArrowRight size={18} strokeWidth={2} />
              </Link>
              <a
                href="#why-mentor"
                className="inline-flex items-center gap-2 border border-white/20 text-white font-poppins font-semibold px-8 py-4 rounded-md hover:border-white/40 transition-colors"
              >
                Learn More
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
