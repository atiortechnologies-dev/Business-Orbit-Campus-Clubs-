import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronRight, Lock, Send } from 'lucide-react';
import AdminShell from '@/components/admin/AdminShell';
import Badge from '@/components/ui/Badge';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

const INITIAL_CHECKLIST = [
  { id: 'c1', label: 'Technical Whitepaper Review', done: true },
  { id: 'c2', label: 'Market Size Validation', done: true },
  { id: 'c3', label: 'Team Background Check', done: true },
  { id: 'c4', label: 'Risk Mitigation Strategy', done: false },
  { id: 'c5', label: 'Ethics & Compliance Audit', done: false },
];

const INITIAL_METRICS = [
  { id: 'innovation', label: 'Innovation', value: 8.5 },
  { id: 'validation', label: 'Validation', value: 6.2 },
  { id: 'technical', label: 'Technical Progress', value: 9.1 },
  { id: 'business', label: 'Business Potential', value: 7.8 },
];

const DECISIONS = [
  { id: 'approve', label: 'Approve Stage' },
  { id: 'changes', label: 'Request Changes' },
  { id: 'reject', label: 'Reject Submission' },
];

export default function ReviewWorkspacePage() {
  useDocumentTitle('Evaluation Workspace: NeuralStream AI — BOCC Admin');
  const navigate = useNavigate();

  const [checklist, setChecklist] = useState(INITIAL_CHECKLIST);
  const [metrics, setMetrics] = useState(INITIAL_METRICS);
  const [decision, setDecision] = useState(null);
  const [draftSaved, setDraftSaved] = useState(false);

  const completedCount = checklist.filter((c) => c.done).length;
  const consensus = useMemo(
    () => (metrics.reduce((sum, m) => sum + m.value, 0) / metrics.length).toFixed(1),
    [metrics]
  );

  function toggleChecklistItem(id) {
    setChecklist((prev) => prev.map((c) => (c.id === id ? { ...c, done: !c.done } : c)));
  }

  function updateMetric(id, value) {
    setMetrics((prev) => prev.map((m) => (m.id === id ? { ...m, value: Number(value) } : m)));
  }

  function handleSaveDraft() {
    // TODO(backend): POST the current checklist/metrics/notes as a draft.
    setDraftSaved(true);
    setTimeout(() => setDraftSaved(false), 2000);
  }

  return (
    <AdminShell>
      <nav className="mb-6 flex items-center gap-2 text-text-muted font-inter text-small">
        <Link to="/admin/reviews" className="hover:text-text-heading transition-colors">Startup Reviews</Link>
        <ChevronRight size={14} strokeWidth={2} />
        <span>Active Queue</span>
        <ChevronRight size={14} strokeWidth={2} />
        <span className="text-text-heading font-semibold">Evaluation Workspace: NeuralStream AI</span>
      </nav>

      <div className="bg-surface-white border border-border-subtle rounded-lg p-6 shadow-card mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="font-poppins font-semibold text-page text-text-heading">Evaluation Workspace</h1>
          <p className="font-inter text-body text-text-body mt-1">Reviewing NeuralStream AI for Seed Stage Funding Approval.</p>
        </div>
        <Badge variant="error">Priority Review</Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pb-24">
        <div className="lg:col-span-8 space-y-6">
          <section className="bg-surface-white border border-border-subtle rounded-lg p-6 shadow-card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-poppins font-semibold text-body text-text-heading">Evaluation Checklist</h3>
              <Badge variant={completedCount === checklist.length ? 'success' : 'warning'}>
                {completedCount}/{checklist.length} Complete
              </Badge>
            </div>
            <div className="space-y-3">
              {checklist.map(({ id, label, done }) => (
                <label key={id} className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={done}
                    onChange={() => toggleChecklistItem(id)}
                    className="rounded border-border-subtle text-brand-black focus:ring-brand-black"
                  />
                  <span className={`font-inter text-small ${done ? 'text-text-body' : 'text-text-muted'}`}>{label}</span>
                </label>
              ))}
            </div>
          </section>

          <section className="bg-surface-white border border-border-subtle rounded-lg p-6 shadow-card space-y-4">
            <h3 className="font-poppins font-semibold text-body text-text-heading">Reviewer Notes</h3>
            <div>
              <label className="font-inter font-medium text-caption text-text-muted uppercase tracking-wider block mb-1">Core Strengths</label>
              <textarea rows={3} className="w-full bg-canvas-bg border border-border-subtle rounded-md p-3 font-inter text-small text-text-body resize-none focus:outline-none focus:ring-1 focus:ring-brand-black" placeholder="What's working well..." />
            </div>
            <div>
              <label className="font-inter font-medium text-caption text-text-muted uppercase tracking-wider block mb-1">Required Improvements</label>
              <textarea rows={3} className="w-full bg-canvas-bg border border-border-subtle rounded-md p-3 font-inter text-small text-text-body resize-none focus:outline-none focus:ring-1 focus:ring-brand-black" placeholder="What needs to change before the next stage..." />
            </div>
            <div>
              <label className="flex items-center gap-1.5 font-inter font-medium text-caption text-text-muted uppercase tracking-wider mb-1">
                <Lock size={12} strokeWidth={2} /> Internal Admin Comments
              </label>
              <textarea rows={2} className="w-full bg-canvas-bg border border-border-subtle rounded-md p-3 font-inter text-small text-text-body italic resize-none focus:outline-none focus:ring-1 focus:ring-brand-black" placeholder="Private — not visible to the founder..." />
            </div>
          </section>

          <section className="bg-surface-white border border-border-subtle rounded-lg p-6 shadow-card">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-poppins font-semibold text-body text-text-heading">Metrics Scorecard</h3>
              <div className="text-right">
                <p className="font-inter text-caption text-text-muted uppercase">Calculated Consensus</p>
                <p className="font-poppins font-semibold text-card text-text-heading">{consensus}<span className="text-text-muted text-small">/10.0</span></p>
              </div>
            </div>
            <div className="space-y-5">
              {metrics.map(({ id, label, value }) => (
                <div key={id}>
                  <div className="flex justify-between mb-1.5">
                    <span className="font-inter text-small text-text-body">{label}</span>
                    <span className="font-inter font-semibold text-small text-text-heading">{value.toFixed(1)}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="10"
                    step="0.1"
                    value={value}
                    onChange={(e) => updateMetric(id, e.target.value)}
                    className="w-full accent-brand-black"
                  />
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <section className="bg-surface-white border border-border-subtle rounded-lg p-6 shadow-card">
            <h3 className="font-poppins font-semibold text-body text-text-heading mb-4">Decision Summary</h3>
            <div className="space-y-2">
              {DECISIONS.map(({ id, label }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setDecision(id)}
                  className={`w-full py-2.5 rounded-md font-poppins font-semibold text-small transition-all border ${
                    decision === id
                      ? id === 'reject'
                        ? 'bg-error text-white border-error'
                        : 'bg-action-bg text-action-text border-brand-black dark:border-white'
                      : 'bg-canvas-bg text-text-heading border-border-subtle hover:bg-canvas-bg/70'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </section>

          <div className="bg-surface-white border border-border-subtle rounded-lg p-4 shadow-card">
            <p className="font-inter font-medium text-caption text-text-muted uppercase tracking-wider mb-2">Submission Preview</p>
            <div className="placeholder-box rounded-md h-32" />
            <p className="font-inter text-caption text-text-muted mt-2 text-center">Architecture.pdf</p>
          </div>
        </div>
      </div>

      {/* Sticky action footer */}
      <div className="fixed bottom-0 right-0 left-0 lg:left-[var(--spacing-sidebar-width)] bg-surface-white border-t border-border-subtle py-4 px-6 md:px-10 flex items-center justify-between z-30 shadow-[0_-4px_12px_rgba(0,0,0,0.05)]">
        <span className="font-inter text-caption text-text-muted">
          {draftSaved ? 'Draft saved.' : 'Last autosave: 2 minutes ago'}
        </span>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={handleSaveDraft}
            className="px-5 py-2.5 border border-border-subtle rounded-md font-poppins font-semibold text-small text-text-heading hover:bg-canvas-bg transition-colors"
          >
            Save Draft
          </button>
          <button
            type="button"
            disabled={!decision}
            onClick={() => navigate('/admin/reviews/outcome')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-md font-poppins font-semibold text-small transition-all ${
              decision ? 'bg-action-bg text-action-text hover:opacity-90 active:scale-[0.98]' : 'bg-canvas-bg text-text-muted cursor-not-allowed'
            }`}
          >
            Submit Review <Send size={14} strokeWidth={2} />
          </button>
        </div>
      </div>
    </AdminShell>
  );
}
