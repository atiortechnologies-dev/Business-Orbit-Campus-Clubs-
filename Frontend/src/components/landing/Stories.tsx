import { Star } from "lucide-react";

const stories = [
  { name: "Alex Chen", role: "CEO, PixelForge", avatar: "https://i.pravatar.cc/80?img=12", quote: "BOCC connected me with the exact mentors we needed. Within 6 months we raised our seed and shipped our first product to real users." },
  { name: "Sarah Miller", role: "Founder, GreenLoop", avatar: "https://i.pravatar.cc/80?img=47", quote: "The community here is unmatched. We tapped into a network of founders who had solved every problem we were facing." },
  { name: "James Rodrigues", role: "CEO, KinetiStack", avatar: "https://i.pravatar.cc/80?img=33", quote: "As a first-time founder, having access to seasoned operators and a supportive peer group made all the difference in our early days." },
];

export default function Stories() {
  return (
    <section className="py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-5 lg:px-10">
        <h2 className="text-3xl lg:text-4xl font-black text-center">Founder Stories</h2>
        <div className="mt-12 grid md:grid-cols-3 gap-5">
          {stories.map((s) => (
            <div key={s.name} className="bg-white rounded-2xl p-6 border border-black/5">
              <div className="flex items-center gap-3">
                <img src={s.avatar} alt={s.name} loading="lazy" width={40} height={40} className="w-10 h-10 rounded-full object-cover bg-neutral-200" />
                <div className="min-w-0">
                  <div className="font-semibold text-sm">{s.name}</div>
                  <div className="text-xs text-neutral-500">{s.role}</div>
                </div>
              </div>
              <p className="mt-4 text-sm text-neutral-600 leading-relaxed">"{s.quote}"</p>
              <div className="mt-4 flex gap-1 text-black">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={14} fill="currentColor" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}