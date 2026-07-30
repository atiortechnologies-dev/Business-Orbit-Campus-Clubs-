import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, User, GraduationCap, MessageSquare, ShieldCheck } from 'lucide-react';
import AdminShell from '@/components/admin/AdminShell';
import Badge from '@/components/ui/Badge';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

// TODO(backend): replace with GET /admin/users/verification/:id for this
// student's registration — no wireframe covers this role, so fields are
// sourced from the real signup + complete-profile fields (StudentSignup.jsx,
// complete-profile/Student.jsx) instead.
const APPLICATION = {
  id: 'STU-2201-2024',
  fullName: 'Priya Chen',
  email: 'priya.chen@stanford.edu',
  phone: '+1 (555) 402-7731',
  college: 'Stanford Chapter',
  degree: 'B-Tech, Computer Science',
  graduationYear: '2026',
  skills: ['Product Strategy', 'Fintech', 'Leadership'],
};

export default function StudentVerificationPage() {
  useDocumentTitle(`Student Verification: #${APPLICATION.id} — BOCC Admin`);

  const [openModal, setOpenModal] = useState(null); // 'approve' | 'reject' | 'request' | null
  const [decision, setDecision] = useState(null); // 'approved' | 'rejected' | null
  const [remarks, setRemarks] = useState('');
  const [requestText, setRequestText] = useState('');

  // TODO(backend): each of these should POST the real decision to
  // /admin/users/verification/:id/decision. For now they just update local
  // state honestly (no fake network delay) and close the modal.
  function confirmApprove() {
    setDecision('approved');
    setOpenModal(null);
  }
  function confirmReject() {
    setDecision('rejected');
    setOpenModal(null);
  }
  function confirmRequestInfo() {
    setOpenModal(null);
    setRequestText('');
  }

  return (
    <AdminShell>
      <nav className="mb-2 flex items-center gap-2 text-text-muted font-inter text-small">
        <Link to="/admin/verification" className="hover:text-text-heading transition-colors">Verification</Link>
        <ChevronRight size={14} strokeWidth={2} />
        <span className="text-text-heading font-semibold">Student Details</span>
      </nav>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="font-poppins font-semibold text-page text-text-heading">Student Verification</h1>
          <p className="font-inter text-body text-text-body mt-1">
            Review campus affiliation and profile details for platform accreditation.
          </p>
        </div>
        <Badge variant="warning">Pending Review</Badge>
      </div>

      {decision && (
        <div className={`mb-6 p-4 rounded-lg border font-inter text-small ${decision === 'approved' ? 'bg-success/10 border-success/30 text-success' : 'bg-error/10 border-error/30 text-error'}`}>
          {decision === 'approved' ? `${APPLICATION.fullName} has been approved as a verified Student.` : `${APPLICATION.fullName}'s student registration has been rejected.`}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-6">
          <section className="bg-surface-white border border-border-subtle rounded-lg p-6 shadow-card">
            <div className="flex items-center gap-2 mb-4">
              <User size={16} strokeWidth={2} className="text-text-heading" />
              <h3 className="font-poppins font-semibold text-caption uppercase tracking-wider text-text-heading">Basic Information</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <p className="font-inter text-caption text-text-muted uppercase mb-1">Full Name</p>
                <p className="font-inter font-medium text-small text-text-heading">{APPLICATION.fullName}</p>
              </div>
              <div>
                <p className="font-inter text-caption text-text-muted uppercase mb-1">Email Address</p>
                <p className="font-inter font-medium text-small text-text-heading">{APPLICATION.email}</p>
              </div>
              <div>
                <p className="font-inter text-caption text-text-muted uppercase mb-1">Phone Number</p>
                <p className="font-inter font-medium text-small text-text-heading">{APPLICATION.phone}</p>
              </div>
            </div>
          </section>

          <section className="bg-surface-white border border-border-subtle rounded-lg p-6 shadow-card">
            <div className="flex items-center gap-2 mb-4">
              <GraduationCap size={16} strokeWidth={2} className="text-text-heading" />
              <h3 className="font-poppins font-semibold text-caption uppercase tracking-wider text-text-heading">Student Details</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
              <div>
                <p className="font-inter text-caption text-text-muted uppercase mb-1">College / Chapter</p>
                <p className="font-inter font-medium text-small text-text-heading">{APPLICATION.college}</p>
              </div>
              <div>
                <p className="font-inter text-caption text-text-muted uppercase mb-1">Degree</p>
                <p className="font-inter font-medium text-small text-text-heading">{APPLICATION.degree}</p>
              </div>
              <div>
                <p className="font-inter text-caption text-text-muted uppercase mb-1">Graduation Year</p>
                <p className="font-inter font-medium text-small text-text-heading">{APPLICATION.graduationYear}</p>
              </div>
            </div>
            <div>
              <p className="font-inter text-caption text-text-muted uppercase mb-2">Skills</p>
              <div className="flex flex-wrap gap-2">
                {APPLICATION.skills.map((tag) => (
                  <span key={tag} className="px-2.5 py-1 bg-canvas-bg border border-border-subtle rounded-md font-inter text-caption text-text-body">{tag}</span>
                ))}
              </div>
            </div>
          </section>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <section className="bg-surface-white border border-border-subtle rounded-lg p-6 shadow-card">
            <div className="flex items-center gap-2 mb-4">
              <MessageSquare size={16} strokeWidth={2} className="text-text-heading" />
              <h3 className="font-poppins font-semibold text-caption uppercase tracking-wider text-text-heading">Admin Remarks</h3>
            </div>
            <textarea
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="Enter internal verification notes..."
              rows={5}
              className="w-full bg-canvas-bg border border-border-subtle rounded-md p-3 font-inter text-small text-text-body resize-none focus:outline-none focus:ring-1 focus:ring-brand-black"
            />
          </section>

          <section className="bg-surface-white border border-border-subtle rounded-lg p-6 shadow-card">
            <div className="flex items-center gap-2 mb-4">
              <ShieldCheck size={16} strokeWidth={2} className="text-text-heading" />
              <h3 className="font-poppins font-semibold text-caption uppercase tracking-wider text-text-heading">Verification Actions</h3>
            </div>
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => setOpenModal('approve')}
                className="w-full py-3 bg-action-bg text-action-text rounded-md font-poppins font-semibold text-small hover:opacity-90 active:scale-[0.98] transition-all"
              >
                Approve User
              </button>
              <button
                type="button"
                onClick={() => setOpenModal('request')}
                className="w-full py-3 border border-border-subtle rounded-md font-poppins font-semibold text-small text-text-heading hover:bg-canvas-bg transition-colors"
              >
                Request More Information
              </button>
              <button
                type="button"
                onClick={() => setOpenModal('reject')}
                className="w-full py-3 border border-error text-error rounded-md font-poppins font-semibold text-small hover:bg-error/5 transition-colors"
              >
                Reject User
              </button>
            </div>
          </section>
        </div>
      </div>

      <Modal isOpen={openModal === 'approve'} onClose={() => setOpenModal(null)} title="Approve Student Access?">
        <p className="font-inter text-small text-text-body mb-6">
          {APPLICATION.fullName} will be listed as a verified Student on the platform. This action is logged in the audit trail.
        </p>
        <div className="flex justify-end gap-2">
          <Button variant="outline" size="sm" onClick={() => setOpenModal(null)}>Cancel</Button>
          <Button variant="primary" size="sm" onClick={confirmApprove}>Confirm Approval</Button>
        </div>
      </Modal>

      <Modal isOpen={openModal === 'reject'} onClose={() => setOpenModal(null)} title="Reject Student Registration?">
        <p className="font-inter text-small text-text-body mb-6">
          {APPLICATION.fullName} will be notified that their registration was not approved.
        </p>
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

      <Modal isOpen={openModal === 'request'} onClose={() => setOpenModal(null)} title="Request More Information">
        <textarea
          value={requestText}
          onChange={(e) => setRequestText(e.target.value)}
          placeholder="e.g. Please provide a valid student ID or enrollment proof."
          rows={4}
          className="w-full bg-canvas-bg border border-border-subtle rounded-md p-3 font-inter text-small text-text-body resize-none focus:outline-none focus:ring-1 focus:ring-brand-black mb-4"
        />
        <div className="flex justify-end gap-2">
          <Button variant="outline" size="sm" onClick={() => setOpenModal(null)}>Cancel</Button>
          <Button variant="primary" size="sm" disabled={!requestText.trim()} onClick={confirmRequestInfo}>Send Request</Button>
        </div>
      </Modal>
    </AdminShell>
  );
}
