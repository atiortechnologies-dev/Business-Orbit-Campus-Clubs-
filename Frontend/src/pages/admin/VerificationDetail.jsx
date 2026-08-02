import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
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
  Loader2,
} from "lucide-react";
import AdminShell from "@/components/admin/AdminShell";
import Badge from "@/components/ui/Badge";
import ComingSoon from "@/components/ui/ComingSoon";
import Modal from "@/components/ui/Modal";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import api from "@/api/axiosInstance";

export default function VerificationDetailPage() {
  const { id } = useParams();
  useDocumentTitle(`User Profile: ${id || "Loading"} — BOCC Admin`);
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState(null);

  const [notes, setNotes] = useState([]);
  const [draft, setDraft] = useState("");
  const [requestInfoOpen, setRequestInfoOpen] = useState(false);
  const [requestInfoText, setRequestInfoText] = useState("");
  const [requestInfoSent, setRequestInfoSent] = useState(false);
  const [noteErrorMsg, setNoteErrorMsg] = useState("");
  const [requestErrorMsg, setRequestErrorMsg] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError(null);
        const res = await api.get(`/admin/users/verification/${id}`);
        setUserData(res.data);
        setNotes(res.data.notes || []);
      } catch (err) {
        console.error("Failed to fetch user verification details:", err);
        setError(err?.response?.data?.message || err?.message || "Failed to load user details.");
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchData();
  }, [id]);

  async function handleAddNote(e) {
    e.preventDefault();
    if (!draft.trim()) return;
    try {
      setNoteErrorMsg("");
      await api.post(`/admin/users/verification/${id}/notes`, { text: draft.trim() });
      setNotes((prev) => [
        ...prev,
        { author: "Admin", text: draft.trim() },
      ]);
      setDraft("");
    } catch (err) {
      console.error("Failed to add note:", err);
      setNoteErrorMsg(
        err?.response?.data?.message || err?.message || "Failed to add note.",
      );
    }
  }

  async function handleSendRequestInfo() {
    if (!requestInfoText.trim()) return;
    try {
      setRequestErrorMsg("");
      await api.post(`/admin/users/verification/${id}/request-info`, {
        message: requestInfoText.trim(),
      });
      setNotes((prev) => [
        ...prev,
        {
          author: "Admin",
          text: `Requested more info: "${requestInfoText.trim()}"`,
        },
      ]);
      setRequestInfoText("");
      setRequestInfoOpen(false);
      setRequestInfoSent(true);
      setTimeout(() => setRequestInfoSent(false), 2500);
    } catch (err) {
      console.error("Failed to send request info:", err);
      setRequestErrorMsg(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to send request.",
      );
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
    affiliation = "Unknown Affiliation",
    region = "Unknown Region",
    memberSince = "Unknown",
    email = "N/A",
    phone = "N/A",
    location = "N/A",
    docCompletion = "0%",
    checksPassed = "0/0",
    riskRating = "UNKNOWN",
    documents = [],
    checklist = [],
    timeline = [],
  } = userData;

  return (
    <AdminShell>
      {requestInfoSent && (
        <div className="mb-6 p-4 rounded-lg border border-success/30 bg-success/10 text-success font-inter text-small">
          Info request sent to {name}.
        </div>
      )}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <Link
          to="/admin/verification"
          className="flex items-center gap-2 text-text-muted hover:text-text-heading font-poppins font-semibold text-small transition-colors"
        >
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
            onClick={() => navigate(`/admin/verification/decision/${id}`)}
            className="px-4 py-2 bg-action-bg text-action-text rounded-md font-poppins font-semibold text-small hover:opacity-90 active:scale-[0.98] transition-all"
          >
            Verify User
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4 space-y-6">
          <section className="bg-surface-white border border-border-subtle rounded-lg p-6 shadow-card text-center">
            <div className="relative w-20 h-20 mx-auto mb-4">
              <div className="w-full h-full rounded-full bg-canvas-bg border border-border-subtle flex items-center justify-center font-poppins font-bold text-text-heading text-2xl select-none">
                {initials}
              </div>
              <span className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-brand-black border-2 border-surface-white flex items-center justify-center">
                <BadgeCheck size={16} strokeWidth={2} className="text-white" />
              </span>
            </div>
            <h2 className="font-poppins font-semibold text-card text-text-heading">
              {name}
            </h2>
            <p className="font-inter text-small text-text-muted mb-3">
              {role}
            </p>
            <div className="flex justify-center gap-2 mb-6">
              <Badge variant="success">Active</Badge>
              <Badge variant="neutral">Tier 2</Badge>
            </div>
            <dl className="text-left space-y-3 pt-4 border-t border-divider-line">
              <div className="flex justify-between gap-4">
                <dt className="font-inter text-small text-text-muted">
                  Affiliation
                </dt>
                <dd className="font-inter font-medium text-small text-text-heading text-right">
                  {affiliation}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="font-inter text-small text-text-muted">
                  Region
                </dt>
                <dd className="font-inter font-medium text-small text-text-heading text-right">
                  {region}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="font-inter text-small text-text-muted">
                  Member Since
                </dt>
                <dd className="font-inter font-medium text-small text-text-heading text-right">
                  {memberSince}
                </dd>
              </div>
            </dl>
          </section>

          <section className="bg-surface-white border border-border-subtle rounded-lg p-6 shadow-card">
            <h3 className="font-poppins font-semibold text-body text-text-heading mb-4">
              Contact Information
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Mail
                  size={16}
                  strokeWidth={2}
                  className="text-text-muted shrink-0"
                />
                <span className="font-inter text-small text-text-body truncate">
                  {email}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Phone
                  size={16}
                  strokeWidth={2}
                  className="text-text-muted shrink-0"
                />
                <span className="font-inter text-small text-text-body">
                  {phone}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin
                  size={16}
                  strokeWidth={2}
                  className="text-text-muted shrink-0"
                />
                <span className="font-inter text-small text-text-body">
                  {location}
                </span>
              </div>
            </div>
          </section>
        </div>

        <div className="lg:col-span-5 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-surface-white border border-border-subtle rounded-lg p-4 shadow-card">
              <p className="font-inter text-caption text-text-muted uppercase mb-1">
                Doc Completion
              </p>
              <p className="font-poppins font-semibold text-card text-text-heading">
                {docCompletion}
              </p>
            </div>
            <div className="bg-surface-white border border-border-subtle rounded-lg p-4 shadow-card">
              <p className="font-inter text-caption text-text-muted uppercase mb-1">
                Checks Passed
              </p>
              <p className="font-poppins font-semibold text-card text-text-heading">
                {checksPassed}
              </p>
            </div>
            <div className="bg-surface-white border border-border-subtle rounded-lg p-4 shadow-card">
              <p className="font-inter text-caption text-text-muted uppercase mb-1">
                Risk Rating
              </p>
              <p className="font-poppins font-semibold text-card text-success">
                {riskRating}
              </p>
            </div>
          </div>

          <section className="bg-surface-white border border-border-subtle rounded-lg shadow-card overflow-hidden">
            <div className="px-6 py-4 border-b border-border-subtle bg-canvas-bg/50 flex items-center justify-between">
              <h3 className="font-poppins font-semibold text-body text-text-heading">
                Submitted Documents
              </h3>
              <ComingSoon label="Download All" position="top" inline>
                <span className="font-inter font-medium text-small text-text-body">
                  Download All
                </span>
              </ComingSoon>
            </div>
            <div className="divide-y divide-border-subtle">
              {documents.map((doc) => (
                <div key={doc.name} className="p-4 flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded flex items-center justify-center shrink-0 ${doc.flagged ? "bg-error/10 text-error" : "bg-canvas-bg text-text-muted"}`}
                  >
                    {doc.name.endsWith(".jpg") ? (
                      <ImageIcon size={18} strokeWidth={2} />
                    ) : (
                      <FileText size={18} strokeWidth={2} />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-inter font-medium text-small text-text-heading truncate">
                      {doc.name}
                    </p>
                    {doc.flagged ? (
                      <p className="flex items-center gap-1 font-inter text-caption text-error">
                        <AlertCircle size={12} strokeWidth={2} /> Flagged:{" "}
                        {doc.flagReason}
                      </p>
                    ) : (
                      <p className="font-inter text-caption text-text-muted">
                        {doc.size}
                      </p>
                    )}
                  </div>
                  {doc.flagged ? (
                    <ComingSoon label="Replace document" position="top" inline>
                      <span className="px-3 py-1.5 border border-error/40 text-error rounded-md font-inter font-medium text-caption">
                        Replace
                      </span>
                    </ComingSoon>
                  ) : (
                    <ComingSoon
                      label={`Download ${doc.name}`}
                      position="top"
                      inline
                    >
                      <span className="p-2 text-text-muted rounded-md">
                        <Download size={16} strokeWidth={2} />
                      </span>
                    </ComingSoon>
                  )}
                </div>
              ))}
              {documents.length === 0 && (
                <div className="p-4 text-center font-inter text-small text-text-muted">
                  No documents submitted.
                </div>
              )}
            </div>
          </section>

          <section className="bg-surface-white border border-border-subtle rounded-lg p-6 shadow-card">
            <h3 className="font-poppins font-semibold text-body text-text-heading mb-4">
              Verification Checklist
            </h3>
            <div className="space-y-3">
              {checklist.map(({ label, done }) => (
                <label key={label} className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={done}
                    disabled
                    className="rounded border-border-subtle text-brand-black"
                  />
                  <span
                    className={`font-inter text-small ${done ? "text-text-body" : "text-text-muted"}`}
                  >
                    {label}
                  </span>
                </label>
              ))}
              {checklist.length === 0 && (
                <div className="font-inter text-small text-text-muted">
                  No checklist items.
                </div>
              )}
            </div>
          </section>
        </div>

        <div className="lg:col-span-3 space-y-6">
          <section className="bg-surface-white border border-border-subtle rounded-lg p-6 shadow-card">
            <h3 className="font-poppins font-semibold text-body text-text-heading mb-4">
              Audit Timeline
            </h3>
            <div className="space-y-4">
              {timeline.map(({ label, time, variant, current }) => (
                <div key={label} className="flex items-start gap-3">
                  <div
                    className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${variant === "error" ? "bg-error" : current ? "bg-accent-neon" : "bg-text-muted"}`}
                  />
                  <div>
                    <p
                      className={`font-inter font-medium text-small ${variant === "error" ? "text-error" : "text-text-heading"}`}
                    >
                      {label}
                    </p>
                    <p className="font-inter text-caption text-text-muted">
                      {time}
                    </p>
                  </div>
                </div>
              ))}
              {timeline.length === 0 && (
                <div className="font-inter text-small text-text-muted">
                  No timeline events.
                </div>
              )}
            </div>
          </section>

          <section className="bg-surface-white border border-border-subtle rounded-lg p-6 shadow-card">
            <h3 className="font-poppins font-semibold text-body text-text-heading mb-4">
              Internal Command Notes
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
            {noteErrorMsg && (
               <div className="p-3 bg-error/15 border border-error/30 text-error rounded-md text-small flex items-center gap-2 mb-4">
                 <AlertCircle size={16} className="shrink-0" />
                 <span>{noteErrorMsg}</span>
               </div>
            )}
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
        isOpen={requestInfoOpen}
        onClose={() => setRequestInfoOpen(false)}
        title="Request more info"
      >
        {requestErrorMsg && (
          <div className="p-3 bg-error/15 border border-error/30 text-error rounded-md text-small flex items-center gap-2 mb-4">
            <AlertCircle size={16} className="shrink-0" />
            <span>{requestErrorMsg}</span>
          </div>
        )}
        <p className="font-inter text-small text-text-muted mb-3">
          Sent to {name} by email and logged against this record.
        </p>
        <textarea
          value={requestInfoText}
          onChange={(e) => setRequestInfoText(e.target.value)}
          placeholder="e.g. Please re-upload a clearer copy of your proof of residency."
          rows={4}
          className="w-full bg-canvas-bg border border-border-subtle rounded-md p-3 font-inter text-small text-text-body resize-none focus:outline-none focus:ring-1 focus:ring-brand-black mb-4"
        />
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => setRequestInfoOpen(false)}
            className="border border-border-subtle text-text-heading px-5 py-2 rounded-md hover:bg-canvas-bg transition-colors font-poppins font-semibold text-small"
          >
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
