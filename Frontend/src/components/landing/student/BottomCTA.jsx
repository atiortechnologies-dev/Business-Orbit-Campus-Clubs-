import { Link } from 'react-router-dom';
import { ArrowRight, Calendar, Star } from 'lucide-react';
import ComingSoon from '@/components/ui/ComingSoon';

export default function BottomCTA() {
  return (
    <section className="relative py-24 md:py-32 bg-brand-black overflow-hidden">
      <Star aria-hidden className="absolute -top-16 -right-10 md:top-10 md:right-20 text-white/10" size={120} fill="currentColor" strokeWidth={0} />
      <Star aria-hidden className="absolute bottom-10 left-8 md:left-24 text-white/5" size={48} fill="currentColor" strokeWidth={0} />

      <div className="relative mx-auto max-w-4xl px-6 lg:px-10 text-center">
        <h2 className="font-poppins font-bold text-3xl md:text-5xl lg:text-6xl text-white leading-[1.1]">
          Your Founder Journey Starts Here.
        </h2>
        <p className="mt-5 font-inter text-body md:text-card text-white/60 max-w-xl mx-auto leading-relaxed">
          Join a community of builders, mentors, and investors. Apply today and take the first step.
        </p>
        <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
          <Link to="/signup/student" className="inline-flex items-center gap-2 px-7 py-3.5 bg-accent-neon text-brand-black font-poppins font-semibold text-small rounded-md hover:opacity-90 transition-colors">
            Apply Now
            <ArrowRight size={16} strokeWidth={2} />
          </Link>
          <ComingSoon label="View Events" position="top" inline className="inline-flex items-center gap-2 px-7 py-3.5 border border-white/20 text-white font-poppins font-semibold text-small rounded-md">
            <Calendar size={16} strokeWidth={2} />
            View Events
          </ComingSoon>
        </div>
      </div>
    </section>
  );
}
