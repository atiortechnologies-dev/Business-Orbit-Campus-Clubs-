import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronRight, Check, FolderOpen, ExternalLink, History } from 'lucide-react';
import AdminShell from '@/components/admin/AdminShell';
import Badge from '@/components/ui/Badge';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import ComingSoon from '@/components/ui/ComingSoon';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

// TODO(backend): replace with GET /admin/startups/:id/ideation-review — the
// startup's Ideation-stage submission, tied to the same fields the founder
// filled in on IdeaSubmission.jsx.
const STARTUP = { name: 'Project Nexus-Alpha', founder: 'Sarah Chen', chapter: 'Silicon Valley Hub' };

const SUBMISSION = {
  draftLabel: 'Draft #04',
  date: 'Oct 24, 2024',
  status: 'Pending Review',
  progressPct: 20,
  problemStatement:
    'Current supply chain logistics for small-scale organic farmers lack transparency and efficient routing, leading to high spoilage rates (avg 22%) and excessive middleman costs that reduce farmer margins to less than 15%.',
  proposedSolution:
    'A decentralized peer-to-peer logistics network that uses predictive AI to bundle shipments from neighboring farms and optimize multi-stop delivery routes directly to urban retailers.',
  targetAudience:
    'Primary: Independent organic farmers within a 150-mile radius of Tier 1 metropolitan areas. Secondary: Boutique health food stores and organic grocers.',
  valueProposition:
    'Reduces logistics overhead by 35% and spoilage by 50% while providing farmers with real-time tracking and dynamic pricing models to ensure maximum profitability.',
  competitors:
    'Conventional logistics giants (FedEx, DHL) — expensive. Regional wholesalers — large minimums. Niche direct-to-consumer apps — low volume capability.',
  driveFolderName: 'nexus_alpha_ideation_assets_v1',
  driveFolderUrl: '#',
};

const JOURNEY_STAGES = [
  { label: 'Ideation', sub: 'Active Phase', status: 'active' },
  { label: 'Validation', status: 'pending' },
  { label: 'Prototype', status: 'pending' },
  { label: 'Business Model', status: 'pending' },
  { label: 'Launch', status: 'pending' },
];

const SUBMISSION_SECTIONS = [
  { label: 'Problem Statement', key: 'problemStatement' },
  { label: 'Proposed Solution', key: 'proposedSolution' },
  { label: 'Target Audience', key: 'targetAudience' },
  { label: 'Value Proposition', key: 'valueProposition' },
  { label: 'Competitors', key: 'competitors' },
];

export default function IdeationReviewPage() {
  useDocumentTitle(`Ideation Review: ${STARTUP.name} — BOCC Admin`);
  const navigate = useNavigate();

  const [remarks, setRemarks] = useState('');
  const [requestChangesOpen, setRequestChangesOpen] = useState(false);
  const [changesText, setChangesText] = useState('');
  const [changesRequested, setChangesRequested] = useState(false);

  // TODO(backend): POST the approval to /admin/startups/:id/ideation-review/approve.
  function handleApproveAndSchedule() {
    navigate('/admin/reviews/schedule-meeting');
  }

  // TODO(backend): POST the revision request to /admin/startups/:id/ideation-review/request-changes.
  function confirmRequestChanges() {
    setRequestChangesOpen(false);
    setChangesRequested(true);
    setChangesText('');
  }

  return (
    <AdminShell>
      <nav className="mb-2 flex items-center gap-2 text-text-muted font-inter text-small">
        <Link to="/admin/reviews" className="hover:text-text-heading transition-colors">Startups</Link>
        <ChevronRight size={14} strokeWidth={2} />
        <span className="text-text-heading font-semibold">Ideation Review</span>
      </nav>
      <h1 className="font-poppins font-semibold text-page text-text-heading mb-6">Review Workspace: Ideation Phase</h1>

      {changesRequested && (
        <div className="mb-6 p-4 rounded-lg border border-warning/30 bg-warning/10 text-warning font-inter text-small">
          A revision request has been logged for {STARTUP.name} and is now visible to the founder.
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Startup info + journey */}
        <div className="lg:col-span-3 space-y-6">
          <section className="bg-surface-white border border-border-subtle rounded-lg p-6 shadow-card">
            <h3 className="font-poppins font-semibold text-caption uppercase tracking-wider text-text-muted mb-4">Startup Information</h3>
            <div className="space-y-3">
              <div>
                <p className="font-inter text-caption text-text-muted uppercase mb-1">Name</p>
                <p className="font-inter font-semibold text-small text-text-heading">{STARTUP.name}</p>
              </div>
              <div>
                <p className="font-inter text-caption text-text-muted uppercase mb-1">Founder</p>
                <p className="font-inter text-small text-text-heading">{STARTUP.founder}</p>
              </div>
              <div>
                <p className="font-inter text-caption text-text-muted uppercase mb-1">Chapter</p>
                <p className="font-inter text-small text-text-heading">{STARTUP.chapter}</p>
              </div>
            </div>
          </section>

          <section className="bg-surface-white border border-border-subtle rounded-lg p-6 shadow-card">
            <h3 className="font-poppins font-semibold text-caption uppercase tracking-wider text-text-muted mb-4">Startup Journey</h3>
            <div className="space-y-0">
              {JOURNEY_STAGES.map((stage, i) => (
                <div key={stage.label} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 border-2 ${
                        stage.status === 'active' ? 'bg-brand-black border-brand-black text-white' : 'bg-surface-white border-border-subtle'
                      }`}
                    >
                      {stage.status === 'active' && <Check size={14} strokeWidth={2.5} />}
                    </div>
                    {i < JOURNEY_STAGES.length - 1 && (
                      <div className={`w-[2px] flex-1 min-h-[28px] ${stage.status === 'active' ? 'bg-brand-black' : 'bg-border-subtle'}`} />
                    )}
                  </div>
                  <div className="pb-6">
                    <p className={`font-inter text-small ${stage.status === 'active' ? 'font-bold text-text-heading' : 'text-text-muted'}`}>{stage.label}</p>
                    {stage.sub && <p className="font-inter text-caption text-text-muted">{stage.sub}</p>}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Center: submission content */}
        <div className="lg:col-span-6 space-y-6">
          <section className="bg-surface-white border border-border-subtle rounded-lg p-6 shadow-card">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-divider-line">
              <h3 className="font-poppins font-semibold text-caption uppercase tracking-wider text-text-muted">Ideation Submission</h3>
              <Badge variant="neutral">{SUBMISSION.draftLabel}</Badge>
            </div>
            <div className="space-y-6">
              {SUBMISSION_SECTIONS.map(({ label, key }) => (
                <section key={key}>
                  <h4 className="font-inter font-semibold text-caption uppercase tracking-wider text-text-muted mb-2">{label}</h4>
                  <div className="p-4 bg-canvas-bg border border-border-subtle rounded-md">
                    <p className="font-inter text-small text-text-body leading-relaxed">{SUBMISSION[key]}</p>
                  </div>
                </section>
              ))}
            </div>
          </section>

          <section className="bg-surface-white border border-border-subtle rounded-lg p-6 shadow-card flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-12 h-12 rounded-md bg-canvas-bg border border-border-subtle flex items-center justify-center shrink-0">
                <FolderOpen size={20} strokeWidth={2} className="text-text-muted" />
              </div>
              <div className="min-w-0">
                <p className="font-inter font-semibold text-small text-text-heading">Google Drive Folder</p>
                <p className="font-inter text-caption text-text-muted truncate">{SUBMISSION.driveFolderName}</p>
              </div>
            </div>
            <a
              href={SUBMISSION.driveFolderUrl}
              target="_blank"
              rel="noreferrer"
              className="shrink-0 flex items-center gap-2 px-4 py-2 border border-brand-black rounded-md font-poppins font-semibold text-caption text-text-heading hover:bg-canvas-bg transition-colors"
            >
              <ExternalLink size={14} strokeWidth={2} /> Open Drive Folder
            </a>
          </section>
        </div>

        {/* Right: status + actions */}
        <div className="lg:col-span-3 space-y-6">
          <section className="bg-surface-white border border-border-subtle rounded-lg p-6 shadow-card">
            <h3 className="font-poppins font-semibold text-caption uppercase tracking-wider text-text-muted mb-4">Submission Information</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-divider-line">
                <span className="font-inter text-caption text-text-muted uppercase">Date</span>
                <span className="font-inter text-small text-text-heading">{SUBMISSION.date}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-divider-line">
                <span className="font-inter text-caption text-text-muted uppercase">Status</span>
                <Badge variant="warning">{SUBMISSION.status}</Badge>
              </div>
              <div className="pt-1">
                <span className="font-inter text-caption text-text-muted uppercase block mb-2">Journey Progress</span>
                <div className="w-full bg-canvas-bg rounded-full h-2 overflow-hidden">
                  <div className="bg-brand-black h-full rounded-full" style={{ width: `${SUBMISSION.progressPct}%` }} />
                </div>
                <div className="flex justify-between mt-1">
                  <span className="font-inter text-caption text-text-muted">Ideation</span>
                  <span className="font-inter text-caption text-text-muted">{SUBMISSION.progressPct}%</span>
                </div>
              </div>
            </div>
          </section>

          <section className="bg-surface-white border border-border-subtle rounded-lg p-6 shadow-card">
            <h3 className="font-poppins font-semibold text-caption uppercase tracking-wider text-text-muted mb-4">Admin Remarks</h3>
            <textarea
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="Type internal notes or feedback here..."
              rows={4}
              className="w-full bg-canvas-bg border border-border-subtle rounded-md p-3 font-inter text-small text-text-body resize-none focus:outline-none focus:ring-1 focus:ring-brand-black mb-3"
            />
            <p className="flex items-center gap-1.5 font-inter text-caption text-text-muted mb-4">
              Remarks will be visible to the founder.
            </p>
            <div className="space-y-2">
              <button
                type="button"
                onClick={handleApproveAndSchedule}
                className="w-full py-3 bg-action-bg text-action-text rounded-md font-poppins font-semibold text-small hover:opacity-90 active:scale-[0.98] transition-all"
              >
                Approve &amp; Schedule Meeting
              </button>
              <button
                type="button"
                onClick={() => setRequestChangesOpen(true)}
                className="w-full py-3 border border-border-subtle rounded-md font-poppins font-semibold text-small text-text-heading hover:bg-canvas-bg transition-colors"
              >
                Request Changes
              </button>
            </div>
          </section>

          <ComingSoon label="Internal History" position="top" inline={false} className="bg-surface-white border border-dashed border-border-subtle rounded-lg p-6">
            <div className="flex items-center gap-2 mb-3">
              <History size={16} strokeWidth={2} className="text-text-muted" />
              <h3 className="font-poppins font-semibold text-caption uppercase tracking-wider text-text-muted">Internal History</h3>
            </div>
            <p className="font-inter text-caption text-text-muted">Full audit trail of every action taken on this submission.</p>
          </ComingSoon>
        </div>
      </div>

      <Modal isOpen={requestChangesOpen} onClose={() => setRequestChangesOpen(false)} title="Request Changes">
        <p className="font-inter text-small text-text-muted mb-3">
          Sent to {STARTUP.founder} and logged against this submission.
        </p>
        <textarea
          value={changesText}
          onChange={(e) => setChangesText(e.target.value)}
          placeholder="e.g. Please clarify your go-to-market timeline before resubmitting."
          rows={4}
          className="w-full bg-canvas-bg border border-border-subtle rounded-md p-3 font-inter text-small text-text-body resize-none focus:outline-none focus:ring-1 focus:ring-brand-black mb-4"
        />
        <div className="flex justify-end gap-2">
          <Button variant="outline" size="sm" onClick={() => setRequestChangesOpen(false)}>Cancel</Button>
          <Button variant="primary" size="sm" disabled={!changesText.trim()} onClick={confirmRequestChanges}>Send Request</Button>
        </div>
      </Modal>
    </AdminShell>
  );
}
