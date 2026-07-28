import { Star } from 'lucide-react';

const STORIES = [
  { name: 'Alex Chen', role: 'CEO, PixelForge', quote: 'BOCC connected me with the exact mentors we needed. Within 6 months we raised our seed and shipped our first product to real users.' },
  { name: 'Sarah Miller', role: 'Founder, GreenLoop', quote: 'The community here is unmatched. We tapped into a network of founders who had solved every problem we were facing.' },
  { name: 'James Rodrigues', role: 'CEO, KinetiStack', quote: 'As a first-time founder, having access to seasoned operators and a supportive peer group made all the difference in our early days.' },
];

export default function Stories() {
  return (
    <section id="stories" className="py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-5 lg:px-10">
        <h2 className="font-poppins font-bold text-3xl lg:text-4xl text-text-heading text-center">Founder Stories</h2>
        <div className="mt-12 grid md:grid-cols-3 gap-5">
          {STORIES.map((s) => {
            const initials = s.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();
            return (
              <div key={s.name} className="bg-surface-white rounded-lg p-6 border border-border-subtle">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-canvas-bg border border-border-subtle flex items-center justify-center font-poppins font-bold text-text-heading text-caption select-none shrink-0">
                    {initials}
                  </div>
                  <div className="min-w-0">
                    <div className="font-poppins font-semibold text-small text-text-heading">{s.name}</div>
                    <div className="font-inter text-caption text-text-muted">{s.role}</div>
                  </div>
                </div>
                <p className="mt-4 font-inter text-small text-text-body leading-relaxed">&ldquo;{s.quote}&rdquo;</p>
                <div className="mt-4 flex gap-1 text-accent-neon">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={14} strokeWidth={2} fill="currentColor" />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
