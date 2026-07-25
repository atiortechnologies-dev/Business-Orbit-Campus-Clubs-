import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, Shield, Eye, EyeOff } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import PasswordStrengthMeter from '@/components/auth/PasswordStrengthMeter';

function computeStrength(password) {
  if (!password) return 0;
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password) || /[0-9]/.test(password)) score++;
  if (/[^a-zA-Z0-9]/.test(password)) score++;
  return score;
}

function EyeToggle({ show, onToggle }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={show ? 'Hide password' : 'Show password'}
      className="text-text-muted hover:text-text-heading transition-all duration-150 ease-linear focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-black rounded p-0.5"
    >
      {show ? (
        <EyeOff size={15} strokeWidth={2} aria-hidden="true" />
      ) : (
        <Eye size={15} strokeWidth={2} aria-hidden="true" />
      )}
    </button>
  );
}

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmError, setConfirmError] = useState('');
  const [confirmTouched, setConfirmTouched] = useState(false);

  const strength = computeStrength(newPassword);

  function validateConfirm(value) {
    if (!value) return 'Please confirm your password.';
    if (value !== newPassword) return 'Passwords do not match.';
    return '';
  }

  function handleConfirmBlur() {
    setConfirmTouched(true);
    setConfirmError(validateConfirm(confirmPassword));
  }

  // Also revalidate confirm when new password changes (after confirm has been touched)
  function handleNewPasswordChange(e) {
    setNewPassword(e.target.value);
    if (confirmTouched) {
      setConfirmError(validateConfirm(confirmPassword));
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    setConfirmTouched(true);
    const err = validateConfirm(confirmPassword);
    setConfirmError(err);
    if (!err && newPassword.length >= 8) {
      // TODO(backend): replace with a real POST /api/auth/reset-password
      // call, sending newPassword (and whatever reset token got the user
      // here). On success this redirect to /login stays the same; on
      // failure, surface the API's error via confirmError instead.
      navigate('/login');
    }
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 py-10 bg-canvas-bg">
      <div className="w-full max-w-sm">
        <Card className="p-8 flex flex-col gap-6">

          {/* Custom illustration — "secured" motif: a shield with a keyhole,
              accent-neon lit up. Distinct from ForgotPassword's envelope
              (that's the "request in flight" moment; this is the "new
              password locks it back down" moment right before this form's
              own submit). The keyhole is drawn with fixed accent-neon, not
              a theme-reactive token, so it reads as one continuous element
              with the fixed brand-black shield regardless of theme — the
              two rings around it are theme-reactive since they sit on the
              Card's own reactive background, not on the shield's fill. */}
          <svg
            viewBox="0 0 500 200"
            className="w-full aspect-[5/2] rounded-lg"
            role="img"
            aria-label="Illustration of a shield with a keyhole, representing a secured account"
          >
            <circle cx="250" cy="105" r="85" fill="none" stroke="var(--color-border-subtle)" strokeWidth="1.5" />
            <circle cx="250" cy="105" r="65" fill="none" stroke="var(--color-border-subtle)" strokeWidth="1.5" />

            <path
              d="M250 45 L300 63 L300 105 Q300 143 250 165 Q200 143 200 105 L200 63 Z"
              fill="var(--color-brand-black)"
            />

            <circle cx="250" cy="93" r="13" fill="var(--color-accent-neon)" />
            <polygon points="242,102 258,102 251,130 249,130" fill="var(--color-accent-neon)" />

            <circle cx="110" cy="60" r="3" fill="var(--color-border-subtle)" />
            <circle cx="395" cy="150" r="3" fill="var(--color-border-subtle)" />
            <circle cx="120" cy="155" r="4" fill="var(--color-border-subtle)" />
          </svg>

          <div className="flex flex-col gap-2 text-center">
            <h1 className="text-card font-medium text-text-heading font-poppins">Reset Password</h1>
            <p className="text-body font-normal text-text-body font-inter leading-relaxed">
              Secure your account by choosing a strong, unique password that you
              haven&apos;t used before.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-4"
            noValidate
            aria-label="Reset password form"
          >
            <div className="flex flex-col gap-2">
              <Input
                id="new-password"
                label="New Password"
                type={showNew ? 'text' : 'password'}
                placeholder="At least 8 characters"
                autoComplete="new-password"
                value={newPassword}
                onChange={handleNewPasswordChange}
                leftSlot={<Lock size={15} strokeWidth={2} />}
                rightSlot={
                  <EyeToggle
                    show={showNew}
                    onToggle={() => setShowNew((v) => !v)}
                  />
                }
              />
              {/* Meter — receives computed strength as prop; animates via
                  transition-colors on each segment (PasswordStrengthMeter.jsx) */}
              <PasswordStrengthMeter strength={strength} />
              <p className="text-small font-normal text-text-muted font-inter">
                Use uppercase letters, numbers, and symbols for maximum security.
              </p>
            </div>

            <Input
              id="confirm-password"
              label="Confirm Password"
              type={showConfirm ? 'text' : 'password'}
              placeholder="Repeat your new password"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                if (confirmTouched) {
                  setConfirmError(validateConfirm(e.target.value));
                }
              }}
              onBlur={handleConfirmBlur}
              error={confirmTouched ? confirmError : ''}
              leftSlot={<Shield size={15} strokeWidth={2} />}
              rightSlot={
                <EyeToggle
                  show={showConfirm}
                  onToggle={() => setShowConfirm((v) => !v)}
                />
              }
            />

            <Button variant="ghost" fullWidth type="submit">
              Save New Password
            </Button>
          </form>

          <p className="text-sm text-center">
            <Link
              to="/login"
              className="text-small font-normal text-text-body hover:text-text-heading underline underline-offset-2 transition-all duration-150 ease-linear font-inter"
            >
              Return to Login
            </Link>
          </p>

        </Card>
      </div>
    </div>
  );
}
