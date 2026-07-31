import { Link } from 'react-router-dom';
import {
  ChevronRight,
  Check,
  Hourglass,
  Lock,
  FolderArchive,
  FileText,
  Eye,
  Download,
  Star,
  Headset,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import DashboardShell from '@/components/dashboard/DashboardShell';
import Button from '@/components/ui/Button';
import ComingSoon from '@/components/ui/ComingSoon';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { getLaunchVerificationStatus, getLaunchVerificationFiles, getLaunchCertificate } from '@/api/startup/launchApi';

const STEPS = [
  { label: 'Launch Submitted', status: 'done' },
  { label: 'Under Review', status: 'current' },
  { label: 'Verified', status: 'upcoming' },
  { label: 'Journey Complete', status: 'upcoming' },
];

const SUMMARY = [
  { label: 'Launch Type', value: 'Demo Day' },
  { label: 'Launch Date', value: 'Oct 20, 2023' },
  { label: 'Venue', value: 'Main Campus Auditorium' },
  { label: 'Live URL', value: 'https://startup.bocc.edu', link: true },
];

const FILES = [
  { icon: FolderArchive, name: 'launch_photos.zip', meta: '42.5 MB • Photo Gallery' },
  { icon: FileText, name: 'pitch_deck_final.pdf', meta: '12.2 MB • Presentation' },
  { icon: FileText, name: 'press_release.docx', meta: '1.1 MB • Marketing Material' },
];

const UPCOMING = [
  { label: 'Incubation Graduation', date: 'Nov 15, 2023' },
  { label: 'Alumni Network Access', date: 'Post-verification' },
];

export default function LaunchVerificationReviewPage() {
  useDocumentTitle('Launch Verification — BOCC');

  const [statusData, setStatusData] = useState(null);
  const [filesData, setFilesData] = useState([]);
  const [certificate, setCertificate] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statusRes, filesRes, certRes] = await Promise.all([
          getLaunchVerificationStatus().catch(() => null),
          getLaunchVerificationFiles().catch(() => null),
          getLaunchCertificate().catch(() => null)
        ]);
        if (statusRes) setStatusData(statusRes);
        if (filesRes) setFilesData(filesRes.files || filesRes.data || []);
        if (certRes) setCertificate(certRes);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  const displayFiles = filesData.length > 0 ? filesData : FILES;
  const currentStatus = statusData?.status || 'PENDING';

  return (
    <DashboardShell pageId="launch-verification-review">
      <nav className="mb-2 flex items-center gap-2 text-text-muted font-inter font-normal text-small">
        <Link to="/dashboard" className="hover:text-text-heading transition-colors">Dashboard</Link>
        <ChevronRight size={14} strokeWidth={2} />
        <Link to="/build-startup/journey/launch" className="hover:text-text-heading transition-colors">Stage 5 – Launch</Link>
        <ChevronRight size={14} strokeWidth={2} />
        <span className="text-text-heading font-semibold">Verification</span>
      </nav>

      <div className="mb-8">
        <h1 className="font-poppins font-semibold text-page text-text-heading mb-2">Launch Verification</h1>
        <p className="font-inter text-body text-text-body">
          Your launch submission is currently being reviewed by the BOCC Admin team.
        </p>
      </div>

      <div className="mb-10 relative flex items-center justify-between px-4">
        <div className="absolute top-4 left-4 right-4 h-0.5 bg-border-subtle z-0" />
        {STEPS.map((step) => (
          <div key={step.label} className="relative z-10 flex flex-col items-center gap-2 bg-canvas-bg px-2">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step.status === 'done'
                  ? 'bg-brand-black text-white'
                  : step.status === 'current'
                  ? 'bg-surface-white border-4 border-brand-black'
                  : 'bg-surface-white border-2 border-border-subtle'
              }`}
            >
              {step.status === 'done' && <Check size={16} strokeWidth={2} />}
              {step.status === 'current' && <span className="w-2 h-2 rounded-full bg-brand-black animate-pulse" />}
            </div>
            <span
              className={`font-inter text-caption ${
                step.status === 'current' ? 'text-text-heading font-semibold' : step.status === 'done' ? 'text-text-heading' : 'text-text-muted'
              }`}
            >
              {step.label}
            </span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        <div className="lg:col-span-8 space-y-6">

          <div className="bg-surface-white border border-border-subtle rounded-lg p-6 space-y-6">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-inter text-caption uppercase tracking-widest text-text-muted">Current Status</span>
                  <span className="bg-canvas-bg px-2 py-0.5 rounded text-[10px] font-semibold border border-border-subtle">{currentStatus}</span>
                </div>
                <h3 className="font-poppins font-semibold text-card text-text-heading">{currentStatus === 'VERIFIED' ? 'Verified' : 'Pending Review'}</h3>
              </div>
              <Hourglass size={36} strokeWidth={1.5} className="text-text-muted" />
            </div>

            <div className="grid grid-cols-2 gap-6 p-4 bg-canvas-bg rounded-lg">
              <div className="flex flex-col">
                <span className="font-inter text-caption text-text-muted">Assigned Reviewer</span>
                <span className="font-inter font-semibold text-small text-text-heading">BOCC Administration Team</span>
              </div>
              <div className="flex flex-col">
                <span className="font-inter text-caption text-text-muted">Submission Date</span>
                <span className="font-inter font-semibold text-small text-text-heading">Oct 24, 2023</span>
              </div>
              <div className="flex flex-col">
                <span className="font-inter text-caption text-text-muted">Estimated Review Time</span>
                <span className="font-inter font-semibold text-small text-text-heading">3–5 Business Days</span>
              </div>
            </div>

            <div className="flex items-center gap-3 border border-border-subtle p-4 rounded-lg opacity-75">
              <Lock size={18} strokeWidth={2} className="text-text-muted" />
              <span className="font-inter text-small text-text-muted">
                Submission locked. Edits are disabled while verification is in progress.
              </span>
            </div>
          </div>

          <div className="bg-surface-white border border-border-subtle rounded-lg p-6">
            <h3 className="font-poppins font-semibold text-body text-text-heading mb-6">Submission Summary</h3>
            <div className="grid grid-cols-2 gap-y-8 gap-x-12">
              {SUMMARY.map(({ label, value, link }) => (
                <div key={label} className="flex flex-col gap-1">
                  <span className="font-inter text-caption text-text-muted">{label}</span>
                  <span className={`font-inter text-small border-b border-border-subtle pb-1 ${link ? 'text-brand-black underline' : 'text-text-heading'}`}>
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-surface-white border border-border-subtle rounded-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-poppins font-semibold text-body text-text-heading">Uploaded Files &amp; Evidence</h3>
              <span className="font-inter text-caption text-text-muted">{displayFiles.length} Files Uploaded</span>
            </div>
            <div className="border border-border-subtle rounded divide-y divide-border-subtle">
              {displayFiles.map((file, i) => {
                const name = file.name || file.filename || file.title || `File ${i+1}`;
                const meta = file.meta || file.size || 'Uploaded Document';
                const Icon = file.icon || FolderArchive;
                return (
                <div key={name} className="p-4 flex items-center justify-between hover:bg-canvas-bg transition-colors group">
                  <div className="flex items-center gap-4">
                    <Icon size={20} strokeWidth={2} className="text-text-muted" />
                    <div className="flex flex-col">
                      <span className="font-inter font-semibold text-small text-text-heading">{name}</span>
                      <span className="font-inter text-caption text-text-muted">{meta}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <ComingSoon label={`Preview ${name}`} position="left" inline>
                      <span className="p-2 border border-border-subtle rounded hover:bg-brand-black hover:text-white transition-all cursor-pointer inline-flex">
                        <Eye size={16} strokeWidth={2} />
                      </span>
                    </ComingSoon>
                    <ComingSoon label={`Download ${name}`} position="left" inline>
                      <span className="p-2 border border-border-subtle rounded hover:bg-brand-black hover:text-white transition-all cursor-pointer inline-flex">
                        <Download size={16} strokeWidth={2} />
                      </span>
                    </ComingSoon>
                  </div>
                </div>
              )})}
            </div>
          </div>
          
          {certificate && (
            <div className="bg-surface-white border border-border-subtle rounded-lg p-6 mt-6 bg-green-50">
              <h3 className="font-poppins font-semibold text-body text-green-800 mb-4">Launch Certificate Awarded!</h3>
              <p className="font-inter text-small text-green-700 mb-4">Congratulations, your launch is verified and you have completed the journey.</p>
              <div className="flex gap-4">
                <Button variant="outline" onClick={() => window.open(certificate.url || '#', '_blank')}>View Certificate</Button>
                <Button onClick={() => window.open(certificate.downloadUrl || '#', '_blank')}>Download</Button>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between py-4">
            <ComingSoon label="View Submission Full Details" position="top" inline>
              <span className="inline-flex items-center min-h-[44px] px-6 rounded-md border border-border-subtle text-text-heading font-poppins font-semibold text-small cursor-pointer hover:bg-canvas-bg transition-colors">
                View Submission Full Details
              </span>
            </ComingSoon>
            <Link to="/dashboard">
              <Button>Return to Dashboard</Button>
            </Link>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6">

          <div className="bg-surface-white border border-border-subtle rounded-lg p-6">
            <h4 className="font-poppins font-semibold text-body text-text-heading mb-4">Program Progress</h4>
            <div className="space-y-4">
              <div className="w-full h-2 bg-canvas-bg rounded-full overflow-hidden">
                <div className="h-full bg-brand-black" style={{ width: '85%' }} />
              </div>
              <div className="flex justify-between font-inter text-caption">
                <span className="text-text-muted">Overall Completion</span>
                <span className="font-semibold text-text-heading">85%</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-canvas-bg rounded border border-border-subtle">
                <Star size={18} strokeWidth={2} className="text-text-heading" />
                <span className="font-inter text-small text-text-body">Final Milestone: Launch Success</span>
              </div>
            </div>
          </div>

          <div className="bg-surface-white border border-border-subtle rounded-lg p-6">
            <h4 className="font-poppins font-semibold text-body text-text-heading mb-4">Upcoming</h4>
            <div className="space-y-4">
              {UPCOMING.map(({ label, date }) => (
                <div key={label} className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-border-subtle mt-2 shrink-0" />
                  <div>
                    <p className="font-inter font-semibold text-small text-text-heading">{label}</p>
                    <p className="font-inter text-caption text-text-muted">{date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-brand-black text-white rounded-lg p-6 flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <Headset size={18} strokeWidth={2} />
              <h4 className="font-poppins font-semibold text-body">Verification Support</h4>
            </div>
            <p className="font-inter text-small opacity-80">
              Having trouble or need to expedite your review? Contact the administration desk.
            </p>
            <div className="flex flex-col gap-2 mt-2">
              <ComingSoon label="Contact Admin" position="left" inline>
                <span className="w-full block text-center py-2 bg-white text-brand-black font-poppins font-semibold rounded hover:opacity-90 transition-colors cursor-pointer">
                  Contact Admin
                </span>
              </ComingSoon>
              <ComingSoon label="View FAQ" position="left" inline>
                <span className="w-full block text-center py-2 border border-white/30 text-white font-poppins font-semibold rounded hover:bg-white/10 transition-colors cursor-pointer">
                  View FAQ
                </span>
              </ComingSoon>
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
