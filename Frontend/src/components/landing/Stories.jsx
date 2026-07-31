import { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import { cmsApi } from '@/api/cmsApi';

export default function Stories() {
  const [stories, setStories] = useState([]);

  useEffect(() => {
    async function loadStories() {
      try {
        const response = await cmsApi.getSuccessStories();
        if (Array.isArray(response)) {
          setStories(response);
        } else if (response && Array.isArray(response.data)) {
          setStories(response.data);
        } else if (response && Array.isArray(response.stories)) {
          setStories(response.stories);
        }
      } catch (err) {
        console.error('Failed to load success stories:', err);
      }
    }
    loadStories();
  }, []);

  return (
    <section id="stories" className="py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-5 lg:px-10">
        <h2 className="font-poppins font-bold text-3xl lg:text-4xl text-text-heading text-center">Founder Stories</h2>
        <div className="mt-12 grid md:grid-cols-3 gap-5">
          {stories.map((s) => {
            const initials = s.name ? s.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase() : 'BO';
            return (
              <div key={s._id || s.name} className="bg-surface-white rounded-lg p-6 border border-border-subtle">
                <div className="flex items-center gap-3">
                  {s.image ? (
                    <img
                      src={s.image}
                      alt={s.name}
                      className="w-10 h-10 rounded-full object-cover shrink-0 border border-border-subtle"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-canvas-bg border border-border-subtle flex items-center justify-center font-poppins font-bold text-text-heading text-caption select-none shrink-0">
                      {initials}
                    </div>
                  )}
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
