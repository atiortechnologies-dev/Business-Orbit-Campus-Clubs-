import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Camera, X, Plus, CheckCircle2, ChevronRight, KeyRound, ShieldCheck, Trash2 } from 'lucide-react';
import DashboardShell from '@/components/dashboard/DashboardShell';
import ComingSoon from '@/components/ui/ComingSoon';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

const DEFAULT_FORM = {
  fullName: 'Alex Chen',
  email: 'alex.chen@bocc.edu',
  phone: '+1 (555) 019-2384',
  college: 'State University',
  branch: 'Computer Science',
  gradYear: '2026',
  linkedin: 'https://linkedin.com/in/alexchen',
  github: 'https://github.com/alexchen',
  portfolio: '',
};

const INITIAL_SKILLS = ['React', 'Product Design', 'Market Research'];

export default function SettingsPage() {
  useDocumentTitle('Settings — BOCC');

  const [form, setForm] = useState(DEFAULT_FORM);
  const [skills, setSkills] = useState(INITIAL_SKILLS);
  const [skillDraft, setSkillDraft] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const addSkill = () => {
    const trimmed = skillDraft.trim();
    if (trimmed && !skills.includes(trimmed)) setSkills((prev) => [...prev, trimmed]);
    setSkillDraft('');
  };

  const removeSkill = (skill) => setSkills((prev) => prev.filter((s) => s !== skill));

  const handleSave = () => {
    // TODO(backend): PATCH the student profile with `form` and `skills`.
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  const initials = form.fullName.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();

  return (
    <DashboardShell pageId="settings">
      <nav className="mb-2 flex items-center gap-2 text-text-muted font-inter font-normal text-small">
        <Link to="/dashboard" className="hover:text-text-heading transition-colors">Dashboard</Link>
        <ChevronRight size={14} strokeWidth={2} />
        <span className="text-text-heading font-semibold">Settings</span>
      </nav>

      <h1 className="font-poppins font-semibold text-page text-text-heading mb-1">Account Settings</h1>
      <p className="font-inter text-body text-text-body mb-8">
        Manage your profile, education details, and account security.
      </p>

      {saveSuccess && (
        <div className="mb-6 flex items-center gap-2 rounded-lg border bg-success/10 border-success/30 text-success px-4 py-3 font-inter text-small">
          <CheckCircle2 size={16} strokeWidth={2} />
          Changes saved.
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pb-8">
        <div className="lg:col-span-4">
          <div className="bg-surface-white border border-border-subtle rounded-lg shadow-card p-6 flex flex-col items-center text-center">
            <div className="relative mb-4">
              <div className="w-24 h-24 rounded-full bg-canvas-bg border border-border-subtle flex items-center justify-center font-poppins font-bold text-text-heading text-3xl select-none">
                {initials}
              </div>
              <ComingSoon label="Change Photo" position="top" inline>
                <span className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-brand-black flex items-center justify-center border-2 border-surface-white">
                  <Camera size={14} strokeWidth={2} className="text-white" />
                </span>
              </ComingSoon>
            </div>
            <h3 className="font-poppins font-semibold text-card text-text-heading">{form.fullName}</h3>
            <p className="font-inter text-small text-text-muted">{form.college} · {form.branch}</p>
            <Link
              to="/build-startup/journey"
              className="mt-4 w-full border border-border-subtle text-text-heading py-2 rounded-md hover:bg-canvas-bg transition-colors font-poppins font-semibold text-small"
            >
              View Startup Journey
            </Link>
          </div>
        </div>

        <div className="lg:col-span-8 space-y-6">
          <div className="bg-surface-white border border-border-subtle rounded-lg shadow-card p-6">
            <h3 className="font-poppins font-semibold text-body text-text-heading mb-4">Personal Info</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-poppins font-semibold text-caption text-text-muted uppercase tracking-wider block mb-1.5">Full Name</label>
                <input type="text" name="fullName" value={form.fullName} onChange={handleChange} className="w-full bg-canvas-bg border border-border-subtle rounded-md text-text-body font-inter text-body py-2.5 px-3 focus:outline-none focus:ring-1 focus:ring-brand-black" />
              </div>
              <div>
                <label className="font-poppins font-semibold text-caption text-text-muted uppercase tracking-wider block mb-1.5">Email</label>
                <input type="email" name="email" value={form.email} onChange={handleChange} className="w-full bg-canvas-bg border border-border-subtle rounded-md text-text-body font-inter text-body py-2.5 px-3 focus:outline-none focus:ring-1 focus:ring-brand-black" />
              </div>
              <div>
                <label className="font-poppins font-semibold text-caption text-text-muted uppercase tracking-wider block mb-1.5">Phone</label>
                <input type="tel" name="phone" value={form.phone} onChange={handleChange} className="w-full bg-canvas-bg border border-border-subtle rounded-md text-text-body font-inter text-body py-2.5 px-3 focus:outline-none focus:ring-1 focus:ring-brand-black" />
              </div>
            </div>
          </div>

          <div className="bg-surface-white border border-border-subtle rounded-lg shadow-card p-6">
            <h3 className="font-poppins font-semibold text-body text-text-heading mb-4">Education</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="font-poppins font-semibold text-caption text-text-muted uppercase tracking-wider block mb-1.5">College</label>
                <input type="text" name="college" value={form.college} onChange={handleChange} className="w-full bg-canvas-bg border border-border-subtle rounded-md text-text-body font-inter text-body py-2.5 px-3 focus:outline-none focus:ring-1 focus:ring-brand-black" />
              </div>
              <div>
                <label className="font-poppins font-semibold text-caption text-text-muted uppercase tracking-wider block mb-1.5">Branch</label>
                <input type="text" name="branch" value={form.branch} onChange={handleChange} className="w-full bg-canvas-bg border border-border-subtle rounded-md text-text-body font-inter text-body py-2.5 px-3 focus:outline-none focus:ring-1 focus:ring-brand-black" />
              </div>
              <div>
                <label className="font-poppins font-semibold text-caption text-text-muted uppercase tracking-wider block mb-1.5">Graduation Year</label>
                <input type="text" name="gradYear" value={form.gradYear} onChange={handleChange} className="w-full bg-canvas-bg border border-border-subtle rounded-md text-text-body font-inter text-body py-2.5 px-3 focus:outline-none focus:ring-1 focus:ring-brand-black" />
              </div>
            </div>
          </div>

          <div className="bg-surface-white border border-border-subtle rounded-lg shadow-card p-6">
            <h3 className="font-poppins font-semibold text-body text-text-heading mb-4">Skills &amp; Interests</h3>
            <div className="flex flex-wrap gap-2 mb-3">
              {skills.map((skill) => (
                <span key={skill} className="flex items-center gap-1.5 bg-canvas-bg border border-border-subtle rounded-full px-3 py-1 font-inter text-small text-text-body">
                  {skill}
                  <button type="button" onClick={() => removeSkill(skill)} aria-label={`Remove ${skill}`}>
                    <X size={12} strokeWidth={2} className="text-text-muted hover:text-error transition-colors" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={skillDraft}
                onChange={(e) => setSkillDraft(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                placeholder="Add a skill..."
                className="flex-1 bg-canvas-bg border border-border-subtle rounded-md text-text-body font-inter text-small py-2 px-3 focus:outline-none focus:ring-1 focus:ring-brand-black"
              />
              <button type="button" onClick={addSkill} className="w-9 h-9 rounded-md bg-brand-black flex items-center justify-center shrink-0 hover:opacity-90 transition-opacity">
                <Plus size={16} strokeWidth={2} className="text-white" />
              </button>
            </div>
          </div>

          <div className="bg-surface-white border border-border-subtle rounded-lg shadow-card p-6">
            <h3 className="font-poppins font-semibold text-body text-text-heading mb-4">Professional Links</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-poppins font-semibold text-caption text-text-muted uppercase tracking-wider block mb-1.5">LinkedIn</label>
                <input type="url" name="linkedin" value={form.linkedin} onChange={handleChange} className="w-full bg-canvas-bg border border-border-subtle rounded-md text-text-body font-inter text-body py-2.5 px-3 focus:outline-none focus:ring-1 focus:ring-brand-black" />
              </div>
              <div>
                <label className="font-poppins font-semibold text-caption text-text-muted uppercase tracking-wider block mb-1.5">GitHub</label>
                <input type="url" name="github" value={form.github} onChange={handleChange} className="w-full bg-canvas-bg border border-border-subtle rounded-md text-text-body font-inter text-body py-2.5 px-3 focus:outline-none focus:ring-1 focus:ring-brand-black" />
              </div>
              <div className="sm:col-span-2">
                <label className="font-poppins font-semibold text-caption text-text-muted uppercase tracking-wider block mb-1.5">Portfolio (Optional)</label>
                <input type="url" name="portfolio" value={form.portfolio} onChange={handleChange} placeholder="https://..." className="w-full bg-canvas-bg border border-border-subtle rounded-md text-text-body font-inter text-body py-2.5 px-3 focus:outline-none focus:ring-1 focus:ring-brand-black" />
              </div>
            </div>
          </div>

          <div className="bg-surface-white border border-border-subtle rounded-lg shadow-card p-6">
            <h3 className="font-poppins font-semibold text-body text-text-heading mb-4">Account Security</h3>
            <div className="space-y-3">
              <ComingSoon label="Change Password" position="top" className="flex items-center justify-between w-full border border-border-subtle rounded-lg p-4">
                <span className="flex items-center gap-2.5 font-inter text-small text-text-body">
                  <KeyRound size={16} strokeWidth={2} className="text-text-muted" /> Change Password
                </span>
                <ChevronRight size={16} strokeWidth={2} className="text-text-muted" />
              </ComingSoon>
              <div className="flex items-center justify-between border border-border-subtle rounded-lg p-4">
                <span className="flex items-center gap-2.5 font-inter text-small text-text-body">
                  <ShieldCheck size={16} strokeWidth={2} className="text-text-muted" /> Two-Factor Authentication
                </span>
                <span className="font-poppins font-semibold text-caption text-text-muted">Not Enabled</span>
              </div>
              <ComingSoon label="Delete Account" position="top" className="flex items-center justify-between w-full border border-error/30 rounded-lg p-4">
                <span className="flex items-center gap-2.5 font-inter text-small text-error">
                  <Trash2 size={16} strokeWidth={2} /> Delete Account
                </span>
              </ComingSoon>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => { setForm(DEFAULT_FORM); setSkills(INITIAL_SKILLS); }}
              className="border border-border-subtle text-text-heading px-6 py-2.5 rounded-md hover:bg-canvas-bg transition-colors font-poppins font-semibold text-small"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="bg-action-bg text-action-text px-6 py-2.5 rounded-md hover:opacity-90 active:scale-[0.98] transition-all font-poppins font-semibold text-small"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
