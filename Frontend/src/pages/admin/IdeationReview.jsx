import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ChevronRight,
  Check,
  FolderOpen,
  ExternalLink,
  History,
  Loader2,
} from "lucide-react";
import AdminShell from "@/components/admin/AdminShell";
import Badge from "@/components/ui/Badge";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import ComingSoon from "@/components/ui/ComingSoon";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import {
  getSubmissionDetail,
  submitReviewDecision,
} from "@/api/admin/adminReviewApi";

export default function IdeationReviewPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const submissionId = searchParams.get("id");

  useDocumentTitle(`Ideation Review — BOCC Admin`);

  const queryClient = useQueryClient();

  const [remarks, setRemarks] = useState("");
  const [requestChangesOpen, setRequestChangesOpen] = useState(false);
  const [changesText, setChangesText] = useState("");

  const { data: resData, isLoading: loading, error } = useQuery({
    queryKey: ["adminSubmissionDetail", submissionId],
    queryFn: () => getSubmissionDetail(submissionId),
    enabled: !!submissionId,
  });

  const data = resData?.data || {};

  const decisionMutation = useMutation({
    mutationFn: (payload) => submitReviewDecision(submissionId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminSubmissionDetail", submissionId] });
      queryClient.invalidateQueries({ queryKey: ["adminReviewQueue"] });
    },
  });

  const submitting = decisionMutation.isPending;

  const handleApproveAndSchedule = async () => {
    try {
      await decisionMutation.mutateAsync({
        decision: "approve",
        remarks,
      });

      // Redirect to meeting schedule or workspace outcome
      navigate(`/admin/reviews/schedule-meeting?submissionId=${submissionId}`);
    } catch (error) {
      console.error("Failed to approve submission:", error);
    }
  };

  const confirmRequestChanges = async () => {
    try {
      await decisionMutation.mutateAsync({
        decision: "request_changes",
        remarks,
        changesText,
      });

      setRequestChangesOpen(false);
      navigate("/admin/reviews");
    } catch (error) {
      console.error("Failed to request changes:", error);
    }
  };

  if (loading) {
    return (
      <AdminShell>
        <div className="flex justify-center py-20">
          <Loader2 size={32} className="animate-spin text-text-muted" />
        </div>
      </AdminShell>
    );
  }

  if (error) {
    return (
      <AdminShell>
        <div className="flex justify-center py-20 text-error">
          <p>Failed to load submission details. Please try again.</p>
        </div>
      </AdminShell>
    );
  }

  const { submission, startup, journeyStages = [] } = data || {};

  const SUBMISSION_SECTIONS = [
    { label: "Problem Statement", value: submission?.description },
    { label: "Proposed Solution", value: submission?.solution },
    { label: "Target Audience", value: submission?.targetAudience },
    { label: "Value Proposition", value: submission?.valueProposition },
    { label: "Competitors", value: submission?.competitors },
  ];

  return (
    <AdminShell>
      <nav className="mb-2 flex items-center gap-2 text-text-muted font-inter text-small">
        <Link
          to="/admin/reviews"
          className="hover:text-text-heading transition-colors"
        >
          Startups
        </Link>
        <ChevronRight size={14} strokeWidth={2} />
        <span className="text-text-heading font-semibold">Ideation Review</span>
      </nav>
      <h1 className="font-poppins font-semibold text-page text-text-heading mb-6">
        Review Workspace: Ideation Phase
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Startup info + journey */}
        <div className="lg:col-span-3 space-y-6">
          <section className="bg-surface-white border border-border-subtle rounded-lg p-6 shadow-card">
            <h3 className="font-poppins font-semibold text-caption uppercase tracking-wider text-text-muted mb-4">
              Startup Information
            </h3>
            <div className="space-y-3">
              <div>
                <p className="font-inter text-caption text-text-muted uppercase mb-1">
                  Name
                </p>
                <p className="font-inter font-semibold text-small text-text-heading">
                  {startup?.name}
                </p>
              </div>
              <div>
                <p className="font-inter text-caption text-text-muted uppercase mb-1">
                  Founder
                </p>
                <p className="font-inter text-small text-text-heading">
                  {startup?.founder}
                </p>
              </div>
              <div>
                <p className="font-inter text-caption text-text-muted uppercase mb-1">
                  Chapter
                </p>
                <p className="font-inter text-small text-text-heading">
                  {startup?.chapter}
                </p>
              </div>
            </div>
          </section>

          <section className="bg-surface-white border border-border-subtle rounded-lg p-6 shadow-card">
            <h3 className="font-poppins font-semibold text-caption uppercase tracking-wider text-text-muted mb-4">
              Startup Journey
            </h3>
            <div className="space-y-0">
              {journeyStages.map((stage, i) => {
                const isActive = stage.stageNumber === startup?.currentStage;
                return (
                  <div key={stage.label} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 border-2 ${
                          isActive
                            ? "bg-brand-black border-brand-black text-white"
                            : "bg-surface-white border-border-subtle"
                        }`}
                      >
                        {isActive && <Check size={14} strokeWidth={2.5} />}
                      </div>
                      {i < journeyStages.length - 1 && (
                        <div
                          className={`w-[2px] flex-1 min-h-[28px] ${
                            isActive ? "bg-brand-black" : "bg-border-subtle"
                          }`}
                        />
                      )}
                    </div>
                    <div className="pb-6">
                      <p
                        className={`font-inter text-small ${
                          isActive
                            ? "font-bold text-text-heading"
                            : "text-text-muted"
                        }`}
                      >
                        {stage.label}
                      </p>
                      {isActive && (
                        <p className="font-inter text-caption text-text-muted">
                          Active Phase
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>

        {/* Center: submission content */}
        <div className="lg:col-span-6 space-y-6">
          <section className="bg-surface-white border border-border-subtle rounded-lg p-6 shadow-card">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-divider-line">
              <h3 className="font-poppins font-semibold text-caption uppercase tracking-wider text-text-muted">
                Ideation Submission
              </h3>
              <Badge variant="neutral">{submission?.title || "Draft"}</Badge>
            </div>
            <div className="space-y-6">
              {SUBMISSION_SECTIONS.map(({ label, value }) => (
                <section key={label}>
                  <h4 className="font-inter font-semibold text-caption uppercase tracking-wider text-text-muted mb-2">
                    {label}
                  </h4>
                  <div className="p-4 bg-canvas-bg border border-border-subtle rounded-md">
                    <p className="font-inter text-small text-text-body leading-relaxed">
                      {value || "No input provided."}
                    </p>
                  </div>
                </section>
              ))}
            </div>
          </section>

          {/* Attachment Folder */}
          <section className="bg-surface-white border border-border-subtle rounded-lg p-6 shadow-card flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-12 h-12 rounded-md bg-canvas-bg border border-border-subtle flex items-center justify-center shrink-0">
                <FolderOpen
                  size={20}
                  strokeWidth={2}
                  className="text-text-muted"
                />
              </div>
              <div className="min-w-0">
                <p className="font-inter font-semibold text-small text-text-heading">
                  Submission Attachment
                </p>
                <p className="font-inter text-caption text-text-muted truncate">
                  {submission?.attachmentUrl || "No attachment provided"}
                </p>
              </div>
            </div>
            {submission?.attachmentUrl && (
              <a
                href={submission.attachmentUrl}
                target="_blank"
                rel="noreferrer"
                className="shrink-0 flex items-center gap-2 px-4 py-2 border border-brand-black rounded-md font-poppins font-semibold text-caption text-text-heading hover:bg-canvas-bg transition-colors"
              >
                <ExternalLink size={14} strokeWidth={2} /> Open Attachment
              </a>
            )}
          </section>
        </div>

        {/* Right: status + actions */}
        <div className="lg:col-span-3 space-y-6">
          <section className="bg-surface-white border border-border-subtle rounded-lg p-6 shadow-card">
            <h3 className="font-poppins font-semibold text-caption uppercase tracking-wider text-text-muted mb-4">
              Submission Information
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-divider-line">
                <span className="font-inter text-caption text-text-muted uppercase">
                  Date
                </span>
                <span className="font-inter text-small text-text-heading">
                  {submission?.submittedAt
                    ? new Date(submission.submittedAt).toLocaleDateString()
                    : "N/A"}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-divider-line">
                <span className="font-inter text-caption text-text-muted uppercase">
                  Status
                </span>
                <Badge variant="warning">
                  {submission?.status?.toUpperCase() || "PENDING"}
                </Badge>
              </div>
              <div className="pt-1">
                <span className="font-inter text-caption text-text-muted uppercase block mb-2">
                  Journey Progress
                </span>
                <div className="w-full bg-canvas-bg rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-brand-black h-full rounded-full"
                    style={{ width: `${startup?.progressPercentage || 20}%` }}
                  />
                </div>
                <div className="flex justify-between mt-1">
                  <span className="font-inter text-caption text-text-muted">
                    Ideation
                  </span>
                  <span className="font-inter text-caption text-text-muted">
                    {startup?.progressPercentage || 20}%
                  </span>
                </div>
              </div>
            </div>
          </section>

          <section className="bg-surface-white border border-border-subtle rounded-lg p-6 shadow-card">
            <h3 className="font-poppins font-semibold text-caption uppercase tracking-wider text-text-muted mb-4">
              Admin Remarks
            </h3>
            <textarea
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="Type internal notes or feedback here..."
              rows={4}
              className="w-full bg-canvas-bg border border-border-subtle rounded-md p-3 font-inter text-small text-text-body resize-none focus:outline-none focus:ring-1 focus:ring-brand-black mb-3"
            />
            <p className="flex items-center gap-1.5 font-inter text-caption text-text-muted mb-4">
              Remarks will be visible to the founder.
            </p>
            <div className="space-y-2">
              <button
                type="button"
                disabled={submitting}
                onClick={handleApproveAndSchedule}
                className="w-full py-3 bg-action-bg text-action-text rounded-md font-poppins font-semibold text-small hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50"
              >
                Approve &amp; Schedule Meeting
              </button>
              <button
                type="button"
                onClick={() => setRequestChangesOpen(true)}
                className="w-full py-3 border border-border-subtle rounded-md font-poppins font-semibold text-small text-text-heading hover:bg-canvas-bg transition-colors"
              >
                Request Changes
              </button>
            </div>
          </section>

          <ComingSoon
            label="Internal History"
            position="top"
            inline={false}
            className="bg-surface-white border border-dashed border-border-subtle rounded-lg p-6"
          >
            <div className="flex items-center gap-2 mb-3">
              <History size={16} strokeWidth={2} className="text-text-muted" />
              <h3 className="font-poppins font-semibold text-caption uppercase tracking-wider text-text-muted">
                Internal History
              </h3>
            </div>
            <p className="font-inter text-caption text-text-muted">
              Full audit trail of every action taken on this submission.
            </p>
          </ComingSoon>
        </div>
      </div>

      {/* Modal - Request Changes */}
      <Modal
        isOpen={requestChangesOpen}
        onClose={() => setRequestChangesOpen(false)}
        title="Request Changes"
      >
        <p className="font-inter text-small text-text-muted mb-3">
          Sent to {startup?.founder} and logged against this submission.
        </p>
        <textarea
          value={changesText}
          onChange={(e) => setChangesText(e.target.value)}
          placeholder="e.g. Please clarify your go-to-market timeline before resubmitting."
          rows={4}
          className="w-full bg-canvas-bg border border-border-subtle rounded-md p-3 font-inter text-small text-text-body resize-none focus:outline-none focus:ring-1 focus:ring-brand-black mb-4"
        />
        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setRequestChangesOpen(false)}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            size="sm"
            disabled={!changesText.trim() || submitting}
            onClick={confirmRequestChanges}
          >
            Send Request
          </Button>
        </div>
      </Modal>
    </AdminShell>
  );
}
