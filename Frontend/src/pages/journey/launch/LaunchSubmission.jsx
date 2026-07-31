import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ChevronRight,
  Info,
  Link2,
  FileText,
  Share2,
  Send,
  Globe,
  Camera,
  X as XIcon,
  PlayCircle,
  CheckCircle2,
  Radio,
  CircleDashed,
  Lightbulb,
} from 'lucide-react';
import DashboardShell from '@/components/dashboard/DashboardShell';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { useIncubation } from '@/hooks/useIncubation';

const INDUSTRIES = ['Select Industry', 'Fintech', 'Healthtech', 'SaaS', 'EdTech'];
const FUNDING = ['Select Status', 'Bootstrapped', 'Pre-seed', 'Seed', 'Series A+'];

const TEXTAREA_CLASS =
  'w-full rounded-md border border-border-subtle bg-surface-white text-sm text-text-body font-inter p-3 focus:outline-none focus:border-brand-black focus:ring-1 focus:ring-brand-black transition-all resize-none';

const SELECT_CLASS =
  'w-full rounded-md border border-border-subtle bg-surface-white text-sm text-text-body font-inter min-h-[44px] px-3 focus:outline-none focus:border-brand-black focus:ring-1 focus:ring-brand-black transition-all';

const CHECKLIST = [
  { label: 'Program Benchmarks', desc: 'Completed in Stage 4', status: 'done' },
  { label: 'Launch Form', desc: 'Currently filling final details', status: 'current' },
  { label: 'Graduation Review', desc: 'Unlocks after submission', status: 'upcoming' },
];

const READINESS = [
  { label: 'Market Validation', done: true },
  { label: 'Financial Projections', done: true },
  { label: 'Product Demo', done: false },
];

export default function LaunchSubmissionPage() {
  useDocumentTitle('Launch Submission — BOCC');
  const navigate = useNavigate();

  const [form, setForm] = useState({
    startupName: '', productName: '', launchDate: '', industry: INDUSTRIES[0],
    teamSize: '', funding: FUNDING[0], websiteUrl: '', liveUrl: '', storeLink: '',
    demoUrl: '', description: '', notes: '', linkedin: '', instagram: '', twitter: '', youtube: '',
  });

  const update = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const { submitLaunch, saveLaunchDraft, fetchLaunchSubmission, launchSubmission, isLoading: isContextLoading } = useIncubation();
  const [toastMsg, setToastMsg] = useState({ type: '', text: '' });

  // Fetch draft data on mount
  useEffect(() => {
    fetchLaunchSubmission();
  }, [fetchLaunchSubmission]);

  // Sync draft data into form when it loads
  useEffect(() => {
    if (launchSubmission) {
      setForm({
        startupName: launchSubmission.startup_name || '',
        productName: launchSubmission.product_name || '',
        launchDate: launchSubmission.launch_date ? launchSubmission.launch_date.split('T')[0] : '',
        industry: launchSubmission.industry || INDUSTRIES[0],
        fundingStatus: launchSubmission.funding_status || FUNDING[0],
        demoLink: launchSubmission.demo_link || '',
        socials: {
          twitter: launchSubmission.social?.twitter || '',
          linkedin: launchSubmission.social?.linkedin || '',
        }
      });
    }
  }, [launchSubmission]);

  const isSavingDraft = isContextLoading;
  const isSubmitting = isContextLoading;

  const handleSubmit = async () => {
    setToastMsg({ type: '', text: '' });
    try {
      await submitLaunch(form);
      navigate('/build-startup/journey/launch/pitch-deck');
    } catch (err) {
      setToastMsg({ type: 'error', text: err.message || 'Submission failed' });
    }
  };

  const handleSaveDraft = async () => {
    setToastMsg({ type: '', text: '' });
    try {
      await saveLaunchDraft(form);
      setToastMsg({ type: 'success', text: 'Draft Saved' });
      setTimeout(() => setToastMsg({ type: '', text: '' }), 3000);
    } catch (err) {
      setToastMsg({ type: 'error', text: err.message || 'Failed to save draft' });
    }
  };

  return (
    <DashboardShell pageId="launch-submission">
      <nav className="mb-2 flex items-center gap-2 text-text-muted font-inter font-normal text-small">
        <Link to="/dashboard" className="hover:text-text-heading transition-colors">Dashboard</Link>
        <ChevronRight size={14} strokeWidth={2} />
        <Link to="/build-startup/journey/launch" className="hover:text-text-heading transition-colors">Stage 5 – Launch</Link>
        <ChevronRight size={14} strokeWidth={2} />
        <span className="text-text-heading font-semibold">Launch Submission</span>
      </nav>

      <div className="mb-10">
        <h1 className="font-poppins font-semibold text-page text-text-heading mb-2">Launch Submission</h1>
        <p className="font-inter text-body text-text-body max-w-2xl">
          Please provide the final details of your startup launch for graduation review.
          Ensure all links are active and descriptions are comprehensive.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        <div className="lg:col-span-8 space-y-6">

          <section className="bg-surface-white border border-border-subtle rounded-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <Info size={20} strokeWidth={2} className="text-text-heading" />
              <h3 className="font-poppins font-semibold text-body text-text-heading">General Information</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Input id="startupName" label="Startup Name" placeholder="e.g. Acme Corp" value={form.startupName} onChange={update('startupName')} />
              <Input id="productName" label="Product Name" placeholder="e.g. Acme Dash" value={form.productName} onChange={update('productName')} />
              <Input id="launchDate" label="Launch Date" type="date" value={form.launchDate} onChange={update('launchDate')} />
              <div className="flex flex-col gap-1">
                <label htmlFor="industry" className="text-caption font-medium text-text-heading font-inter">Industry</label>
                <select id="industry" value={form.industry} onChange={update('industry')} className={SELECT_CLASS}>
                  {INDUSTRIES.map((i) => <option key={i}>{i}</option>)}
                </select>
              </div>
              <Input id="teamSize" label="Current Team Size" type="number" placeholder="0" value={form.teamSize} onChange={update('teamSize')} />
              <div className="flex flex-col gap-1">
                <label htmlFor="funding" className="text-caption font-medium text-text-heading font-inter">Funding Status (Optional)</label>
                <select id="funding" value={form.funding} onChange={update('funding')} className={SELECT_CLASS}>
                  {FUNDING.map((f) => <option key={f}>{f}</option>)}
                </select>
              </div>
            </div>
          </section>

          <section className="bg-surface-white border border-border-subtle rounded-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <Link2 size={20} strokeWidth={2} className="text-text-heading" />
              <h3 className="font-poppins font-semibold text-body text-text-heading">Product &amp; Demo Links</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Input id="websiteUrl" label="Website URL" placeholder="https://..." value={form.websiteUrl} onChange={update('websiteUrl')} />
              <Input id="liveUrl" label="Live Product URL" placeholder="app...." value={form.liveUrl} onChange={update('liveUrl')} />
              <Input id="storeLink" label="App Store / Play Store Link" placeholder="Link to mobile app" value={form.storeLink} onChange={update('storeLink')} />
              <Input id="demoUrl" label="Demo Video URL" placeholder="YouTube, Loom, or Vimeo link" value={form.demoUrl} onChange={update('demoUrl')} />
            </div>
          </section>

          <section className="bg-surface-white border border-border-subtle rounded-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <FileText size={20} strokeWidth={2} className="text-text-heading" />
              <h3 className="font-poppins font-semibold text-body text-text-heading">Descriptions</h3>
            </div>
            <div className="space-y-5">
              <div className="flex flex-col gap-1">
                <label htmlFor="description" className="text-caption font-medium text-text-heading font-inter">Startup Description</label>
                <textarea id="description" rows={4} placeholder="What problem are you solving and how? Max 500 characters." value={form.description} onChange={update('description')} className={TEXTAREA_CLASS} />
              </div>
              <div className="flex flex-col gap-1">
                <label htmlFor="notes" className="text-caption font-medium text-text-heading font-inter">Additional Notes</label>
                <textarea id="notes" rows={3} placeholder="Any specific instructions for the graduation committee?" value={form.notes} onChange={update('notes')} className={TEXTAREA_CLASS} />
              </div>
            </div>
          </section>

          <section className="bg-surface-white border border-border-subtle rounded-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <Share2 size={20} strokeWidth={2} className="text-text-heading" />
              <h3 className="font-poppins font-semibold text-body text-text-heading">Social Media Presence</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="flex flex-col gap-1">
                <label htmlFor="linkedin" className="text-caption font-medium text-text-heading font-inter">LinkedIn</label>
                <div className="relative">
                  <Globe size={16} strokeWidth={2} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                  <input id="linkedin" value={form.linkedin} onChange={update('linkedin')} placeholder="linkedin.com/company/..." className="w-full rounded-md border border-border-subtle bg-surface-white text-sm text-text-body font-inter min-h-[44px] pl-10 pr-3 focus:outline-none focus:border-brand-black focus:ring-1 focus:ring-brand-black transition-all" />
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <label htmlFor="instagram" className="text-caption font-medium text-text-heading font-inter">Instagram</label>
                <div className="relative">
                  <Camera size={16} strokeWidth={2} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                  <input id="instagram" value={form.instagram} onChange={update('instagram')} placeholder="@handle" className="w-full rounded-md border border-border-subtle bg-surface-white text-sm text-text-body font-inter min-h-[44px] pl-10 pr-3 focus:outline-none focus:border-brand-black focus:ring-1 focus:ring-brand-black transition-all" />
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <label htmlFor="twitter" className="text-caption font-medium text-text-heading font-inter">Twitter/X</label>
                <div className="relative">
                  <XIcon size={16} strokeWidth={2} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                  <input id="twitter" value={form.twitter} onChange={update('twitter')} placeholder="@handle" className="w-full rounded-md border border-border-subtle bg-surface-white text-sm text-text-body font-inter min-h-[44px] pl-10 pr-3 focus:outline-none focus:border-brand-black focus:ring-1 focus:ring-brand-black transition-all" />
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <label htmlFor="youtube" className="text-caption font-medium text-text-heading font-inter">YouTube</label>
                <div className="relative">
                  <PlayCircle size={16} strokeWidth={2} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                  <input id="youtube" value={form.youtube} onChange={update('youtube')} placeholder="youtube.com/@channel" className="w-full rounded-md border border-border-subtle bg-surface-white text-sm text-text-body font-inter min-h-[44px] pl-10 pr-3 focus:outline-none focus:border-brand-black focus:ring-1 focus:ring-brand-black transition-all" />
                </div>
              </div>
            </div>
          </section>

          <div className="flex items-center gap-4 py-6 border-t border-divider-line">
            <Button onClick={handleSubmit} disabled={isSubmitting || isSavingDraft}>
              {isSubmitting ? 'Submitting...' : 'Submit Launch Details'}
              {!isSubmitting && <Send size={16} strokeWidth={2} />}
            </Button>
            <Button variant="outline" onClick={handleSaveDraft} disabled={isSubmitting || isSavingDraft}>
              {isSavingDraft ? 'Saving...' : 'Save Draft'}
            </Button>
            {toastMsg.text && (
              <span className={`text-sm font-medium ${toastMsg.type === 'error' ? 'text-red-500' : 'text-green-600'}`}>
                {toastMsg.text}
              </span>
            )}
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6">

          <div className="bg-canvas-bg border border-border-subtle rounded-lg p-6">
            <h4 className="font-inter font-semibold text-caption text-text-muted uppercase tracking-widest mb-4">
              Submission Progress
            </h4>
            <div className="flex items-center justify-between mb-2">
              <span className="font-poppins font-semibold text-small text-text-heading">Launch Submission</span>
              <span className="px-2 py-1 bg-brand-black text-white rounded text-[10px] font-inter font-semibold uppercase">In Progress</span>
            </div>
            <div className="w-full bg-surface-white h-2 rounded-full overflow-hidden mb-3">
              <div className="bg-brand-black h-full rounded-full transition-all" style={{ width: '45%' }} />
            </div>
            <p className="font-inter text-caption text-text-muted">
              8 of 14 fields completed. Fill in all required fields to enable the submission button.
            </p>
          </div>

          <div className="bg-surface-white border border-border-subtle rounded-lg p-6">
            <h4 className="font-inter font-semibold text-caption text-text-muted uppercase tracking-widest mb-6">Final Checklist</h4>
            <ul className="space-y-5">
              {CHECKLIST.map(({ label, desc, status }) => (
                <li key={label} className={`flex items-start gap-3 ${status === 'upcoming' ? 'opacity-40' : ''}`}>
                  {status === 'done' && <CheckCircle2 size={20} strokeWidth={2} className="text-text-heading shrink-0" />}
                  {status === 'current' && <Radio size={20} strokeWidth={2} className="text-text-heading shrink-0" />}
                  {status === 'upcoming' && <CircleDashed size={20} strokeWidth={2} className="text-text-muted shrink-0" />}
                  <div>
                    <p className="font-poppins font-semibold text-small text-text-heading">{label}</p>
                    <p className="font-inter text-caption text-text-muted">{desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-surface-white border border-dashed border-border-subtle rounded-lg p-6">
            <div className="flex items-center gap-2 mb-3 text-text-muted">
              <Lightbulb size={18} strokeWidth={2} />
              <h4 className="font-inter font-semibold text-caption uppercase tracking-wider">Expert Tip</h4>
            </div>
            <p className="font-inter text-small text-text-muted italic">
              "The graduation committee values clarity over jargon. Make your demo video short
              (under 3 mins) and ensure your links are accessible to external reviewers."
            </p>
          </div>

          <div className="bg-surface-white border border-border-subtle rounded-lg p-6">
            <h4 className="font-inter font-semibold text-caption text-text-muted uppercase tracking-widest mb-4">
              Launch Readiness
            </h4>
            <div className="space-y-3">
              {READINESS.map(({ label, done }) => (
                <div key={label} className="flex justify-between items-center font-inter text-small">
                  <span className="text-text-muted">{label}</span>
                  {done ? (
                    <CheckCircle2 size={16} strokeWidth={2} className="text-text-heading" />
                  ) : (
                    <span className="w-2 h-2 rounded-full bg-border-subtle" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
