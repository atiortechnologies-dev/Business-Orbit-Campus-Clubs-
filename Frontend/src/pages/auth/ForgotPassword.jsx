import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, Mail, ArrowRight, CheckCircle } from 'lucide-react';
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
      // TODO(backend): POST /api/auth/forgot-password with `email`. Keep
      // showing this same confirmation view regardless of whether the
      // address exists, to avoid leaking which emails are registered.
      setSubmitted(true);
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
                <h2 className="text-card font-medium text-text-heading font-poppins">Check your inbox</h2>
                <p className="text-body font-normal text-text-body font-inter leading-relaxed">
                  If{' '}
                  <span className="text-text-heading font-medium">{email}</span>{' '}
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
              {/* Custom illustration — "recovery request" motif: an email
                  being sent out, with the key to your account riding along
                  with it. Distinct from Login's orbit (that's a brand mark;
                  this is about what's actually happening on THIS screen —
                  requesting access back via email) and from ResetPassword's
                  shield motif (that's the "secured" end state, this is the
                  "request in flight" moment). The envelope has its own
                  fixed brand-black fill (like the Sidebar), so the flap
                  lines drawn on it are literal white, not the reactive
                  border-subtle token — see CONTRIBUTING.md §6. */}
              <svg
                viewBox="0 0 500 200"
                className="w-full aspect-[5/2] rounded-lg"
                role="img"
                aria-label="Illustration of an email being sent with an account recovery key"
              >
                <circle cx="120" cy="70" r="3" fill="var(--color-border-subtle)" />
                <circle cx="145" cy="85" r="4" fill="var(--color-border-subtle)" />
                <circle cx="170" cy="98" r="5" fill="var(--color-border-subtle)" />

                <rect x="185" y="55" width="150" height="100" rx="10" fill="var(--color-brand-black)" />
                <line x1="185" y1="65" x2="260" y2="115" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
                <line x1="335" y1="65" x2="260" y2="115" stroke="white" strokeWidth="2.5" strokeLinecap="round" />

                {/* Key — the reset link/access riding along with the email.
                    Ring + horizontal shaft + perpendicular teeth, not a
                    ring-plus-diagonal-line (that reads as a magnifying
                    glass, not a key — first draft of this shape made
                    exactly that mistake). */}
                <circle cx="375" cy="115" r="15" fill="none" stroke="var(--color-accent-neon)" strokeWidth="5" />
                <rect x="389" y="111" width="52" height="8" fill="var(--color-accent-neon)" />
                <rect x="420" y="119" width="7" height="13" fill="var(--color-accent-neon)" />
                <rect x="433" y="119" width="7" height="9" fill="var(--color-accent-neon)" />

                <circle cx="80" cy="150" r="3" fill="var(--color-border-subtle)" />
                <circle cx="440" cy="60" r="3" fill="var(--color-border-subtle)" />
              </svg>

              <div className="flex flex-col gap-2 text-center">
                <h1 className="text-card font-medium text-text-heading font-poppins">Forgot Password?</h1>
                <p className="text-body font-normal text-text-body font-inter leading-relaxed">
                  No worries! Enter the email address associated with your BOCC account
                  and we&apos;ll send you a link to reset your password.
                </p>
              </div>

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

              <p className="text-small font-normal text-center text-text-muted font-inter">
                Remember your password?{' '}
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

        <p className="text-center text-caption font-medium uppercase tracking-[0.2em] text-text-muted font-inter mt-4">
          Business Orbit Campus Clubs
        </p>

      </div>
    </div>
  );
}
