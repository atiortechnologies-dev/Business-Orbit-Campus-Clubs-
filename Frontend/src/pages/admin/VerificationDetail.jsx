import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  BadgeCheck,
  Mail,
  Phone,
  MapPin,
  FileText,
  Image as ImageIcon,
  Download,
  AlertCircle,
  Send,
} from 'lucide-react';
import AdminShell from '@/components/admin/AdminShell';
import Badge from '@/components/ui/Badge';
import ComingSoon from '@/components/ui/ComingSoon';
import Modal from '@/components/ui/Modal';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

const DOCUMENTS = [
  { name: 'Professional_License_2024.pdf', size: '2.1 MB', flagged: false },
  { name: 'Government_ID_Front.jpg', size: '3.4 MB', flagged: false },
  { name: 'Proof_of_Residency.pdf', size: '1.2 MB', flagged: true, flagReason: 'Expired or Illegible' },
];

const CHECKLIST = [
  { label: 'Email Address Validated', done: true },
  { label: 'Sanctions List Scan', done: true },
  { label: 'Corporate Affiliation', done: false },
  { label: 'Physical Office Verification', done: false },
];

const TIMELINE = [
  { label: 'Application Received', time: 'Oct 12, 2024 · 09:02 AM' },
  { label: 'Documents Screened', time: 'Oct 13, 2024 · 11:40 AM' },
  { label: 'Identity Flag Raised', time: 'Oct 14, 2024 · 03:15 PM', variant: 'error' },
  { label: 'Pending Manual Final Review', time: 'Currently active', current: true },
];

export default function VerificationDetailPage() {
  useDocumentTitle('User Profile: ID-88421 — BOCC Admin');
  const navigate = useNavigate();
  const [notes, setNotes] = useState([
    { author: 'Admin_Sarah_K', text: 'Contacted user regarding residency proof — awaiting response.' },
  ]);
  const [draft, setDraft] = useState('');
  const [requestInfoOpen, setRequestInfoOpen] = useState(false);
  const [requestInfoText, setRequestInfoText] = useState('');
  const [requestInfoSent, setRequestInfoSent] = useState(false);

  function handleAddNote(e) {
    e.preventDefault();
    if (!draft.trim()) return;
    // TODO(backend): POST this note to the real audit/notes API instead of
    // just appending to local state.
    setNotes((prev) => [...prev, { author: 'Alex Rivera', text: draft.trim() }]);
    setDraft('');
  }

  function handleSendRequestInfo() {
    if (!requestInfoText.trim()) return;
    // TODO(backend): send this request to the user by email and log it
    // against their verification record.
    setNotes((prev) => [...prev, { author: 'Alex Rivera', text: `Requested more info: "${requestInfoText.trim()}"` }]);
    setRequestInfoText('');
    setRequestInfoOpen(false);
    setRequestInfoSent(true);
    setTimeout(() => setRequestInfoSent(false), 2500);
  }

  return (
    <AdminShell>
      {requestInfoSent && (
        <div className="mb-6 p-4 rounded-lg border border-success/30 bg-success/10 text-success font-inter text-small">
          Info request sent to Alexander Vance.
        </div>
      )}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <Link to="/admin/verification" className="flex items-center gap-2 text-text-muted hover:text-text-heading font-poppins font-semibold text-small transition-colors">
          <ArrowLeft size={16} strokeWidth={2} /> Back to Verification Queue
        </Link>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setRequestInfoOpen(true)}
            className="px-4 py-2 border border-border-subtle rounded-md font-poppins font-semibold text-small text-text-heading hover:bg-canvas-bg transition-colors"
          >
            Request More Info
          </button>
          <button
            type="button"
            onClick={() => navigate('/admin/verification/decision')}
            className="px-4 py-2 bg-action-bg text-action-text rounded-md font-poppins font-semibold text-small hover:opacity-90 active:scale-[0.98] transition-all"
          >
            Verify User
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left column */}
        <div className="lg:col-span-4 space-y-6">
          <section className="bg-surface-white border border-border-subtle rounded-lg p-6 shadow-card text-center">
            <div className="relative w-20 h-20 mx-auto mb-4">
              <div className="w-full h-full rounded-full bg-canvas-bg border border-border-subtle flex items-center justify-center font-poppins font-bold text-text-heading text-2xl select-none">
                AV
              </div>
              <span className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-brand-black border-2 border-surface-white flex items-center justify-center">
                <BadgeCheck size={16} strokeWidth={2} className="text-white" />
              </span>
            </div>
            <h2 className="font-poppins font-semibold text-card text-text-heading">Alexander Vance</h2>
            <p className="font-inter text-small text-text-muted mb-3">Senior Logistics Coordinator</p>
            <div className="flex justify-center gap-2 mb-6">
              <Badge variant="success">Active</Badge>
              <Badge variant="neutral">Tier 2</Badge>
            </div>
            <dl className="text-left space-y-3 pt-4 border-t border-divider-line">
              <div className="flex justify-between gap-4">
                <dt className="font-inter text-small text-text-muted">Affiliation</dt>
                <dd className="font-inter font-medium text-small text-text-heading text-right">Global Dynamics Inc.</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="font-inter text-small text-text-muted">Region</dt>
                <dd className="font-inter font-medium text-small text-text-heading text-right">North America (EMEA)</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="font-inter text-small text-text-muted">Member Since</dt>
                <dd className="font-inter font-medium text-small text-text-heading text-right">Oct 12, 2022</dd>
              </div>
            </dl>
          </section>

          <section className="bg-surface-white border border-border-subtle rounded-lg p-6 shadow-card">
            <h3 className="font-poppins font-semibold text-body text-text-heading mb-4">Contact Information</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Mail size={16} strokeWidth={2} className="text-text-muted shrink-0" />
                <span className="font-inter text-small text-text-body truncate">a.vance@globaldynamics.com</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone size={16} strokeWidth={2} className="text-text-muted shrink-0" />
                <span className="font-inter text-small text-text-body">+1 (206) 555-0142</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin size={16} strokeWidth={2} className="text-text-muted shrink-0" />
                <span className="font-inter text-small text-text-body">Seattle, WA — HQ Sector 4</span>
              </div>
            </div>
          </section>
        </div>

        {/* Middle column */}
        <div className="lg:col-span-5 space-y-6">
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-surface-white border border-border-subtle rounded-lg p-4 shadow-card">
              <p className="font-inter text-caption text-text-muted uppercase mb-1">Doc Completion</p>
              <p className="font-poppins font-semibold text-card text-text-heading">85%</p>
            </div>
            <div className="bg-surface-white border border-border-subtle rounded-lg p-4 shadow-card">
              <p className="font-inter text-caption text-text-muted uppercase mb-1">Checks Passed</p>
              <p className="font-poppins font-semibold text-card text-text-heading">12/14</p>
            </div>
            <div className="bg-surface-white border border-border-subtle rounded-lg p-4 shadow-card">
              <p className="font-inter text-caption text-text-muted uppercase mb-1">Risk Rating</p>
              <p className="font-poppins font-semibold text-card text-success">LOW</p>
            </div>
          </div>

          <section className="bg-surface-white border border-border-subtle rounded-lg shadow-card overflow-hidden">
            <div className="px-6 py-4 border-b border-border-subtle bg-canvas-bg/50 flex items-center justify-between">
              <h3 className="font-poppins font-semibold text-body text-text-heading">Submitted Documents</h3>
              <ComingSoon label="Download All" position="top" inline>
                <span className="font-inter font-medium text-small text-text-body">Download All</span>
              </ComingSoon>
            </div>
            <div className="divide-y divide-border-subtle">
              {DOCUMENTS.map((doc) => (
                <div key={doc.name} className="p-4 flex items-center gap-3">
                  <div className={`w-10 h-10 rounded flex items-center justify-center shrink-0 ${doc.flagged ? 'bg-error/10 text-error' : 'bg-canvas-bg text-text-muted'}`}>
                    {doc.name.endsWith('.jpg') ? <ImageIcon size={18} strokeWidth={2} /> : <FileText size={18} strokeWidth={2} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-inter font-medium text-small text-text-heading truncate">{doc.name}</p>
                    {doc.flagged ? (
                      <p className="flex items-center gap-1 font-inter text-caption text-error">
                        <AlertCircle size={12} strokeWidth={2} /> Flagged: {doc.flagReason}
                      </p>
                    ) : (
                      <p className="font-inter text-caption text-text-muted">{doc.size}</p>
                    )}
                  </div>
                  {doc.flagged ? (
                    <ComingSoon label="Replace document" position="top" inline>
                      <span className="px-3 py-1.5 border border-error/40 text-error rounded-md font-inter font-medium text-caption">Replace</span>
                    </ComingSoon>
                  ) : (
                    <ComingSoon label={`Download ${doc.name}`} position="top" inline>
                      <span className="p-2 text-text-muted rounded-md"><Download size={16} strokeWidth={2} /></span>
                    </ComingSoon>
                  )}
                </div>
              ))}
            </div>
          </section>

          <section className="bg-surface-white border border-border-subtle rounded-lg p-6 shadow-card">
            <h3 className="font-poppins font-semibold text-body text-text-heading mb-4">Verification Checklist</h3>
            <div className="space-y-3">
              {CHECKLIST.map(({ label, done }) => (
                <label key={label} className="flex items-center gap-3">
                  <input type="checkbox" checked={done} disabled className="rounded border-border-subtle text-brand-black" />
                  <span className={`font-inter text-small ${done ? 'text-text-body' : 'text-text-muted'}`}>{label}</span>
                </label>
              ))}
            </div>
          </section>
        </div>

        {/* Right column */}
        <div className="lg:col-span-3 space-y-6">
          <section className="bg-surface-white border border-border-subtle rounded-lg p-6 shadow-card">
            <h3 className="font-poppins font-semibold text-body text-text-heading mb-4">Audit Timeline</h3>
            <div className="space-y-4">
              {TIMELINE.map(({ label, time, variant, current }) => (
                <div key={label} className="flex items-start gap-3">
                  <div className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${variant === 'error' ? 'bg-error' : current ? 'bg-accent-neon' : 'bg-text-muted'}`} />
                  <div>
                    <p className={`font-inter font-medium text-small ${variant === 'error' ? 'text-error' : 'text-text-heading'}`}>{label}</p>
                    <p className="font-inter text-caption text-text-muted">{time}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-surface-white border border-border-subtle rounded-lg p-6 shadow-card">
            <h3 className="font-poppins font-semibold text-body text-text-heading mb-4">Internal Command Notes</h3>
            <div className="space-y-3 mb-4">
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

      <Modal isOpen={requestInfoOpen} onClose={() => setRequestInfoOpen(false)} title="Request more info">
        <p className="font-inter text-small text-text-muted mb-3">
          Sent to Alexander Vance by email and logged against this record.
        </p>
        <textarea
          value={requestInfoText}
          onChange={(e) => setRequestInfoText(e.target.value)}
          placeholder="e.g. Please re-upload a clearer copy of your proof of residency."
          rows={4}
          className="w-full bg-canvas-bg border border-border-subtle rounded-md p-3 font-inter text-small text-text-body resize-none focus:outline-none focus:ring-1 focus:ring-brand-black mb-4"
        />
        <div className="flex justify-end gap-3">
          <button type="button" onClick={() => setRequestInfoOpen(false)} className="border border-border-subtle text-text-heading px-5 py-2 rounded-md hover:bg-canvas-bg transition-colors font-poppins font-semibold text-small">
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSendRequestInfo}
            disabled={!requestInfoText.trim()}
            className="bg-action-bg text-action-text px-5 py-2 rounded-md hover:opacity-90 active:scale-[0.98] transition-all font-poppins font-semibold text-small disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Send Request
          </button>
        </div>
      </Modal>
    </AdminShell>
  );
}
