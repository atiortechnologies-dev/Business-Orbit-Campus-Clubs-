import { useState } from 'react';
import {
  Building,
  Info,
  Calendar,
  Lock,
  ExternalLink,
  Download,
  Camera,
  X,
  Plus,
  CheckCircle,
  AlertTriangle,
  ChevronDown,
} from 'lucide-react';
import IncubatorShell from '@/components/incubator/IncubatorShell';
import ComingSoon from '@/components/ui/ComingSoon';
import Modal from '@/components/ui/Modal';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

const DEFAULT_FORM_STATE = {
  incubatorName: 'BOCC Incubator',
  repName: 'Sarah Jenkins',
  phone: '+1 (555) 012-3456',
  website: 'https://www.incubatorhub.io',
  address: '42 Innovation Drive, Suite 100, San Francisco, CA',
  about: 'We provide early-stage tech startups with the capital, mentorship, and network they need to scale rapidly. Our focus is on sustainable AI and fintech solutions.',
  stages: 'Pre-seed to Seed',
  maxStartups: '25',
  meetingPreference: 'Video Call (Remote)',
  primaryComm: 'Email',
};

const INITIAL_INDUSTRIES = ['Artificial Intelligence', 'Fintech', 'SaaS'];

const INITIAL_WORKING_DAYS = {
  M: true,
  T: true,
  W: true,
  T2: true, // Thursday
  F: true,
  S: false,
  S2: false, // Sunday
};

export default function SettingsPage() {
  useDocumentTitle('Settings — BOCC Incubator Portal');
  const [form, setForm] = useState(DEFAULT_FORM_STATE);
  const [industries, setIndustries] = useState(INITIAL_INDUSTRIES);
  const [workingDays, setWorkingDays] = useState(INITIAL_WORKING_DAYS);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [industryDraft, setIndustryDraft] = useState('');
  const [addingIndustry, setAddingIndustry] = useState(false);
  const [logoUrl, setLogoUrl] = useState(null);
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ current: '', next: '', confirm: '' });
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [deactivateOpen, setDeactivateOpen] = useState(false);
  const [deactivateConfirmText, setDeactivateConfirmText] = useState('');
  const [deactivateRequested, setDeactivateRequested] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleRemoveIndustry = (indName) => {
    setIndustries((prev) => prev.filter((i) => i !== indName));
  };

  const handleToggleDay = (dayKey) => {
    setWorkingDays((prev) => ({ ...prev, [dayKey]: !prev[dayKey] }));
  };

  const handleCancel = () => {
    setForm(DEFAULT_FORM_STATE);
    setIndustries(INITIAL_INDUSTRIES);
    setWorkingDays(INITIAL_WORKING_DAYS);
    setEmailNotifications(true);
  };

  const handleSave = () => {
    // TODO(backend): PATCH the incubator profile with `form`, `industries`,
    // `workingDays`, and `emailNotifications`.
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  const addIndustry = () => {
    const trimmed = industryDraft.trim();
    if (trimmed && !industries.includes(trimmed)) setIndustries((prev) => [...prev, trimmed]);
    setIndustryDraft('');
    setAddingIndustry(false);
  };

  const handleLogoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLogoUrl(URL.createObjectURL(file));
  };

  const handlePasswordField = (e) => {
    const { name, value } = e.target;
    setPasswordForm((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordSubmit = () => {
    if (passwordForm.next.length < 8) {
      setPasswordError('New password must be at least 8 characters.');
      return;
    }
    if (passwordForm.next !== passwordForm.confirm) {
      setPasswordError('New password and confirmation do not match.');
      return;
    }
    setPasswordError('');
    // TODO(backend): verify `passwordForm.current` and update the account
    // password with `passwordForm.next`.
    setPasswordSuccess(true);
    setPasswordForm({ current: '', next: '', confirm: '' });
    setTimeout(() => { setPasswordSuccess(false); setPasswordOpen(false); }, 1500);
  };

  const handleDeactivateConfirm = () => {
    // TODO(backend): deactivate the incubator account and sign out.
    setDeactivateOpen(false);
    setDeactivateConfirmText('');
    setDeactivateRequested(true);
  };

  return (
    <IncubatorShell>
      <header className="mb-8">
        <h2 className="font-poppins font-bold text-section text-text-heading">
          Profile Management
        </h2>
        <p className="font-inter text-body text-text-muted mt-1">
          Manage your organization's presence and administrative settings.
        </p>
      </header>

      <div className="grid grid-cols-12 gap-8 pb-24">
        <div className="col-span-12 lg:col-span-4 space-y-6">
          <section className="bg-surface-white border border-border-subtle rounded-xl p-6 shadow-card transition-colors duration-150 ease-linear">
            <div className="flex flex-col items-center text-center">
              <div
                className="w-24 h-24 rounded-2xl bg-canvas-bg border border-border-subtle mb-4 flex items-center justify-center font-poppins font-bold text-text-heading text-4xl select-none bg-cover bg-center"
                style={logoUrl ? { backgroundImage: `url(${logoUrl})` } : undefined}
              >
                {!logoUrl && 'BI'}
              </div>
              <div className="flex items-center gap-1 mb-1">
                <h3 className="font-poppins font-bold text-card text-text-heading">
                  BOCC Incubator
                </h3>
              </div>
              <p className="font-inter text-small text-text-muted mb-6">
                Sarah Jenkins • Lead Representative
              </p>
              
              <div className="w-full space-y-2 mb-6">
                <div className="flex justify-between font-poppins font-semibold text-caption text-text-heading">
                  <span>Profile Completion</span>
                  <span>85%</span>
                </div>
                <div className="w-full h-2 bg-canvas-bg rounded-full overflow-hidden border border-border-subtle">
                  <div className="h-full bg-brand-black dark:bg-white w-[85%]"></div>
                </div>
              </div>

              <ComingSoon label="View Public Profile" position="top" inline={false}>
                <div className="w-full flex items-center justify-center gap-2 py-2.5 border border-border-subtle text-text-heading font-poppins font-semibold text-small rounded-lg hover:bg-canvas-bg cursor-pointer transition-colors">
                  <ExternalLink size={16} strokeWidth={2} />
                  View Public Profile
                </div>
              </ComingSoon>
            </div>

            <div className="mt-8 pt-6 border-t border-divider-line">
              <h4 className="font-poppins font-semibold text-small text-text-heading mb-4">
                Quick Actions
              </h4>
              <div className="space-y-2">
                <ComingSoon label="Download Data Audit" position="top" inline={false}>
                  <div className="w-full text-left p-3 rounded-lg hover:bg-canvas-bg font-inter text-small text-text-heading flex items-center justify-between cursor-pointer group border border-transparent hover:border-border-subtle transition-all">
                    <span>Download Data Audit</span>
                    <Download size={16} className="text-text-muted opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </ComingSoon>

                <label className="w-full text-left p-3 rounded-lg hover:bg-canvas-bg font-inter text-small text-text-heading flex items-center justify-between cursor-pointer group border border-transparent hover:border-border-subtle transition-all">
                  <span>Update Organization Logo</span>
                  <Camera size={16} className="text-text-muted opacity-0 group-hover:opacity-100 transition-opacity" />
                  <input type="file" accept="image/*" onChange={handleLogoChange} className="sr-only" />
                </label>
              </div>
            </div>
          </section>
        </div>

        <div className="col-span-12 lg:col-span-8 space-y-6">
          <section className="bg-surface-white border border-border-subtle rounded-xl p-6 shadow-card transition-colors duration-150 ease-linear">
            <div className="flex items-center gap-2 mb-6">
              <Building size={20} className="text-text-muted" />
              <h3 className="font-poppins font-bold text-card text-text-heading">
                Organization Information
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="font-poppins font-semibold text-caption text-text-muted">
                  Incubator Name
                </label>
                <input
                  type="text"
                  name="incubatorName"
                  value={form.incubatorName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-border-subtle rounded-lg font-inter text-small text-text-body focus:outline-none focus:ring-1 focus:ring-brand-black transition-all bg-canvas-bg/30"
                />
              </div>
              <div className="space-y-1">
                <label className="font-poppins font-semibold text-caption text-text-muted">
                  Representative Name
                </label>
                <input
                  type="text"
                  name="repName"
                  value={form.repName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-border-subtle rounded-lg font-inter text-small text-text-body focus:outline-none focus:ring-1 focus:ring-brand-black transition-all bg-canvas-bg/30"
                />
              </div>
              <div className="space-y-1">
                <label className="font-poppins font-semibold text-caption text-text-muted">
                  Work Email (Read-only)
                </label>
                <input
                  type="email"
                  disabled
                  value="sarah.j@incubatorhub.com"
                  className="w-full px-4 py-2 border border-border-subtle rounded-lg font-inter text-small text-text-muted/60 bg-canvas-bg/80 cursor-not-allowed"
                />
              </div>
              <div className="space-y-1">
                <label className="font-poppins font-semibold text-caption text-text-muted">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-border-subtle rounded-lg font-inter text-small text-text-body focus:outline-none focus:ring-1 focus:ring-brand-black transition-all bg-canvas-bg/30"
                />
              </div>
              <div className="space-y-1 md:col-span-2">
                <label className="font-poppins font-semibold text-caption text-text-muted">
                  Website
                </label>
                <input
                  type="url"
                  name="website"
                  value={form.website}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-border-subtle rounded-lg font-inter text-small text-text-body focus:outline-none focus:ring-1 focus:ring-brand-black transition-all bg-canvas-bg/30"
                />
              </div>
              <div className="space-y-1 md:col-span-2">
                <label className="font-poppins font-semibold text-caption text-text-muted">
                  Address
                </label>
                <input
                  type="text"
                  name="address"
                  value={form.address}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-border-subtle rounded-lg font-inter text-small text-text-body focus:outline-none focus:ring-1 focus:ring-brand-black transition-all bg-canvas-bg/30"
                />
              </div>
            </div>
          </section>

          <section className="bg-surface-white border border-border-subtle rounded-xl p-6 shadow-card transition-colors duration-150 ease-linear">
            <div className="flex items-center gap-2 mb-6">
              <Info size={20} className="text-text-muted" />
              <h3 className="font-poppins font-bold text-card text-text-heading">
                Incubator Details
              </h3>
            </div>
            <div className="space-y-6">
              <div className="space-y-1">
                <label className="font-poppins font-semibold text-caption text-text-muted">
                  About Organization
                </label>
                <textarea
                  name="about"
                  value={form.about}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-2 border border-border-subtle rounded-lg font-inter text-small text-text-body focus:outline-none focus:ring-1 focus:ring-brand-black transition-all bg-canvas-bg/30"
                />
              </div>

              <div className="space-y-2">
                <label className="font-poppins font-semibold text-caption text-text-muted">
                  Focus Industries
                </label>
                <div className="flex flex-wrap gap-2 items-center">
                  {industries.map((ind) => (
                    <span
                      key={ind}
                      className="px-3 py-1 bg-canvas-bg border border-border-subtle rounded-full font-inter text-xs text-text-body font-medium flex items-center gap-1.5"
                    >
                      {ind}
                      <button
                        type="button"
                        onClick={() => handleRemoveIndustry(ind)}
                        className="text-text-muted hover:text-text-heading focus:outline-none"
                      >
                        <X size={12} strokeWidth={2} />
                      </button>
                    </span>
                  ))}
                  
                  {addingIndustry ? (
                    <input
                      type="text"
                      autoFocus
                      value={industryDraft}
                      onChange={(e) => setIndustryDraft(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addIndustry())}
                      onBlur={addIndustry}
                      placeholder="Industry name..."
                      className="px-3 py-1 border border-border-subtle rounded-full font-inter text-xs text-text-body focus:outline-none focus:ring-1 focus:ring-brand-black w-32"
                    />
                  ) : (
                    <button
                      type="button"
                      onClick={() => setAddingIndustry(true)}
                      className="px-3 py-1 border border-dashed border-border-subtle hover:border-brand-black text-text-muted hover:text-text-heading rounded-full font-poppins font-semibold text-xs transition-colors flex items-center gap-1"
                    >
                      <Plus size={12} />
                      Add Industry
                    </button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className="font-poppins font-semibold text-caption text-text-muted">
                    Stages Supported
                  </label>
                  <select
                    name="stages"
                    value={form.stages}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-border-subtle rounded-lg font-inter text-small text-text-body focus:outline-none focus:ring-1 focus:ring-brand-black transition-all bg-canvas-bg/30"
                  >
                    <option>Pre-seed to Seed</option>
                    <option>Seed to Series A</option>
                    <option>Late Stage</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="font-poppins font-semibold text-caption text-text-muted">
                    Max Active Startups
                  </label>
                  <input
                    type="number"
                    name="maxStartups"
                    value={form.maxStartups}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-border-subtle rounded-lg font-inter text-small text-text-body focus:outline-none focus:ring-1 focus:ring-brand-black transition-all bg-canvas-bg/30"
                  />
                </div>
              </div>
            </div>
          </section>

          <section className="bg-surface-white border border-border-subtle rounded-xl p-6 shadow-card transition-colors duration-150 ease-linear">
            <div className="flex items-center gap-2 mb-6">
              <Calendar size={20} className="text-text-muted" />
              <h3 className="font-poppins font-bold text-card text-text-heading">
                Contact &amp; Availability
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="font-poppins font-semibold text-caption text-text-muted">
                  Meeting Preference
                </label>
                <select
                  name="meetingPreference"
                  value={form.meetingPreference}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-border-subtle rounded-lg font-inter text-small text-text-body focus:outline-none focus:ring-1 focus:ring-brand-black transition-all bg-canvas-bg/30"
                >
                  <option>Video Call (Remote)</option>
                  <option>In-person (On-site)</option>
                  <option>Hybrid</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="font-poppins font-semibold text-caption text-text-muted">
                  Primary Communication
                </label>
                <select
                  name="primaryComm"
                  value={form.primaryComm}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-border-subtle rounded-lg font-inter text-small text-text-body focus:outline-none focus:ring-1 focus:ring-brand-black transition-all bg-canvas-bg/30"
                >
                  <option>Email</option>
                  <option>Slack</option>
                  <option>Portal Messenger</option>
                </select>
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="font-poppins font-semibold text-caption text-text-muted">
                  Working Hours (PST)
                </label>
                <div className="flex flex-col sm:flex-row sm:items-center gap-6 p-4 bg-canvas-bg/40 border border-border-subtle rounded-lg">
                  <div className="flex flex-col gap-1.5 flex-grow">
                    <span className="font-poppins font-semibold text-[11px] leading-[16px] text-text-muted uppercase">
                      Days
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {[
                        { key: 'M', label: 'M' },
                        { key: 'T', label: 'T' },
                        { key: 'W', label: 'W' },
                        { key: 'T2', label: 'T' },
                        { key: 'F', label: 'F' },
                        { key: 'S', label: 'S' },
                        { key: 'S2', label: 'S' },
                      ].map(({ key, label }) => {
                        const isSet = workingDays[key];
                        return (
                          <button
                            key={key}
                            type="button"
                            onClick={() => handleToggleDay(key)}
                            className={`w-8 h-8 rounded border flex items-center justify-center font-poppins font-bold text-xs select-none transition-all active:scale-[0.98] ${
                              isSet
                                ? 'bg-brand-black text-white border-brand-black dark:bg-white dark:text-brand-black'
                                : 'bg-transparent text-text-muted border-border-subtle hover:bg-canvas-bg'
                            }`}
                          >
                            {label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  <div className="flex flex-col gap-1 flex-shrink-0">
                    <span className="font-poppins font-semibold text-[11px] leading-[16px] text-text-muted uppercase">
                      Time Range
                    </span>
                    <span className="font-inter text-small font-semibold text-text-heading">
                      09:00 AM - 05:30 PM
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="bg-surface-white border border-border-subtle rounded-xl p-6 shadow-card transition-colors duration-150 ease-linear">
            <div className="flex items-center gap-2 mb-6">
              <Lock size={20} className="text-text-muted" />
              <h3 className="font-poppins font-bold text-card text-text-heading">
                Account &amp; Privacy
              </h3>
            </div>
            <div className="divide-y divide-border-subtle">
              <div className="py-4">
                <button
                  type="button"
                  onClick={() => setPasswordOpen((v) => !v)}
                  className="w-full flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-left"
                >
                  <div>
                    <p className="font-poppins font-semibold text-small text-text-heading">
                      Password Security
                    </p>
                    <p className="font-inter text-small text-text-muted">
                      Last changed 4 months ago.
                    </p>
                  </div>
                  <span className="px-4 py-2 border border-border-subtle rounded-lg font-poppins font-semibold text-small hover:bg-canvas-bg flex items-center gap-1.5 shrink-0">
                    Update Password
                    <ChevronDown size={14} strokeWidth={2} className={`transition-transform ${passwordOpen ? 'rotate-180' : ''}`} />
                  </span>
                </button>
                {passwordOpen && (
                  <div className="mt-4 space-y-3 max-w-sm">
                    {passwordSuccess ? (
                      <p className="flex items-center gap-2 text-success font-inter text-small">
                        <CheckCircle size={16} strokeWidth={2} /> Password updated.
                      </p>
                    ) : (
                      <>
                        <input
                          type="password"
                          name="current"
                          value={passwordForm.current}
                          onChange={handlePasswordField}
                          placeholder="Current password"
                          className="w-full bg-canvas-bg border border-border-subtle rounded-md text-text-body font-inter text-small py-2.5 px-3 focus:outline-none focus:ring-1 focus:ring-brand-black"
                        />
                        <input
                          type="password"
                          name="next"
                          value={passwordForm.next}
                          onChange={handlePasswordField}
                          placeholder="New password"
                          className="w-full bg-canvas-bg border border-border-subtle rounded-md text-text-body font-inter text-small py-2.5 px-3 focus:outline-none focus:ring-1 focus:ring-brand-black"
                        />
                        <input
                          type="password"
                          name="confirm"
                          value={passwordForm.confirm}
                          onChange={handlePasswordField}
                          placeholder="Confirm new password"
                          className="w-full bg-canvas-bg border border-border-subtle rounded-md text-text-body font-inter text-small py-2.5 px-3 focus:outline-none focus:ring-1 focus:ring-brand-black"
                        />
                        {passwordError && <p className="text-error font-inter text-small">{passwordError}</p>}
                        <button
                          type="button"
                          onClick={handlePasswordSubmit}
                          className="bg-action-bg text-action-text px-5 py-2 rounded-md hover:opacity-90 active:scale-[0.98] transition-all font-poppins font-semibold text-small"
                        >
                          Update Password
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>

              <div className="py-4 flex items-center justify-between">
                <div>
                  <p className="font-poppins font-semibold text-small text-text-heading">
                    Email Notifications
                  </p>
                  <p className="font-inter text-small text-text-muted">
                    Receive alerts about new startup applications.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setEmailNotifications(!emailNotifications)}
                  className={`w-10 h-6 rounded-full relative transition-colors focus:outline-none ${
                    emailNotifications ? 'bg-brand-black dark:bg-white' : 'bg-border-subtle'
                  }`}
                >
                  <div
                    className={`w-4 h-4 bg-surface-white dark:bg-brand-black rounded-full absolute top-1 transition-all ${
                      emailNotifications ? 'right-1' : 'left-1'
                    }`}
                  />
                </button>
              </div>

              {deactivateRequested ? (
                <div className="py-4 flex items-center gap-2.5 text-warning font-inter text-small">
                  <AlertTriangle size={16} strokeWidth={2} /> Deactivation requested — our team will follow up by email.
                </div>
              ) : (
                <div className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <p className="font-poppins font-semibold text-small text-error">
                      Deactivate Account
                    </p>
                    <p className="font-inter text-small text-text-muted">
                      Temporarily disable your incubator profile.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setDeactivateOpen(true)}
                    className="text-error font-poppins font-bold text-small hover:underline cursor-pointer"
                  >
                    Deactivate
                  </button>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>

      <footer className="fixed bottom-0 right-0 left-0 lg:left-[var(--spacing-sidebar-width)] h-20 bg-surface-white border-t border-border-subtle flex items-center justify-between px-6 md:px-8 z-30 shadow-[0_-4px_12px_rgba(0,0,0,0.03)] transition-colors duration-150 ease-linear">
        <div>
          {saveSuccess && (
            <div className="flex items-center gap-2 text-success font-poppins font-semibold text-small animate-fade-in select-none">
              <CheckCircle size={18} />
              Changes saved
            </div>
          )}
        </div>
        <div className="flex gap-4">
          <button
            type="button"
            onClick={handleCancel}
            className="px-6 py-2.5 border border-border-subtle rounded-lg text-text-heading font-poppins font-semibold text-small hover:bg-canvas-bg transition-colors active:scale-[0.98]"
          >
            Cancel Changes
          </button>
          
          <button
            type="button"
            onClick={handleSave}
            className="px-6 py-2.5 bg-action-bg text-action-text rounded-lg font-poppins font-semibold text-small hover:opacity-90 active:scale-[0.98] transition-all flex items-center gap-1.5"
          >
            <span>Save Changes</span>
          </button>
        </div>
      </footer>

      <Modal isOpen={deactivateOpen} onClose={() => { setDeactivateOpen(false); setDeactivateConfirmText(''); }} title="Deactivate account">
        <p className="font-inter text-small text-text-body mb-4">
          This temporarily disables your incubator profile and hides it from applicants. Type <strong>DEACTIVATE</strong> to confirm.
        </p>
        <input
          type="text"
          value={deactivateConfirmText}
          onChange={(e) => setDeactivateConfirmText(e.target.value)}
          placeholder="DEACTIVATE"
          className="w-full bg-canvas-bg border border-border-subtle rounded-md text-text-body font-inter text-small py-2.5 px-3 mb-4 focus:outline-none focus:ring-1 focus:ring-error"
        />
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => { setDeactivateOpen(false); setDeactivateConfirmText(''); }}
            className="border border-border-subtle text-text-heading px-5 py-2 rounded-md hover:bg-canvas-bg transition-colors font-poppins font-semibold text-small"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDeactivateConfirm}
            disabled={deactivateConfirmText !== 'DEACTIVATE'}
            className="bg-error text-white px-5 py-2 rounded-md hover:opacity-90 active:scale-[0.98] transition-all font-poppins font-semibold text-small disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Deactivate Account
          </button>
        </div>
      </Modal>
    </IncubatorShell>
  );
}
