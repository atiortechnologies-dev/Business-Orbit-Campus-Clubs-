import { Quote } from "lucide-react";
import FadeIn from "@/components/motion/FadeIn";

import sarahImg from "@/assets/testimonials/sarah.png";
import marcusImg from "@/assets/testimonials/marcus.png";
import aishaImg from "@/assets/testimonials/aisha.png";

const testimonials = [
  {
    image: sarahImg,
    quote:
      "Mentoring through Atior connected me with a founder who is now raising Series A. The caliber of talent here is unmatched.",
    name: "Sarah Chen",
    role: "Partner at Vertex Capital",
  },
  {
    image: marcusImg,
    quote:
      "The structured workflow made mentorship effortless. I could focus on giving value, not managing logistics.",
    name: "Marcus Reid",
    role: "CTO at Nuvola Systems",
  },
  {
    image: aishaImg,
    quote:
      "Watching my mentee pivot from concept to revenue in eight months was the most rewarding professional experience.",
    name: "Aisha Patel",
    role: "Founder, Ex-Google",
  },
];

export default function ImpactStories() {
  return (
    <section id="impact-stories" className="py-20 lg:py-32 bg-[#F8F8F8]">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <FadeIn className="max-w-2xl mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight text-black leading-[1.2]">
            Impact Stories
          </h2>

          <p className="mt-4 text-base md:text-lg text-[#666666] leading-relaxed">
            Real outcomes from mentors who shaped tomorrow's leaders.
          </p>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <FadeIn key={t.name} delay={i * 0.1}>
              <div className="group h-full bg-white border border-[#EAEAEA] rounded-xl overflow-hidden hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.05)] transition-all duration-300">
                <div className="aspect-square overflow-hidden bg-gradient-to-br from-[#EAEAEA] to-[#F8F8F8]">
                  <img
                    src={t.image}
                    alt={t.name}
                    className="h-full w-full object-cover"
                  />
                </div>

                <div className="p-6">
                  <Quote size={24} className="text-[#C7D62F] mb-4" />

                  <p className="text-sm text-black leading-relaxed mb-6">
                    {t.quote}
                  </p>

                  <div className="flex items-center gap-3 pt-4 border-t border-[#EAEAEA]">
                    <div className="h-10 w-10 rounded-full overflow-hidden flex-shrink-0">
                      <img
                        src={t.image}
                        alt={t.name}
                        className="h-full w-full object-cover"
                      />
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-black">
                        {t.name}
                      </p>

                      <p className="text-xs text-[#666666]">{t.role}</p>
                    </div>
                  </div>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}