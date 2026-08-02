import { Link } from 'react-router-dom';
import { ArrowRight, Calendar } from 'lucide-react';
import ComingSoon from '@/components/ui/ComingSoon';

export default function FinalCTA() {
  return (
    <section id="final-cta" className="py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-lg bg-brand-black px-8 py-16 lg:px-16 lg:py-20 text-center">
          <div className="relative max-w-2xl mx-auto">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-accent-neon/15 border border-accent-neon/30 font-inter text-caption font-semibold tracking-wider uppercase text-accent-neon">
              <span className="w-1.5 h-1.5 rounded-full bg-accent-neon" />
              Join the Network
            </span>
            <h2 className="font-poppins font-bold text-3xl lg:text-5xl tracking-tight text-white mt-6">
              Ready to Build the Next Generation of Startups?
            </h2>
            <p className="font-inter text-card text-white/70 mt-5">
              Partner with Atior Technologies to strengthen your incubation
              ecosystem, empower founders, and create lasting innovation impact.
            </p>
            <div className="flex flex-wrap justify-center gap-4 mt-9">
              <Link to="/signup/incubator" className="group inline-flex items-center gap-2 bg-accent-neon text-brand-black font-poppins font-semibold text-small px-7 py-3.5 rounded-lg hover:opacity-90 transition-all">
                Become a Partner
                <ArrowRight size={16} strokeWidth={2} className="transition-transform group-hover:translate-x-1" />
              </Link>
              <ComingSoon label="Book a Demo" position="top" inline className="inline-flex items-center gap-2 bg-transparent text-white font-poppins font-semibold text-small px-7 py-3.5 rounded-lg border border-white/20">
                <Calendar size={16} strokeWidth={2} />
                Book a Demo
              </ComingSoon>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
