import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, RefreshCw } from 'lucide-react';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

const OTP_LENGTH = 6;

export default function VerifyEmailPage() {
  useDocumentTitle('Verify Your Email — BOCC');
  const navigate = useNavigate();
  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(''));
  const [secondsLeft, setSecondsLeft] = useState(45);
  const inputsRef = useRef([]);

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const timer = setInterval(() => setSecondsLeft((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [secondsLeft]);

  const handleChange = (index, value) => {
    const sanitized = value.replace(/\D/g, '').slice(-1);
    const nextOtp = [...otp];
    nextOtp[index] = sanitized;
    setOtp(nextOtp);
    if (sanitized && index < OTP_LENGTH - 1) inputsRef.current[index + 1]?.focus();
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const nextOtp = [...otp];
      nextOtp[index - 1] = '';
      setOtp(nextOtp);
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handleVerify = (e) => {
    e.preventDefault();
    // TODO(backend): POST the entered code to a real verification endpoint,
    // branch to /onboarding/application-rejected only on a real failure
    // response. There's no backend yet, so every complete code proceeds.
    navigate('/onboarding/verification-progress');
  };

  const isComplete = otp.every((digit) => digit !== '');

  return (
    <div className="flex-1 flex items-center justify-center px-4 py-12 bg-canvas-bg">
      <div className="w-full max-w-sm bg-surface-white border border-border-subtle rounded-xl shadow-card p-8 flex flex-col items-center text-center">
        <div className="w-14 h-14 rounded-full bg-canvas-bg border border-border-subtle flex items-center justify-center mb-4">
          <Mail size={24} strokeWidth={2} className="text-text-heading" />
        </div>
        <span className="font-inter text-caption font-semibold uppercase tracking-wide text-text-muted bg-canvas-bg px-2.5 py-1 rounded-full mb-3">
          Step 2 of 3
        </span>
        <h1 className="font-poppins font-semibold text-card text-text-heading mb-2">Verify Your Email</h1>
        <p className="font-inter text-small text-text-muted leading-relaxed mb-6">
          We have sent a six-digit verification code to your inbox. Enter it below to continue.
        </p>

        <form onSubmit={handleVerify} className="w-full flex flex-col items-center gap-6">
          <div className="flex gap-2">
            {otp.map((value, index) => (
              <input
                key={index}
                ref={(el) => { inputsRef.current[index] = el; }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={value}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                aria-label={`OTP digit ${index + 1}`}
                className="w-11 h-12 text-center font-poppins font-semibold text-card bg-canvas-bg border border-border-subtle rounded-md focus:outline-none focus:ring-1 focus:ring-brand-black transition-all"
              />
            ))}
          </div>

          <button
            type="submit"
            disabled={!isComplete}
            className="w-full bg-action-bg text-action-text font-poppins font-semibold text-small px-5 py-3 rounded-md hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            Verify
          </button>

          <div className="flex items-center justify-between w-full font-inter text-small text-text-muted">
            <span>Resend code in {secondsLeft}s</span>
            <button
              type="button"
              disabled={secondsLeft > 0}
              onClick={() => setSecondsLeft(45)}
              className="inline-flex items-center gap-1.5 font-medium text-text-body hover:text-text-heading disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <RefreshCw size={14} strokeWidth={2} />
              Resend Code
            </button>
          </div>
        </form>

        <div className="w-full mt-6 pt-4 border-t border-border-subtle text-left">
          <p className="font-inter font-semibold text-small text-text-heading mb-1">Need help?</p>
          <p className="font-inter text-small text-text-muted">
            If you do not receive the code, check your spam folder or request a new one.
          </p>
        </div>
      </div>
    </div>
  );
}
