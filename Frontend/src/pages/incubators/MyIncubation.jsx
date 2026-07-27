import { Link } from 'react-router-dom';
import { MapPin, Mail, Phone, Download, MessageCircle, Mail as MailUnread, ClipboardCheck, History, PartyPopper } from 'lucide-react';
import DashboardShell from '@/components/dashboard/DashboardShell';
import Badge from '@/components/ui/Badge';
import ComingSoon from '@/components/ui/ComingSoon';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

const DOCUMENTS = [
  { name: 'Pitch_Deck_v2.pdf', type: 'PDF', date: 'Oct 24, 2023' },
  { name: 'Financial_Projections.xlsx', type: 'XLSX', date: 'Oct 24, 2023' },
];

const STEPS = [
  { label: 'Submitted', date: 'Oct 24, 2023 · 10:45 AM', done: true },
  { label: 'Screening', date: 'Oct 26, 2023 · In Progress', done: true },
  { label: 'Review', date: 'Estimated: Nov 02' },
  { label: 'Interview', date: 'Pending Review' },
  { label: 'Final Decision', date: 'TBD' },
];

const UPDATES = [
  { icon: MailUnread, text: 'Interview invite received from Skyline Ventures.', time: '2 hours ago' },
  { icon: ClipboardCheck, text: 'Screening complete for EcoFlow Solutions.', time: 'Yesterday, 4:20 PM' },
  { icon: History, text: 'Application auto-saved for Global Impact Fund.', time: 'Oct 25, 2023' },
  { icon: PartyPopper, text: "Accepted into Blue Sky Lab Cohort '24!", time: 'Oct 24, 2023' },
];

export default function MyIncubationPage() {
  useDocumentTitle('My Incubation — BOCC');

  return (
    <DashboardShell pageId="my-incubation">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="font-poppins font-semibold text-page text-text-heading mb-1">My Incubation</h1>
          <p className="font-inter text-body text-text-body">Track the progress of your startup submissions across various hubs.</p>
        </div>
        <Link to="/incubators" className="px-6 py-2.5 bg-action-bg text-action-text rounded-lg font-poppins font-semibold text-small hover:opacity-90 transition-all">
          New Application
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-surface-white border border-border-subtle rounded-lg p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h4 className="font-inter text-caption text-text-muted uppercase mb-1">Active Application</h4>
                  <h3 className="font-poppins font-semibold text-card text-text-heading">Tech Hub Alpha</h3>
                </div>
                <Badge variant="neutral">Under Review</Badge>
              </div>
              <div className="grid grid-cols-2 gap-4 font-inter text-small">
                <div><p className="text-caption text-text-muted">Applied Date</p><p className="font-medium text-text-heading">Oct 24, 2023</p></div>
                <div><p className="text-caption text-text-muted">Current Stage</p><p className="font-medium text-text-heading">Screening</p></div>
                <div><p className="text-caption text-text-muted">Lead Reviewer</p><p className="font-medium text-text-heading">Sarah Jenkins</p></div>
                <div><p className="text-caption text-text-muted">Expected Decision</p><p className="font-medium text-text-heading">Nov 15, 2023</p></div>
              </div>
              <div className="mt-6 flex gap-3">
                <ComingSoon label="View Meeting Details" position="top" className="flex-1">
                  <span className="block text-center py-2 bg-brand-black text-white rounded-lg font-inter font-medium text-small">View Meeting Details</span>
                </ComingSoon>
                <ComingSoon label="Withdraw" position="top" inline>
                  <span className="px-4 py-2 border border-error text-error rounded-lg font-inter font-medium text-small">Withdraw</span>
                </ComingSoon>
              </div>
            </div>

            <div className="bg-surface-white border border-border-subtle rounded-lg p-6">
              <h4 className="font-poppins font-semibold text-card text-text-heading mb-4">Incubator Information</h4>
              <div className="space-y-3 font-inter text-small text-text-body">
                <p className="flex items-center gap-2"><MapPin size={16} strokeWidth={2} className="text-text-muted" /> Innovation District, Block C, Suite 402</p>
                <p className="flex items-center gap-2"><Mail size={16} strokeWidth={2} className="text-text-muted" /> contact@techhubalpha.com</p>
                <p className="flex items-center gap-2"><Phone size={16} strokeWidth={2} className="text-text-muted" /> +1 (555) 012-3456</p>
              </div>
              <div className="mt-4 p-3 bg-canvas-bg rounded-lg">
                <p className="font-inter text-caption text-text-muted mb-0.5">Office Hours</p>
                <p className="font-inter text-small text-text-heading">Mon – Fri, 9:00 AM – 5:00 PM</p>
              </div>
            </div>
          </div>

          <div className="bg-surface-white border border-border-subtle rounded-lg overflow-hidden">
            <div className="p-6 border-b border-divider-line flex justify-between items-center">
              <h4 className="font-poppins font-semibold text-card text-text-heading">Uploaded Documents</h4>
              <ComingSoon label="Upload New Document" position="left" inline>
                <span className="font-inter font-medium text-small text-text-heading">Upload New</span>
              </ComingSoon>
            </div>
            <table className="w-full text-left">
              <thead className="bg-canvas-bg border-b border-divider-line">
                <tr>
                  <th className="px-6 py-3 font-inter text-caption text-text-muted uppercase">Document Name</th>
                  <th className="px-6 py-3 font-inter text-caption text-text-muted uppercase">Type</th>
                  <th className="px-6 py-3 font-inter text-caption text-text-muted uppercase">Date</th>
                  <th className="px-6 py-3 font-inter text-caption text-text-muted uppercase text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle">
                {DOCUMENTS.map((doc) => (
                  <tr key={doc.name}>
                    <td className="px-6 py-4 font-inter text-small text-text-heading">{doc.name}</td>
                    <td className="px-6 py-4 font-inter text-small text-text-muted">{doc.type}</td>
                    <td className="px-6 py-4 font-inter text-small text-text-muted">{doc.date}</td>
                    <td className="px-6 py-4 text-right">
                      <ComingSoon label={`Download ${doc.name}`} position="left" inline>
                        <span className="text-text-muted"><Download size={16} strokeWidth={2} /></span>
                      </ComingSoon>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-surface-white border border-border-subtle rounded-lg p-6">
            <h4 className="font-poppins font-semibold text-card text-text-heading mb-4">Communication</h4>
            <div className="border border-border-subtle rounded-lg p-4 bg-canvas-bg">
              <div className="flex justify-between items-center mb-2">
                <span className="font-inter font-bold text-small text-text-heading">Sarah Jenkins (Reviewer)</span>
                <span className="font-inter text-caption text-text-muted">Yesterday, 2:15 PM</span>
              </div>
              <p className="font-inter text-small text-text-body italic">"We've received your pitch deck. Could you clarify the market size assumptions on slide 8?"</p>
              <div className="mt-4 flex justify-end">
                <ComingSoon label="Open Conversation" position="top" inline>
                  <span className="flex items-center gap-2 px-4 py-2 bg-surface-white border border-border-subtle rounded-lg font-inter font-medium text-small text-text-heading">
                    <MessageCircle size={16} strokeWidth={2} /> Open Conversation
                  </span>
                </ComingSoon>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <div className="bg-surface-white border border-border-subtle rounded-lg p-6">
            <h4 className="font-poppins font-semibold text-card text-text-heading mb-2">Current Application Status</h4>
            <div className="flex items-center justify-between mb-6">
              <span className="font-inter font-bold text-small text-text-heading">Tech Hub Alpha</span>
              <span className="font-inter text-caption text-text-muted bg-canvas-bg px-2 py-0.5 rounded">60% Complete</span>
            </div>
            <div className="relative flex flex-col gap-6 ml-2 border-l-2 border-border-subtle pb-2">
              {STEPS.map((step) => (
                <div key={step.label} className="relative pl-6">
                  <div className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full border-4 border-surface-white ${step.done ? 'bg-brand-black' : 'bg-canvas-bg'}`} />
                  <p className={`font-inter font-bold text-small ${step.done ? 'text-text-heading' : 'text-text-muted'}`}>{step.label}</p>
                  <p className="font-inter text-caption text-text-muted">{step.date}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-surface-white border border-border-subtle rounded-lg p-6">
            <h4 className="font-poppins font-semibold text-card text-text-heading mb-6">Recent Updates</h4>
            <div className="space-y-5">
              {UPDATES.map(({ icon: Icon, text, time }) => (
                <div key={text} className="flex gap-3">
                  <div className="w-8 h-8 rounded-md bg-canvas-bg flex items-center justify-center shrink-0"><Icon size={16} strokeWidth={2} className="text-text-heading" /></div>
                  <div>
                    <p className="font-inter text-small text-text-body leading-snug">{text}</p>
                    <p className="font-inter text-caption text-text-muted">{time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
