import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Zap, Lightbulb, Loader2 } from 'lucide-react';
import DashboardShell from '@/components/dashboard/DashboardShell';
import Button from '@/components/ui/Button';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { mentorshipApi } from '@/api/mentorshipApi';
import api from '@/api/axiosInstance';

const STAGE_OPTIONS = ['Ideation', 'Prototype / MVP', 'Early Traction', 'Scaling'];
const INDUSTRY_OPTIONS = ['SaaS / Enterprise Software', 'FinTech', 'HealthTech', 'CleanTech', 'EdTech'];
const MODE_OPTIONS = ['Video Call', 'Voice Call', 'In-person'];

export default function MentorshipRequestPage() {
  useDocumentTitle('Request Mentorship — BOCC');
  const navigate = useNavigate();
  const [requestStatus, setRequestStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkStatus() {
      try {
        const res = await mentorshipApi.getMentorshipRequestStatus();
        setRequestStatus(res?.data || null);
      } catch (err) {
        console.error('Failed to get request status', err);
      } finally {
        setLoading(false);
      }
    }
    checkStatus();
  }, []);


  const [form, setForm] = useState({
    startupName: '', stage: STAGE_OPTIONS[0], industry: INDUSTRY_OPTIONS[0],
    problem: '', whyMentor: '', helpNeeded: '', mode: MODE_OPTIONS[0], notes: '',
  });

  const update = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const canSubmit = form.startupName.trim().length > 0 && form.problem.trim().length > 0;

  const handleSubmit = () => {
    if (!canSubmit) return;
    setLoading(true);
    api.post('/request-meeting', { ...form, mentorId: 'm1' })
      .then(() => {
        navigate('/mentors/messages');
      })
      .catch(err => {
        console.error('Failed to request meeting:', err);
        setLoading(false);
      });
  };

  return (
    <DashboardShell pageId="mentorship-request">
      <div className="flex items-center gap-2 mb-2">
        <Link to="/mentors" className="p-1 -ml-1 text-text-muted hover:text-text-heading transition-colors">
          <ArrowLeft size={18} strokeWidth={2} />
        </Link>
        <nav className="font-inter text-small text-text-muted">
          Mentors / <span className="text-text-heading font-semibold">Request Mentorship</span>
        </nav>
      </div>

      <div className="mb-8">
        <h1 className="font-poppins font-semibold text-page text-text-heading mb-2">Request Mentorship</h1>
        <p className="font-inter text-body text-text-body">Fill out the details below to initiate a request with your selected mentor.</p>
        {!loading && requestStatus && requestStatus.status === 'pending' && (
          <div className="mt-4 p-4 bg-warning/10 border border-warning text-warning rounded-lg font-inter text-sm flex flex-col">
            <span className="font-semibold mb-1">You already have a pending request.</span>
            <span>Please wait for the mentor to respond before submitting a new request.</span>
          </div>
        )}
      </div>


      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-surface-white border border-border-subtle rounded-lg p-8 grid grid-cols-1 md:grid-cols-2 gap-5">
            <Input label="Startup Name" placeholder="e.g. EcoFlow Analytics" value={form.startupName} onChange={update('startupName')} />
            <SelectField label="Current Stage" value={form.stage} onChange={update('stage')} options={STAGE_OPTIONS} />
            <div className="md:col-span-2">
              <SelectField label="Industry" value={form.industry} onChange={update('industry')} options={INDUSTRY_OPTIONS} />
            </div>
            <div className="md:col-span-2 flex flex-col gap-1">
              <label className="text-caption font-medium text-text-heading font-inter">Problem Statement</label>
              <textarea rows={4} placeholder="Briefly describe the core problem your startup is solving..." value={form.problem} onChange={update('problem')} className="w-full rounded-md border border-border-subtle bg-surface-white text-sm text-text-body font-inter p-3 focus:outline-none focus:border-brand-black focus:ring-1 focus:ring-brand-black transition-all resize-none" />
            </div>
            <div className="md:col-span-2 flex flex-col gap-1">
              <label className="text-caption font-medium text-text-heading font-inter">Why this mentor?</label>
              <textarea rows={3} placeholder="Explain why you chose this specific mentor for your current challenges..." value={form.whyMentor} onChange={update('whyMentor')} className="w-full rounded-md border border-border-subtle bg-surface-white text-sm text-text-body font-inter p-3 focus:outline-none focus:border-brand-black focus:ring-1 focus:ring-brand-black transition-all resize-none" />
            </div>
            <div className="md:col-span-2 flex flex-col gap-1">
              <label className="text-caption font-medium text-text-heading font-inter">Help needed</label>
              <textarea rows={3} placeholder="What specific outcomes or advice are you looking for?" value={form.helpNeeded} onChange={update('helpNeeded')} className="w-full rounded-md border border-border-subtle bg-surface-white text-sm text-text-body font-inter p-3 focus:outline-none focus:border-brand-black focus:ring-1 focus:ring-brand-black transition-all resize-none" />
            </div>
            <div className="md:col-span-2 flex flex-col gap-2">
              <label className="text-caption font-medium text-text-heading font-inter">Preferred Meeting Mode</label>
              <div className="flex flex-wrap gap-4">
                {MODE_OPTIONS.map((m) => (
                  <label key={m} className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="mode" checked={form.mode === m} onChange={() => setForm((prev) => ({ ...prev, mode: m }))} className="w-4 h-4 text-brand-black focus:ring-brand-black" />
                    <span className="font-inter text-small text-text-body">{m}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="md:col-span-2">
              <Input label="Additional Notes (Optional)" placeholder="Anything else the mentor should know?" value={form.notes} onChange={update('notes')} />
            </div>
          </div>

          <div className="flex items-center justify-end gap-4">
            <Link to="/mentors" className="px-6 py-2.5 font-inter font-semibold text-small text-text-muted hover:text-text-heading transition-colors">
              Cancel
            </Link>
            <Button 
              onClick={handleSubmit} 
              disabled={!canSubmit || loading || (requestStatus && requestStatus.status === 'pending')}
            >
              {loading ? <Loader2 className="animate-spin" size={18} /> : 'Submit Request'}
            </Button>
          </div>

        </div>

        <div className="lg:col-span-4 space-y-6">
          <div className="bg-surface-white border border-border-subtle rounded-lg p-6">
            <h3 className="font-poppins font-semibold text-body text-text-heading mb-5">Selected Mentor</h3>
            <div className="flex items-center gap-4 mb-5">
              <div className="w-14 h-14 rounded-full bg-canvas-bg border border-border-subtle flex items-center justify-center font-poppins font-bold text-small text-text-muted shrink-0">SD</div>
              <div>
                <p className="font-poppins font-semibold text-small text-text-heading">Sarah Drasner</p>
                <p className="font-inter text-caption text-text-muted">VP of Product, TechScale</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <p className="font-inter text-caption text-text-muted uppercase tracking-wide mb-1">Expertise</p>
                <div className="flex flex-wrap gap-1">
                  {['Product Strategy', 'Scaling', 'UX'].map((t) => <span key={t} className="px-2 py-0.5 bg-canvas-bg rounded font-inter text-caption text-text-heading">{t}</span>)}
                </div>
              </div>
              <div className="flex items-center gap-2 font-inter text-small text-text-heading">
                <Calendar size={16} strokeWidth={2} className="text-text-heading shrink-0" /> Next: Tue, Oct 24
              </div>
              <div className="flex items-center gap-2 font-inter text-small text-text-heading">
                <Zap size={16} strokeWidth={2} className="text-text-heading shrink-0" /> High response rate (usually &lt; 24h)
              </div>
            </div>
            <p className="font-inter text-small text-text-muted italic pt-4 mt-4 border-t border-divider-line">
              "I'm passionate about helping early-stage founders find product-market fit and build sustainable design systems."
            </p>
          </div>

          <div className="bg-canvas-bg border border-border-subtle rounded-lg p-6">
            <div className="flex items-center gap-2 text-text-heading mb-2">
              <Lightbulb size={18} strokeWidth={2} />
              <span className="font-poppins font-semibold text-small">Pro Tip</span>
            </div>
            <p className="font-inter text-small text-text-muted">
              Be as specific as possible in your problem statement. Mentors are more likely to accept requests that have clear, actionable goals.
            </p>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}

function Input({ label, ...rest }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-caption font-medium text-text-heading font-inter">{label}</label>
      <input type="text" className="w-full rounded-md border border-border-subtle bg-surface-white text-sm text-text-body font-inter min-h-[44px] px-3 focus:outline-none focus:border-brand-black focus:ring-1 focus:ring-brand-black transition-all" {...rest} />
    </div>
  );
}

function SelectField({ label, options, ...rest }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-caption font-medium text-text-heading font-inter">{label}</label>
      <select className="w-full rounded-md border border-border-subtle bg-surface-white text-sm text-text-body font-inter min-h-[44px] px-3 focus:outline-none focus:border-brand-black focus:ring-1 focus:ring-brand-black transition-all" {...rest}>
        {options.map((o) => <option key={o}>{o}</option>)}
      </select>
    </div>
  );
}
