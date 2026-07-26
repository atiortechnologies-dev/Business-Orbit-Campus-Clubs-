import { Link } from 'react-router-dom';
import {
  Award,
  Rocket,
  GraduationCap,
  ShieldCheck,
  Users,
  Network,
  CalendarCheck,
  FileText,
  Download,
  Share2,
  ExternalLink,
  ArrowRight,
} from 'lucide-react';
import DashboardShell from '@/components/dashboard/DashboardShell';
import ComingSoon from '@/components/ui/ComingSoon';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

const CERTIFICATE = {
  founderName: 'Alex Rivera',
  startupName: 'Nexus Dynamics Ltd.',
  completionDate: 'November 14, 2023',
  certificateId: 'BOCC-2023-99821-X',
};

const MILESTONES = [
  { icon: Rocket, title: 'Startup Successfully Launched', desc: 'Market-ready product deployed with initial user validation.' },
  { icon: GraduationCap, title: 'BOCC Graduate', desc: 'Completed all 5 stages of the Venture Program roadmap.' },
  { icon: ShieldCheck, title: 'Verified Startup Founder', desc: 'Vetted founder status within the BOCC Ecosystem.' },
];

const ALUMNI_BENEFITS = [
  { icon: Users, title: 'Join BOCC Alumni Network', desc: 'Connect with over 5,000+ past founders across 12 countries.', cta: 'Apply' },
  { icon: Network, title: 'Access Founder Community', desc: '24/7 access to the private community channel and resource vault.', cta: 'Request Access' },
  { icon: CalendarCheck, title: 'Future Events & Mentorship', desc: 'Exclusive invites to Demo Days and 1-on-1 advisor sessions.', cta: 'View Calendar' },
];

const DOWNLOADS = ['Startup Journey Certificate', 'Completion Transcript'];

export default function CertificateAlumniPage() {
  useDocumentTitle('Certificate & Alumni — BOCC');

  return (
    <DashboardShell pageId="certificate-alumni">
      <section className="mb-12">
        <h1 className="font-poppins font-semibold text-page text-text-heading mb-2">Startup Journey Certificate</h1>
        <p className="font-inter text-body text-text-body">
          Congratulations on successfully completing the BOCC Startup Journey.
        </p>
      </section>

      <section className="mb-12">
        <div className="bg-surface-white border-2 border-brand-black rounded-xl p-2">
          <div className="border border-border-subtle p-8 md:p-16 flex flex-col items-center text-center m-1">
            <div className="mb-8">
              <div className="w-24 h-24 border-2 border-brand-black rounded-full flex items-center justify-center mx-auto mb-4">
                <Award size={44} strokeWidth={1.5} className="text-text-heading" />
              </div>
              <h3 className="font-inter font-semibold text-caption uppercase tracking-widest text-text-muted">
                Certificate of Achievement
              </h3>
            </div>

            <p className="font-inter text-body text-text-body mb-2">This is to certify that</p>
            <h4 className="font-poppins font-semibold text-headline-lg text-text-heading border-b-2 border-border-subtle px-8 pb-2 mb-8">
              {CERTIFICATE.founderName.toUpperCase()}
            </h4>

            <p className="font-inter text-small text-text-body mb-4 max-w-2xl">
              Has successfully completed the intensive Startup Journey at the BOCC Venture
              Program, demonstrating excellence in venture validation, prototype development,
              and strategic business modeling for their startup:
            </p>
            <h5 className="font-poppins font-semibold text-headline-md text-text-heading mb-12">
              {CERTIFICATE.startupName}
            </h5>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 w-full mt-8 pt-8 border-t border-divider-line">
              <div>
                <p className="font-inter text-caption text-text-muted mb-1">Completion Date</p>
                <p className="font-inter font-semibold text-small text-text-heading">{CERTIFICATE.completionDate}</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 placeholder-box border border-border-subtle mb-2 flex items-center justify-center">
                  <span className="text-[9px] text-text-muted font-inter">QR</span>
                </div>
                <p className="font-inter text-caption text-text-muted">Scan to Verify</p>
              </div>
              <div>
                <p className="font-inter text-caption text-text-muted mb-1">Certificate ID</p>
                <p className="font-inter font-semibold text-small text-text-heading">{CERTIFICATE.certificateId}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        <div className="lg:col-span-8 space-y-6">

          <div>
            <h3 className="font-poppins font-semibold text-body text-text-heading mb-4">Program Milestones</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {MILESTONES.map(({ icon: Icon, title, desc }) => (
                <div key={title} className="bg-surface-white border border-border-subtle rounded-lg p-6 flex flex-col items-center text-center">
                  <div className="w-12 h-12 bg-canvas-bg rounded-full flex items-center justify-center mb-4">
                    <Icon size={20} strokeWidth={2} className="text-text-heading" />
                  </div>
                  <h4 className="font-inter font-semibold text-caption text-text-heading leading-tight mb-2">{title}</h4>
                  <p className="font-inter text-[12px] text-text-muted">{desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4">
            <h3 className="font-poppins font-semibold text-body text-text-heading mb-6">Alumni Benefits</h3>
            <div className="space-y-4">
              {ALUMNI_BENEFITS.map(({ icon: Icon, title, desc, cta }) => (
                <div key={title} className="flex items-start gap-4 p-4 border border-border-subtle rounded-lg bg-surface-white">
                  <div className="p-2 bg-canvas-bg border border-border-subtle rounded shrink-0">
                    <Icon size={20} strokeWidth={2} className="text-text-heading" />
                  </div>
                  <div>
                    <h4 className="font-inter font-semibold text-small text-text-heading">{title}</h4>
                    <p className="font-inter text-caption text-text-muted">{desc}</p>
                  </div>
                  <ComingSoon label={title} position="left" inline className="ml-auto shrink-0">
                    <span className="text-text-heading font-poppins font-semibold text-caption hover:underline cursor-pointer">
                      {cta}
                    </span>
                  </ComingSoon>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-4">
          <div className="bg-surface-white border border-border-subtle rounded-xl p-6 sticky top-24">
            <h3 className="font-poppins font-semibold text-body text-text-heading mb-6">Downloads &amp; Actions</h3>

            <div className="space-y-3 mb-8">
              {DOWNLOADS.map((name) => (
                <ComingSoon key={name} label={`Download ${name}`} position="top">
                  <div className="flex items-center justify-between p-3 border border-border-subtle rounded bg-canvas-bg cursor-pointer hover:bg-surface-white transition-colors w-full">
                    <div className="flex items-center gap-3">
                      <FileText size={18} strokeWidth={2} className="text-text-muted" />
                      <span className="font-inter text-small text-text-body">{name}</span>
                    </div>
                    <Download size={16} strokeWidth={2} className="text-text-muted" />
                  </div>
                </ComingSoon>
              ))}
            </div>

            <div className="space-y-3">
              <ComingSoon label="Download All Files" position="top">
                <span className="w-full py-4 bg-brand-black text-white rounded-lg font-poppins font-semibold text-small flex items-center justify-center gap-2 hover:opacity-90 transition-all cursor-pointer">
                  <Download size={18} strokeWidth={2} />
                  Download All Files
                </span>
              </ComingSoon>
              <ComingSoon label="Share on LinkedIn" position="top">
                <span className="w-full py-4 border border-brand-black text-text-heading rounded-lg font-poppins font-semibold text-small flex items-center justify-center gap-2 hover:bg-canvas-bg transition-colors cursor-pointer">
                  <Share2 size={18} strokeWidth={2} />
                  Share on LinkedIn
                </span>
              </ComingSoon>
            </div>

            <div className="mt-8 pt-8 border-t border-divider-line space-y-4">
              <ComingSoon label="View Public Startup Profile" position="top" inline>
                <span className="flex items-center justify-between group cursor-pointer w-full">
                  <span className="font-inter text-small text-text-muted group-hover:text-text-heading transition-colors">
                    View Public Startup Profile
                  </span>
                  <ExternalLink size={16} strokeWidth={2} className="text-text-muted group-hover:text-text-heading transition-colors" />
                </span>
              </ComingSoon>
              <Link to="/dashboard" className="flex items-center justify-between group">
                <span className="font-inter text-small text-text-muted group-hover:text-text-heading transition-colors">
                  Go to Dashboard
                </span>
                <ArrowRight size={16} strokeWidth={2} className="text-text-muted group-hover:text-text-heading transition-colors" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      <footer className="mt-16 py-8 border-t border-divider-line text-center">
        <p className="font-inter text-caption text-text-muted uppercase tracking-widest">
          BOCC Venture Program • Certification Office • 2024
        </p>
      </footer>
    </DashboardShell>
  );
}