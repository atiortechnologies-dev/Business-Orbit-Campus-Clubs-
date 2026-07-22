/**
 * @page ForgotPasswordPage  /forgot-password
 * Owns email value, validation, and the submitted/confirmation
 * state swap. Valid submit swaps the form inside the Card for a confirmation
 * view (client state only — no backend exists yet, so no email is actually
 * sent).
 *
 * The Card outer shell, Back to Login link, and brand caption remain visible
 * during both states. Only the Card content swaps.
 */

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, Lock, Mail, ArrowRight, CheckCircle } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import ComingSoon from '@/components/ui/ComingSoon';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateEmail(value) {
  if (!value.trim()) return 'Email address is required.';
  if (!EMAIL_RE.test(value.trim())) return 'Enter a valid email address.';
  return '';
}

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [touched, setTouched] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  function handleBlur() {
    setTouched(true);
    setEmailError(validateEmail(email));
  }

  function handleSubmit(e) {
    e.preventDefault();
    setTouched(true);
    const err = validateEmail(email);
    setEmailError(err);
    if (!err) {
      setSubmitted(true);
    }
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 py-10 bg-canvas-bg">
      <div className="w-full max-w-sm flex flex-col gap-4">

        {/* Back to Login — above card, always visible */}
        <Link
          to="/login"
          className="inline-flex items-center gap-1 text-[14px] leading-[20px] font-normal text-text-body hover:text-text-heading transition-all duration-150 ease-linear self-start font-inter"
          aria-label="Return to login"
        >
          <ChevronLeft size={14} strokeWidth={2} aria-hidden="true" />
          Back to Login
        </Link>

        {/* ── Card ───────────────────────────────────────── */}
        <Card className="p-8 flex flex-col gap-6">
          {submitted ? (
            /* ── Confirmation view (swaps in after valid submit) ── */
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
                <h2 className="text-[22px] leading-[28px] font-medium text-text-heading font-poppins">Check your inbox</h2>
                <p className="text-[16px] leading-[24px] font-normal text-text-body font-inter leading-relaxed">
                  If{' '}
                  <span className="text-text-heading font-medium">{email}</span>{' '}
                  is registered, you&apos;ll receive a reset link shortly.
                </p>
              </div>
              <Link
                to="/login"
                className="text-[14px] leading-[20px] font-normal text-text-body hover:underline transition-all duration-150 ease-linear font-inter"
              >
                Back to Login
              </Link>
            </div>
          ) : (
            /* ── Form view ─────────────────────────────────── */
            <>
              {/* Illustration placeholder */}
              <div
                className="w-full aspect-[5/2] border border-dashed border-border-subtle bg-transparent flex flex-col items-center justify-center gap-2 text-text-muted rounded-lg"
                role="img"
                aria-label="Illustration placeholder"
              >
                <Lock size={32} strokeWidth={2} className="text-text-muted" aria-hidden="true" />
                <span className="text-[11px] uppercase tracking-widest select-none font-inter font-medium">
                  Placeholder
                </span>
              </div>

              {/* Heading + description */}
              <div className="flex flex-col gap-2 text-center">
                <h1 className="text-[22px] leading-[28px] font-medium text-text-heading font-poppins">Forgot Password?</h1>
                <p className="text-[16px] leading-[24px] font-normal text-text-body font-inter leading-relaxed">
                  No worries! Enter the email address associated with your BOCC account
                  and we&apos;ll send you a link to reset your password.
                </p>
              </div>

              {/* Form */}
              <form
                onSubmit={handleSubmit}
                className="flex flex-col gap-4"
                noValidate
                aria-label="Forgot password form"
              >
                <Input
                  id="forgot-email"
                  label="WORK EMAIL ADDRESS"
                  type="email"
                  placeholder="e.g. name@company.com"
                  autoComplete="username"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={handleBlur}
                  error={touched ? emailError : ''}
                  leftSlot={<Mail size={15} strokeWidth={2} />}
                />
                <Button variant="ghost" fullWidth type="submit">
                  Send Reset Link
                  <ArrowRight size={14} strokeWidth={2} aria-hidden="true" />
                </Button>
              </form>

              {/* Login reminder */}
              <p className="text-[14px] leading-[20px] font-normal text-center text-text-muted font-inter">
                Remember your password?{' '}
                <Link
                  to="/login"
                  className="text-text-body font-medium hover:underline transition-all duration-150 ease-linear"
                >
                  Login
                </Link>
              </p>

              {/* Divider */}
              <div className="h-px bg-divider-line" role="separator" />

              {/* Secondary links */}
              <div className="flex items-center justify-center gap-3 text-[14px] leading-[20px] font-normal font-inter text-text-muted">
                <Link
                  to="/role-selection"
                  className="text-text-body hover:underline transition-all duration-150 ease-linear"
                >
                  Create New Account
                </Link>
                <span className="text-border-subtle" aria-hidden="true">•</span>
                <ComingSoon label="Support Center" position="top" inline>
                  <span className="text-text-body hover:text-text-heading hover:underline transition-all duration-150 ease-linear">
                    Support Center
                  </span>
                </ComingSoon>
              </div>
            </>
          )}
        </Card>

        {/* Below-card brand tagline */}
        <p className="text-center text-[12px] leading-[16px] font-medium uppercase tracking-[0.2em] text-text-muted font-inter mt-4">
          Business Orbit Campus Clubs
        </p>

      </div>
    </div>
  );
}
