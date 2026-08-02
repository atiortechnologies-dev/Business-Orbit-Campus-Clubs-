import { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Clock3,
  BellRing,
  FileText,
  MessageCircleMore,
  Check,
  RotateCw,
  Loader2,
} from "lucide-react";
import ComingSoon from "@/components/ui/ComingSoon";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { getOnboardingStatus } from "@/api/auth/onboardingApi";

const STEPS = [
  { title: "Profile", status: "done" },
  { title: "Details", status: "done" },
  { title: "Docs", status: "done" },
  { title: "Review", status: "active" },
  { title: "Finalize", status: "pending" },
];

const INFO_CARDS = [
  {
    icon: BellRing,
    title: "Next Steps",
    text: "Check your email for status updates or requests for additional documents.",
  },
  {
    icon: FileText,
    title: "Club Charter",
    text: "Review the BOCC bylaws while you wait to ensure compliance.",
  },
];

export default function VerificationProgressPage() {
  useDocumentTitle("Verification in Progress — BOCC");
  const navigate = useNavigate();

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastChecked, setLastChecked] = useState(null);

  // Poll server status to check if admin approved/rejected
  const checkStatus = useCallback(async () => {
    setIsRefreshing(true);
    try {
      const res = await getOnboardingStatus();
      const data = res?.data || res;
      setLastChecked(new Date().toLocaleTimeString());

      const nextScreen = data?.next_screen;
      const redirectTo = data?.redirect_to;

      // If user status is no longer "verification_pending", redirect them!
      if (nextScreen && nextScreen !== "verification_pending") {
        const destination = redirectTo;
        navigate(destination, { replace: true });
      }
    } catch (err) {
      console.error("Failed to fetch onboarding status:", err);
    } finally {
      setIsRefreshing(false);
    }
  }, [navigate]);

  useEffect(() => {
    // Initial check on mount
    checkStatus();

    // Auto-poll status every 15 seconds
    const interval = setInterval(() => {
      checkStatus();
    }, 15000);

    return () => clearInterval(interval);
  }, [checkStatus]);

  return (
    <div className="flex-1 flex items-center justify-center px-4 py-12 bg-canvas-bg">
      <div className="w-full max-w-lg bg-surface-white border border-border-subtle rounded-xl shadow-card p-8">
        <div className="aspect-3/1 rounded-lg border-2 border-dashed border-border-subtle bg-canvas-bg flex items-center justify-center gap-2 mb-6">
          <Clock3 size={22} strokeWidth={2} className="text-text-muted" />
          <span className="font-inter text-caption font-semibold uppercase tracking-wider text-text-muted">
            Awaiting Verification
          </span>
        </div>

        <h1 className="font-poppins font-bold text-card text-text-heading mb-2 text-center">
          Verification in Progress
        </h1>
        <p className="font-inter text-small text-text-body leading-relaxed text-center mb-5">
          Our administrative team is currently reviewing your registration
          documents. This process ensures all Business Orbit Campus Clubs meet
          our professional ecosystem standards.
        </p>

        {/* Status Badge & Manual Refresh Button */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <span className="inline-flex items-center gap-2 font-inter text-caption font-semibold uppercase tracking-wide text-warning bg-warning/15 px-3 py-1.5 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-warning animate-pulse" />
            Status: Under Review
          </span>

          <button
            type="button"
            onClick={checkStatus}
            disabled={isRefreshing}
            className="p-1.5 rounded-full border border-border-subtle text-text-muted hover:text-text-heading hover:bg-canvas-bg transition-all disabled:opacity-50"
            title="Refresh Status"
          >
            {isRefreshing ? (
              <Loader2 size={16} className="animate-spin text-text-heading" />
            ) : (
              <RotateCw size={16} />
            )}
          </button>
        </div>

        {lastChecked && (
          <p className="text-center font-inter text-caption text-text-muted mb-4 -mt-3">
            Last checked: {lastChecked}
          </p>
        )}

        <div className="flex items-center justify-between bg-canvas-bg border border-border-subtle rounded-lg p-4 mb-6">
          <div className="flex items-center gap-3">
            <Clock3 size={18} strokeWidth={2} className="text-text-muted" />
            <div>
              <p className="font-poppins font-semibold text-small text-text-heading">
                Estimated Timeline
              </p>
              <p className="font-inter text-caption text-text-muted">
                Review window
              </p>
            </div>
          </div>
          <span className="font-inter font-semibold text-small text-text-heading">
            24–48 business hours
          </span>
        </div>

        <div className="mb-2 flex items-center justify-between">
          <span className="font-inter font-semibold text-small text-text-heading">
            Registration Progress
          </span>
          <span className="font-inter text-small text-text-muted">
            80% Complete
          </span>
        </div>
        <div className="w-full bg-border-subtle h-1.5 rounded-full overflow-hidden mb-6">
          <div
            className="bg-brand-black h-full rounded-full"
            style={{ width: "80%" }}
          />
        </div>

        <div className="flex items-center justify-between mb-8">
          {STEPS.map((step, index) => (
            <div
              key={step.title}
              className="flex flex-col items-center flex-1 relative"
            >
              {index < STEPS.length - 1 && (
                <div className="absolute top-3.5 left-1/2 w-full h-px bg-border-subtle z-0" />
              )}
              <div
                className={`relative z-10 w-7 h-7 rounded-full flex items-center justify-center font-inter text-caption font-semibold ${
                  step.status === "done"
                    ? "bg-brand-black text-white"
                    : step.status === "active"
                      ? "bg-accent-neon text-brand-black"
                      : "bg-canvas-bg border border-border-subtle text-text-muted"
                }`}
              >
                {step.status === "done" ? (
                  <Check size={14} strokeWidth={2.5} />
                ) : (
                  index + 1
                )}
              </div>
              <span className="font-inter text-caption text-text-muted mt-1.5">
                {step.title}
              </span>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <Link
            to="/login"
            className="flex-1 text-center bg-action-bg text-action-text font-poppins font-semibold text-small px-5 py-2.5 rounded-md hover:opacity-90 transition-all"
          >
            Return to Home
          </Link>
          <ComingSoon
            label="Contact Support"
            position="top"
            inline
            className="flex-1 flex items-center justify-center gap-2 border border-border-subtle text-text-heading font-inter font-medium text-small px-5 py-2.5 rounded-md cursor-pointer"
          >
            <MessageCircleMore size={16} strokeWidth={2} />
            Contact Support
          </ComingSoon>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {INFO_CARDS.map(({ icon: Icon, title, text }) => (
            <div
              key={title}
              className="border border-border-subtle rounded-lg p-4"
            >
              <Icon
                size={18}
                strokeWidth={2}
                className="text-text-muted mb-2"
              />
              <p className="font-poppins font-semibold text-small text-text-heading mb-1">
                {title}
              </p>
              <p className="font-inter text-caption text-text-muted leading-relaxed">
                {text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
