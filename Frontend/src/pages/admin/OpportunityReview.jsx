import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  ChevronRight,
  Terminal,
  Lock,
  MessageCircle,
  AlertCircle,
} from "lucide-react";
import AdminShell from "@/components/admin/AdminShell";
import Badge from "@/components/ui/Badge";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import ComingSoon from "@/components/ui/ComingSoon";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import api from "@/api/axiosInstance";
const CHANGE_REASONS = [
  "Missing compensation details",
  "Ambiguous eligibility criteria",
  "Requires company profile verification",
];

export default function OpportunityReviewPage() {
  useDocumentTitle("Opportunity Review — BOCC Admin");
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");

  const [opportunity, setOpportunity] = useState(null);
  const [loading, setLoading] = useState(true);

  const [openModal, setOpenModal] = useState(null); // 'approve' | 'reject' | 'changes' | null
  const [changeReason, setChangeReason] = useState(CHANGE_REASONS[0]);
  const [rejectReason, setRejectReason] = useState("");
  const [notes, setNotes] = useState("");
  const [noteSaved, setNoteSaved] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }
    api.get(`/admin/opportunities/${id}`)
      .then(res => {
        setOpportunity(res.data?.data?.opportunity || res.data?.data || res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch opportunity", err);
        setErrorMsg("Failed to load details");
        setLoading(false);
      });
  }, [id]);

  async function confirmDecision() {
    try {
      setErrorMsg("");

      if (openModal === "approve") {
        await api.post(`/admin/opportunities/${id}/approve`);
      } else if (openModal === "reject") {
        if (!rejectReason) {
          setErrorMsg("Reject reason is required.");
          return;
        }
        await api.post(`/admin/opportunities/${id}/reject`, { reason: rejectReason });
      } else if (openModal === "changes") {
        await api.post(`/admin/opportunities/${id}/request-changes`, { reason: changeReason, reviewerNotes: notes });
      }

      setOpenModal(null);
      navigate("/admin/opportunities");
    } catch (e) {
      console.error("Failed to update opportunity:", e);
      setErrorMsg(
        e?.response?.data?.message ||
          e?.message ||
          "Failed to update opportunity.",
      );
      setOpenModal(null);
    }
  }

  if (loading) {
    return (
      <AdminShell>
        <div className="flex items-center justify-center p-12">
          <span className="font-inter text-text-muted">Loading...</span>
        </div>
      </AdminShell>
    );
  }

  return (
    <AdminShell>
      <nav className="mb-6 flex items-center gap-2 text-text-muted font-inter font-normal text-small">
        <Link
          to="/admin/opportunities"
          className="hover:text-text-heading transition-colors"
        >
          Opportunities
        </Link>
        <ChevronRight size={14} strokeWidth={2} />
        <span className="text-text-heading font-semibold">#{id}</span>
      </nav>

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-poppins font-semibold text-page text-text-heading">
            Opportunity Review
          </h1>
          <p className="font-inter text-caption text-text-muted mt-1">
            #{id} · <Badge variant="warning">{opportunity?.status || "Pending Verification"}</Badge>
          </p>
        </div>
      </div>

      {errorMsg && (
        <div className="mb-6 p-4 rounded-lg border border-error/30 bg-error/15 text-error font-inter text-small flex items-center gap-2">
          <AlertCircle size={16} className="shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Company info */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-surface-white border border-border-subtle rounded-lg p-6 shadow-card">
            <div className="w-16 h-16 rounded-lg bg-canvas-bg border border-border-subtle flex items-center justify-center mb-4">
              <Terminal size={28} strokeWidth={2} className="text-text-muted" />
            </div>
            <h2 className="font-poppins font-semibold text-card text-text-heading mb-1">
              {opportunity?.company_id?.company_name || "Company Name"}
            </h2>
            <p className="font-inter text-caption text-text-muted uppercase tracking-wider mb-4">
              {opportunity?.company_id?.industry || "Industry"}
            </p>
            <div className="space-y-3">
              <div>
                <p className="font-inter text-caption text-text-muted uppercase mb-0.5">
                  Website
                </p>
                <p className="font-inter text-small text-brand-black underline">
                  {opportunity?.company_id?.website || "N/A"}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-surface-white border border-border-subtle rounded-lg p-6 shadow-card">
            <h3 className="font-poppins font-semibold text-body text-text-heading mb-3">
              Company Profile
            </h3>
            <p className="font-inter text-small text-text-body leading-relaxed">
              {opportunity?.company_id?.description || "No company profile available."}
            </p>
          </div>
        </div>

        {/* Opportunity detail */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-surface-white border border-border-subtle rounded-lg p-8 shadow-card">
            <div className="mb-6 pb-6 border-b border-divider-line">
              <h2 className="font-poppins font-semibold text-section text-text-heading mb-3">
                {opportunity?.title || "Opportunity Title"}
              </h2>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-canvas-bg rounded font-inter text-caption font-semibold uppercase text-text-body">
                  {opportunity?.opportunity_type || "Type"}
                </span>
                <span className="px-3 py-1 bg-canvas-bg rounded font-inter text-caption font-semibold uppercase text-text-body">
                  {opportunity?.location || "Location"}
                </span>
              </div>
            </div>
            <div className="space-y-6">
              <section>
                <h4 className="font-poppins font-semibold text-body text-text-heading mb-2">
                  Description
                </h4>
                <p className="font-inter text-body text-text-body leading-relaxed">
                  {opportunity?.description || "No description provided."}
                </p>
              </section>
              <section>
                <h4 className="font-poppins font-semibold text-body text-text-heading mb-2">
                  Responsibilities
                </h4>
                {Array.isArray(opportunity?.responsibilities) ? (
                  <ul className="list-disc pl-5 space-y-1.5 font-inter text-small text-text-body">
                    {opportunity.responsibilities.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                ) : Array.isArray(opportunity?.requirements) ? (
                  <ul className="list-disc pl-5 space-y-1.5 font-inter text-small text-text-body">
                    {opportunity.requirements.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="font-inter text-small text-text-body">
                    {opportunity?.responsibilities || opportunity?.requirements || "No responsibilities listed."}
                  </p>
                )}
              </section>
              <div className="grid grid-cols-2 gap-6 pt-6 border-t border-divider-line">
                <div>
                  <p className="font-inter text-caption text-text-muted uppercase mb-2">
                    Required Skills
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {(opportunity?.skills_required || opportunity?.skills || []).map((skill, idx) => (
                      <span
                        key={idx}
                        className="border border-border-subtle px-2 py-1 rounded font-inter text-caption text-text-body"
                      >
                        {skill}
                      </span>
                    ))}
                    {!(opportunity?.skills_required?.length > 0 || opportunity?.skills?.length > 0) && (
                      <span className="text-text-muted italic">No skills listed</span>
                    )}
                  </div>
                </div>
                <div>
                  <p className="font-inter text-caption text-text-muted uppercase mb-2">
                    Eligibility
                  </p>
                  <p className="font-inter text-small text-text-body">
                    {opportunity?.eligibility || opportunity?.qualifications || "Not specified."}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-divider-line">
                <div>
                  <p className="font-inter text-caption text-text-muted uppercase mb-1">
                    Duration
                  </p>
                  <p className="font-inter text-small text-text-heading">
                    {opportunity?.duration || "Not specified"}
                  </p>
                </div>
                <div>
                  <p className="font-inter text-caption text-text-muted uppercase mb-1">
                    Compensation
                  </p>
                  <p className="font-inter text-small text-text-heading">
                    {opportunity?.salary_range || opportunity?.stipend || opportunity?.compensation || "Not specified"}
                  </p>
                </div>
                <div>
                  <p className="font-inter text-caption text-text-muted uppercase mb-1">
                    Deadline
                  </p>
                  <p className="font-inter font-semibold text-small text-text-heading">
                    {opportunity?.deadline ? new Date(opportunity.deadline).toLocaleDateString() : "Not specified"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Review summary + notes */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-surface-white border border-border-subtle rounded-lg p-6 shadow-card">
            <h3 className="font-poppins font-semibold text-body text-text-heading mb-4">
              Review Summary
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="font-inter text-caption text-text-muted">
                  Submission
                </span>
                <span className="font-inter text-small text-text-heading">
                  Aug 28, 2024
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-inter text-caption text-text-muted">
                  Status
                </span>
                <Badge variant="neutral">Active Review</Badge>
              </div>
              <div className="pt-4 border-t border-divider-line">
                <p className="font-inter text-caption text-text-muted mb-3">
                  Revision History
                </p>
                <div className="space-y-3">
                  <div className="flex gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-brand-black mt-1.5 shrink-0" />
                    <div>
                      <p className="font-inter font-semibold text-small text-text-heading">
                        Submitted for Review
                      </p>
                      <p className="font-inter text-caption text-text-muted">
                        Aug 28, 09:12 AM
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3 opacity-50">
                    <div className="w-1.5 h-1.5 rounded-full bg-text-muted mt-1.5 shrink-0" />
                    <div>
                      <p className="font-inter font-semibold text-small text-text-heading">
                        Draft Created
                      </p>
                      <p className="font-inter text-caption text-text-muted">
                        Aug 27, 04:30 PM
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-surface-white border border-border-subtle rounded-lg p-6 shadow-card">
            <h3 className="font-poppins font-semibold text-body text-text-heading mb-3">
              Internal Notes
            </h3>
            {opportunity?.admin_notes && opportunity.admin_notes.length > 0 && (
              <div className="mb-4 space-y-3">
                {opportunity.admin_notes.map((note, idx) => (
                  <div key={idx} className="p-3 bg-canvas-bg rounded-md border border-border-subtle">
                    <p className="font-inter text-small text-text-body">{note.note || note.text || note}</p>
                  </div>
                ))}
              </div>
            )}
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add a private note for the review team..."
              rows={5}
              className="w-full bg-canvas-bg border border-border-subtle rounded-md p-3 font-inter text-small text-text-body resize-none focus:outline-none focus:ring-1 focus:ring-brand-black"
            />
            <div className="flex items-center justify-between mt-3">
              <p className="flex items-center gap-1.5 font-inter text-caption text-text-muted">
                <Lock size={14} strokeWidth={2} /> Private to Administrators
              </p>
              <button
                type="button"
                disabled={!notes.trim()}
                onClick={() => {
                  if (notes.trim()) {
                    setErrorMsg("");
                    api.post(`/admin/opportunities/${id}/notes`, { note: notes })
                      .then(() => {
                        setNoteSaved(true);
                        setNotes("");
                        setTimeout(() => setNoteSaved(false), 2000);
                        api.get(`/admin/opportunities/${id}`).then(res => {
                           setOpportunity(res.data?.data?.opportunity || res.data?.data || res.data);
                        });
                      })
                      .catch((err) => {
                        console.error("Failed to save notes:", err);
                        setErrorMsg(
                          err?.response?.data?.message ||
                            err?.message ||
                            "Failed to save notes.",
                        );
                      });
                  }
                }}
                className="font-inter font-medium text-caption uppercase tracking-wide text-action-text bg-action-bg px-3 py-1.5 rounded-md hover:opacity-90 transition-all disabled:opacity-50"
              >
                {noteSaved ? "Saved" : "Save"}
              </button>
            </div>
          </div>

          <ComingSoon label="Message Startup" position="top">
            <span className="flex items-center justify-center gap-2 w-full py-2.5 border border-border-subtle rounded-md font-poppins font-semibold text-small text-text-heading">
              <MessageCircle size={16} strokeWidth={2} /> Message Startup
            </span>
          </ComingSoon>
        </div>
      </div>

      <div className="flex items-center justify-between mt-8 pt-6 border-t border-divider-line sticky bottom-0 bg-canvas-bg/95 backdrop-blur-sm py-4">
        <Button variant="outline" onClick={() => setOpenModal("changes")}>
          Request Changes
        </Button>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setOpenModal("reject")}
            className="px-6 py-2.5 border border-error text-error rounded-md font-poppins font-semibold text-small hover:bg-error/5 transition-colors"
          >
            Reject Opportunity
          </button>
          <button
            type="button"
            onClick={() => setOpenModal("approve")}
            className="px-6 py-2.5 bg-action-bg text-action-text rounded-md font-poppins font-semibold text-small hover:opacity-90 active:scale-[0.98] transition-all"
          >
            Approve Opportunity
          </button>
        </div>
      </div>

      <Modal
        isOpen={openModal === "approve"}
        onClose={() => setOpenModal(null)}
        title="Approve Opportunity?"
      >
        <p className="font-inter text-small text-text-body mb-6">
          "Senior Machine Learning Engineer" will go live and become visible to
          eligible students. This action is logged in the audit trail.
        </p>
        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setOpenModal(null)}
          >
            Cancel
          </Button>
          <Button variant="primary" size="sm" onClick={confirmDecision}>
            Confirm Approval
          </Button>
        </div>
      </Modal>

      <Modal
        isOpen={openModal === "reject"}
        onClose={() => setOpenModal(null)}
        title="Reject Opportunity?"
      >
        <p className="font-inter text-small text-text-body mb-4">
          The posting company will be notified this opportunity was rejected,
          along with your internal notes.
        </p>
        <textarea
          value={rejectReason}
          onChange={(e) => setRejectReason(e.target.value)}
          placeholder="Reason for rejection (required)..."
          rows={3}
          className="w-full bg-canvas-bg border border-border-subtle rounded-md p-3 font-inter text-small text-text-body resize-none focus:outline-none focus:ring-1 focus:ring-brand-black mb-6"
        />
        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setOpenModal(null)}
          >
            Cancel
          </Button>
          <button
            type="button"
            onClick={confirmDecision}
            className="px-4 py-2 bg-error text-white rounded-md font-poppins font-semibold text-small hover:opacity-90 transition-opacity"
          >
            Confirm Rejection
          </button>
        </div>
      </Modal>

      <Modal
        isOpen={openModal === "changes"}
        onClose={() => setOpenModal(null)}
        title="Request Changes"
      >
        <fieldset className="space-y-2 mb-6">
          <legend className="sr-only">Reason for requesting changes</legend>
          {CHANGE_REASONS.map((reason) => (
            <label
              key={reason}
              className="flex items-center gap-2 font-inter text-small text-text-body cursor-pointer"
            >
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
          <Button
            variant="outline"
            size="sm"
            onClick={() => setOpenModal(null)}
          >
            Cancel
          </Button>
          <Button variant="primary" size="sm" onClick={confirmDecision}>
            Send Request
          </Button>
        </div>
      </Modal>
    </AdminShell>
  );
}
