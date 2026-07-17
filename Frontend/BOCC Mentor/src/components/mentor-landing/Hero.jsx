import { ArrowRight, Users } from 'lucide-react';
import FadeIn from '@/components/motion/FadeIn';
import c42275e9a_generated_66a2a5f3 from "@/assets/c42275e9a_generated_66a2a5f3.png";



const stats = [
  { value: '500+', label: 'Expert Mentors' },
  { value: '1,200+', label: 'Startup Guides' },
];

export default function Hero() {
  return (
    <section id="top" className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 bg-[#F8F8F8] overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <FadeIn>
            <div className="inline-flex items-center gap-2 bg-[#EAEAEA] rounded-full px-4 py-2 mb-6">
              <span className="h-2 w-2 rounded-full bg-[#C7D62F]" />
              <span className="text-xs font-semibold uppercase tracking-wider text-black">
                Mentorship Program 2024
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight text-black leading-[1.1]">
              Shape the Future of Campus Innovation
            </h1>
            <p className="mt-6 text-base md:text-lg text-[#666666] leading-relaxed max-w-xl">
              Join Atior Technologies' elite mentorship program and guide the next generation of founders.
              Share your expertise, build meaningful connections, and leave a lasting impact on the innovation ecosystem.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href="#cta"
                className="inline-flex items-center gap-2 bg-[#C7D62F] text-black font-semibold px-7 py-3.5 rounded-lg hover:bg-[#b5c928] transition-all hover:shadow-lg hover:shadow-[#C7D62F]/20"
              >
                Apply to Mentor
                <ArrowRight size={18} />
              </a>
              <a
                href="#impact-stories"
                className="inline-flex items-center gap-2 border border-[#EAEAEA] bg-white text-black font-semibold px-7 py-3.5 rounded-lg hover:border-black transition-colors"
              >
                View Ecosystem
              </a>
            </div>
            <div className="mt-12 flex items-center">
              {stats.map((stat, i) => (
                <div
                  key={i}
                  className={`flex flex-col ${i > 0 ? 'pl-8 border-l border-[#EAEAEA]' : ''} ${
                    i < stats.length - 1 ? 'pr-8' : ''
                  }`}
                >
                  <span className="text-3xl md:text-4xl font-bold text-black">{stat.value}</span>
                  <span className="text-xs uppercase tracking-wider text-[#666666] mt-1">{stat.label}</span>
                </div>
              ))}
            </div>
          </FadeIn>

          <FadeIn delay={0.2} y={32}>
            <div className="relative">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden ring-1 ring-[#EAEAEA] shadow-xl shadow-black/5 bg-gradient-to-br from-[#EAEAEA] to-[#F8F8F8]">
                <img
                  src={c42275e9a_generated_66a2a5f3}
                  alt="Professional mentor in a minimalist workspace"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-white border border-[#EAEAEA] rounded-xl p-5 shadow-lg hidden sm:block">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-[#C7D62F]/20 flex items-center justify-center">
                    <Users size={20} className="text-black" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-black">Active Community</p>
                    <p className="text-xs text-[#666666]">1,700+ members</p>
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}