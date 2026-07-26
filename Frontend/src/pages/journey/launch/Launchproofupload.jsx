import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ChevronRight,
  Info,
  Upload,
  Camera,
  Film,
  Presentation,
  Image as ImageIcon,
  Newspaper,
  MessageCircle,
  Plus,
  Share2,
  FileText,
} from 'lucide-react';
import DashboardShell from '@/components/dashboard/DashboardShell';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import ComingSoon from '@/components/ui/ComingSoon';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

const LAUNCH_TYPES = ['Select option', 'Demo Day', 'College Event', 'Startup Expo', 'Incubator Showcase', 'Product Release', 'Online Launch', 'Other'];

const UPLOAD_CARDS = [
  { id: 'photos', title: 'Launch Photos', icon: Camera, desc: 'Official photography of the launch event.', formats: 'JPG, PNG • MAX 10MB' },
  { id: 'videos', title: 'Launch Videos', icon: Film, desc: 'Event recap or product launch trailer.', formats: 'MP4, MOV • MAX 50MB' },
  { id: 'stage', title: 'Stage Presentation', icon: Presentation, desc: 'Photos of the pitch/demo on stage.', formats: 'JPG, PDF • MAX 15MB' },
  { id: 'screenshots', title: 'Product Screenshots', icon: ImageIcon, desc: 'Live views of the UI at launch.', formats: 'PNG, JPG • MAX 5MB' },
  { id: 'coverage', title: 'Media Coverage', icon: Newspaper, desc: 'Clips from news or startup blogs.', formats: 'PDF, JPG • MAX 20MB' },
  { id: 'testimonials', title: 'Testimonials', icon: MessageCircle, desc: 'Customer feedback (Optional).', formats: 'ANY • MAX 5MB', optional: true },
];

const TEXTAREA_CLASS =
  'w-full rounded-md border border-border-subtle bg-surface-white text-sm text-text-body font-inter p-3 focus:outline-none focus:border-brand-black focus:ring-1 focus:ring-brand-black transition-all resize-none';

const SELECT_CLASS =
  'w-full rounded-md border border-border-subtle bg-surface-white text-sm text-text-body font-inter min-h-[44px] px-3 focus:outline-none focus:border-brand-black focus:ring-1 focus:ring-brand-black transition-all';

export default function LaunchProofUploadPage() {
  useDocumentTitle('Launch Insights — BOCC');
  const navigate = useNavigate();

  const [form, setForm] = useState({
    launchDate: '', launchType: LAUNCH_TYPES[0], venue: '', liveUrl: '',
    linkedin: '', instagram: '', twitter: '', youtube: '', website: '', notes: '',
  });

  const update = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = () => {
    // TODO(backend): submit launch evidence for verification.
    navigate('/build-startup/journey/launch/verification');
  };

  const handleSaveDraft = () => {
    // TODO(backend): persist as a draft against the student's account.
  };

  return (
    <DashboardShell pageId="launch-proof-upload">
      <nav className="mb-2 flex items-center gap-2 text-text-muted font-inter font-normal text-small">
        <Link to="/dashboard" className="hover:text-text-heading transition-colors">Dashboard</Link>
        <ChevronRight size={14} strokeWidth={2} />
        <Link to="/build-startup/journey/launch" className="hover:text-text-heading transition-colors">Stage 5 – Launch</Link>
        <ChevronRight size={14} strokeWidth={2} />
        <span className="text-text-heading font-semibold">Launch Insights</span>
      </nav>

      <div className="mb-10">
        <h1 className="font-poppins font-semibold text-page text-text-heading mb-2">Launch Insights</h1>
        <p className="font-inter text-body text-text-body">
          Upload insights showcasing your startup's official launch.
        </p>
      </div>

      <div className="space-y-10">

        <section>
          <div className="flex items-center gap-3 mb-6">
            <span className="w-8 h-8 rounded-full bg-brand-black text-white flex items-center justify-center font-poppins font-semibold text-caption">01</span>
            <h2 className="font-poppins font-semibold text-body text-text-heading">Launch Information</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-surface-white p-8 border border-border-subtle rounded-lg">
            <Input id="launchDate" label="Launch Date" type="date" value={form.launchDate} onChange={update('launchDate')} />
            <div className="flex flex-col gap-1">
              <label htmlFor="launchType" className="text-caption font-medium text-text-heading font-inter">Launch Type</label>
              <select id="launchType" value={form.launchType} onChange={update('launchType')} className={SELECT_CLASS}>
                {LAUNCH_TYPES.map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>
            <Input id="venue" label="Launch Venue (Optional)" placeholder="e.g. South Convention Hall" value={form.venue} onChange={update('venue')} />
            <Input id="liveUrl" label="Live Product URL" type="url" placeholder="https://yourstartup.com" value={form.liveUrl} onChange={update('liveUrl')} />
          </div>
        </section>

        <section>
          <div className="flex items-center gap-3 mb-6">
            <span className="w-8 h-8 rounded-full bg-brand-black text-white flex items-center justify-center font-poppins font-semibold text-caption">02</span>
            <h2 className="font-poppins font-semibold text-body text-text-heading">Upload Evidence</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {UPLOAD_CARDS.map(({ id, title, icon: Icon, desc, formats, optional }) => (
              <div
                key={id}
                className={`p-6 border rounded-lg bg-surface-white flex flex-col justify-between hover:border-brand-black transition-all group ${
                  optional ? 'border-dashed border-border-subtle' : 'border-border-subtle'
                }`}
              >
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <h3 className={`font-inter font-semibold text-[11px] uppercase tracking-widest ${optional ? 'text-text-muted' : 'text-text-heading'}`}>
                      {title}
                    </h3>
                    <Icon size={18} strokeWidth={2} className={optional ? 'text-text-muted' : 'text-text-muted group-hover:text-text-heading transition-colors'} />
                  </div>
                  <p className="font-inter text-caption text-text-muted mb-4">{desc}</p>
                </div>
                <div className="space-y-3">
                  <div className="text-[10px] text-text-muted font-inter">{formats}</div>
                  <ComingSoon label={title} position="top">
                    <div className="w-full border-2 border-dashed border-border-subtle py-4 rounded-lg text-text-muted flex flex-col items-center gap-1 hover:bg-canvas-bg transition-colors cursor-pointer">
                      {optional ? <Plus size={16} strokeWidth={2} /> : <Upload size={16} strokeWidth={2} />}
                      <span className="text-[10px] font-poppins font-semibold uppercase">{optional ? 'Optional' : 'Browse Files'}</span>
                    </div>
                  </ComingSoon>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <div className="flex items-center gap-3 mb-6">
            <Share2 size={18} strokeWidth={2} className="text-text-heading" />
            <span className="w-8 h-8 rounded-full bg-brand-black text-white flex items-center justify-center font-poppins font-semibold text-caption">03</span>
            <h2 className="font-poppins font-semibold text-body text-text-heading">Social Media Verification</h2>
          </div>
          <div className="space-y-4 bg-surface-white p-8 border border-border-subtle rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input id="linkedin" label="LinkedIn Launch Post" placeholder="https://linkedin.com/posts/..." value={form.linkedin} onChange={update('linkedin')} />
              <Input id="instagram" label="Instagram Post" placeholder="https://instagram.com/p/..." value={form.instagram} onChange={update('instagram')} />
              <Input id="twitter" label="Twitter / X Post" placeholder="https://x.com/status/..." value={form.twitter} onChange={update('twitter')} />
              <Input id="youtube" label="YouTube Demo" placeholder="https://youtube.com/watch?v=..." value={form.youtube} onChange={update('youtube')} />
            </div>
            <Input id="website" label="Official Website Announcement" placeholder="https://yourstartup.com/blog/launch" value={form.website} onChange={update('website')} />
          </div>
        </section>

        <section>
          <div className="flex items-center gap-3 mb-6">
            <FileText size={18} strokeWidth={2} className="text-text-heading" />
            <span className="w-8 h-8 rounded-full bg-brand-black text-white flex items-center justify-center font-poppins font-semibold text-caption">04</span>
            <h2 className="font-poppins font-semibold text-body text-text-heading">Additional Context</h2>
          </div>
          <div className="bg-surface-white p-8 border border-border-subtle rounded-lg">
            <textarea
              rows={5}
              placeholder="Describe any specific challenges, achievements, or notable attendees during the launch..."
              value={form.notes}
              onChange={update('notes')}
              className={TEXTAREA_CLASS}
            />
          </div>
        </section>

        <footer className="flex flex-col md:flex-row gap-4 pt-10 border-t border-divider-line pb-4">
          <Button variant="outline" fullWidth onClick={handleSaveDraft} className="uppercase tracking-widest">
            Save Draft
          </Button>
          <div className="md:flex-[2]">
            <Button fullWidth onClick={handleSubmit} className="uppercase tracking-widest">
              Submit Launch Evidence
            </Button>
          </div>
        </footer>
      </div>
    </DashboardShell>
  );
}