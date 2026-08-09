import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  CheckCircle2,
  Award,
  Unlock,
  Lock,
  ArrowRight,
  ChevronRight,
  Clock,
  History,
  Star,
  Loader2,
  XCircle,
  RotateCcw,
} from "lucide-react";
import DashboardShell from "@/components/dashboard/DashboardShell";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { getStudentStageFeedback } from "@/api/startup/meetingFeedbackApi";
import { beginValidationStage } from "@/api/startup/studentStageApi";

export default function IdeationReviewResultPage() {
  useDocumentTitle("Review Result — BOCC");
  const navigate = useNavigate();

  const [feedbackData, setFeedbackData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isStartingValidation, setIsStartingValidation] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const fetchResult = async () => {
      try {
        setIsLoading(true);
        const res = await getStudentStageFeedback("ideation");
        const payload = res?.data || null;

        if (isMounted) {
          setFeedbackData(payload);
        }
      } catch (err) {
        console.error("Failed to load ideation review result:", err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchResult();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleBeginValidation = async () => {
    try {
      setIsStartingValidation(true);
      await beginValidationStage();
      navigate("/build-startup/journey/validation");
    } catch (err) {
      console.error("Failed to begin validation stage:", err);
      // Fallback navigation if stage was already transitioned
      navigate("/build-startup/journey/validation");
    } finally {
      setIsStartingValidation(false);
    }
  };

  if (isLoading) {
    return (
      <DashboardShell pageId="ideation-review-result">
        <div className="min-h-[50vh] flex items-center justify-center">
          <Loader2 size={28} className="animate-spin text-text-muted" />
        </div>
      </DashboardShell>
    );
  }

  const isApproved = Boolean(feedbackData?.validation_approved);
  const decision =
    feedbackData?.decision || (isApproved ? "approve" : "pending");
  const isRejected = decision === "reject" || decision === "request_changes";

  const comments =
    feedbackData?.reviewer_comments ||
    feedbackData?.summary ||
    "Your Stage 1: Ideation submission is currently under active review. Please check back shortly.";

  const decisionLabel = isApproved
    ? "Approved"
    : isRejected
      ? "Rejected / Action Needed"
      : "Pending Review";

  const scoreLabel = isApproved
    ? "Pass (Exceeds)"
    : isRejected
      ? "Needs Revision"
      : "Under Review";

  const stats = [
    {
      icon: Clock,
      label: "Review Status",
      value: feedbackData ? "Completed" : "In Progress",
    },
    {
      icon: History,
      label: "Decision",
      value: decisionLabel,
    },
    {
      icon: Star,
      label: "Score",
      value: scoreLabel,
    },
  ];

  return (
    <DashboardShell pageId="ideation-review-result">
      {/* Navigation Breadcrumbs */}
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
        <span className="text-text-heading font-semibold">Review Result</span>
      </nav>

      {/* Page Header */}
      <h1 className="font-poppins font-semibold text-page text-text-heading mb-1">
        Review Result
      </h1>
      <p className="font-inter text-body text-text-body mb-8 max-w-2xl">
        The evaluation of your Stage 1: Ideation submission is complete. Review
        the feedback below to understand the next steps in your venture-building
        journey.
      </p>

      {/* Main Feedback Card */}
      <div className="bg-surface-white border border-border-subtle rounded-lg shadow-card overflow-hidden mb-8">
        <div
          className={`h-1.5 ${
            isApproved ? "bg-success" : isRejected ? "bg-error" : "bg-warning"
          }`}
        />
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              {isApproved && (
                <span className="inline-flex items-center gap-1.5 bg-success/10 text-success font-poppins font-semibold text-caption px-3 py-1 rounded-full mb-2">
                  <CheckCircle2 size={14} strokeWidth={2} /> Idea Approved
                </span>
              )}

              {isRejected && (
                <span className="inline-flex items-center gap-1.5 bg-error/10 text-error font-poppins font-semibold text-caption px-3 py-1 rounded-full mb-2">
                  <XCircle size={14} strokeWidth={2} /> Idea Rejected / Action
                  Required
                </span>
              )}

              {!isApproved && !isRejected && (
                <span className="inline-flex items-center gap-1.5 bg-warning/10 text-warning font-poppins font-semibold text-caption px-3 py-1 rounded-full mb-2">
                  <Clock size={14} strokeWidth={2} /> Under Review
                </span>
              )}

              <h2 className="font-poppins font-semibold text-section text-text-heading">
                {isApproved
                  ? "Congratulations!"
                  : isRejected
                    ? "Revision Requested"
                    : "Feedback Pending"}
              </h2>
            </div>
            <div className="w-12 h-12 rounded-lg bg-canvas-bg border border-border-subtle flex items-center justify-center shrink-0">
              <Award size={22} strokeWidth={2} className="text-text-body" />
            </div>
          </div>

          <p className="font-inter text-caption text-text-muted uppercase tracking-wider mb-2">
            Reviewer Feedback ({feedbackData?.reviewer_name || "Mentor"})
          </p>
          <blockquote className="italic font-inter text-body text-text-body bg-canvas-bg border-l-2 border-border-subtle rounded-md p-4 mb-6 whitespace-pre-line">
            "{comments}"
          </blockquote>

          {/* Additional Structured Feedback Fields */}
          {(feedbackData?.strengths || feedbackData?.improvements) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {feedbackData?.strengths && (
                <div className="p-4 bg-canvas-bg border border-border-subtle rounded-md">
                  <p className="font-inter text-caption text-text-muted uppercase tracking-wider mb-1">
                    Strengths Observed
                  </p>
                  <p className="font-inter text-small text-text-body">
                    {feedbackData.strengths}
                  </p>
                </div>
              )}
              {feedbackData?.improvements && (
                <div className="p-4 bg-canvas-bg border border-border-subtle rounded-md">
                  <p className="font-inter text-caption text-text-muted uppercase tracking-wider mb-1">
                    Suggestions for Improvement
                  </p>
                  <p className="font-inter text-small text-text-body">
                    {feedbackData.improvements}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Stage Unlock Banner */}
          {isApproved ? (
            <div className="flex items-start gap-3 bg-info/10 border border-info/30 rounded-lg p-4 mb-6">
              <Unlock
                size={20}
                strokeWidth={2}
                className="text-info shrink-0 mt-0.5"
              />
              <div>
                <h3 className="font-poppins font-semibold text-small text-text-heading">
                  Stage 2: Validation Unlocked
                </h3>
                <p className="font-inter text-small text-text-body mt-1">
                  You've demonstrated sufficient logic and market potential to
                  proceed. You can now access market-research tools and
                  customer-interview frameworks.
                </p>
              </div>
            </div>
          ) : (
            <div
              className={`flex items-start gap-3 rounded-lg p-4 mb-6 border ${
                isRejected
                  ? "bg-error/10 border-error/30"
                  : "bg-warning/10 border-warning/30"
              }`}
            >
              <Lock
                size={20}
                strokeWidth={2}
                className={`shrink-0 mt-0.5 ${
                  isRejected ? "text-error" : "text-warning"
                }`}
              />
              <div>
                <h3 className="font-poppins font-semibold text-small text-text-heading">
                  Stage 2: Locked
                </h3>
                <p className="font-inter text-small text-text-body mt-1">
                  {isRejected
                    ? "Your ideation submission was not approved by the reviewer. Please review the comments above and resubmit your idea."
                    : "Your ideation review must be approved by an admin or mentor before you can proceed to Stage 2 (Validation)."}
                </p>
              </div>
            </div>
          )}

          {/* Stage Action Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            {isApproved ? (
              <button
                type="button"
                onClick={handleBeginValidation}
                disabled={isStartingValidation}
                className="inline-flex items-center gap-2 bg-action-bg text-action-text px-6 py-2.5 rounded-md hover:opacity-90 active:scale-[0.98] transition-all font-poppins font-semibold text-small disabled:opacity-50"
              >
                {isStartingValidation ? (
                  <>
                    <Loader2 size={16} className="animate-spin" /> Unlocking
                    Validation...
                  </>
                ) : (
                  <>
                    Begin Validation <ArrowRight size={16} strokeWidth={2} />
                  </>
                )}
              </button>
            ) : isRejected ? (
              <button
                type="button"
                onClick={() => navigate("/build-startup/journey/ideation")}
                className="inline-flex items-center gap-2 bg-brand-black text-white px-6 py-2.5 rounded-md hover:opacity-90 active:scale-[0.98] transition-all font-poppins font-semibold text-small"
              >
                <RotateCcw size={16} strokeWidth={2} /> Update Ideation Pitch
              </button>
            ) : (
              <button
                type="button"
                disabled
                className="inline-flex items-center gap-2 bg-border-subtle text-text-muted px-6 py-2.5 rounded-md font-poppins font-semibold text-small cursor-not-allowed opacity-60"
              >
                <Lock size={15} strokeWidth={2} /> Begin Validation (Locked)
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map(({ icon: Icon, label, value }) => (
          <div
            key={label}
            className="flex items-center gap-3 bg-surface-white border border-border-subtle rounded-lg shadow-card p-4"
          >
            <div className="w-10 h-10 rounded-md bg-canvas-bg border border-border-subtle flex items-center justify-center shrink-0">
              <Icon size={18} strokeWidth={2} className="text-text-body" />
            </div>
            <div>
              <p className="font-inter text-caption text-text-muted">{label}</p>
              <p className="font-poppins font-semibold text-small text-text-heading">
                {value}
              </p>
            </div>
          </div>
        ))}
      </div>
    </DashboardShell>
  );
}
