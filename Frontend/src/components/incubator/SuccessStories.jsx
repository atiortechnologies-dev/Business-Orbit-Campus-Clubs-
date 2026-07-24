import { useScrollReveal } from "@/hooks/useScrollReveal";
import { Quote, Star } from "lucide-react";

const stories = [
  {
    quote: "Partnering with BOCC helped us standardize our incubation process and significantly improve startup success rates.",
    author: "Director, University Incubator",
    role: "Partner Institution",
  },
  {
    quote: "The mentor network and investor access gave our student founders a head start most incubators can only dream of.",
    author: "Head of Innovation, Tech Campus",
    role: "Partner Institution",
  },
  {
    quote: "BOCC's analytics dashboards transformed how we track and report on startup progress to our stakeholders.",
    author: "Program Manager, Seed Hub",
    role: "Partner Institution",
  },
];

export default function SuccessStories() {
  const ref = useScrollReveal();
  return (
    <section ref={ref} id="stories" className="py-20 lg:py-28 bg-[#FAFAFA] border-y border-[#EAEAEA]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span data-reveal className="text-xs font-semibold tracking-wider uppercase text-[#111111] bg-[#C6D82D]/15 px-3 py-1 rounded-full">
            Success Stories
          </span>
          <h2 data-reveal data-delay="80" className="font-heading font-bold text-3xl lg:text-4xl tracking-tight text-[#111111] mt-4">
            Trusted by Incubators Worldwide
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {stories.map((s, i) => (
            <div
              key={i}
              data-reveal
              data-delay={i * 100}
              className="bg-white border border-[#EAEAEA] rounded-2xl p-8 hover:shadow-xl hover:shadow-black/5 hover:-translate-y-1 transition-all duration-300 flex flex-col"
            >
              <Quote className="w-8 h-8 text-[#C6D82D] mb-4" />
              <div className="flex gap-0.5 mb-4">
                {[...Array(5)].map((_, j) => (
                  <Star key={j} className="w-4 h-4 fill-[#C6D82D] text-[#C6D82D]" />
                ))}
              </div>
              <p className="text-[#333] leading-relaxed flex-1">"{s.quote}"</p>
              <div className="mt-6 pt-5 border-t border-[#EAEAEA]">
                <div className="font-heading font-semibold text-sm text-[#111111]">{s.author}</div>
                <div className="text-xs text-[#888] mt-0.5">{s.role}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}