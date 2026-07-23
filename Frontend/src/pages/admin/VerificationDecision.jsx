import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronRight, CheckCircle, Globe, History, Send, CheckSquare } from 'lucide-react';
import AdminShell from '@/components/admin/AdminShell';
import Badge from '@/components/ui/Badge';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

const CHECKLIST = [
  'Identity Verification',
  'Address Proof',
  'Background Check',
  'Email Domain',
  'Phone Authenticity',
  'KYC/AML Screen',
];

const REJECT_REASONS = ['Fraudulent Identity', 'Unverifiable Details', 'Policy Violation'];
const REQUEST_DOCS = ['Updated Proof of Address', 'Professional License Certification', 'Tax Identification Document'];

export default function VerificationDecisionPage() {
  useDocumentTitle('User Review: #USR-88219 — BOCC Admin');
  const navigate = useNavigate();

  const [openModal, setOpenModal] = useState(null); // 'approve' | 'reject' | 'request' | null
  const [decision, setDecision] = useState(null); // 'approved' | 'rejected' | null
  const [rejectReason, setRejectReason] = useState(REJECT_REASONS[0]);
  const [requestedDocs, setRequestedDocs] = useState([]);
  const [requestMessage, setRequestMessage] = useState('');
  const [notes, setNotes] = useState([
    { author: 'System Automator', text: 'Geolocation check completed automatically — cleared.' },
    { author: 'Admin Unit-04', text: 'Trust score recalculated after manual document review.' },
  ]);
  const [draft, setDraft] = useState('');

  function handleAddNote(e) {
    e.preventDefault();
    if (!draft.trim()) return;
    setNotes((prev) => [...prev, { author: 'Alex Rivera', text: draft.trim() }]);
    setDraft('');
  }

  // TODO(backend): each of these three confirm handlers should POST the
  // real decision to the verification API. For now they just update local
  // state honestly (no fake network delay) and close the modal.
  function confirmApprove() {
    setDecision('approved');
    setOpenModal(null);
  }
  function confirmReject() {
    setDecision('rejected');
    setOpenModal(null);
  }
  function confirmRequestDocs() {
    setOpenModal(null);
    setRequestedDocs([]);
    setRequestMessage('');
  }

  return (
    <AdminShell>
      <nav className="mb-2 flex items-center gap-2 text-text-muted font-inter text-small">
        <Link to="/admin/verification" className="hover:text-text-heading transition-colors">Verification Queue</Link>
        <ChevronRight size={14} strokeWidth={2} />
        <span className="text-text-heading font-semibold">User Review: #USR-88219</span>
      </nav>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <h1 className="font-poppins font-semibold text-page text-text-heading">Decision Summary</h1>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={() => setOpenModal('request')}>
            Request More Documents
          </Button>
          <button
            type="button"
            onClick={() => setOpenModal('reject')}
            className="px-4 py-2 border border-error text-error rounded-md font-poppins font-semibold text-small hover:bg-error/5 transition-colors"
          >
            Reject User
          </button>
          <button
            type="button"
            onClick={() => setOpenModal('approve')}
            className="px-4 py-2 bg-action-bg text-action-text rounded-md font-poppins font-semibold text-small hover:opacity-90 active:scale-[0.98] transition-all"
          >
            Approve User
          </button>
        </div>
      </div>

      {decision && (
        <div className={`mb-6 p-4 rounded-lg border font-inter text-small ${decision === 'approved' ? 'bg-success/10 border-success/30 text-success' : 'bg-error/10 border-error/30 text-error'}`}>
          {decision === 'approved' ? 'This user has been approved.' : 'This user has been rejected.'}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-6">
          <section className="bg-surface-white border border-border-subtle rounded-lg p-6 shadow-card flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-canvas-bg border border-border-subtle flex items-center justify-center font-poppins font-bold text-text-heading text-lg select-none shrink-0">
                ES
              </div>
              <div>
                <h2 className="font-poppins font-semibold text-card text-text-heading">Elena Sokolov</h2>
                <p className="font-inter text-small text-text-muted">Independent Contractor</p>
                <p className="font-inter text-caption text-text-muted mt-1">User ID: 88219-EL · e.sokolov@provider.net</p>
                <p className="font-inter text-caption text-text-muted">Applied On: Oct 24, 2024</p>
              </div>
            </div>
            <div className="text-right shrink-0">
              <p className="font-inter text-caption text-text-muted uppercase mb-1">Trust Score</p>
              <Badge variant="success">98/100</Badge>
            </div>
          </section>

          <section className="bg-surface-white border border-border-subtle rounded-lg p-6 shadow-card">
            <h3 className="font-poppins font-semibold text-body text-text-heading mb-4">Risk Factors</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Globe size={18} strokeWidth={2} className="text-text-muted shrink-0" />
                <span className="flex-1 font-inter text-small text-text-body">Geolocation mismatch (VPN detected)</span>
                <span className="flex items-center gap-1 text-success font-inter text-caption font-semibold">
                  <CheckCircle size={14} strokeWidth={2} /> Cleared
                </span>
              </div>
              <div className="flex items-center gap-3">
                <History size={18} strokeWidth={2} className="text-text-muted shrink-0" />
                <span className="flex-1 font-inter text-small text-text-muted">Previous application history</span>
                <span className="font-inter text-caption text-text-muted">None</span>
              </div>
            </div>
          </section>

          <section className="bg-surface-white border border-border-subtle rounded-lg p-6 shadow-card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-poppins font-semibold text-body text-text-heading">Verification Checklist</h3>
              <Badge variant="success">6/6 Completed</Badge>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {CHECKLIST.map((label) => (
                <div key={label} className="flex items-center gap-2">
                  <CheckSquare size={18} strokeWidth={2} className="text-success shrink-0" />
                  <span className="font-inter text-small text-text-body">{label}</span>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="lg:col-span-4">
          <section className="bg-surface-white border border-border-subtle rounded-lg p-6 shadow-card sticky top-24">
            <h3 className="font-poppins font-semibold text-body text-text-heading mb-4">Internal Audit Notes</h3>
            <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
              {notes.map((note, i) => (
                <div key={i} className="p-3 bg-canvas-bg rounded-md">
                  <p className="font-inter font-semibold text-caption text-text-heading mb-0.5">{note.author}</p>
                  <p className="font-inter text-small text-text-body">{note.text}</p>
                </div>
              ))}
            </div>
            <form onSubmit={handleAddNote} className="flex gap-2">
              <textarea
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="Add an internal note..."
                rows={2}
                className="flex-1 bg-canvas-bg border border-border-subtle rounded-md p-2 font-inter text-small text-text-body resize-none focus:outline-none focus:ring-1 focus:ring-brand-black"
              />
              <button type="submit" className="p-2 h-fit bg-action-bg text-action-text rounded-md hover:opacity-90 transition-opacity" aria-label="Add note">
                <Send size={16} strokeWidth={2} />
              </button>
            </form>
          </section>
        </div>
      </div>

      {/* ── Modals ─────────────────────────────────────────────────── */}
      <Modal isOpen={openModal === 'approve'} onClose={() => setOpenModal(null)} title="Approve User Access?">
        <p className="font-inter text-small text-text-body mb-6">
          Elena Sokolov will gain full verified access to the platform. This action is logged in the audit trail.
        </p>
        <div className="flex justify-end gap-2">
          <Button variant="outline" size="sm" onClick={() => setOpenModal(null)}>Cancel</Button>
          <Button variant="primary" size="sm" onClick={confirmApprove}>Confirm Approval</Button>
        </div>
      </Modal>

      <Modal isOpen={openModal === 'reject'} onClose={() => setOpenModal(null)} title="Rejection Reason">
        <fieldset className="space-y-2 mb-6">
          <legend className="sr-only">Rejection reason</legend>
          {REJECT_REASONS.map((reason) => (
            <label key={reason} className="flex items-center gap-2 font-inter text-small text-text-body cursor-pointer">
              <input
                type="radio"
                name="reject-reason"
                checked={rejectReason === reason}
                onChange={() => setRejectReason(reason)}
                className="text-brand-black focus:ring-brand-black"
              />
              {reason}
            </label>
          ))}
        </fieldset>
        <div className="flex justify-end gap-2">
          <Button variant="outline" size="sm" onClick={() => setOpenModal(null)}>Cancel</Button>
          <button
            type="button"
            onClick={confirmReject}
            className="px-4 py-2 bg-error text-white rounded-md font-poppins font-semibold text-small hover:opacity-90 transition-opacity"
          >
            Confirm Rejection
          </button>
        </div>
      </Modal>

      <Modal isOpen={openModal === 'request'} onClose={() => setOpenModal(null)} title="Request Additional Documents">
        <div className="space-y-2 mb-4">
          {REQUEST_DOCS.map((doc) => (
            <label key={doc} className="flex items-center gap-2 font-inter text-small text-text-body cursor-pointer">
              <input
                type="checkbox"
                checked={requestedDocs.includes(doc)}
                onChange={(e) =>
                  setRequestedDocs((prev) => (e.target.checked ? [...prev, doc] : prev.filter((d) => d !== doc)))
                }
                className="rounded border-border-subtle text-brand-black focus:ring-brand-black"
              />
              {doc}
            </label>
          ))}
        </div>
        <textarea
          value={requestMessage}
          onChange={(e) => setRequestMessage(e.target.value)}
          placeholder="Custom message to the user (optional)"
          rows={3}
          className="w-full bg-canvas-bg border border-border-subtle rounded-md p-3 font-inter text-small text-text-body resize-none focus:outline-none focus:ring-1 focus:ring-brand-black mb-6"
        />
        <div className="flex justify-end gap-2">
          <Button variant="outline" size="sm" onClick={() => setOpenModal(null)}>Cancel</Button>
          <Button variant="primary" size="sm" onClick={confirmRequestDocs}>Send Request</Button>
        </div>
      </Modal>
    </AdminShell>
  );
}
