import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, MessageCircle, Compass } from 'lucide-react';
import DashboardShell from '@/components/dashboard/DashboardShell';
import Badge from '@/components/ui/Badge';
import ComingSoon from '@/components/ui/ComingSoon';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

const STEPS = ['Submitted', 'Viewed', 'Shortlisted', 'Interview', 'Selected/Rejected'];

const APPLICATIONS = [
  { id: 'a1', title: 'Full Stack Developer', company: 'Nexus AI Studio', applied: 'Oct 24, 2023', stage: 'shortlisted', stepIndex: 2, primaryAction: 'View Application' },
  { id: 'a2', title: 'Product Designer', company: 'Flow Capital', applied: 'Oct 20, 2023', stage: 'interview', stepIndex: 3, primaryAction: 'Schedule Call' },
  { id: 'a3', title: 'Data Analyst', company: 'GreenGrid Systems', applied: 'Oct 28, 2023', stage: 'viewed', stepIndex: 1, primaryAction: 'View Application' },
];

const STAGE_BADGE = { shortlisted: 'info', interview: 'brand', viewed: 'neutral' };
const STAGE_LABEL = { shortlisted: 'Shortlisted', interview: 'Interview', viewed: 'Viewed' };

const TABS = [
  { id: 'active', label: 'Active', match: (a) => a.stage !== 'interview' },
  { id: 'interviews', label: 'Interviews', match: (a) => a.stage === 'interview' },
  { id: 'rejected', label: 'Rejected', match: () => false },
  { id: 'archived', label: 'Archived', match: () => false },
];

export default function MyApplicationsPage() {
  useDocumentTitle('My Applications — BOCC');
  const [activeTab, setActiveTab] = useState('active');
  const tab = TABS.find((t) => t.id === activeTab);
  const visible = APPLICATIONS.filter(tab.match);

  return (
    <DashboardShell pageId="my-applications">
      <div className="mb-2">
        <h1 className="font-poppins font-semibold text-page text-text-heading mb-1">My Applications</h1>
        <p className="font-inter text-body text-text-body">Monitor the status of every opportunity you've applied for.</p>
      </div>

      <div className="flex items-center gap-8 border-b border-divider-line mb-8 mt-6">
        <span className="pb-3 text-text-muted hover:text-text-heading transition-colors font-inter text-small cursor-default">
          <Link to="/freelancing">Opportunities</Link>
        </span>
        <span className="pb-3 border-b-2 border-brand-black text-text-heading font-inter font-semibold text-small">My Applications</span>
      </div>

      <div className="flex border-b border-divider-line mb-6 overflow-x-auto">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`px-6 py-3 font-inter text-small whitespace-nowrap transition-colors ${activeTab === t.id ? 'border-b-2 border-brand-black text-text-heading font-semibold' : 'text-text-muted hover:text-text-heading'}`}
          >
            {t.label} ({APPLICATIONS.filter(t.match).length})
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <p className="font-inter text-small text-text-muted py-12 text-center">No applications in this category yet.</p>
      ) : (
        <div className="space-y-4">
          {visible.map((app) => (
            <article key={app.id} className="bg-surface-white border border-border-subtle rounded-lg p-6 flex flex-col md:flex-row gap-6 shadow-card">
              <div className="flex flex-col w-full md:w-56 gap-3 shrink-0">
                <div>
                  <h4 className="font-poppins font-semibold text-body text-text-heading truncate">{app.title}</h4>
                  <p className="font-inter text-small text-text-muted">{app.company}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="px-2.5 py-1 bg-canvas-bg text-text-muted font-inter text-caption rounded-full">Applied {app.applied}</span>
                  <Badge variant={STAGE_BADGE[app.stage]}>{STAGE_LABEL[app.stage]}</Badge>
                </div>
              </div>

              <div className="flex-1 overflow-x-auto">
                <div className="flex items-center justify-between px-2 relative min-w-[420px]">
                  <div className="absolute left-4 right-4 top-3 h-0.5 bg-border-subtle" />
                  {STEPS.map((step, i) => (
                    <div key={step} className="relative z-10 flex flex-col items-center gap-2 text-center w-1/5">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                        i < app.stepIndex ? 'bg-brand-black' : i === app.stepIndex ? 'bg-brand-black ring-2 ring-offset-2 ring-brand-black' : 'bg-canvas-bg border-2 border-border-subtle'
                      }`}>
                        {i <= app.stepIndex && i < app.stepIndex && <Check size={12} strokeWidth={3} className="text-accent-neon" />}
                      </div>
                      <span className={`font-inter text-caption whitespace-nowrap ${i === app.stepIndex ? 'font-bold text-text-heading' : i < app.stepIndex ? 'font-semibold text-text-heading' : 'text-text-muted'}`}>{step}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col justify-center gap-2 w-full md:w-44 shrink-0">
                <ComingSoon label={app.primaryAction} position="top" className="w-full">
                  <span className="w-full flex items-center justify-center py-2 bg-brand-black text-white rounded-lg font-inter font-semibold text-small">{app.primaryAction}</span>
                </ComingSoon>
                {app.stage === 'viewed' ? (
                  <ComingSoon label="Withdraw Application" position="top" className="w-full">
                    <span className="w-full flex items-center justify-center py-2 border border-error text-error rounded-lg font-inter font-medium text-small">Withdraw Application</span>
                  </ComingSoon>
                ) : (
                  <ComingSoon label="Open Chat" position="top" className="w-full">
                    <span className="w-full flex items-center justify-center gap-2 py-2 border border-border-subtle rounded-lg font-inter font-medium text-small text-text-heading">
                      <MessageCircle size={16} strokeWidth={2} /> Open Chat
                    </span>
                  </ComingSoon>
                )}
              </div>
            </article>
          ))}
        </div>
      )}

      <div className="py-12 flex flex-col items-center text-center gap-4 border-t border-divider-line mt-8">
        <p className="font-inter text-small text-text-muted">Applying for more helps you stay on track.</p>
        <Link to="/freelancing" className="flex items-center gap-2 px-6 py-2.5 border border-brand-black text-text-heading font-poppins font-semibold text-small rounded-lg hover:bg-canvas-bg transition-colors">
          <Compass size={18} strokeWidth={2} /> Browse More Opportunities
        </Link>
      </div>
    </DashboardShell>
  );
}
