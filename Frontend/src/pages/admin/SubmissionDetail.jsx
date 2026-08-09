import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ArrowLeft, FolderOpen, ExternalLink, Loader2, Inbox } from "lucide-react";
import AdminShell from "@/components/admin/AdminShell";
import Badge from "@/components/ui/Badge";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { getSubmissionDetail } from "@/api/admin/adminStartupReviewApi";

const STATUS_VARIANT = {
  draft: "neutral",
  pending_review: "warning",
  approved: "success",
  rejected: "error",
  request_changes: "warning",
};

const STATUS_LABEL = {
  draft: "Draft",
  pending_review: "Pending Review",
  approved: "Approved",
  rejected: "Rejected",
  request_changes: "Changes Requested",
};

// Read-only historical view of a stage submission, reached from
// StartupDetail.jsx's "View Details" links. Deliberately generic/stage-
// agnostic (works for whichever stage's submissionId it's given) rather
// than hardcoded to Ideation — kept as its own file rather than reusing
// IdeationReview.jsx, since that page carries active-review-only machinery
// (Approve/Request Changes, Modal, remarks) this view doesn't need.
export default function SubmissionDetailPage() {
  useDocumentTitle("Submission Details — BOCC Admin");
  const [searchParams] = useSearchParams();
  const submissionId = searchParams.get("id");
  // Passed by StartupDetail.jsx's "View Details" link so the heading can
  // read e.g. "Ideation Submission" — submission.title is free text the
  // student typed (often just the startup's name), not a stage label.
  const stageLabel = searchParams.get("stage");
  const startupIdParam = searchParams.get("startupId");

  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const fetchSubmission = async () => {
      try {
        setIsLoading(true);
        setIsError(false);

        if (!submissionId) {
          setIsError(true);
          return;
        }

        const res = await getSubmissionDetail(submissionId);
        const payload = res?.data?.data || res?.data || res;

        if (isMounted && payload) {
          setData(payload);
        }
      } catch (err) {
        console.error("Failed to load submission details:", err);
        if (isMounted) setIsError(true);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchSubmission();

    return () => {
      isMounted = false;
    };
  }, [submissionId]);

  if (isLoading) {
    return (
      <AdminShell>
        <div className="min-h-[50vh] flex items-center justify-center">
          <Loader2 size={28} className="animate-spin text-text-muted" />
        </div>
      </AdminShell>
    );
  }

  const { submission, startup } = data || {};

  if (isError || !submission) {
    return (
      <AdminShell>
        <div className="min-h-[50vh] flex flex-col items-center justify-center text-center gap-3">
          <Inbox size={32} className="text-text-muted" />
          <p className="font-poppins font-semibold text-card text-text-heading">
            Couldn't load this submission
          </p>
          <p className="font-inter text-small text-text-muted max-w-sm">
            This submission's details aren't available or the link is
            invalid.
          </p>
          <Link
            to="/admin/chapters"
            className="font-poppins font-semibold text-small text-text-heading hover:opacity-80 transition-opacity"
          >
            Back to Chapters
          </Link>
        </div>
      </AdminShell>
    );
  }

  const SECTIONS = [
    { label: "Problem Statement", value: submission.description },
    { label: "Proposed Solution", value: submission.solution },
    { label: "Target Audience", value: submission.targetAudience },
    { label: "Value Proposition", value: submission.valueProposition },
    { label: "Competitors", value: submission.competitors },
  ];

  const submittedDateLabel = submission.submittedAt
    ? new Date(submission.submittedAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : null;

  return (
    <AdminShell>
      <Link
        to={`/admin/startups/detail?id=${startup?.id || startupIdParam || ""}`}
        className="mb-6 inline-flex items-center gap-1.5 font-inter font-medium text-small text-text-muted hover:text-text-heading transition-colors"
      >
        <ArrowLeft size={14} strokeWidth={2} /> Back to Startup Details
      </Link>

      <div className="max-w-3xl">
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <h1 className="font-poppins font-semibold text-page text-text-heading">
              {stageLabel ? `${stageLabel} Submission` : submission.title || "Submission"}
            </h1>
            <p className="font-inter text-small text-text-muted mt-1">
              Submitted stage details for {startup?.name || "this startup"}.
            </p>
          </div>
          <div className="text-right shrink-0">
            <Badge variant={STATUS_VARIANT[submission.status] || "neutral"}>
              {STATUS_LABEL[submission.status] || submission.status || "—"}
            </Badge>
            {submittedDateLabel && (
              <p className="font-inter text-caption text-text-muted mt-1.5 whitespace-nowrap">
                Submitted {submittedDateLabel}
              </p>
            )}
          </div>
        </div>

        <div className="space-y-5">
          {SECTIONS.map(({ label, value }) => (
            <section
              key={label}
              className="bg-surface-white border border-border-subtle rounded-lg p-6 shadow-card"
            >
              <h3 className="font-inter font-semibold text-caption uppercase tracking-wider text-text-muted mb-2">
                {label}
              </h3>
              <p className="font-inter text-small text-text-body leading-relaxed">
                {value || "No input provided."}
              </p>
            </section>
          ))}

          <section className="bg-surface-white border border-border-subtle rounded-lg p-6 shadow-card flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-12 h-12 rounded-md bg-canvas-bg border border-border-subtle flex items-center justify-center shrink-0">
                <FolderOpen size={20} strokeWidth={2} className="text-text-muted" />
              </div>
              <div className="min-w-0">
                <p className="font-inter font-semibold text-small text-text-heading truncate">
                  {submission.attachmentUrl || "No attachment provided"}
                </p>
                <p className="font-inter text-caption text-text-muted">
                  Shared Drive Folder
                </p>
              </div>
            </div>
            {submission.attachmentUrl && (
              <a
                href={submission.attachmentUrl}
                target="_blank"
                rel="noreferrer"
                className="shrink-0 flex items-center gap-2 px-4 py-2 border border-brand-black rounded-md font-poppins font-semibold text-caption text-text-heading hover:bg-canvas-bg transition-colors"
              >
                <ExternalLink size={14} strokeWidth={2} /> Open Drive Folder
              </a>
            )}
          </section>
        </div>

        {/* Footer metadata bar. Version/Completion have no backing field on
            StageSubmission today — TODO(backend): honest "—" until they
            exist, rather than fabricating values. */}
        <div className="mt-10 pt-6 border-t border-divider-line flex flex-wrap gap-x-3 gap-y-1 font-inter text-caption uppercase tracking-wider text-text-muted">
          <span>
            Submission date: {submittedDateLabel || "—"}
          </span>
          <span className="text-border-subtle">|</span>
          <span>Version: —</span>
          <span className="text-border-subtle">|</span>
          <span>
            Status: {STATUS_LABEL[submission.status] || submission.status || "—"}
          </span>
          <span className="text-border-subtle">|</span>
          <span>Completion: —</span>
        </div>
      </div>
    </AdminShell>
  );
}
