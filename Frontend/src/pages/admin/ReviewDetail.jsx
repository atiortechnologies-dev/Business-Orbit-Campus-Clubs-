import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  ChevronRight,
  Rocket,
  Globe,
  Presentation,
  FileText,
  FileSpreadsheet,
  FileArchive,
  Download,
  Calendar,
  History,
  AlertCircle,
} from "lucide-react";
import AdminShell from "@/components/admin/AdminShell";
import Badge from "@/components/ui/Badge";
import ComingSoon from "@/components/ui/ComingSoon";
import Modal from "@/components/ui/Modal";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import api from "@/api/axiosInstance";



export default function ReviewDetailPage() {
  useDocumentTitle("Review Detail — BOCC Admin");
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");

  const [submission, setSubmission] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");

  const [revisionRequested, setRevisionRequested] = useState(false);
  const [previousReviewsOpen, setPreviousReviewsOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (!id) return;
    const fetchDetail = async () => {
      setLoading(true);
      setFetchError("");
      try {
        const res = await api.get(`/admin/reviews/${id}`);
        if (res.success) {
          setSubmission(res.data);
        } else {
          setFetchError(res.message || "Failed to fetch submission details");
        }
      } catch (err) {
        setFetchError(err.message || "An error occurred");
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  if (loading) {
    return (
      <AdminShell>
        <div className="p-6">Loading submission details...</div>
      </AdminShell>
    );
  }

  if (fetchError || !submission) {
    return (
      <AdminShell>
        <div className="p-6 text-error">
          {fetchError || "Submission not found."}
        </div>
      </AdminShell>
    );
  }

  const timeline = submission.timeline || [];
  const files = submission.files || [];
  const previousReviews = submission.previousReviews || [];
  const startupName = submission.startup_id?.startup_name || "Unknown Startup";
  const stageName = submission.stage_id?.stage_name || "Unknown Stage";
  const founderName = submission.startup_id?.student_id?.full_name || "Unknown Founder";
  const chapter = submission.startup_id?.chapter || "N/A";
  const reviewerName = submission.assigned_reviewer_id?.full_name || "Unassigned";

  return (
    <AdminShell>
      <nav className="mb-6 flex items-center gap-2 text-text-muted font-inter text-small">
        <Link
          to="/admin/reviews"
          className="hover:text-text-heading transition-colors"
        >
          Stage Approval Queue
        </Link>
        <ChevronRight size={14} strokeWidth={2} />
        <span className="text-text-heading font-semibold">
          Review: {startupName}
        </span>
      </nav>

      {revisionRequested && (
        <div className="mb-6 p-4 rounded-lg border border-warning/30 bg-warning/10 text-warning font-inter text-small">
          A revision request has been logged for {startupName}.
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left column */}
        <div className="lg:col-span-8 space-y-6">
          <section className="bg-surface-white border border-border-subtle rounded-lg p-6 shadow-card">
            <div className="flex items-center gap-4 mb-2">
              <div className="w-12 h-12 rounded-lg bg-brand-black text-white flex items-center justify-center shrink-0">
                <Rocket size={22} strokeWidth={2} />
              </div>
              <div>
                <h1 className="font-poppins font-semibold text-card text-text-heading">
                  {startupName}
                </h1>
                <Badge variant="brand" className="mt-1">
                  Stage: {stageName}
                </Badge>
              </div>
            </div>
            <dl className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 mt-4 border-t border-divider-line">
              <div>
                <dt className="font-inter text-caption text-text-muted uppercase">
                  Founder
                </dt>
                <dd className="font-inter font-medium text-small text-text-heading">
                  {founderName}
                </dd>
              </div>
              <div>
                <dt className="font-inter text-caption text-text-muted uppercase">
                  Chapter
                </dt>
                <dd className="font-inter font-medium text-small text-text-heading">
                  {chapter}
                </dd>
              </div>
              <div>
                <dt className="font-inter text-caption text-text-muted uppercase">
                  Mentor
                </dt>
                <dd className="font-inter font-medium text-small text-text-heading">
                  {reviewerName}
                </dd>
              </div>
            </dl>
          </section>

          <section className="bg-surface-white border border-border-subtle rounded-lg p-6 shadow-card">
            <h3 className="font-poppins font-semibold text-body text-text-heading mb-6">
              Progress Timeline
            </h3>
            <div className="relative flex justify-between">
              {timeline.length > 0 ? (
                <>
                  <div className="absolute top-4 left-0 right-0 h-px bg-border-subtle" />
                  {timeline.map(({ label, date, status }) => (
                    <div
                      key={label}
                      className="relative z-10 flex flex-col items-center gap-2 text-center flex-1"
                    >
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center border-4 border-surface-white ${
                          status === "done"
                            ? "bg-success text-white"
                            : status === "active"
                              ? "bg-brand-black text-white"
                              : "bg-canvas-bg border border-border-subtle text-text-muted"
                        }`}
                      >
                        {status === "active" && (
                          <div className="w-2 h-2 rounded-full bg-accent-neon" />
                        )}
                      </div>
                      <p
                        className={`font-inter font-medium text-caption ${status === "pending" ? "text-text-muted" : "text-text-heading"}`}
                      >
                        {label}
                      </p>
                      <p className="font-inter text-caption text-text-muted">
                        {date}
                      </p>
                    </div>
                  ))}
                </>
              ) : (
                <p className="font-inter text-small text-text-muted">No timeline available.</p>
              )}
            </div>
          </section>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <ComingSoon
              label="View MVP Resources"
              position="top"
              className="bg-surface-white border border-border-subtle rounded-lg p-6 shadow-card"
            >
              <Globe
                size={20}
                strokeWidth={2}
                className="text-text-muted mb-3"
              />
              <h4 className="font-poppins font-semibold text-body text-text-heading mb-1">
                MVP Links
              </h4>
              <p className="font-inter text-small text-text-muted mb-3">
                Prototype URL &amp; staging environment.
              </p>
              <span className="font-inter font-semibold text-small text-text-heading">
                View Resources →
              </span>
            </ComingSoon>
            <ComingSoon
              label="Open Pitch Deck"
              position="top"
              className="bg-surface-white border border-border-subtle rounded-lg p-6 shadow-card"
            >
              <Presentation
                size={20}
                strokeWidth={2}
                className="text-text-muted mb-3"
              />
              <h4 className="font-poppins font-semibold text-body text-text-heading mb-1">
                Pitch Deck
              </h4>
              <p className="font-inter text-small text-text-muted mb-3">
                Finalized investor deck v2.4.
              </p>
              <span className="font-inter font-semibold text-small text-text-heading">
                Open Deck →
              </span>
            </ComingSoon>
          </div>

          <section className="bg-surface-white border border-border-subtle rounded-lg shadow-card overflow-hidden">
            <div className="px-6 py-4 border-b border-border-subtle bg-canvas-bg/50 flex items-center justify-between">
              <h3 className="font-poppins font-semibold text-body text-text-heading">
                Uploaded Evidence Files
              </h3>
              <ComingSoon label="Download All" position="top" inline>
                <span className="font-inter font-medium text-small text-text-body">
                  Download All
                </span>
              </ComingSoon>
            </div>
            <div className="divide-y divide-border-subtle">
              {files.length > 0 ? (
                files.map(({ name, size }) => (
                  <div key={name} className="p-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded bg-canvas-bg text-text-muted flex items-center justify-center shrink-0">
                      <FileText size={18} strokeWidth={2} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-inter font-medium text-small text-text-heading truncate">
                        {name}
                      </p>
                      <p className="font-inter text-caption text-text-muted">
                        {size}
                      </p>
                    </div>
                    <ComingSoon label={`Download ${name}`} position="top" inline>
                      <span className="p-2 text-text-muted rounded-md">
                        <Download size={16} strokeWidth={2} />
                      </span>
                    </ComingSoon>
                  </div>
                ))
              ) : (
                <div className="p-4 font-inter text-small text-text-muted">No files attached.</div>
              )}
            </div>
          </section>
        </div>

        {/* Right column */}
        <div className="lg:col-span-4 space-y-6">
          <section className="bg-surface-white border border-border-subtle rounded-lg p-6 shadow-card">
            <h3 className="font-poppins font-semibold text-body text-text-heading mb-4">
              Quick Information
            </h3>
            <div className="flex items-center justify-center mb-4">
              <svg viewBox="0 0 100 100" className="w-28 h-28 -rotate-90">
                <circle
                  cx="50"
                  cy="50"
                  r="44"
                  fill="none"
                  stroke="var(--color-border-subtle)"
                  strokeWidth="10"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="44"
                  fill="none"
                  stroke="var(--color-brand-black)"
                  strokeWidth="10"
                  strokeDasharray={`${2 * Math.PI * 44}`}
                  strokeDashoffset={`${2 * Math.PI * 44 * (1 - 0.6)}`}
                  strokeLinecap="round"
                />
                <text
                  x="50"
                  y="50"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="rotate-90"
                  style={{
                    transform: "rotate(90deg)",
                    transformOrigin: "50px 50px",
                    fill: "var(--color-text-heading)",
                    fontSize: "18px",
                    fontWeight: 700,
                    fontFamily: "Poppins",
                  }}
                >
                  60%
                </text>
              </svg>
            </div>
            <p className="text-center font-inter text-caption text-text-muted mb-4">
              Startup Progress
            </p>
            <dl className="space-y-3 pt-4 border-t border-divider-line">
              <div className="flex justify-between">
                <dt className="font-inter text-small text-text-muted">
                  Submission Date
                </dt>
                <dd className="font-inter font-medium text-small text-text-heading">
                  {submission.submitted_at ? new Date(submission.submitted_at).toLocaleDateString() : "N/A"}
                </dd>
              </div>
              <div className="flex justify-between items-center">
                <dt className="font-inter text-small text-text-muted">
                  Current Status
                </dt>
                <dd>
                  <Badge variant="warning">{submission.status || "Pending"}</Badge>
                </dd>
              </div>
            </dl>
            <blockquote className="mt-4 pt-4 border-t border-divider-line font-inter text-small text-text-body italic">
              "Strong technical foundation, needs clearer go-to-market timeline
              before Traction review."
            </blockquote>
          </section>

          <section className="bg-surface-white border border-border-subtle rounded-lg p-6 shadow-card space-y-2">
            <h3 className="font-poppins font-semibold text-body text-text-heading mb-2">
              Quick Actions
            </h3>
            <button
              type="button"
              onClick={() => navigate("/admin/reviews/schedule-meeting")}
              className="w-full flex items-center gap-2 py-2.5 px-3 border border-border-subtle rounded-md font-inter font-medium text-small text-text-heading hover:bg-canvas-bg transition-colors"
            >
              <Calendar size={16} strokeWidth={2} /> Schedule Meeting
            </button>
            <ComingSoon
              label="Download All Files"
              position="top"
              inline={false}
            >
              <span className="w-full flex items-center gap-2 py-2.5 px-3 border border-border-subtle rounded-md font-inter font-medium text-small text-text-heading">
                <Download size={16} strokeWidth={2} /> Download All Files
              </span>
            </ComingSoon>
            <button
              type="button"
              onClick={() => setPreviousReviewsOpen(true)}
              className="w-full flex items-center gap-2 py-2.5 px-3 border border-border-subtle rounded-md font-inter font-medium text-small text-text-heading hover:bg-canvas-bg transition-colors"
            >
              <History size={16} strokeWidth={2} /> View Previous Reviews
            </button>
          </section>

          <section className="border-2 border-dashed border-border-subtle rounded-lg p-6">
            <h3 className="font-poppins font-semibold text-caption text-text-muted uppercase tracking-wider mb-4">
              Internal Admin Action
            </h3>
            {errorMsg && (
              <div className="p-3 bg-error/15 border border-error/30 text-error rounded-md text-small flex items-center gap-2 mb-4">
                <AlertCircle size={16} className="shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}
            <div className="space-y-2">
              <button
                type="button"
                onClick={async () => {
                  try {
                    setErrorMsg("");
                    await api.post("/applications/revision", {
                      entityId: "LUMINARA",
                      requested: true,
                    });
                    setRevisionRequested(true);
                  } catch (err) {
                    console.error("Failed to request revision:", err);
                    setErrorMsg(
                      err?.response?.data?.message ||
                        err?.message ||
                        "Failed to request revision.",
                    );
                  }
                }}
                className="w-full py-2.5 border border-error text-error rounded-md font-poppins font-semibold text-small hover:bg-error/5 transition-colors"
              >
                Request Revision
              </button>
              <button
                type="button"
                onClick={() => navigate(`/admin/reviews/workspace?id=${id}`)}
                className="w-full py-2.5 bg-action-bg text-action-text rounded-md font-poppins font-semibold text-small hover:opacity-90 transition-opacity"
              >
                Begin Evaluation
              </button>
            </div>
          </section>
        </div>
      </div>

      <Modal
        isOpen={previousReviewsOpen}
        onClose={() => setPreviousReviewsOpen(false)}
        title={`Previous Reviews — ${startupName}`}
      >
        <div className="space-y-4">
          {previousReviews.length > 0 ? (
            previousReviews.map(({ stage, date, reviewer, outcome, note }) => (
              <div
                key={stage}
                className="border border-border-subtle rounded-lg p-4"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <Badge variant="brand">{stage}</Badge>
                  <span className="font-inter text-caption text-text-muted">
                    {date}
                  </span>
                </div>
                <p className="font-inter font-semibold text-small text-text-heading">
                  {reviewer} · {outcome}
                </p>
                <p className="font-inter text-small text-text-muted mt-1">
                  {note}
                </p>
              </div>
            ))
          ) : (
            <p className="font-inter text-small text-text-muted">No previous reviews found.</p>
          )}
        </div>
      </Modal>
    </AdminShell>
  );
}
