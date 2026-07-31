import { useState, useEffect } from 'react';
import { Rocket } from 'lucide-react';
import { cmsApi } from '@/api/cmsApi';

export default function FeaturedStartups() {
  const [startups, setStartups] = useState([]);

  useEffect(() => {
    async function loadFeaturedStartups() {
      try {
        const response = await cmsApi.getFeaturedStartups();
        if (Array.isArray(response)) {
          setStartups(response);
        } else if (response && Array.isArray(response.data)) {
          setStartups(response.data);
        } else if (response && Array.isArray(response.startups)) {
          setStartups(response.startups);
        }
      } catch (err) {
        console.error('Failed to load featured startups:', err);
      }
    }
    loadFeaturedStartups();
  }, []);

  if (startups.length === 0) return null;

  return (
    <section id="featured-startups" className="py-20 lg:py-28 bg-surface-white">
      <div className="max-w-7xl mx-auto px-5 lg:px-10">
        <div className="text-center mb-12">
          <span className="font-inter text-caption font-semibold uppercase tracking-wider text-text-muted">Showcase</span>
          <h2 className="mt-3 font-poppins font-bold text-3xl md:text-4xl lg:text-5xl tracking-tight text-text-heading">
            Featured Startups
          </h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {startups.map((startup) => (
            <div key={startup._id || startup.name} className="flex flex-col p-6 border border-border-subtle rounded-xl bg-canvas-bg hover:shadow-sm transition-shadow">
              <div className="flex items-center gap-4 mb-4">
                {startup.logo || startup.image ? (
                  <img src={startup.logo || startup.image} alt={startup.name} className="w-12 h-12 rounded-md object-cover border border-border-subtle" />
                ) : (
                  <div className="w-12 h-12 rounded-md bg-accent-neon/10 text-accent-neon flex items-center justify-center">
                    <Rocket size={24} />
                  </div>
                )}
                <div>
                  <h3 className="font-poppins font-semibold text-body text-text-heading">{startup.name}</h3>
                  <p className="font-inter text-caption text-text-muted">{startup.industry || 'Startup'}</p>
                </div>
              </div>
              <p className="font-inter text-small text-text-body line-clamp-3 mb-4 flex-grow">
                {startup.description}
              </p>
              {startup.website && (
                <a href={startup.website} target="_blank" rel="noopener noreferrer" className="font-inter text-small font-medium text-accent-neon hover:underline">
                  Visit Website &rarr;
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
