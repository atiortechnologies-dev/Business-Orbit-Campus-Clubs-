import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  ChevronRight,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Clock,
  ExternalLink,
  Link2,
  MessageSquareWarning,
} from "lucide-react";
import DashboardShell from "@/components/dashboard/DashboardShell";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import {
  submitIdea,
  saveDraft,
  getSubmissionStatus,
} from "@/api/startup/submissionApi";

const FIELDS = [
  {
    name: "startupName",
    label: "Startup Name / Title",
    type: "input",
    placeholder: "e.g. EcoSphere Analytics",
    hint: "Make it memorable and professional.",
  },
  {
    name: "problemStatement",
    label: "Problem Statement",
    type: "textarea",
    rows: 3,
    placeholder: "What specific problem are you solving? Be concise.",
    hint: "Focus on the pain points of your potential customers.",
  },
  {
    name: "solution",
    label: "Solution",
    type: "textarea",
    rows: 3,
    placeholder: "Explain your core offering and how it addresses the problem.",
    hint: 'Focus on the "How" and "What" of your startup.',
  },
  {
    name: "targetAudience",
    label: "Target Audience",
    type: "textarea",
    rows: 2,
    placeholder: "Who is your ideal customer? Define demographics or segments.",
  },
  {
    name: "valueProposition",
    label: "Value Proposition",
    type: "textarea",
    rows: 2,
    placeholder: "Why should customers choose you over others?",
  },
  {
    name: "competitors",
    label: "Competitors",
    type: "textarea",
    rows: 2,
    placeholder: "List existing alternatives and your competitive advantage.",
  },
];

export default function IdeaSubmissionPage() {
  useDocumentTitle("Submit Your Idea — BOCC");
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    startupName: "",
    problemStatement: "",
    solution: "",
    targetAudience: "",
    valueProposition: "",
    competitors: "",
    attachmentUrl: "",
  });

  const [submissionDetails, setSubmissionDetails] = useState(null);
  const [isReadOnly, setIsReadOnly] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [savingDraft, setSavingDraft] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [requestChangesText, setRequestChangesText] = useState("");

  useEffect(() => {
    async function loadStatus() {
      try {
        setLoading(true);
        const res = await getSubmissionStatus();
        const data = res?.data || res;

        // Extract the submission object
        const sub = data?.submission;

        if (sub) {
          setSubmissionDetails(sub);

          // Fill all form fields from backend response
          setFormData({
            startupName: sub.title || "",
            problemStatement: sub.description || "",
            solution: sub.solution || "",
            targetAudience: sub.target_audience || "",
            valueProposition: sub.value_proposition || "",
            competitors: sub.competitors || "",
            attachmentUrl: sub.attachment_url || "",
          });

          // Lock form ONLY if undergoing review or approved
          if (
            ["pending_review", "submitted", "approved"].includes(sub.status)
          ) {
            setIsReadOnly(true);
          } else {
            // Unlock form for editing if in 'draft' or requested changes state
            setIsReadOnly(false);
          }

          // Capture revision request notes from admin
          if (sub.request_changes || sub.requestChanges) {
            setRequestChangesText(sub.request_changes || sub.requestChanges);
          }
        }
      } catch {
        console.log("No previous submission found or stage inactive.");
      } finally {
        setLoading(false);
      }
    }

    loadStatus();
  }, []);

  const handleChange = (e) => {
    if (isReadOnly) return;
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const mapPayload = () => ({
    title: formData.startupName.trim(),
    description: formData.problemStatement.trim(),
    startup_name: formData.startupName.trim(),
    problem_statement: formData.problemStatement.trim(),
    solution: formData.solution.trim(),
    target_audience: formData.targetAudience.trim(),
    value_proposition: formData.valueProposition.trim(),
    competitors: formData.competitors.trim(),
    attachment_url: formData.attachmentUrl.trim(),
  });

  const canSubmit =
    !isReadOnly &&
    formData.startupName.trim().length > 0 &&
    formData.problemStatement.trim().length > 0 &&
    formData.solution.trim().length > 0 &&
    !submitting;

  const handleSaveDraft = async () => {
    try {
      setSavingDraft(true);
      setErrorMsg("");
      setSuccessMsg("");

      await saveDraft(mapPayload());

      setSuccessMsg("Draft saved successfully.");
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err) {
      setErrorMsg(err?.message || "Failed to save draft.");
    } finally {
      setSavingDraft(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canSubmit) return;

    try {
      setSubmitting(true);
      setErrorMsg("");

      await submitIdea(mapPayload());

      navigate("/build-startup/journey/ideation/confirmation", {
        replace: true,
      });
    } catch (err) {
      setErrorMsg(err?.message || "Failed to submit idea.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DashboardShell pageId="idea-submission">
      <nav className="mb-2 flex items-center gap-2 text-text-muted font-inter font-normal text-small">
        <Link
          to="/dashboard"
          className="hover:text-text-heading transition-colors"
        >
          Dashboard
        </Link>
        <ChevronRight size={14} strokeWidth={2} />
        <Link
          to="/build-startup/journey/ideation"
          className="hover:text-text-heading transition-colors"
        >
          Ideation
        </Link>
        <ChevronRight size={14} strokeWidth={2} />
        <span className="text-text-heading font-semibold">
          {isReadOnly ? "Submission View" : "Submit Idea"}
        </span>
      </nav>

      <h1 className="font-poppins font-semibold text-page text-text-heading mb-1">
        {isReadOnly ? "Your Idea Submission" : "Submit Your Idea"}
      </h1>
      <p className="font-inter text-body text-text-body mb-8 max-w-2xl">
        {isReadOnly
          ? "You have already submitted an idea for this stage. View your submitted details below."
          : "Complete the following sections to detail your startup's core proposition. This data will be used for your Stage 1 review."}
      </p>

      {/* Banner for Admin Revision Request */}
      {requestChangesText && (
        <div className="max-w-3xl mb-6 p-4 bg-warning/10 border border-warning/30 text-warning rounded-lg flex items-start gap-3">
          <MessageSquareWarning size={20} className="shrink-0 mt-0.5" />
          <div>
            <p className="font-poppins font-semibold text-small">
              Action Required: Changes Requested by Reviewer
            </p>
            <p className="font-inter text-small text-text-body mt-1 leading-relaxed bg-surface-white/60 p-3 rounded border border-warning/20">
              "{requestChangesText}"
            </p>
            <p className="font-inter text-caption text-text-muted mt-2">
              Please revise the form fields below based on the reviewer's
              feedback and resubmit your idea.
            </p>
          </div>
        </div>
      )}

      {/* Lock Banner for locked statuses */}
      {isReadOnly && (
        <div className="max-w-3xl mb-6 p-4 bg-warning/10 border border-warning/30 text-warning rounded-lg flex items-center gap-3">
          <Clock size={20} className="shrink-0" />
          <div>
            <p className="font-poppins font-semibold text-small">
              Status:{" "}
              {submissionDetails?.status?.replace("_", " ").toUpperCase()}
            </p>
            <p className="font-inter text-caption text-text-body mt-0.5">
              Your submission is currently locked and undergoing review by the
              BOCC team.
            </p>
          </div>
        </div>
      )}

      {errorMsg && (
        <div className="max-w-3xl mb-6 p-3 bg-error/15 border border-error/30 text-error rounded-md text-small flex items-center gap-2">
          <AlertCircle size={16} className="shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {successMsg && (
        <div className="max-w-3xl mb-6 p-3 bg-success/15 border border-success/30 text-success rounded-md text-small flex items-center gap-2">
          <CheckCircle2 size={16} className="shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-16 max-w-3xl">
          <Loader2 size={32} className="animate-spin text-text-muted" />
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="max-w-3xl bg-surface-white border border-border-subtle rounded-lg shadow-card p-6 space-y-6"
        >
          {FIELDS.map(({ name, label, type, rows }) => (
            <div key={name} className="space-y-1.5">
              <label
                htmlFor={name}
                className="font-poppins font-semibold text-caption text-text-muted uppercase tracking-wider block"
              >
                {label}
              </label>
              {type === "textarea" ? (
                <textarea
                  id={name}
                  name={name}
                  rows={rows}
                  disabled={isReadOnly}
                  value={formData[name]}
                  onChange={handleChange}
                  className={`w-full border rounded-md text-text-body font-inter text-body py-2.5 px-3 focus:outline-none resize-none ${
                    isReadOnly
                      ? "bg-canvas-bg/50 border-border-subtle cursor-not-allowed opacity-90"
                      : "bg-canvas-bg border-border-subtle focus:ring-1 focus:ring-brand-black"
                  }`}
                />
              ) : (
                <input
                  id={name}
                  name={name}
                  type="text"
                  disabled={isReadOnly}
                  value={formData[name]}
                  onChange={handleChange}
                  className={`w-full border rounded-md text-text-body font-inter text-body py-2.5 px-3 focus:outline-none ${
                    isReadOnly
                      ? "bg-canvas-bg/50 border-border-subtle cursor-not-allowed opacity-90"
                      : "bg-canvas-bg border-border-subtle focus:ring-1 focus:ring-brand-black"
                  }`}
                />
              )}
            </div>
          ))}

          <div className="space-y-1.5">
            <label
              htmlFor="attachmentUrl"
              className="font-poppins font-semibold text-caption text-text-muted uppercase tracking-wider block"
            >
              Supporting Document / Pitch Deck Link
            </label>
            <div className="relative">
              <input
                id="attachmentUrl"
                name="attachmentUrl"
                type="url"
                disabled={isReadOnly}
                value={formData.attachmentUrl}
                onChange={handleChange}
                placeholder="https://drive.google.com/..., Notion, Figma, or Dropbox link"
                className={`w-full border rounded-md text-text-body font-inter text-body py-2.5 px-3 focus:outline-none ${
                  isReadOnly
                    ? "bg-canvas-bg/50 border-border-subtle cursor-not-allowed opacity-90"
                    : "bg-canvas-bg border-border-subtle focus:ring-1 focus:ring-brand-black"
                }`}
              />
            </div>
            <p className="font-inter text-caption text-text-muted">
              Paste a shareable link to your pitch deck or supporting files
              (Google Drive, Notion, Figma, etc.).
            </p>

            {/* Clickable link preview when in read-only mode */}
            {isReadOnly && formData.attachmentUrl && (
              <div className="pt-2">
                <a
                  href={formData.attachmentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-canvas-bg border border-border-subtle rounded-md text-small font-semibold text-text-heading hover:bg-surface-white transition-colors"
                >
                  <Link2 size={16} />
                  <span>Open Submitted Link</span>
                  <ExternalLink size={14} className="text-text-muted" />
                </a>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-divider-line">
            {isReadOnly ? (
              <Link
                to="/build-startup/journey/ideation"
                className="bg-brand-black text-white px-6 py-2.5 rounded-md font-poppins font-semibold text-small hover:opacity-90 transition-opacity"
              >
                Back to Stage Overview
              </Link>
            ) : (
              <>
                <button
                  type="button"
                  onClick={handleSaveDraft}
                  disabled={savingDraft || submitting}
                  className="font-poppins font-semibold text-small text-text-heading hover:opacity-80 transition-opacity inline-flex items-center gap-2 disabled:opacity-50"
                >
                  {savingDraft && (
                    <Loader2 size={14} className="animate-spin" />
                  )}
                  Save Draft
                </button>
                <button
                  type="submit"
                  disabled={!canSubmit}
                  className="bg-action-bg text-action-text px-6 py-2.5 rounded-md hover:opacity-90 active:scale-[0.98] transition-all font-poppins font-semibold text-small disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2"
                >
                  {submitting && <Loader2 size={16} className="animate-spin" />}
                  Submit Idea
                </button>
              </>
            )}
          </div>
        </form>
      )}
    </DashboardShell>
  );
}
