import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MapPin, Clock, DollarSign, Bookmark, CheckCircle2, CalendarDays } from 'lucide-react';
import CompanyShell from '@/components/company/CompanyShell';
import PostOpportunityStepper from '@/components/company/PostOpportunityStepper';
import Button from '@/components/ui/Button';
import ComingSoon from '@/components/ui/ComingSoon';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { postOpportunityDraft } from './postOpportunityDraft';

const CHECKLIST = [
  { label: 'Role Details', step: 1 },
  { label: 'Criteria & Skills', step: 2 },
  { label: 'Description & Perks', step: 3 },
];

const VISIBILITY_OPTIONS = [
  { value: 'public', label: 'Public', hint: 'Visible to all students across the BOCC network and external search.' },
  { value: 'members', label: 'BOCC Members Only', hint: 'Only verified students with a BOCC platform account can view this.' },
  { value: 'selected', label: 'Selected Colleges', hint: 'Restrict visibility to specific partner institutions only.' },
];

export default function PostOpportunityStep4Page() {
  useDocumentTitle('Post Opportunity — Preview & Publish — BOCC');
  const navigate = useNavigate();
  const [visibility, setVisibility] = useState('public');

  const draft = postOpportunityDraft;
  const title = draft.title || 'Untitled Opportunity';
  const locationLabel = draft.location ? `${draft.location}, ${draft.workMode}` : draft.workMode;

  const handlePublish = () => {
    // TODO(backend): POST /api/opportunities with the full wizard state + visibility setting.
    navigate('/company/my-opportunities');
  };

  const handleSaveDraft = () => {
    // TODO(backend): POST /api/opportunities/drafts with the full wizard state.
  };

  return (
    <CompanyShell>
      <div className="mb-2">
        <h1 className="font-poppins font-semibold text-page text-text-heading">Post New Opportunity</h1>
        <p className="font-inter text-body text-text-body mt-1">Review how your opportunity will appear to students and configure final visibility settings.</p>
      </div>

      <PostOpportunityStepper current={4} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-4">
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-surface-white border border-border-subtle rounded-lg overflow-hidden">
            <div className="p-6 border-b border-divider-line bg-canvas-bg">
              <span className="inline-block px-2 py-1 bg-brand-black text-accent-neon font-inter font-bold text-[10px] rounded uppercase tracking-wider mb-3">Live Preview (Student View)</span>
              <div className="flex items-start justify-between gap-4">
                <div className="flex gap-4">
                  <div className="w-16 h-16 rounded-lg bg-surface-white border border-border-subtle flex items-center justify-center shrink-0">
                    <span className="font-poppins font-bold text-card text-text-muted">{title.charAt(0).toUpperCase()}</span>
                  </div>
                  <div>
                    <h3 className="font-poppins font-semibold text-card text-text-heading">{title}</h3>
                    <div className="flex flex-wrap items-center gap-4 mt-2 text-text-muted font-inter text-small">
                      <span className="flex items-center gap-1"><MapPin size={16} strokeWidth={2} /> {locationLabel}</span>
                      <span className="flex items-center gap-1"><Clock size={16} strokeWidth={2} /> {draft.type}</span>
                      {draft.salaryRange && <span className="flex items-center gap-1"><DollarSign size={16} strokeWidth={2} /> {draft.salaryRange}</span>}
                    </div>
                  </div>
                </div>
                <ComingSoon label="Bookmark" position="left" inline>
                  <span className="p-2 border border-border-subtle rounded-lg text-text-muted"><Bookmark size={18} strokeWidth={2} /></span>
                </ComingSoon>
              </div>
            </div>
            <div className="p-8 space-y-6">
              <section>
                <h4 className="font-poppins font-semibold text-body text-text-heading mb-2">About the Role</h4>
                <p className="font-inter text-small text-text-body leading-relaxed">
                  {draft.overview || 'Add an opportunity overview in Step 3 to see it reflected here.'}
                </p>
              </section>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <section>
                  <h4 className="font-poppins font-semibold text-body text-text-heading mb-2">Requirements</h4>
                  <ul className="space-y-2 font-inter text-small text-text-body">
                    <li className="flex items-start gap-2"><CheckCircle2 size={16} strokeWidth={2} className="text-brand-black shrink-0 mt-0.5" /> Meets the minimum education & CGPA set in Step 2</li>
                    <li className="flex items-start gap-2"><CheckCircle2 size={16} strokeWidth={2} className="text-brand-black shrink-0 mt-0.5" /> Matches the experience level set in Step 2</li>
                  </ul>
                </section>
                <section>
                  <h4 className="font-poppins font-semibold text-body text-text-heading mb-2">Key Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {(draft.skills.length ? draft.skills : ['Add skills in Step 2']).map((s) => (
                      <span key={s} className="px-3 py-1 bg-canvas-bg rounded-full font-inter text-caption text-text-body">{s}</span>
                    ))}
                  </div>
                </section>
              </div>
              <section className="pt-6 border-t border-divider-line">
                <span className="w-full flex items-center justify-center gap-2 py-3.5 bg-brand-black text-white rounded-lg font-poppins font-semibold text-small">
                  Apply Now
                </span>
              </section>
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <div className="bg-surface-white border border-border-subtle rounded-lg p-6">
            <h4 className="font-poppins font-semibold text-body text-text-heading mb-4">Review Checklist</h4>
            <ul className="space-y-4">
              {CHECKLIST.map(({ label, step }) => (
                <li key={label} className="flex items-center gap-3">
                  <CheckCircle2 size={20} strokeWidth={2} className="text-brand-black shrink-0" />
                  <div className="flex-1">
                    <p className="font-inter font-bold text-small text-text-heading">{label}</p>
                    <p className="font-inter text-caption text-text-muted">Completed</p>
                  </div>
                  <Link to={`/company/post-opportunity/step-${step}`} className="font-inter font-bold text-caption text-text-heading underline">Edit</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-surface-white border border-border-subtle rounded-lg p-6">
            <h4 className="font-poppins font-semibold text-body text-text-heading mb-4">Visibility Settings</h4>
            <div className="space-y-3">
              {VISIBILITY_OPTIONS.map((opt) => (
                <label key={opt.value} className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${visibility === opt.value ? 'border-brand-black bg-canvas-bg' : 'border-border-subtle hover:bg-canvas-bg'}`}>
                  <input type="radio" name="visibility" value={opt.value} checked={visibility === opt.value} onChange={() => setVisibility(opt.value)} className="mt-1 text-brand-black focus:ring-brand-black" />
                  <div className="flex-1">
                    <p className="font-inter font-bold text-small text-text-heading">{opt.label}</p>
                    <p className="font-inter text-caption text-text-muted">{opt.hint}</p>
                  </div>
                </label>
              ))}
            </div>
            <div className="mt-6 pt-6 border-t border-divider-line">
              <div className="flex items-center justify-between mb-3">
                <span className="font-inter font-bold text-small text-text-heading">Application Deadline</span>
                <ComingSoon label="Change Application Deadline" position="left" inline>
                  <span className="font-inter font-bold text-caption text-text-heading">Change</span>
                </ComingSoon>
              </div>
              <div className="flex items-center gap-2 p-3 bg-canvas-bg rounded-lg border border-border-subtle">
                <CalendarDays size={18} strokeWidth={2} className="text-text-muted" />
                <span className="font-inter font-medium text-small text-text-heading">Oct 31, 2023</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mt-8 pt-6 border-t border-divider-line">
        <button type="button" onClick={() => navigate('/company/post-opportunity/step-3')} className="px-6 py-2.5 font-inter font-semibold text-small text-text-muted hover:text-text-heading transition-colors">
          Previous
        </button>
        <div className="flex gap-3">
          <Button variant="outline" onClick={handleSaveDraft}>Save Draft</Button>
          <Button onClick={handlePublish}>Publish Opportunity</Button>
        </div>
      </div>
    </CompanyShell>
  );
}
