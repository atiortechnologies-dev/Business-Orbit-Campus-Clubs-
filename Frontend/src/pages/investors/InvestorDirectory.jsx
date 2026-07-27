import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Wallet, MapPin } from 'lucide-react';
import DashboardShell from '@/components/dashboard/DashboardShell';
import ComingSoon from '@/components/ui/ComingSoon';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

const INDUSTRY_OPTIONS = ['All Industries', 'Fintech', 'Healthtech', 'SaaS', 'Clean Energy'];
const STAGE_OPTIONS = ['Pre-Seed to Series A', 'Pre-Seed', 'Seed', 'Series A', 'Growth'];
const LOCATION_OPTIONS = ['Global', 'North America', 'Europe', 'Asia Pacific'];
const SIZE_OPTIONS = ['Any Range', '$10k - $100k', '$100k - $500k', '$500k+'];

const INVESTORS = [
  { id: 'iv1', name: 'Sarah Chen', firm: 'Oasis Capital', role: 'Managing Director', location: 'San Francisco, CA', bio: 'Focused on early-stage fintech and enterprise SaaS. We help student founders scale from MVP to Series A with strategic mentorship and a deep network of industry partners.', focus: ['Fintech', 'B2B SaaS'], stages: 'Pre-Seed, Seed', range: '$250k - $1.5M' },
  { id: 'iv2', name: 'Marcus Thorne', firm: 'Founders First Fund', role: 'General Partner', location: 'London, UK', bio: 'Backing technical student founders building disruptive climate tech and hardware solutions. We prefer hands-on involvement during the prototype phase.', focus: ['Climate Tech', 'Hardware'], stages: 'Idea, Pre-Seed', range: '$50k - $500k' },
  { id: 'iv3', name: 'Elena Rodriguez', firm: 'NextGen Ventures', role: 'Venture Partner', location: 'New York, NY', bio: 'Specializing in consumer marketplaces and social platforms. I look for exceptional student founders who demonstrate deep empathy for their users and high velocity in execution.', focus: ['Marketplaces', 'Consumer'], stages: 'Seed, Series A', range: '$150k - $1M' },
];

export default function InvestorDirectoryPage() {
  useDocumentTitle('Investor Directory — BOCC');
  const [industry, setIndustry] = useState(INDUSTRY_OPTIONS[0]);
  const [stage, setStage] = useState(STAGE_OPTIONS[0]);
  const [location, setLocation] = useState(LOCATION_OPTIONS[0]);
  const [size, setSize] = useState(SIZE_OPTIONS[0]);
  const [activeOnly, setActiveOnly] = useState(false);
  const [recentlyJoined, setRecentlyJoined] = useState(false);

  return (
    <DashboardShell pageId="investor-directory">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-brand-black flex items-center justify-center shrink-0">
              <Wallet size={20} strokeWidth={2} className="text-accent-neon" />
            </div>
            <h1 className="font-poppins font-semibold text-page text-text-heading">Investor Directory</h1>
          </div>
          <p className="font-inter text-body text-text-body">Browse investors and discover potential funding partners.</p>
        </div>
        <ComingSoon label="Saved Investors" position="top" inline className="flex items-center gap-2 px-4 py-2.5 border border-border-subtle rounded-lg font-inter font-semibold text-small text-text-heading self-start">
          Saved Investors
        </ComingSoon>
      </div>

      <div className="bg-surface-white border border-border-subtle rounded-lg p-4 flex flex-wrap items-end gap-6 mb-8">
        <div className="flex flex-col gap-1">
          <label className="text-caption text-text-muted font-inter">Industry Focus</label>
          <select value={industry} onChange={(e) => setIndustry(e.target.value)} className="bg-transparent font-inter text-small text-text-heading focus:outline-none cursor-pointer">
            {INDUSTRY_OPTIONS.map((o) => <option key={o}>{o}</option>)}
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-caption text-text-muted font-inter">Investment Stage</label>
          <select value={stage} onChange={(e) => setStage(e.target.value)} className="bg-transparent font-inter text-small text-text-heading focus:outline-none cursor-pointer">
            {STAGE_OPTIONS.map((o) => <option key={o}>{o}</option>)}
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-caption text-text-muted font-inter">Location</label>
          <select value={location} onChange={(e) => setLocation(e.target.value)} className="bg-transparent font-inter text-small text-text-heading focus:outline-none cursor-pointer">
            {LOCATION_OPTIONS.map((o) => <option key={o}>{o}</option>)}
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-caption text-text-muted font-inter">Investment Size</label>
          <select value={size} onChange={(e) => setSize(e.target.value)} className="bg-transparent font-inter text-small text-text-heading focus:outline-none cursor-pointer">
            {SIZE_OPTIONS.map((o) => <option key={o}>{o}</option>)}
          </select>
        </div>
        <div className="flex items-center gap-4 ml-auto">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={activeOnly} onChange={(e) => setActiveOnly(e.target.checked)} className="w-4 h-4 rounded border-border-subtle text-brand-black focus:ring-brand-black" />
            <span className="font-inter text-small text-text-body">Active Only</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={recentlyJoined} onChange={(e) => setRecentlyJoined(e.target.checked)} className="w-4 h-4 rounded border-border-subtle text-brand-black focus:ring-brand-black" />
            <span className="font-inter text-small text-text-body">Recently Joined</span>
          </label>
        </div>
      </div>

      <div className="space-y-4">
        {INVESTORS.map((inv) => (
          <div key={inv.id} className="bg-surface-white border border-border-subtle rounded-lg p-6 flex flex-col md:flex-row gap-6 shadow-card">
            <div className="w-20 h-20 shrink-0 rounded-lg bg-canvas-bg border border-border-subtle flex items-center justify-center font-poppins font-bold text-card text-text-muted">
              {inv.name.split(' ').map((n) => n[0]).join('')}
            </div>
            <div className="flex-1 space-y-3">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                <div>
                  <h3 className="font-poppins font-semibold text-card text-text-heading">{inv.name}</h3>
                  <p className="font-inter text-small text-text-body"><span className="font-semibold text-text-heading">{inv.firm}</span> · {inv.role}</p>
                </div>
                <div className="flex items-center gap-1 text-text-muted">
                  <MapPin size={16} strokeWidth={2} /> <span className="font-inter text-small">{inv.location}</span>
                </div>
              </div>
              <p className="font-inter text-small text-text-body max-w-3xl">{inv.bio}</p>
              <div className="flex flex-wrap gap-x-8 gap-y-3 pt-1">
                <div>
                  <p className="font-inter text-caption text-text-muted uppercase tracking-wide mb-1">Investment Focus</p>
                  <div className="flex gap-2">{inv.focus.map((f) => <span key={f} className="px-2 py-0.5 bg-canvas-bg rounded font-inter text-caption text-text-heading">{f}</span>)}</div>
                </div>
                <div>
                  <p className="font-inter text-caption text-text-muted uppercase tracking-wide mb-1">Preferred Stages</p>
                  <p className="font-inter text-small text-text-heading">{inv.stages}</p>
                </div>
                <div>
                  <p className="font-inter text-caption text-text-muted uppercase tracking-wide mb-1">Investment Range</p>
                  <p className="font-inter font-semibold text-small text-text-heading">{inv.range}</p>
                </div>
              </div>
            </div>
            <div className="flex md:flex-col justify-end gap-3 shrink-0">
              <Link to="/investors/profile" className="px-4 py-2 border border-border-subtle rounded-lg font-inter font-semibold text-small text-text-heading hover:bg-canvas-bg transition-colors text-center">
                View Profile
              </Link>
              <Link to="/investors/send-pitch" className="px-4 py-2 bg-action-bg text-action-text rounded-lg font-inter font-semibold text-small hover:opacity-90 transition-all text-center">
                Send Pitch Deck
              </Link>
            </div>
          </div>
        ))}
      </div>
    </DashboardShell>
  );
}
