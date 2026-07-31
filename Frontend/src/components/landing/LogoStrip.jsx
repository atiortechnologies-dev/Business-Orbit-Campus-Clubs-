import { useState, useEffect } from 'react';
import { Building2 } from 'lucide-react';
import PlaceholderGraphic from '@/components/ui/PlaceholderGraphic';
import { cmsApi } from '@/api/cmsApi';

export default function LogoStrip({ title = 'Trusted by leading institutions' }) {
  const [logos, setLogos] = useState([]);

  useEffect(() => {
    async function loadLogos() {
      try {
        const response = await cmsApi.getPartnerLogos();
        if (Array.isArray(response)) {
          setLogos(response);
        } else if (response && Array.isArray(response.data)) {
          setLogos(response.data);
        } else if (response && Array.isArray(response.logos)) {
          setLogos(response.logos);
        }
      } catch (err) {
        console.error('Failed to load partner logos:', err);
      }
    }
    loadLogos();
  }, []);

  return (
    <section className="bg-surface-white py-12 border-y border-border-subtle">
      <div className="max-w-7xl mx-auto px-5 lg:px-10">
        <p className="text-center font-inter text-caption uppercase tracking-widest text-text-muted mb-8">{title}</p>
        <div className="flex flex-wrap items-center justify-around gap-x-10 gap-y-6">
          {logos.length > 0 ? (
            logos.map((logo, i) => (
              logo.logoUrl || logo.image ? (
                <img
                  key={logo._id || i}
                  src={logo.logoUrl || logo.image}
                  alt={logo.name || 'Partner Logo'}
                  className="max-h-12 object-contain"
                />
              ) : (
                <div key={logo._id || i} className="flex items-center gap-2 text-text-muted font-poppins text-small font-semibold">
                  <Building2 size={20} />
                  <span>{logo.name}</span>
                </div>
              )
            ))
          ) : (
            // Fallback if no logos exist in DB
            Array.from({ length: 6 }).map((_, i) => (
              <PlaceholderGraphic key={i} icon={Building2} iconSize={14} className="w-24 h-8 rounded-md" />
            ))
          )}
        </div>
      </div>
    </section>
  );
}
