import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, EyeOff, CheckCircle2, ArrowRight } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import PasswordStrengthMeter from '@/components/auth/PasswordStrengthMeter';

function computeStrength(password) {
  if (!password) return 0;
  let score = 0;
  if (password.length >= 8) score += 1;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score += 1;
  if (/\d/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;
  return score;
}

// Shared shell for all 5 role-signup pages (Student/Company/Investor/
// Mentor/Incubator) — adapted from a fellow intern's 5 near-duplicate
// signup files (same layout/password/terms/submit flow, only the field
// list differed per role) and centralized here instead of staying
// copy-pasted 5 times. See StudentSignup.jsx for how a page supplies its
// own field list/copy.
export default function RoleSignupForm({ roleId, title, subtitle, icon, fields }) {
  const [values, setValues] = useState(() => Object.fromEntries(fields.map((f) => [f.name, ''])));
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const updateField = (name) => (e) => setValues((prev) => ({ ...prev, [name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (!agreed) {
      setError('Please accept the Terms of Service to continue.');
      return;
    }
    setError('');
    // TODO(backend): POST { role: roleId, ...values, password } to the registration endpoint.
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="flex-1 flex items-center justify-center px-4 py-12 bg-canvas-bg">
        <Card className="max-w-md w-full text-center py-10">
          <div className="w-14 h-14 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-5">
            <CheckCircle2 size={28} strokeWidth={2} className="text-success" />
          </div>
          <h1 className="font-poppins font-semibold text-card text-text-heading mb-2">Account Created</h1>
          <p className="font-inter text-body text-text-body mb-6">
            Welcome to BOCC, {values.fullName || 'there'}. You can sign in now to get started.
          </p>
          <Link to="/login" className="inline-block">
            <Button variant="primary">
              Continue to Login
              <ArrowRight size={16} strokeWidth={2} />
            </Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex-1 flex items-center justify-center px-4 py-12 bg-canvas-bg">
      <Card className="max-w-xl w-full">
        <div className="flex flex-col items-center text-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-lg bg-brand-black flex items-center justify-center">
            {icon}
          </div>
          <div>
            <h1 className="font-poppins font-semibold text-card text-text-heading">{title}</h1>
            <p className="font-inter text-small text-text-muted mt-1">{subtitle}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {fields.map((field) => (
              <div key={field.name} className={field.colSpan === 2 ? 'sm:col-span-2' : ''}>
                {field.type === 'select' ? (
                  <div className="flex flex-col gap-1">
                    <label htmlFor={`${roleId}-${field.name}`} className="text-caption font-medium text-text-heading font-inter">
                      {field.label}
                    </label>
                    <select
                      id={`${roleId}-${field.name}`}
                      value={values[field.name]}
                      onChange={updateField(field.name)}
                      required
                      className="w-full rounded-md border border-border-subtle bg-surface-white text-sm text-text-body font-inter min-h-[44px] px-3 focus:outline-none focus:border-brand-black focus:ring-1 focus:ring-brand-black"
                    >
                      <option value="" disabled>Select {field.label.toLowerCase()}</option>
                      {field.options.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                  </div>
                ) : (
                  <Input
                    id={`${roleId}-${field.name}`}
                    label={field.label}
                    type={field.type || 'text'}
                    placeholder={field.placeholder}
                    helperText={field.helperText}
                    value={values[field.name]}
                    onChange={updateField(field.name)}
                    required
                  />
                )}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              id={`${roleId}-password`}
              label="Password"
              type={showPassword ? 'text' : 'password'}
              placeholder="At least 8 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              rightSlot={
                <button type="button" onClick={() => setShowPassword((v) => !v)} aria-label={showPassword ? 'Hide password' : 'Show password'}>
                  {showPassword ? <EyeOff size={18} strokeWidth={2} /> : <Eye size={18} strokeWidth={2} />}
                </button>
              }
            />
            <Input
              id={`${roleId}-confirm-password`}
              label="Confirm Password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Re-enter your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          {password && <PasswordStrengthMeter strength={computeStrength(password)} />}

          <label className="flex items-start gap-2.5 cursor-pointer pt-1">
            <input
              type="checkbox"
              checked={agreed}
              onChange={() => setAgreed((v) => !v)}
              className="w-4 h-4 mt-0.5 accent-brand-black shrink-0"
            />
            <span className="font-inter text-small text-text-body">
              I agree to the{' '}
              <Link to="/legal/privacy-policy" className="underline underline-offset-2 hover:text-text-heading">Terms of Service</Link>
              {' '}and{' '}
              <Link to="/legal/privacy-policy" className="underline underline-offset-2 hover:text-text-heading">Privacy Policy</Link>.
            </span>
          </label>

          {error && <p role="alert" className="font-inter text-small text-error">{error}</p>}

          <Button type="submit" variant="primary" fullWidth>
            Create Account
            <ArrowRight size={16} strokeWidth={2} />
          </Button>
        </form>

        <p className="text-center font-inter text-small text-text-muted mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-text-body underline underline-offset-2 hover:text-text-heading">Login</Link>
          {' '}·{' '}
          <Link to="/role-selection" className="text-text-body hover:text-text-heading">Back</Link>
        </p>
      </Card>
    </div>
  );
}
