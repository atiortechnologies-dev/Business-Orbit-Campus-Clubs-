import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, RefreshCw, Loader2, AlertCircle } from "lucide-react";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { sendOtp, verifyOtp, getMe } from "@/api/auth/authApi";
import { useAuth } from "@/context/AuthContext";

const OTP_LENGTH = 6;
const RESEND_TIMEOUT = 45;

export default function VerifyEmailPage() {
  useDocumentTitle("Verify Your Email — BOCC");
  const navigate = useNavigate();
  const { fetchUser } = useAuth();

  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(""));
  const [secondsLeft, setSecondsLeft] = useState(RESEND_TIMEOUT);
  const [userEmail, setUserEmail] = useState("");

  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const inputsRef = useRef([]);

  // Send initial OTP on page mount
  useEffect(() => {
    let isMounted = true;

    const sendOtpInit = async () => {
      try {
        setIsSendingOtp(true);
        setError("");

        // Get authenticated user email using the httpOnly auth cookie
        const userRes = await getMe();

        // Handle response unwrapping safely
        const userData = userRes?.data || userRes;
        const email = userData?.email;

        if (!email) {
          throw new Error(
            "Unable to identify user session. Please log in again.",
          );
        }

        if (isMounted) {
          setUserEmail(email);
        }

        // Pass email into sendOtp payload
        await sendOtp(email);

        if (isMounted) {
          setSuccessMsg("Verification code sent to your inbox!");
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || "Failed to send verification code.");
        }
      } finally {
        if (isMounted) {
          setIsSendingOtp(false);
        }
      }
    };

    sendOtpInit();

    return () => {
      isMounted = false;
    };
  }, []);

  // Countdown Timer Effect
  useEffect(() => {
    if (secondsLeft <= 0) return;
    const timer = setInterval(() => setSecondsLeft((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [secondsLeft]);

  const handleChange = (index, value) => {
    const sanitized = value.replace(/\D/g, "");

    if (!sanitized) {
      const nextOtp = [...otp];
      nextOtp[index] = "";
      setOtp(nextOtp);
      return;
    }

    // Support pasting 6-digit code
    if (sanitized.length > 1) {
      const pastedCode = sanitized.slice(0, OTP_LENGTH).split("");
      const nextOtp = [...otp];
      pastedCode.forEach((digit, i) => {
        if (i < OTP_LENGTH) nextOtp[i] = digit;
      });
      setOtp(nextOtp);
      inputsRef.current[Math.min(pastedCode.length, OTP_LENGTH - 1)]?.focus();
      return;
    }

    const nextOtp = [...otp];
    nextOtp[index] = sanitized.slice(-1);
    setOtp(nextOtp);

    if (index < OTP_LENGTH - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const nextOtp = [...otp];
      nextOtp[index - 1] = "";
      setOtp(nextOtp);
      inputsRef.current[index - 1]?.focus();
    }
  };

  // Resend OTP Handler
  const handleResendOtp = async () => {
    if (!userEmail) {
      setError("User email missing. Please refresh the page.");
      return;
    }

    try {
      setIsSendingOtp(true);
      setError("");
      setSuccessMsg("");

      await sendOtp(userEmail);

      setSuccessMsg("A new verification code has been sent!");
      setSecondsLeft(RESEND_TIMEOUT);
    } catch (err) {
      setError(err.message || "Failed to resend OTP. Please try again.");
    } finally {
      setIsSendingOtp(false);
    }
  };

  // Verify OTP Handler
  const handleVerify = async (e) => {
    e.preventDefault();
    const enteredCode = otp.join("");

    if (enteredCode.length !== OTP_LENGTH || !userEmail) return;

    try {
      setIsVerifying(true);
      setError("");

      const res = await verifyOtp(userEmail, enteredCode);

      // Extract nested data from response
      const payload = res?.data || res;

      // accessToken/refreshToken are now set as httpOnly cookies directly
      // by the backend response — nothing to store client-side.

      await fetchUser({ silent: false });

      await fetchUser({ silent: false });

      // 3. Resolve destination URL safely with fallback
      const destination =
        payload?.redirect_to ||
        res?.redirect_to ||
        "/onboarding/verification-progress";

      // Trigger navigation
      navigate(destination, { replace: true });
    } catch (err) {
      setError(err.message || "Invalid or expired verification code.");
      setIsVerifying(false);
    }
  };

  const isComplete = otp.every((digit) => digit !== "");

  return (
    <div className="flex-1 flex items-center justify-center px-4 py-12 bg-canvas-bg">
      <div className="w-full max-w-sm bg-surface-white border border-border-subtle rounded-xl shadow-card p-8 flex flex-col items-center text-center">
        <div className="w-14 h-14 rounded-full bg-canvas-bg border border-border-subtle flex items-center justify-center mb-4">
          <Mail size={24} strokeWidth={2} className="text-text-heading" />
        </div>
        <span className="font-inter text-caption font-semibold uppercase tracking-wide text-text-muted bg-canvas-bg px-2.5 py-1 rounded-full mb-3">
          Step 2 of 3
        </span>
        <h1 className="font-poppins font-semibold text-card text-text-heading mb-2">
          Verify Your Email
        </h1>
        <p className="font-inter text-small text-text-muted leading-relaxed mb-6">
          We have sent a six-digit verification code to{" "}
          <span className="font-medium text-text-heading">
            {userEmail || "your email"}
          </span>
          .
        </p>

        {/* Feedback Alerts */}
        {error && (
          <div className="w-full p-3 bg-error/15 border border-error/30 text-error rounded-md text-small flex items-center gap-2 mb-4 text-left">
            <AlertCircle size={16} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {successMsg && !error && (
          <div className="w-full p-3 bg-success/15 border border-success/30 text-success rounded-md text-small mb-4 text-left">
            {successMsg}
          </div>
        )}

        <form
          onSubmit={handleVerify}
          className="w-full flex flex-col items-center gap-6"
        >
          <div className="flex gap-2">
            {otp.map((value, index) => (
              <input
                key={index}
                ref={(el) => {
                  inputsRef.current[index] = el;
                }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={value}
                disabled={isVerifying}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                aria-label={`OTP digit ${index + 1}`}
                className="w-11 h-12 text-center font-poppins font-semibold text-card bg-canvas-bg border border-border-subtle rounded-md focus:outline-none focus:ring-1 focus:ring-brand-black transition-all disabled:opacity-50"
              />
            ))}
          </div>

          <button
            type="submit"
            disabled={!isComplete || isVerifying || !userEmail}
            className="w-full bg-action-bg text-action-text font-poppins font-semibold text-small px-5 py-3 rounded-md hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
          >
            {isVerifying ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Verifying...
              </>
            ) : (
              "Verify"
            )}
          </button>

          <div className="flex items-center justify-between w-full font-inter text-small text-text-muted">
            <span>
              {secondsLeft > 0
                ? `Resend code in ${secondsLeft}s`
                : "Didn't receive code?"}
            </span>
            <button
              type="button"
              disabled={secondsLeft > 0 || isSendingOtp}
              onClick={handleResendOtp}
              className="inline-flex items-center gap-1.5 font-medium text-text-body hover:text-text-heading disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <RefreshCw
                size={14}
                strokeWidth={2}
                className={isSendingOtp ? "animate-spin" : ""}
              />
              Resend Code
            </button>
          </div>
        </form>

        <div className="w-full mt-6 pt-4 border-t border-border-subtle text-left">
          <p className="font-inter font-semibold text-small text-text-heading mb-1">
            Need help?
          </p>
          <p className="font-inter text-small text-text-muted">
            If you do not receive the code, check your spam folder or request a
            new one.
          </p>
        </div>
      </div>
    </div>
  );
}
