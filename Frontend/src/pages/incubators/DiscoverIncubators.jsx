import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Building2, MapPin } from 'lucide-react';
import DashboardShell from '@/components/dashboard/DashboardShell';
import Badge from '@/components/ui/Badge';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

const INCUBATORS = [
  { id: 'i1', name: 'TechScale Accelerator', program: 'Silicon Valley / Remote', tags: ['SaaS/Fintech', 'Early Stage'], startups: '120+', success: '92%', raised: '$45M', status: 'Open' },
  { id: 'i2', name: 'BlueOrbit', program: 'Global Frontier Lab', tags: ['Deep Tech', 'Pre-Seed'], startups: '45', success: '88%', raised: '$210M', status: 'Open' },
  { id: 'i3', name: 'Verant Green', program: 'Sustainability Alliance', tags: ['CleanTech', 'Idea Stage'], startups: '82', success: '75%', raised: '$12M', status: 'Waitlist' },
];

const STATUS_VARIANT = { Open: 'success', Waitlist: 'warning' };
const INDUSTRY_OPTIONS = ['All Industries', 'SaaS', 'Fintech', 'EdTech', 'HealthTech'];
const STAGE_OPTIONS = ['All Stages', 'Idea Stage', 'Early Stage', 'Growth Stage'];

export default function DiscoverIncubatorsPage() {
  useDocumentTitle('Discover Incubators — BOCC');
  const [industry, setIndustry] = useState(INDUSTRY_OPTIONS[0]);
  const [stage, setStage] = useState(STAGE_OPTIONS[0]);

  return (
    <DashboardShell pageId="discover-incubators">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-lg bg-brand-black flex items-center justify-center shrink-0">
          <Building2 size={20} strokeWidth={2} className="text-accent-neon" />
        </div>
        <h1 className="font-poppins font-semibold text-page text-text-heading">Discover Incubators</h1>
      </div>
      <p className="font-inter text-body text-text-body max-w-2xl mb-8">
        Explore programs designed to scale your startup through mentorship, funding, and a global network.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <div className="flex flex-col gap-1">
          <label className="text-caption font-medium text-text-heading font-inter">Industry</label>
          <select value={industry} onChange={(e) => setIndustry(e.target.value)} className="w-full rounded-md border border-border-subtle bg-surface-white text-sm text-text-body font-inter min-h-[44px] px-3 focus:outline-none focus:border-brand-black focus:ring-1 focus:ring-brand-black transition-all">
            {INDUSTRY_OPTIONS.map((o) => <option key={o}>{o}</option>)}
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-caption font-medium text-text-heading font-inter">Startup Stage</label>
          <select value={stage} onChange={(e) => setStage(e.target.value)} className="w-full rounded-md border border-border-subtle bg-surface-white text-sm text-text-body font-inter min-h-[44px] px-3 focus:outline-none focus:border-brand-black focus:ring-1 focus:ring-brand-black transition-all">
            {STAGE_OPTIONS.map((o) => <option key={o}>{o}</option>)}
          </select>
        </div>
      </div>

      <div className="bg-brand-black text-white rounded-lg p-8 mb-6 flex flex-col md:flex-row items-center gap-6">
        <div className="w-20 h-20 shrink-0 bg-white rounded-lg flex items-center justify-center">
          <Building2 size={36} strokeWidth={2} className="text-brand-black" />
        </div>
        <div className="flex-1 text-center md:text-left">
          <span className="inline-block mb-2 px-2 py-0.5 bg-accent-neon text-brand-black text-[10px] font-bold uppercase tracking-widest rounded">Featured</span>
          <h3 className="font-poppins font-semibold text-card mb-2">Global Venture Studio</h3>
          <p className="font-inter text-small opacity-90 mb-4">The most selective accelerator for high-growth SaaS startups — $150k in initial funding and 500+ Fortune 500 mentors.</p>
          <Link to="/incubators/profile" className="inline-block px-6 py-2.5 bg-white text-brand-black font-poppins font-semibold text-small rounded-lg hover:opacity-90 transition-all">
            Learn More
          </Link>
        </div>
      </div>

      <div className="space-y-4">
        {INCUBATORS.map((inc) => (
          <div key={inc.id} className="bg-surface-white border border-border-subtle rounded-lg p-6 flex flex-col lg:flex-row items-center gap-6 shadow-card">
            <div className="w-14 h-14 shrink-0 rounded-lg bg-canvas-bg border border-border-subtle flex items-center justify-center">
              <Building2 size={24} strokeWidth={2} className="text-text-muted" />
            </div>
            <div className="flex-1 w-full">
              <h3 className="font-poppins font-semibold text-card text-text-heading">{inc.name}</h3>
              <p className="font-inter text-small text-text-muted mb-3">{inc.program}</p>
              <div className="grid grid-cols-3 gap-4 max-w-xs">
                <div className="text-center"><p className="font-poppins font-bold text-body text-text-heading">{inc.startups}</p><p className="text-[10px] text-text-muted uppercase">Startups</p></div>
                <div className="text-center"><p className="font-poppins font-bold text-body text-text-heading">{inc.success}</p><p className="text-[10px] text-text-muted uppercase">Success</p></div>
                <div className="text-center"><p className="font-poppins font-bold text-body text-text-heading">{inc.raised}</p><p className="text-[10px] text-text-muted uppercase">Raised</p></div>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 justify-center shrink-0">
              {inc.tags.map((t) => <span key={t} className="px-3 py-1 bg-canvas-bg text-text-muted font-inter text-caption rounded-full">{t}</span>)}
            </div>
            <div className="flex flex-col items-end gap-3 shrink-0">
              <Badge variant={STATUS_VARIANT[inc.status]}>{inc.status}</Badge>
              <Link to="/incubators/profile" className="px-5 py-2.5 border border-border-subtle rounded-lg font-poppins font-semibold text-small text-text-heading hover:bg-canvas-bg transition-colors">
                View Details
              </Link>
            </div>
          </div>
        ))}
      </div>
      <p className="font-inter text-small text-text-muted mt-6">Showing {INCUBATORS.length} of 42 programs</p>
    </DashboardShell>
  );
}
