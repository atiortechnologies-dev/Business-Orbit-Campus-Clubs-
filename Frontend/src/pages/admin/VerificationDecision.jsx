import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ChevronRight,
  CheckCircle,
  Globe,
  History,
  Send,
  CheckSquare,
  AlertCircle,
  Loader2,
} from "lucide-react";
import AdminShell from "@/components/admin/AdminShell";
import Badge from "@/components/ui/Badge";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import api from "@/api/axiosInstance";

export default function VerificationDecisionPage() {
  const { id } = useParams();
  useDocumentTitle(`User Review: ${id || "Loading"} — BOCC Admin`);
  const _navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState(null);

  const [openModal, setOpenModal] = useState(null); // 'approve' | 'reject' | 'request' | null
  const [decision, setDecision] = useState(null); // 'approved' | 'rejected' | null
  const [rejectReason, setRejectReason] = useState("");
  const [requestedDocs, setRequestedDocs] = useState([]);
  const [requestMessage, setRequestMessage] = useState("");
  const [notes, setNotes] = useState([]);
  const [draft, setDraft] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError(null);
        const res = await api.get(`/admin/users/verification/${id}`);
        setUserData(res.data);
        setNotes(res.data.notes || []);
        if (res.data.rejectReasons?.length > 0) {
          setRejectReason(res.data.rejectReasons[0]);
        } else {
          setRejectReason("Fraudulent Identity"); // Fallback default
        }
      } catch (err) {
        console.error("Failed to fetch user verification details:", err);
        setError(err?.response?.data?.message || err?.message || "Failed to load user details.");
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchData();
  }, [id]);

  function handleAddNote(e) {
    e.preventDefault();
    if (!draft.trim()) return;

    setErrorMsg("");
    api
      .post(`/admin/users/verification/${id}/notes`, { text: draft.trim() })
      .then(() => {
        setNotes((prev) => [
          ...prev,
          { author: "Admin User", text: draft.trim() },
        ]);
        setDraft("");
      })
      .catch((err) => {
        console.error("Failed to post note", err);
        setErrorMsg(
          err?.response?.data?.message ||
            err?.message ||
            "Failed to post note.",
        );
      });
  }

  async function confirmApprove() {
    try {
      setErrorMsg("");
      await api.post(`/admin/users/verification/${id}/decision`, {
        decision: "approved",
      });
      setDecision("approved");
      setOpenModal(null);
    } catch (err) {
      console.error("Failed to approve:", err);
      setErrorMsg(
        err?.response?.data?.message || err?.message || "Failed to approve.",
      );
      setOpenModal(null);
    }
  }
  async function confirmReject() {
    try {
      setErrorMsg("");
      await api.post(`/admin/users/verification/${id}/decision`, {
        decision: "rejected",
        reason: rejectReason,
      });
      setDecision("rejected");
      setOpenModal(null);
    } catch (err) {
      console.error("Failed to reject:", err);
      setErrorMsg(
        err?.response?.data?.message || err?.message || "Failed to reject.",
      );
      setOpenModal(null);
    }
  }
  async function confirmRequestDocs() {
    try {
      setErrorMsg("");
      await api.post(`/admin/users/verification/${id}/decision`, {
        decision: "request_docs",
        docs: requestedDocs,
        message: requestMessage,
      });
      setOpenModal(null);
      setRequestedDocs([]);
      setRequestMessage("");
    } catch (err) {
      console.error("Failed to request docs:", err);
      setErrorMsg(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to request docs.",
      );
      setOpenModal(null);
    }
  }

  if (loading) {
    return (
      <AdminShell>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="animate-spin text-text-muted" size={32} />
        </div>
      </AdminShell>
    );
  }

  if (error) {
    return (
      <AdminShell>
        <div className="mb-6 p-4 rounded-lg border border-error/30 bg-error/15 text-error font-inter text-small flex items-center gap-2">
          <AlertCircle size={16} className="shrink-0" />
          <span>{error}</span>
        </div>
      </AdminShell>
    );
  }

  if (!userData) return null;

  const {
    name = "Unknown User",
    initials = "??",
    role = "Unknown Role",
    email = "N/A",
    userId = id,
    appliedOn = "Unknown",
    trustScore = "0/100",
    riskFactors = [],
    checklist = [],
    rejectReasons = ["Fraudulent Identity", "Unverifiable Details", "Policy Violation"],
    requestDocsList = ["Updated Proof of Address", "Professional License Certification", "Tax Identification Document"]
  } = userData;

  return (
    <AdminShell>
      <nav className="mb-2 flex items-center gap-2 text-text-muted font-inter text-small">
        <Link
          to="/admin/verification"
          className="hover:text-text-heading transition-colors"
        >
          Verification Queue
        </Link>
        <ChevronRight size={14} strokeWidth={2} />
        <span className="text-text-heading font-semibold">
          User Review: #{userId}
        </span>
      </nav>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <h1 className="font-poppins font-semibold text-page text-text-heading">
          Decision Summary
        </h1>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setOpenModal("request")}
          >
            Request More Documents
          </Button>
          <button
            type="button"
            onClick={() => setOpenModal("reject")}
            className="px-4 py-2 border border-error text-error rounded-md font-poppins font-semibold text-small hover:bg-error/5 transition-colors"
          >
            Reject User
          </button>
          <button
            type="button"
            onClick={() => setOpenModal("approve")}
            className="px-4 py-2 bg-action-bg text-action-text rounded-md font-poppins font-semibold text-small hover:opacity-90 active:scale-[0.98] transition-all"
          >
            Approve User
          </button>
        </div>
      </div>

      {decision && (
        <div
          className={`mb-6 p-4 rounded-lg border font-inter text-small ${decision === "approved" ? "bg-success/10 border-success/30 text-success" : "bg-error/10 border-error/30 text-error"}`}
        >
          {decision === "approved"
            ? "This user has been approved."
            : "This user has been rejected."}
        </div>
      )}

      {errorMsg && (
        <div className="mb-6 p-4 rounded-lg border border-error/30 bg-error/15 text-error font-inter text-small flex items-center gap-2">
          <AlertCircle size={16} className="shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-6">
          <section className="bg-surface-white border border-border-subtle rounded-lg p-6 shadow-card flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-canvas-bg border border-border-subtle flex items-center justify-center font-poppins font-bold text-text-heading text-lg select-none shrink-0">
                {initials}
              </div>
              <div>
                <h2 className="font-poppins font-semibold text-card text-text-heading">
                  {name}
                </h2>
                <p className="font-inter text-small text-text-muted">
                  {role}
                </p>
                <p className="font-inter text-caption text-text-muted mt-1">
                  User ID: {userId} · {email}
                </p>
                <p className="font-inter text-caption text-text-muted">
                  Applied On: {appliedOn}
                </p>
              </div>
            </div>
            <div className="text-right shrink-0">
              <p className="font-inter text-caption text-text-muted uppercase mb-1">
                Trust Score
              </p>
              <Badge variant="success">{trustScore}</Badge>
            </div>
          </section>

          <section className="bg-surface-white border border-border-subtle rounded-lg p-6 shadow-card">
            <h3 className="font-poppins font-semibold text-body text-text-heading mb-4">
              Risk Factors
            </h3>
            <div className="space-y-3">
              {riskFactors.length > 0 ? riskFactors.map((factor, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  {factor.icon === 'Globe' ? (
                    <Globe
                      size={18}
                      strokeWidth={2}
                      className="text-text-muted shrink-0"
                    />
                  ) : factor.icon === 'History' ? (
                    <History
                      size={18}
                      strokeWidth={2}
                      className="text-text-muted shrink-0"
                    />
                  ) : (
                    <AlertCircle size={18} strokeWidth={2} className="text-text-muted shrink-0" />
                  )}
                  <span className="flex-1 font-inter text-small text-text-body">
                    {factor.label}
                  </span>
                  {factor.cleared ? (
                    <span className="flex items-center gap-1 text-success font-inter text-caption font-semibold">
                      <CheckCircle size={14} strokeWidth={2} /> Cleared
                    </span>
                  ) : (
                    <span className="font-inter text-caption text-text-muted">
                      {factor.status || "Pending"}
                    </span>
                  )}
                </div>
              )) : (
                 <div className="font-inter text-small text-text-muted">
                    No risk factors identified.
                 </div>
              )}
            </div>
          </section>

          <section className="bg-surface-white border border-border-subtle rounded-lg p-6 shadow-card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-poppins font-semibold text-body text-text-heading">
                Verification Checklist
              </h3>
              <Badge variant="success">
                {checklist.filter(c => c.done).length}/{checklist.length} Completed
              </Badge>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {checklist.map((item) => (
                <div key={item.label} className="flex items-center gap-2">
                  <CheckSquare
                    size={18}
                    strokeWidth={2}
                    className={`${item.done ? "text-success" : "text-text-muted"} shrink-0`}
                  />
                  <span className="font-inter text-small text-text-body">
                    {item.label}
                  </span>
                </div>
              ))}
              {checklist.length === 0 && (
                <div className="font-inter text-small text-text-muted">
                  No checklist items available.
                </div>
              )}
            </div>
          </section>
        </div>

        <div className="lg:col-span-4">
          <section className="bg-surface-white border border-border-subtle rounded-lg p-6 shadow-card sticky top-24">
            <h3 className="font-poppins font-semibold text-body text-text-heading mb-4">
              Internal Audit Notes
            </h3>
            <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
              {notes.map((note, i) => (
                <div key={i} className="p-3 bg-canvas-bg rounded-md">
                  <p className="font-inter font-semibold text-caption text-text-heading mb-0.5">
                    {note.author}
                  </p>
                  <p className="font-inter text-small text-text-body">
                    {note.text}
                  </p>
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
              <button
                type="submit"
                className="p-2 h-fit bg-action-bg text-action-text rounded-md hover:opacity-90 transition-opacity"
                aria-label="Add note"
              >
                <Send size={16} strokeWidth={2} />
              </button>
            </form>
          </section>
        </div>
      </div>

      <Modal
        isOpen={openModal === "approve"}
        onClose={() => setOpenModal(null)}
        title="Approve User Access?"
      >
        <p className="font-inter text-small text-text-body mb-6">
          {name} will gain full verified access to the platform. This
          action is logged in the audit trail.
        </p>
        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setOpenModal(null)}
          >
            Cancel
          </Button>
          <Button variant="primary" size="sm" onClick={confirmApprove}>
            Confirm Approval
          </Button>
        </div>
      </Modal>

      <Modal
        isOpen={openModal === "reject"}
        onClose={() => setOpenModal(null)}
        title="Rejection Reason"
      >
        <fieldset className="space-y-2 mb-6">
          <legend className="sr-only">Rejection reason</legend>
          {rejectReasons.map((reason) => (
            <label
              key={reason}
              className="flex items-center gap-2 font-inter text-small text-text-body cursor-pointer"
            >
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
          <Button
            variant="outline"
            size="sm"
            onClick={() => setOpenModal(null)}
          >
            Cancel
          </Button>
          <button
            type="button"
            onClick={confirmReject}
            className="px-4 py-2 bg-error text-white rounded-md font-poppins font-semibold text-small hover:opacity-90 transition-opacity"
          >
            Confirm Rejection
          </button>
        </div>
      </Modal>

      <Modal
        isOpen={openModal === "request"}
        onClose={() => setOpenModal(null)}
        title="Request Additional Documents"
      >
        <div className="space-y-2 mb-4">
          {requestDocsList.map((doc) => (
            <label
              key={doc}
              className="flex items-center gap-2 font-inter text-small text-text-body cursor-pointer"
            >
              <input
                type="checkbox"
                checked={requestedDocs.includes(doc)}
                onChange={(e) =>
                  setRequestedDocs((prev) =>
                    e.target.checked
                      ? [...prev, doc]
                      : prev.filter((d) => d !== doc),
                  )
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
          <Button
            variant="outline"
            size="sm"
            onClick={() => setOpenModal(null)}
          >
            Cancel
          </Button>
          <Button variant="primary" size="sm" onClick={confirmRequestDocs}>
            Send Request
          </Button>
        </div>
      </Modal>
    </AdminShell>
  );
}
