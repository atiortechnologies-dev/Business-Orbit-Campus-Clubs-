import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronRight, Terminal, Lock, MessageCircle } from 'lucide-react';
import AdminShell from '@/components/admin/AdminShell';
import Badge from '@/components/ui/Badge';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import ComingSoon from '@/components/ui/ComingSoon';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

const REQUIRED_SKILLS = ['PyTorch', 'CUDA', 'C++', 'Triton'];
const RESPONSIBILITIES = [
  'Architect and maintain high-throughput data pipelines for real-time inference.',
  'Collaborate with hardware teams to optimize kernel performance on custom silicon.',
  'Implement model quantization and pruning techniques for LLMs.',
  'Establish benchmarking protocols for latency and power consumption.',
];
const CHANGE_REASONS = ['Missing compensation details', 'Ambiguous eligibility criteria', 'Requires company profile verification'];

export default function OpportunityReviewPage() {
  useDocumentTitle('Opportunity Review — BOCC Admin');
  const navigate = useNavigate();

  const [openModal, setOpenModal] = useState(null); // 'approve' | 'reject' | 'changes' | null
  const [changeReason, setChangeReason] = useState(CHANGE_REASONS[0]);
  const [notes, setNotes] = useState('');

  // TODO(backend): each of these three should PATCH /api/admin/opportunities/:id
  // { decision: 'approved' | 'rejected' | 'changes_requested', reviewerNotes: notes }
  // and notify the posting company of the outcome.
  function confirmDecision() {
    setOpenModal(null);
    navigate('/admin/opportunities');
  }

  return (
    <AdminShell>
      <nav className="mb-6 flex items-center gap-2 text-text-muted font-inter font-normal text-small">
        <Link to="/admin/opportunities" className="hover:text-text-heading transition-colors">Opportunities</Link>
        <ChevronRight size={14} strokeWidth={2} />
        <span className="text-text-heading font-semibold">#OP-8821</span>
      </nav>

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-poppins font-semibold text-page text-text-heading">Opportunity Review</h1>
          <p className="font-inter text-caption text-text-muted mt-1">#OP-8821 · <Badge variant="warning">Pending Verification</Badge></p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Company info */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-surface-white border border-border-subtle rounded-lg p-6 shadow-card">
            <div className="w-16 h-16 rounded-lg bg-canvas-bg border border-border-subtle flex items-center justify-center mb-4">
              <Terminal size={28} strokeWidth={2} className="text-text-muted" />
            </div>
            <h2 className="font-poppins font-semibold text-card text-text-heading mb-1">NeuralFlow AI</h2>
            <p className="font-inter text-caption text-text-muted uppercase tracking-wider mb-4">Deep Tech / ML</p>
            <div className="space-y-3">
              <div>
                <p className="font-inter text-caption text-text-muted uppercase mb-0.5">Founded</p>
                <p className="font-inter text-small text-text-heading">Jan 2023</p>
              </div>
              <div>
                <p className="font-inter text-caption text-text-muted uppercase mb-0.5">Team Size</p>
                <p className="font-inter text-small text-text-heading">12 Employees</p>
              </div>
              <div>
                <p className="font-inter text-caption text-text-muted uppercase mb-0.5">Website</p>
                <p className="font-inter text-small text-brand-black underline">neuralflow.ai</p>
              </div>
            </div>
          </div>
          <div className="bg-surface-white border border-border-subtle rounded-lg p-6 shadow-card">
            <h3 className="font-poppins font-semibold text-body text-text-heading mb-3">Company Profile</h3>
            <p className="font-inter text-small text-text-body leading-relaxed">
              NeuralFlow is building low-latency inference engines for edge computing. Backed by Y-Combinator and Sequoia, they are scaling their core engineering team to support growing enterprise demands in the autonomous vehicle sector.
            </p>
          </div>
        </div>

        {/* Opportunity detail */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-surface-white border border-border-subtle rounded-lg p-8 shadow-card">
            <div className="mb-6 pb-6 border-b border-divider-line">
              <h2 className="font-poppins font-semibold text-section text-text-heading mb-3">Senior Machine Learning Engineer</h2>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-canvas-bg rounded font-inter text-caption font-semibold uppercase text-text-body">Full-Time</span>
                <span className="px-3 py-1 bg-canvas-bg rounded font-inter text-caption font-semibold uppercase text-text-body">Engineering</span>
                <span className="px-3 py-1 bg-canvas-bg rounded font-inter text-caption font-semibold uppercase text-text-body">Remote (US)</span>
              </div>
            </div>
            <div className="space-y-6">
              <section>
                <h4 className="font-poppins font-semibold text-body text-text-heading mb-2">Description</h4>
                <p className="font-inter text-body text-text-body leading-relaxed">
                  We are looking for a Senior ML Engineer to lead our optimization efforts. You will be responsible for taking state-of-the-art transformer models and compressing them for deployment on ARM-based hardware architectures without significant loss in precision.
                </p>
              </section>
              <section>
                <h4 className="font-poppins font-semibold text-body text-text-heading mb-2">Responsibilities</h4>
                <ul className="list-disc pl-5 space-y-1.5 font-inter text-small text-text-body">
                  {RESPONSIBILITIES.map((item) => <li key={item}>{item}</li>)}
                </ul>
              </section>
              <div className="grid grid-cols-2 gap-6 pt-6 border-t border-divider-line">
                <div>
                  <p className="font-inter text-caption text-text-muted uppercase mb-2">Required Skills</p>
                  <div className="flex flex-wrap gap-2">
                    {REQUIRED_SKILLS.map((skill) => <span key={skill} className="border border-border-subtle px-2 py-1 rounded font-inter text-caption text-text-body">{skill}</span>)}
                  </div>
                </div>
                <div>
                  <p className="font-inter text-caption text-text-muted uppercase mb-2">Eligibility</p>
                  <p className="font-inter text-small text-text-body">Masters/PhD in CS or Math, 5+ yrs exp.</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-divider-line">
                <div>
                  <p className="font-inter text-caption text-text-muted uppercase mb-1">Duration</p>
                  <p className="font-inter text-small text-text-heading">Permanent</p>
                </div>
                <div>
                  <p className="font-inter text-caption text-text-muted uppercase mb-1">Compensation</p>
                  <p className="font-inter text-small text-text-heading">$180k – $240k + Equity</p>
                </div>
                <div>
                  <p className="font-inter text-caption text-text-muted uppercase mb-1">Deadline</p>
                  <p className="font-inter font-semibold text-small text-text-heading">Oct 15, 2024</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Review summary + notes */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-surface-white border border-border-subtle rounded-lg p-6 shadow-card">
            <h3 className="font-poppins font-semibold text-body text-text-heading mb-4">Review Summary</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="font-inter text-caption text-text-muted">Submission</span>
                <span className="font-inter text-small text-text-heading">Aug 28, 2024</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-inter text-caption text-text-muted">Status</span>
                <Badge variant="neutral">Active Review</Badge>
              </div>
              <div className="pt-4 border-t border-divider-line">
                <p className="font-inter text-caption text-text-muted mb-3">Revision History</p>
                <div className="space-y-3">
                  <div className="flex gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-brand-black mt-1.5 shrink-0" />
                    <div>
                      <p className="font-inter font-semibold text-small text-text-heading">Submitted for Review</p>
                      <p className="font-inter text-caption text-text-muted">Aug 28, 09:12 AM</p>
                    </div>
                  </div>
                  <div className="flex gap-3 opacity-50">
                    <div className="w-1.5 h-1.5 rounded-full bg-text-muted mt-1.5 shrink-0" />
                    <div>
                      <p className="font-inter font-semibold text-small text-text-heading">Draft Created</p>
                      <p className="font-inter text-caption text-text-muted">Aug 27, 04:30 PM</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-surface-white border border-border-subtle rounded-lg p-6 shadow-card">
            <h3 className="font-poppins font-semibold text-body text-text-heading mb-3">Internal Notes</h3>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add a private note for the review team..."
              rows={5}
              className="w-full bg-canvas-bg border border-border-subtle rounded-md p-3 font-inter text-small text-text-body resize-none focus:outline-none focus:ring-1 focus:ring-brand-black"
            />
            <p className="flex items-center gap-1.5 font-inter text-caption text-text-muted mt-3">
              <Lock size={14} strokeWidth={2} /> Private to Administrators
            </p>
          </div>

          <ComingSoon label="Message Startup" position="top">
            <span className="flex items-center justify-center gap-2 w-full py-2.5 border border-border-subtle rounded-md font-poppins font-semibold text-small text-text-heading">
              <MessageCircle size={16} strokeWidth={2} /> Message Startup
            </span>
          </ComingSoon>
        </div>
      </div>

      <div className="flex items-center justify-between mt-8 pt-6 border-t border-divider-line sticky bottom-0 bg-canvas-bg/95 backdrop-blur-sm py-4">
        <Button variant="outline" onClick={() => setOpenModal('changes')}>Request Changes</Button>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setOpenModal('reject')}
            className="px-6 py-2.5 border border-error text-error rounded-md font-poppins font-semibold text-small hover:bg-error/5 transition-colors"
          >
            Reject Opportunity
          </button>
          <button
            type="button"
            onClick={() => setOpenModal('approve')}
            className="px-6 py-2.5 bg-action-bg text-action-text rounded-md font-poppins font-semibold text-small hover:opacity-90 active:scale-[0.98] transition-all"
          >
            Approve Opportunity
          </button>
        </div>
      </div>

      <Modal isOpen={openModal === 'approve'} onClose={() => setOpenModal(null)} title="Approve Opportunity?">
        <p className="font-inter text-small text-text-body mb-6">
          "Senior Machine Learning Engineer" will go live and become visible to eligible students. This action is logged in the audit trail.
        </p>
        <div className="flex justify-end gap-2">
          <Button variant="outline" size="sm" onClick={() => setOpenModal(null)}>Cancel</Button>
          <Button variant="primary" size="sm" onClick={confirmDecision}>Confirm Approval</Button>
        </div>
      </Modal>

      <Modal isOpen={openModal === 'reject'} onClose={() => setOpenModal(null)} title="Reject Opportunity?">
        <p className="font-inter text-small text-text-body mb-6">
          The posting company will be notified this opportunity was rejected, along with your internal notes.
        </p>
        <div className="flex justify-end gap-2">
          <Button variant="outline" size="sm" onClick={() => setOpenModal(null)}>Cancel</Button>
          <button
            type="button"
            onClick={confirmDecision}
            className="px-4 py-2 bg-error text-white rounded-md font-poppins font-semibold text-small hover:opacity-90 transition-opacity"
          >
            Confirm Rejection
          </button>
        </div>
      </Modal>

      <Modal isOpen={openModal === 'changes'} onClose={() => setOpenModal(null)} title="Request Changes">
        <fieldset className="space-y-2 mb-6">
          <legend className="sr-only">Reason for requesting changes</legend>
          {CHANGE_REASONS.map((reason) => (
            <label key={reason} className="flex items-center gap-2 font-inter text-small text-text-body cursor-pointer">
              <input
                type="radio"
                name="change-reason"
                checked={changeReason === reason}
                onChange={() => setChangeReason(reason)}
                className="text-brand-black focus:ring-brand-black"
              />
              {reason}
            </label>
          ))}
        </fieldset>
        <div className="flex justify-end gap-2">
          <Button variant="outline" size="sm" onClick={() => setOpenModal(null)}>Cancel</Button>
          <Button variant="primary" size="sm" onClick={confirmDecision}>Send Request</Button>
        </div>
      </Modal>
    </AdminShell>
  );
}
