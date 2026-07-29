import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ChevronLeft,
  Mail,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import ComingSoon from "@/components/ui/ComingSoon";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { forgotPassword } from "@/api/authApi";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateEmail(value) {
  if (!value.trim()) return "Email address is required.";
  if (!EMAIL_RE.test(value.trim())) return "Enter a valid email address.";
  return "";
}

export default function ForgotPasswordPage() {
  useDocumentTitle("Forgot Password — BOCC");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [touched, setTouched] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState("");

  function handleBlur() {
    setTouched(true);
    setEmailError(validateEmail(email));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setApiError("");
    setTouched(true);

    const err = validateEmail(email);
    setEmailError(err);

    if (!err) {
      try {
        setIsSubmitting(true);

        // API request to request password reset token/email
        await forgotPassword({ email: email.trim() });

        // Show confirmation regardless of whether email exists (prevents account enumeration)
        setSubmitted(true);
      } catch (error) {
        // Only present systemic API/Network error banners here; do not leak user existence
        setApiError(
          error.message ||
            "Unable to request password reset. Please try again.",
        );
      } finally {
        setIsSubmitting(false);
      }
    }
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 py-10 bg-canvas-bg">
      <div className="w-full max-w-sm flex flex-col gap-4">
        <Link
          to="/login"
          className="inline-flex items-center gap-1 text-small font-normal text-text-body hover:text-text-heading transition-all duration-150 ease-linear self-start font-inter"
          aria-label="Return to login"
        >
          <ChevronLeft size={14} strokeWidth={2} aria-hidden="true" />
          Back to Login
        </Link>

        <Card className="p-8 flex flex-col gap-6">
          {submitted ? (
            <div className="flex flex-col items-center gap-5 text-center animate-slide-in">
              <div className="w-14 h-14 rounded-full bg-canvas-bg border border-border-subtle flex items-center justify-center">
                <CheckCircle
                  size={28}
                  className="text-text-heading"
                  strokeWidth={2}
                  aria-hidden="true"
                />
              </div>
              <div className="flex flex-col gap-2">
                <h2 className="text-card font-medium text-text-heading font-poppins">
                  Check your inbox
                </h2>
                <p className="text-body font-normal text-text-body font-inter leading-relaxed">
                  If{" "}
                  <span className="text-text-heading font-medium">{email}</span>{" "}
                  is registered, you&apos;ll receive a reset link shortly.
                </p>
              </div>
              <Link
                to="/login"
                className="text-small font-normal text-text-body hover:underline transition-all duration-150 ease-linear font-inter"
              >
                Back to Login
              </Link>
            </div>
          ) : (
            <>
              {/* Recovery Request Illustration */}
              <svg
                viewBox="0 0 500 200"
                className="w-full aspect-[5/2] rounded-lg"
                role="img"
                aria-label="Illustration of an email being sent with an account recovery key"
              >
                <circle
                  cx="40"
                  cy="55"
                  r="3"
                  fill="var(--color-border-subtle)"
                />
                <circle
                  cx="65"
                  cy="70"
                  r="4"
                  fill="var(--color-border-subtle)"
                />
                <circle
                  cx="90"
                  cy="85"
                  r="5"
                  fill="var(--color-border-subtle)"
                />

                <rect
                  x="122"
                  y="55"
                  width="150"
                  height="100"
                  rx="10"
                  fill="var(--color-brand-black)"
                  stroke="var(--color-border-subtle)"
                  strokeWidth="1.5"
                />
                <line
                  x1="122"
                  y1="65"
                  x2="197"
                  y2="115"
                  stroke="white"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                <line
                  x1="272"
                  y1="65"
                  x2="197"
                  y2="115"
                  stroke="white"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                <circle
                  cx="197"
                  cy="115"
                  r="6"
                  fill="var(--color-accent-neon)"
                />

                <circle
                  cx="312"
                  cy="115"
                  r="15"
                  fill="none"
                  stroke="var(--color-accent-neon)"
                  strokeWidth="5"
                />
                <rect
                  x="326"
                  y="111"
                  width="52"
                  height="8"
                  fill="var(--color-accent-neon)"
                />
                <rect
                  x="357"
                  y="119"
                  width="7"
                  height="13"
                  fill="var(--color-accent-neon)"
                />
                <rect
                  x="370"
                  y="119"
                  width="7"
                  height="9"
                  fill="var(--color-accent-neon)"
                />

                <circle
                  cx="50"
                  cy="160"
                  r="3"
                  fill="var(--color-border-subtle)"
                />
                <circle
                  cx="460"
                  cy="50"
                  r="3"
                  fill="var(--color-border-subtle)"
                />
              </svg>

              <div className="flex flex-col gap-2 text-center">
                <h1 className="text-card font-medium text-text-heading font-poppins">
                  Forgot Password?
                </h1>
                <p className="text-body font-normal text-text-body font-inter leading-relaxed">
                  No worries! Enter the email address associated with your BOCC
                  account and we&apos;ll send you a link to reset your password.
                </p>
              </div>

              <form
                onSubmit={handleSubmit}
                className="flex flex-col gap-4"
                noValidate
                aria-label="Forgot password form"
              >
                {apiError && (
                  <div className="w-full p-3 bg-error/15 border border-error/30 text-error rounded-md text-small flex items-center gap-2">
                    <AlertCircle size={16} className="shrink-0" />
                    <span>{apiError}</span>
                  </div>
                )}

                <Input
                  id="forgot-email"
                  label="WORK EMAIL ADDRESS"
                  type="email"
                  placeholder="e.g. name@company.com"
                  autoComplete="username"
                  value={email}
                  disabled={isSubmitting}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={handleBlur}
                  error={touched ? emailError : ""}
                  leftSlot={<Mail size={15} strokeWidth={2} />}
                />

                <Button
                  variant="ghost"
                  fullWidth
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span className="inline-flex items-center gap-2">
                      <Loader2 size={16} className="animate-spin" />
                      Sending Link...
                    </span>
                  ) : (
                    <>
                      Send Reset Link
                      <ArrowRight
                        size={14}
                        strokeWidth={2}
                        aria-hidden="true"
                      />
                    </>
                  )}
                </Button>
              </form>

              <p className="text-small font-normal text-center text-text-muted font-inter">
                Remember your password?{" "}
                <Link
                  to="/login"
                  className="text-text-body font-medium hover:underline transition-all duration-150 ease-linear"
                >
                  Login
                </Link>
              </p>

              <div className="h-px bg-divider-line" role="separator" />

              <div className="flex items-center justify-center gap-3 text-small font-normal font-inter text-text-muted">
                <Link
                  to="/role-selection"
                  className="text-text-body hover:underline transition-all duration-150 ease-linear"
                >
                  Create New Account
                </Link>
                <span className="text-border-subtle" aria-hidden="true">
                  •
                </span>
                <ComingSoon label="Support Center" position="top" inline>
                  <span className="text-text-body hover:text-text-heading hover:underline transition-all duration-150 ease-linear cursor-pointer">
                    Support Center
                  </span>
                </ComingSoon>
              </div>
            </>
          )}
        </Card>

        <p className="text-center text-caption font-medium uppercase tracking-[0.2em] text-text-muted font-inter mt-4">
          Business Orbit Campus Clubs
        </p>
      </div>
    </div>
  );
}
