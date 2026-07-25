import { TrendingUp, Users, Award } from 'lucide-react';
import ComingSoon from '@/components/ui/ComingSoon';

const STORIES = [
  { badge: 'SaaS / FinTech', name: 'EcoStream AI', metric: '150% YoY Revenue', stage: 'Traction', icon: TrendingUp },
  { badge: 'HealthTech', name: 'BioPulse Health', metric: '$500k Seed Raised', stage: 'Launch', icon: Award },
  { badge: 'Supply Chain', name: 'Nexus Logistics', metric: '20k Monthly Active Users', stage: 'Traction', icon: Users },
];

export default function SuccessStories() {
  return (
    <section id="stories" className="mx-auto max-w-7xl px-6 py-24">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <h2 className="font-poppins font-bold text-3xl md:text-4xl tracking-tight text-text-heading">
          Featured Success Stories
        </h2>
        <ComingSoon label="View All Success Stories" position="top" inline className="rounded-md border border-border-subtle bg-surface-white px-4 py-2 font-inter text-small font-medium text-text-heading">
          View All Success Stories
        </ComingSoon>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
        {STORIES.map((s) => (
          <article key={s.name} className="overflow-hidden rounded-lg border border-border-subtle bg-surface-white hover:-translate-y-1 hover:shadow-card transition-all">
            <div className="aspect-[4/3] placeholder-box" />
            <div className="p-5">
              <div className="flex items-center justify-between">
                <span className="inline-flex rounded-md bg-canvas-bg px-2 py-1 font-inter text-[11px] font-medium text-text-heading">{s.badge}</span>
                <span className="inline-flex items-center gap-1 font-inter text-[11px] text-text-muted">
                  <s.icon size={14} strokeWidth={2} />
                  {s.stage}
                </span>
              </div>
              <h3 className="mt-3 font-poppins font-semibold text-card text-text-heading">{s.name}</h3>
              <p className="mt-1 font-inter text-[13px] text-text-muted">Metric: {s.metric}</p>
              <div className="mt-4 flex items-center justify-between border-t border-border-subtle pt-3">
                <ComingSoon label="Investor Details" position="top" inline className="font-inter text-caption font-medium text-text-heading">
                  Investor Details →
                </ComingSoon>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
