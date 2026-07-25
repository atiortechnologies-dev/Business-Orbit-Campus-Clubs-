import { useRef, useState } from 'react';
import { Camera, ChevronRight, CheckCircle2 } from 'lucide-react';
import MentorShell from '@/components/mentor/MentorShell';
import ComingSoon from '@/components/ui/ComingSoon';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

const STARTUP_STAGES = ['Idea', 'Validation', 'MVP', 'Traction', 'Launch'];

const ACCOUNT_SETTINGS = [
  { label: 'Change Password', desc: 'Update your login credentials' },
  { label: 'Notification Settings', desc: 'Manage email and push notification alerts' },
  { label: 'Privacy & Security', desc: 'Profile visibility and data usage controls' },
  { label: 'Deactivate Account', desc: 'Temporarily disable your profile or close account' },
];

export default function MentorProfilePage() {
  useDocumentTitle('Mentor Profile — BOCC');
  const photoInputRef = useRef(null);
  const [photoPreview, setPhotoPreview] = useState(null);

  const [fullName, setFullName] = useState('Priya Anand');
  const [phone, setPhone] = useState('+1 (555) 000-0000');
  const [location, setLocation] = useState('San Francisco, CA');
  const email = 'priya.anand@techstars.com';

  const [company, setCompany] = useState('Techstars');
  const [jobTitle, setJobTitle] = useState('Senior Mentor');
  const [industry, setIndustry] = useState('SaaS');
  const [yearsExperience, setYearsExperience] = useState('12');
  const [expertise, setExpertise] = useState(['Product Strategy', 'Growth', 'Fundraising']);
  const [expertiseInput, setExpertiseInput] = useState('');
  const [startupDomains, setStartupDomains] = useState('FinTech, HealthTech, AI/ML');
  const [bio, setBio] = useState('Seasoned SaaS product leader with over 12 years of experience building and scaling early-stage teams.');

  const [stages, setStages] = useState(['Idea', 'Validation', 'MVP', 'Traction']);
  const [preferredIndustries, setPreferredIndustries] = useState('Enterprise SaaS, B2B Marketplaces');
  const [maxMentees, setMaxMentees] = useState('5');
  const [weeklyAvailability, setWeeklyAvailability] = useState('2-4 hours / week');
  const [meetingPreference, setMeetingPreference] = useState('Hybrid');

  const [saved, setSaved] = useState(false);

  const profileCompletion = 88;

  const addExpertise = (e) => {
    if (e.key !== 'Enter' || !expertiseInput.trim()) return;
    e.preventDefault();
    setExpertise((prev) => [...prev, expertiseInput.trim()]);
    setExpertiseInput('');
  };
  const removeExpertise = (index) => setExpertise((prev) => prev.filter((_, i) => i !== index));
  const toggleStage = (stage) =>
    setStages((prev) => (prev.includes(stage) ? prev.filter((s) => s !== stage) : [...prev, stage]));

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoPreview(URL.createObjectURL(file));
  };

  const handleSaveChanges = () => {
    // TODO(backend): persist the full profile form to the mentor's record.
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <MentorShell>
      <div className="mb-8">
        <h1 className="font-poppins font-bold text-section text-text-heading mb-1">Mentor Profile</h1>
        <p className="font-inter text-body text-text-muted">Manage your professional information and mentorship settings.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4 bg-surface-white border border-border-subtle rounded-xl shadow-card p-6 h-fit">
          <div className="flex flex-col items-center text-center">
            <div className="w-20 h-20 rounded-full bg-canvas-bg border border-border-subtle overflow-hidden mb-3">
              {photoPreview && <img src={photoPreview} alt="" className="w-full h-full object-cover" />}
            </div>
            <p className="font-poppins font-semibold text-card text-text-heading">{fullName}</p>
            <p className="font-inter text-small text-text-muted">{jobTitle}</p>
            <div className="flex gap-2 mt-3">
              <span className="font-inter text-caption font-medium bg-canvas-bg border border-border-subtle px-2.5 py-1 rounded-full">{company}</span>
              <span className="font-inter text-caption font-medium bg-canvas-bg border border-border-subtle px-2.5 py-1 rounded-full">{industry}</span>
            </div>
            <p className="font-inter text-caption text-text-muted mt-2">{yearsExperience} years exp.</p>

            <div className="w-full mt-5">
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-inter text-caption font-semibold uppercase tracking-wider text-text-muted">Profile Completion</span>
                <span className="font-inter text-caption font-semibold text-text-heading">{profileCompletion}%</span>
              </div>
              <div className="w-full bg-border-subtle h-1.5 rounded-full overflow-hidden">
                <div className="bg-brand-black h-full rounded-full" style={{ width: `${profileCompletion}%` }} />
              </div>
            </div>

            <input ref={photoInputRef} type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
            <button
              type="button"
              onClick={() => photoInputRef.current?.click()}
              className="w-full mt-5 inline-flex items-center justify-center gap-2 border border-border-subtle text-text-heading font-inter font-medium text-small px-4 py-2.5 rounded-md hover:bg-canvas-bg transition-colors"
            >
              <Camera size={16} strokeWidth={2} />
              Change Photo
            </button>
            <ComingSoon label="Preview Public Profile" position="top" inline={false} className="w-full mt-2 flex items-center justify-center border border-border-subtle text-text-heading font-inter font-medium text-small px-4 py-2.5 rounded-md">
              Preview Public Profile
            </ComingSoon>

            <p className="flex items-center gap-1.5 font-inter text-caption font-medium text-success mt-4">
              <CheckCircle2 size={14} strokeWidth={2} />
              Verified Mentor Status
            </p>

            <div className="w-full mt-5 text-left">
              <p className="font-inter text-caption font-semibold uppercase tracking-wider text-text-muted mb-2">Expertise Highlights</p>
              <div className="flex flex-wrap gap-2">
                {expertise.slice(0, 3).map((item) => (
                  <span key={item} className="font-inter text-caption bg-accent-neon/15 text-text-heading px-2.5 py-1 rounded-full">{item}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-8 flex flex-col gap-6">
          <div className="bg-surface-white border border-border-subtle rounded-xl shadow-card p-6">
            <h2 className="font-poppins font-semibold text-card text-text-heading mb-4">Personal Information</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Full Name" value={fullName} onChange={setFullName} />
              <Field label="Email (Read Only)" value={email} disabled />
              <Field label="Phone Number" value={phone} onChange={setPhone} />
              <Field label="Location" value={location} onChange={setLocation} />
            </div>
          </div>

          <div className="bg-surface-white border border-border-subtle rounded-xl shadow-card p-6">
            <h2 className="font-poppins font-semibold text-card text-text-heading mb-4">Professional Information</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <Field label="Current Company" value={company} onChange={setCompany} />
              <Field label="Job Title" value={jobTitle} onChange={setJobTitle} />
              <Field label="Industry" value={industry} onChange={setIndustry} />
              <Field label="Years of Experience" value={yearsExperience} onChange={setYearsExperience} />
            </div>

            <div className="mb-4">
              <label className="font-inter font-medium text-caption uppercase tracking-wider text-text-muted mb-1.5 block">Areas of Expertise</label>
              <div className="flex flex-wrap items-center gap-2 bg-canvas-bg border border-border-subtle rounded-md p-2">
                {expertise.map((item, i) => (
                  <span key={item} className="inline-flex items-center gap-1 font-inter text-caption bg-surface-white border border-border-subtle rounded-full px-2.5 py-1">
                    {item}
                    <button type="button" onClick={() => removeExpertise(i)} className="text-text-muted hover:text-text-heading">×</button>
                  </span>
                ))}
                <input
                  type="text"
                  value={expertiseInput}
                  onChange={(e) => setExpertiseInput(e.target.value)}
                  onKeyDown={addExpertise}
                  placeholder="Add skill"
                  className="flex-1 min-w-[120px] bg-transparent font-inter text-small focus:outline-none px-1"
                />
              </div>
            </div>

            <div className="mb-4">
              <Field label="Startup Domains" value={startupDomains} onChange={setStartupDomains} />
            </div>

            <div>
              <label className="font-inter font-medium text-caption uppercase tracking-wider text-text-muted mb-1.5 block">Professional Bio</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={4}
                className="w-full bg-canvas-bg border border-border-subtle rounded-md p-3 font-inter text-small text-text-body focus:outline-none focus:ring-1 focus:ring-brand-black transition-all resize-none"
              />
            </div>
          </div>

          <div className="bg-surface-white border border-border-subtle rounded-xl shadow-card p-6">
            <h2 className="font-poppins font-semibold text-card text-text-heading mb-4">Mentorship Preferences</h2>

            <div className="mb-4">
              <label className="font-inter font-medium text-caption uppercase tracking-wider text-text-muted mb-2 block">Ideal Startup Stages</label>
              <div className="flex flex-wrap gap-4">
                {STARTUP_STAGES.map((stage) => (
                  <label key={stage} className="inline-flex items-center gap-2 font-inter text-small text-text-body cursor-pointer">
                    <input type="checkbox" checked={stages.includes(stage)} onChange={() => toggleStage(stage)} className="accent-brand-black" />
                    {stage}
                  </label>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <Field label="Preferred Industries" value={preferredIndustries} onChange={setPreferredIndustries} />
              <Field label="Max Mentees" value={maxMentees} onChange={setMaxMentees} />
              <Field label="Weekly Availability" value={weeklyAvailability} onChange={setWeeklyAvailability} />
              <div>
                <label className="font-inter font-medium text-caption uppercase tracking-wider text-text-muted mb-1.5 block">Meeting Preference</label>
                <select
                  value={meetingPreference}
                  onChange={(e) => setMeetingPreference(e.target.value)}
                  className="w-full bg-canvas-bg border border-border-subtle rounded-md px-3 py-2.5 font-inter text-small text-text-body focus:outline-none focus:ring-1 focus:ring-brand-black transition-all"
                >
                  <option value="Online">Online</option>
                  <option value="In-Person">In-Person</option>
                  <option value="Hybrid">Hybrid</option>
                </select>
              </div>
            </div>
          </div>

          <div className="bg-surface-white border border-border-subtle rounded-xl shadow-card p-6">
            <h2 className="font-poppins font-semibold text-card text-text-heading mb-4">Account Settings</h2>
            <div className="flex flex-col divide-y divide-border-subtle">
              {ACCOUNT_SETTINGS.map((item) => (
                <ComingSoon key={item.label} label={item.label} position="top" inline={false} className="flex items-center justify-between py-3">
                  <div className="text-left">
                    <p className="font-poppins font-semibold text-small text-text-heading">{item.label}</p>
                    <p className="font-inter text-caption text-text-muted">{item.desc}</p>
                  </div>
                  <ChevronRight size={16} strokeWidth={2} className="text-text-muted shrink-0" />
                </ComingSoon>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3">
            <span
              className={`font-inter text-small text-success transition-opacity duration-150 ${saved ? 'opacity-100' : 'opacity-0'}`}
              aria-live="polite"
            >
              Saved
            </span>
            <button type="button" className="border border-border-subtle text-text-heading font-inter font-medium text-small px-5 py-2.5 rounded-md hover:bg-canvas-bg transition-colors">
              Cancel
            </button>
            <button type="button" onClick={handleSaveChanges} className="bg-action-bg text-action-text font-poppins font-semibold text-small px-5 py-2.5 rounded-md hover:opacity-90 transition-all">
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </MentorShell>
  );
}

function Field({ label, value, onChange, disabled = false }) {
  return (
    <div>
      <label className="font-inter font-medium text-caption uppercase tracking-wider text-text-muted mb-1.5 block">{label}</label>
      <input
        type="text"
        value={value}
        disabled={disabled}
        onChange={onChange ? (e) => onChange(e.target.value) : undefined}
        className="w-full bg-canvas-bg border border-border-subtle rounded-md px-3 py-2.5 font-inter text-small text-text-body focus:outline-none focus:ring-1 focus:ring-brand-black transition-all disabled:text-text-muted disabled:cursor-not-allowed"
      />
    </div>
  );
}
