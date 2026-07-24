import FadeIn from '@/components/motion/FadeIn';
import { ArrowRight } from 'lucide-react';

export default function CTA() {
  return (
    <section id="cta" className="py-20 lg:py-32 bg-[#F8F8F8]">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <FadeIn>
          <div className="relative bg-black rounded-2xl px-8 py-16 md:px-16 md:py-24 text-center overflow-hidden">
            <div className="absolute top-0 right-0 h-64 w-64 bg-[#C7D62F]/10 rounded-full blur-3xl -translate-y-1/3 translate-x-1/3" />
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-[1.2] max-w-3xl mx-auto">
                Ready to Guide the Next Big Thing?
              </h2>
              <p className="mt-6 text-base md:text-lg text-white/60 leading-relaxed max-w-2xl mx-auto">
                Join 500+ expert mentors shaping the future of campus innovation. Your experience can be the
                catalyst that turns a vision into reality.
              </p>
              <div className="mt-10 flex flex-wrap justify-center gap-4">
                <a
                  href="#top"
                  className="inline-flex items-center gap-2 bg-[#C7D62F] text-black font-semibold px-8 py-4 rounded-lg hover:bg-[#b5c928] transition-all hover:shadow-lg hover:shadow-[#C7D62F]/20"
                >
                  Apply Now
                  <ArrowRight size={18} />
                </a>
                <a
                  href="#why-mentor"
                  className="inline-flex items-center gap-2 border border-white/20 text-white font-semibold px-8 py-4 rounded-lg hover:border-white/40 transition-colors"
                >
                  Learn More
                </a>
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}