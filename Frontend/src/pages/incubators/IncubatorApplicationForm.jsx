import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronRight, Rocket, Users, Wallet, UploadCloud, Info } from 'lucide-react';
import DashboardShell from '@/components/dashboard/DashboardShell';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import ComingSoon from '@/components/ui/ComingSoon';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

const STAGE_OPTIONS = ['Ideation', 'MVP Development', 'Early Traction', 'Scaling'];

export default function IncubatorApplicationFormPage() {
  useDocumentTitle('Apply for Incubation — BOCC');
  const navigate = useNavigate();

  const [form, setForm] = useState({
    startupName: '', stage: STAGE_OPTIONS[0], industry: '', problem: '', solution: '',
    founders: '', teamSize: '', website: '', deckLink: '', traction: '',
  });

  const update = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const canSubmit = form.startupName.trim().length > 0 && form.problem.trim().length > 0 && form.solution.trim().length > 0;

  const handleSubmit = () => {
    if (!canSubmit) return;
    // TODO(backend): POST /api/incubators/:id/applications with the full form.
    navigate('/incubators/confirmed');
  };

  const handleSaveDraft = () => {
    // TODO(backend): PATCH the application as a draft.
  };

  return (
    <DashboardShell pageId="incubator-application-form">
      <nav className="mb-2 flex items-center gap-2 text-text-muted font-inter font-normal text-small">
        <Link to="/incubators" className="hover:text-text-heading transition-colors">Incubators</Link>
        <ChevronRight size={14} strokeWidth={2} />
        <span className="text-text-heading font-semibold">Apply</span>
      </nav>

      <div className="mb-8">
        <h1 className="font-poppins font-semibold text-page text-text-heading mb-2">Apply for Incubation</h1>
        <p className="font-inter text-body text-text-body">Complete your application to join TechScale Accelerator.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-6">
          <section className="bg-surface-white border border-border-subtle rounded-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <Rocket size={20} strokeWidth={2} className="text-text-heading" />
              <h3 className="font-poppins font-semibold text-body text-text-heading">Startup Information</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Input id="startupName" label="Startup Name" placeholder="Enter legal or brand name" value={form.startupName} onChange={update('startupName')} />
              <div className="flex flex-col gap-1">
                <label htmlFor="stage" className="text-caption font-medium text-text-heading font-inter">Development Stage</label>
                <select id="stage" value={form.stage} onChange={update('stage')} className="w-full rounded-md border border-border-subtle bg-surface-white text-sm text-text-body font-inter min-h-[44px] px-3 focus:outline-none focus:border-brand-black focus:ring-1 focus:ring-brand-black transition-all">
                  {STAGE_OPTIONS.map((s) => <option key={s}>{s}</option>)}
                </select>
              </div>
              <Input id="industry" label="Industry" placeholder="e.g. Fintech, EdTech, HealthTech" className="md:col-span-2" value={form.industry} onChange={update('industry')} />
              <div className="md:col-span-2 flex flex-col gap-1">
                <label htmlFor="problem" className="text-caption font-medium text-text-heading font-inter">Problem Statement</label>
                <textarea id="problem" rows={3} placeholder="What specific problem are you solving?" value={form.problem} onChange={update('problem')} className="w-full rounded-md border border-border-subtle bg-surface-white text-sm text-text-body font-inter p-3 focus:outline-none focus:border-brand-black focus:ring-1 focus:ring-brand-black transition-all resize-none" />
              </div>
              <div className="md:col-span-2 flex flex-col gap-1">
                <label htmlFor="solution" className="text-caption font-medium text-text-heading font-inter">Proposed Solution</label>
                <textarea id="solution" rows={3} placeholder="Describe your product and how it solves the problem." value={form.solution} onChange={update('solution')} className="w-full rounded-md border border-border-subtle bg-surface-white text-sm text-text-body font-inter p-3 focus:outline-none focus:border-brand-black focus:ring-1 focus:ring-brand-black transition-all resize-none" />
              </div>
            </div>
          </section>

          <section className="bg-surface-white border border-border-subtle rounded-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <Users size={20} strokeWidth={2} className="text-text-heading" />
              <h3 className="font-poppins font-semibold text-body text-text-heading">Founder Information</h3>
            </div>
            <div className="space-y-5">
              <div className="flex flex-col gap-1">
                <label htmlFor="founders" className="text-caption font-medium text-text-heading font-inter">Core Founders</label>
                <textarea id="founders" rows={2} placeholder="Names and roles (e.g., Jane Doe – CEO)" value={form.founders} onChange={update('founders')} className="w-full rounded-md border border-border-subtle bg-surface-white text-sm text-text-body font-inter p-3 focus:outline-none focus:border-brand-black focus:ring-1 focus:ring-brand-black transition-all resize-none" />
              </div>
              <Input id="teamSize" label="Current Team Size" type="number" placeholder="Total number of team members" className="max-w-[200px]" value={form.teamSize} onChange={update('teamSize')} />
            </div>
          </section>

          <section className="bg-surface-white border border-border-subtle rounded-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <Wallet size={20} strokeWidth={2} className="text-text-heading" />
              <h3 className="font-poppins font-semibold text-body text-text-heading">Business Information</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Input id="website" label="Website URL" placeholder="https://yourstartup.com" value={form.website} onChange={update('website')} />
              <Input id="deckLink" label="Pitch Deck Link" placeholder="https://link-to-your-deck.com" value={form.deckLink} onChange={update('deckLink')} />
              <div className="md:col-span-2 flex flex-col gap-1">
                <label htmlFor="traction" className="text-caption font-medium text-text-heading font-inter">Market Traction</label>
                <textarea id="traction" rows={3} placeholder="Describe users, revenue, or milestones achieved to date." value={form.traction} onChange={update('traction')} className="w-full rounded-md border border-border-subtle bg-surface-white text-sm text-text-body font-inter p-3 focus:outline-none focus:border-brand-black focus:ring-1 focus:ring-brand-black transition-all resize-none" />
              </div>
            </div>
          </section>

          <section className="bg-surface-white border border-border-subtle rounded-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <UploadCloud size={20} strokeWidth={2} className="text-text-heading" />
              <h3 className="font-poppins font-semibold text-body text-text-heading">Supporting Documents</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {['Pitch Deck (PDF, max 10MB)', 'Business Plan (DOCX/PDF, max 15MB)'].map((label) => (
                <ComingSoon key={label} label={label.split(' (')[0]} position="top">
                  <div className="border-2 border-dashed border-border-subtle rounded-lg p-6 flex flex-col items-center gap-2 hover:bg-canvas-bg transition-colors">
                    <UploadCloud size={28} strokeWidth={1.5} className="text-text-muted" />
                    <p className="font-poppins font-semibold text-small text-text-heading">{label.split(' (')[0]}</p>
                    <p className="font-inter text-caption text-text-muted">{label.match(/\(([^)]+)\)/)[1]}</p>
                  </div>
                </ComingSoon>
              ))}
            </div>
          </section>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <div className="bg-surface-white border border-border-subtle rounded-lg p-6">
            <h4 className="font-poppins font-semibold text-body text-text-heading mb-4">Application Checklist</h4>
            <ul className="space-y-3 font-inter text-small">
              <li className={form.startupName.trim() && form.problem.trim() && form.solution.trim() ? 'text-text-heading' : 'text-text-muted'}>Startup Information</li>
              <li className={form.founders.trim() ? 'text-text-heading' : 'text-text-muted'}>Founder Information</li>
              <li className={form.website.trim() ? 'text-text-heading' : 'text-text-muted'}>Business Information</li>
              <li className="text-text-muted">Supporting Documents</li>
            </ul>
          </div>
          <div className="bg-canvas-bg border border-border-subtle rounded-lg p-6 flex gap-3">
            <Info size={18} strokeWidth={2} className="text-text-muted shrink-0" />
            <p className="font-inter text-small text-text-muted">Once submitted, you cannot edit your application until the initial review phase is complete.</p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end gap-4 mt-8 pt-6 border-t border-divider-line">
        <Button variant="outline" onClick={handleSaveDraft}>Save Draft</Button>
        <Button onClick={handleSubmit} disabled={!canSubmit}>Submit Application</Button>
      </div>
    </DashboardShell>
  );
}
