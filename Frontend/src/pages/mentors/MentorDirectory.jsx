import { useState } from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, Star } from 'lucide-react';
import DashboardShell from '@/components/dashboard/DashboardShell';
import Badge from '@/components/ui/Badge';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

const INDUSTRY_OPTIONS = ['All Industries', 'FinTech', 'EdTech', 'SaaS', 'HealthTech'];
const EXPERTISE_OPTIONS = ['All Expertise', 'GTM Strategy', 'Fundraising', 'Product Design', 'Scaling'];

const MENTORS = [
  { id: 'm1', name: 'Sarah Chen', role: 'Managing Partner at Velocity Ventures', rating: '4.9', reviews: 42, tags: ['SaaS', 'GTM Strategy', 'Series A'], experience: '15+ years', mentored: '12 Startups', status: 'Available' },
  { id: 'm2', name: 'Marcus Thorne', role: 'Founder at CloudScale Systems', rating: '4.8', reviews: 28, tags: ['DevOps', 'Scalability', 'B2B SaaS'], experience: '10+ years', mentored: '5 Startups', status: 'Available' },
  { id: 'm3', name: 'Elena Rodriguez', role: 'Design Lead at Studio Alpha', rating: '5.0', reviews: 56, tags: ['UX/UI', 'Branding', 'Product Design'], experience: '12+ years', mentored: '18 Startups', status: 'Away' },
];

const STATUS_VARIANT = { Available: 'success', Away: 'neutral' };

export default function MentorDirectoryPage() {
  useDocumentTitle('Mentor Directory — BOCC');
  const [industry, setIndustry] = useState(INDUSTRY_OPTIONS[0]);
  const [expertise, setExpertise] = useState(EXPERTISE_OPTIONS[0]);

  return (
    <DashboardShell pageId="mentor-directory">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-lg bg-brand-black flex items-center justify-center shrink-0">
          <GraduationCap size={20} strokeWidth={2} className="text-accent-neon" />
        </div>
        <h1 className="font-poppins font-semibold text-page text-text-heading">Mentor Directory</h1>
      </div>
      <p className="font-inter text-body text-text-body max-w-2xl mb-6">
        Connect with experienced mentors who can guide you through your startup journey.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <div className="flex flex-col gap-1">
          <label className="text-caption font-medium text-text-heading font-inter">Industry</label>
          <select value={industry} onChange={(e) => setIndustry(e.target.value)} className="w-full rounded-md border border-border-subtle bg-surface-white text-sm text-text-body font-inter min-h-[44px] px-3 focus:outline-none focus:border-brand-black focus:ring-1 focus:ring-brand-black transition-all">
            {INDUSTRY_OPTIONS.map((o) => <option key={o}>{o}</option>)}
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-caption font-medium text-text-heading font-inter">Expertise</label>
          <select value={expertise} onChange={(e) => setExpertise(e.target.value)} className="w-full rounded-md border border-border-subtle bg-surface-white text-sm text-text-body font-inter min-h-[44px] px-3 focus:outline-none focus:border-brand-black focus:ring-1 focus:ring-brand-black transition-all">
            {EXPERTISE_OPTIONS.map((o) => <option key={o}>{o}</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {MENTORS.map((m) => (
          <div key={m.id} className="bg-surface-white border border-border-subtle rounded-lg p-6 shadow-card flex flex-col">
            <div className="flex justify-between items-start mb-4">
              <div className="w-14 h-14 rounded-lg bg-canvas-bg border border-border-subtle flex items-center justify-center font-poppins font-bold text-body text-text-muted">
                {m.name.split(' ').map((n) => n[0]).join('')}
              </div>
              <Badge variant={STATUS_VARIANT[m.status]}>{m.status}</Badge>
            </div>
            <h3 className="font-poppins font-semibold text-card text-text-heading">{m.name}</h3>
            <p className="font-inter text-small text-text-muted">{m.role}</p>
            <div className="flex items-center gap-1 mt-1 text-warning">
              <Star size={16} strokeWidth={2} fill="currentColor" />
              <span className="font-inter font-semibold text-small text-text-heading">{m.rating}</span>
              <span className="font-inter text-small text-text-muted">({m.reviews} reviews)</span>
            </div>
            <div className="flex flex-wrap gap-2 my-4">
              {m.tags.map((t) => <span key={t} className="px-2 py-1 bg-canvas-bg text-text-muted font-inter text-caption rounded">{t}</span>)}
            </div>
            <div className="grid grid-cols-2 gap-4 py-4 border-y border-divider-line mb-4">
              <div><p className="font-inter text-caption text-text-muted uppercase mb-1">Experience</p><p className="font-inter font-medium text-small text-text-heading">{m.experience}</p></div>
              <div><p className="font-inter text-caption text-text-muted uppercase mb-1">Mentored</p><p className="font-inter font-medium text-small text-text-heading">{m.mentored}</p></div>
            </div>
            <div className="flex gap-3 mt-auto">
              <Link to="/mentors/profile" className="flex-1 text-center py-2.5 border border-border-subtle rounded-lg font-inter font-semibold text-small text-text-heading hover:bg-canvas-bg transition-colors">
                View Profile
              </Link>
              <Link to="/mentors/request" className="flex-1 text-center py-2.5 bg-action-bg text-action-text rounded-lg font-inter font-semibold text-small hover:opacity-90 transition-all">
                Request
              </Link>
            </div>
          </div>
        ))}
      </div>
      <p className="font-inter text-small text-text-muted mt-6">Showing {MENTORS.length} of 124 mentors</p>
    </DashboardShell>
  );
}
