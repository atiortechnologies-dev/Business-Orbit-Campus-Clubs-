/**
 * @page ResetPasswordPage  /reset-password
 * Owns new/confirm password values, two independent eye
 * toggles, live strength computation, and confirm-match validation.
 *
 * Strength formula (1 point each):
 *   1. length >= 8
 *   2. contains uppercase letter
 *   3. contains lowercase letter OR digit
 *   4. contains symbol (non-alphanumeric)
 * → 0–4 integer passed to PasswordStrengthMeter as prop.
 *
 * Confirm password: validated on blur of the confirm field and on submit.
 * Both eye toggles are completely independent state variables.
 * No backend exists yet — a valid submit redirects straight to /login (see
 * the TODO in handleSubmit for what a real integration needs to do instead).
 */

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, Shield, Eye, EyeOff } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import PasswordStrengthMeter from '@/components/auth/PasswordStrengthMeter';

/* ── Strength computation ───────────────────────────────── */
function computeStrength(password) {
  if (!password) return 0;
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password) || /[0-9]/.test(password)) score++;
  if (/[^a-zA-Z0-9]/.test(password)) score++;
  return score;
}

/* ── Eye toggle button ──────────────────────────────────── */
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

/* ── Component ──────────────────────────────────────────── */
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

          {/* Custom illustration — same orbit motif as Login/ForgotPassword
              (this screen is a step in the same auth flow), recomposed for
              the wider aspect-[5/2] frame. */}
          <svg
            viewBox="0 0 500 200"
            className="w-full aspect-[5/2] rounded-lg"
            role="img"
            aria-label="Illustration of campus clubs orbiting a central hub"
          >
            <ellipse cx="250" cy="100" rx="220" ry="45" fill="none" stroke="var(--color-border-subtle)" strokeWidth="1.5" transform="rotate(-6 250 100)" />
            <ellipse cx="250" cy="100" rx="170" ry="65" fill="none" stroke="var(--color-border-subtle)" strokeWidth="1.5" transform="rotate(9 250 100)" />
            <ellipse cx="250" cy="100" rx="120" ry="80" fill="none" stroke="var(--color-border-subtle)" strokeWidth="1.5" transform="rotate(-12 250 100)" />

            <circle cx="250" cy="100" r="24" fill="var(--color-brand-black)" />
            <circle cx="250" cy="100" r="8" fill="var(--color-accent-neon)" />

            <circle cx="410" cy="88" r="8" fill="var(--color-surface-white)" stroke="var(--color-brand-black)" strokeWidth="1.5" />
            <circle cx="410" cy="88" r="2.5" fill="var(--color-accent-neon)" />

            <circle cx="105" cy="122" r="7" fill="var(--color-surface-white)" stroke="var(--color-brand-black)" strokeWidth="1.5" />
            <circle cx="105" cy="122" r="2" fill="var(--color-accent-neon)" />

            <circle cx="330" cy="165" r="5" fill="var(--color-surface-white)" stroke="var(--color-brand-black)" strokeWidth="1.5" />
            <circle cx="175" cy="35" r="4" fill="var(--color-surface-white)" stroke="var(--color-brand-black)" strokeWidth="1.5" />

            <circle cx="70" cy="60" r="3" fill="var(--color-border-subtle)" />
            <circle cx="420" cy="150" r="3" fill="var(--color-border-subtle)" />
          </svg>

          {/* Heading + description */}
          <div className="flex flex-col gap-2 text-center">
            <h1 className="text-[22px] leading-[28px] font-medium text-text-heading font-poppins">Reset Password</h1>
            <p className="text-[16px] leading-[24px] font-normal text-text-body font-inter leading-relaxed">
              Secure your account by choosing a strong, unique password that you
              haven&apos;t used before.
            </p>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-4"
            noValidate
            aria-label="Reset password form"
          >
            {/* New Password + live strength meter + hint */}
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
              <p className="text-[14px] leading-[20px] font-normal text-text-muted font-inter">
                Use uppercase letters, numbers, and symbols for maximum security.
              </p>
            </div>

            {/* Confirm Password — independent eye toggle */}
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

            {/* Save */}
            <Button variant="ghost" fullWidth type="submit">
              Save New Password
            </Button>
          </form>

          {/* Return to Login */}
          <p className="text-sm text-center">
            <Link
              to="/login"
              className="text-[14px] leading-[20px] font-normal text-text-body hover:text-text-heading underline underline-offset-2 transition-all duration-150 ease-linear font-inter"
            >
              Return to Login
            </Link>
          </p>

        </Card>
      </div>
    </div>
  );
}
