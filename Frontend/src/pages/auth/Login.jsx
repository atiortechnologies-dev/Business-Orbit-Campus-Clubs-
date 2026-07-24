/**
 * @page LoginPage  /login
 * Owns email/password values, validation errors, eye-toggle,
 * remember-me checkbox. No backend exists yet: a valid submit redirects to
 * /dashboard directly (see the TODO in handleSubmit for what a real
 * integration needs to do instead).
 *
 * Validation: blur + submit, format-only checks.
 * Eye toggle: independent show/hide for the password field.
 */

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ChevronLeft,
  Mail,
  Lock,
  Eye,
  EyeOff,
} from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Logo from '@/components/ui/Logo';

/* ── Validation helpers ─────────────────────────────────── */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateField(name, value) {
  if (name === 'email') {
    if (!value.trim()) return 'Email address is required.';
    if (!EMAIL_RE.test(value.trim())) return 'Enter a valid email address.';
  }
  if (name === 'password') {
    if (!value) return 'Password is required.';
    if (value.length < 8) return 'Password must be at least 8 characters.';
  }
  return '';
}

/* ── Component ──────────────────────────────────────────── */
export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  function handleBlur(name, value) {
    setTouched((t) => ({ ...t, [name]: true }));
    setErrors((e) => ({ ...e, [name]: validateField(name, value) }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    const fields = { email, password };
    const allTouched = { email: true, password: true };
    const newErrors = Object.fromEntries(
      Object.entries(fields).map(([k, v]) => [k, validateField(k, v)])
    );
    setTouched(allTouched);
    setErrors(newErrors);

    const valid = Object.values(newErrors).every((err) => !err);
    if (valid) {
      // TODO(backend): replace with a real POST /api/auth/login call.
      // On success the API should establish a session; this redirect to
      // /dashboard stays the same. On failure, surface the API's error via
      // the existing `errors` state instead of assuming success like now.
      navigate('/dashboard');
    }
  }

  return (
    <div className="flex-1 grid lg:grid-cols-[44%_56%]">

      {/* ── Left column (desktop only) ────────────────────── */}
      <section
        className="hidden lg:flex flex-col gap-8 pl-20 pr-4 pt-10 pb-14 bg-canvas-bg"
        aria-labelledby="hero-heading"
      >
        {/* Custom illustration — abstract "orbit" motif: a central hub with
            campus clubs orbiting it, themed entirely with design tokens so
            it adapts to light/dark like every other element on this page.
            This one's specific to Login (it's literally the brand name) —
            ForgotPassword and ResetPassword each get their own motif tied
            to what's actually happening on THOSE screens (an envelope+key
            "request in flight," a shield+keyhole "secured" state) rather
            than reusing this one for generic auth-flow consistency, which
            read as irrelevant on a password-recovery screen. All of them
            share the same geometric line-art language (Dashboard's idea
            spark, Startup Journey's path, MVP Overview's assembling blocks
            included) even though each motif itself is bespoke per screen. */}
        <svg
          viewBox="0 0 400 300"
          className="w-full aspect-[4/3] rounded-lg"
          role="img"
          aria-label="Illustration of campus clubs orbiting a central hub"
        >
          <ellipse cx="200" cy="150" rx="170" ry="70" fill="none" stroke="var(--color-border-subtle)" strokeWidth="1.5" transform="rotate(-8 200 150)" />
          <ellipse cx="200" cy="150" rx="130" ry="100" fill="none" stroke="var(--color-border-subtle)" strokeWidth="1.5" transform="rotate(12 200 150)" />
          <ellipse cx="200" cy="150" rx="90" ry="130" fill="none" stroke="var(--color-border-subtle)" strokeWidth="1.5" transform="rotate(-15 200 150)" />

          {/* Central hub */}
          <circle cx="200" cy="150" r="26" fill="var(--color-brand-black)" />
          <circle cx="200" cy="150" r="9" fill="var(--color-accent-neon)" />

          {/* Orbiting nodes ("clubs") */}
          <circle cx="332" cy="128" r="10" fill="var(--color-surface-white)" stroke="var(--color-brand-black)" strokeWidth="1.5" />
          <circle cx="332" cy="128" r="3" fill="var(--color-accent-neon)" />

          <circle cx="88" cy="185" r="8" fill="var(--color-surface-white)" stroke="var(--color-brand-black)" strokeWidth="1.5" />
          <circle cx="88" cy="185" r="2.5" fill="var(--color-accent-neon)" />

          <circle cx="255" cy="245" r="7" fill="var(--color-surface-white)" stroke="var(--color-brand-black)" strokeWidth="1.5" />

          <circle cx="140" cy="45" r="6" fill="var(--color-surface-white)" stroke="var(--color-brand-black)" strokeWidth="1.5" />

          <circle cx="60" cy="90" r="4" fill="var(--color-border-subtle)" />
          <circle cx="330" cy="220" r="4" fill="var(--color-border-subtle)" />
          <circle cx="230" cy="30" r="3" fill="var(--color-border-subtle)" />
        </svg>

        {/* Heading + paragraph */}
        <div className="flex flex-col gap-4">
          <h1
            id="hero-heading"
            className="text-[32px] leading-[40px] font-semibold text-text-heading font-poppins"
          >
            Empowering the Next Generation of Business Leaders.
          </h1>
          <p className="text-[16px] leading-[24px] font-normal text-text-body font-inter">
            Join Business Orbit Campus Clubs (BOCC) to bridge the gap between
            academic innovation and global industry standard. Connect with mentors,
            investors, and fellow entrepreneurs to launch your professional journey.
          </p>
        </div>

        {/* Avatar cluster + trust line */}
        <div className="flex items-center gap-3">
          <div className="flex -space-x-2" aria-hidden="true">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="block w-8 h-8 rounded-full bg-surface-white border-2 border-canvas-bg"
                style={{ zIndex: 3 - i }}
              />
            ))}
            <span
              className="w-8 h-8 rounded-full bg-brand-black border-2 border-canvas-bg flex items-center justify-center text-white text-[10px] font-semibold font-inter"
              style={{ zIndex: 0 }}
            >
              +10k
            </span>
          </div>
          <p className="text-[14px] leading-[20px] font-normal text-text-muted font-inter">
            Trusted by students across 500+ campuses worldwide.
          </p>
        </div>
      </section>

      {/* ── Right column ──────────────────────────────────── */}
      <section
        className="flex flex-col px-4 sm:px-8 lg:px-12 pt-8 pb-14 bg-canvas-bg"
        aria-labelledby="login-heading"
      >
        {/* Back to Home */}
        <Link
          to="/login"
          className="inline-flex items-center gap-1 text-[14px] leading-[20px] text-text-muted hover:text-text-heading transition-all duration-150 ease-linear self-start font-inter"
          aria-label="Back to home page"
        >
          <ChevronLeft size={14} strokeWidth={2} aria-hidden="true" />
          Back to Home
        </Link>

        {/* Centred main content */}
        <div className="flex-1 flex flex-col items-center justify-center gap-5 py-6">
          <div className="w-full max-w-[546px] flex flex-col items-center gap-5">

            {/* BOCC mark above heading — PublicNav already renders the
                horizontal lockup above this page, so this is a secondary
                instance (no `priority`) sized to match the small
                decorative-icon role it replaces, not a header-scale logo. */}
            <Logo variant="mark" size={28} />

            {/* Heading + subtext */}
            <div className="text-center flex flex-col gap-1.5">
              <h2 id="login-heading" className="text-[22px] leading-[28px] font-medium text-text-heading font-poppins">
                Welcome Back
              </h2>
              <p className="text-[16px] leading-[24px] font-normal text-text-body font-inter">
                Enter your credentials to access your BOCC portal.
              </p>
            </div>

            {/* Form card */}
            <Card className="w-full">
              <form
                onSubmit={handleSubmit}
                className="flex flex-col gap-4"
                noValidate
                aria-label="Login form"
              >
                {/* Email */}
                <Input
                  id="login-email"
                  label="Email Address"
                  type="email"
                  placeholder="name@campusclub.com"
                  autoComplete="username"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={() => handleBlur('email', email)}
                  error={touched.email ? errors.email : ''}
                  leftSlot={<Mail size={15} strokeWidth={2} />}
                />

                {/* Password — eye toggle */}
                <Input
                  id="login-password"
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onBlur={() => handleBlur('password', password)}
                  error={touched.password ? errors.password : ''}
                  leftSlot={<Lock size={15} strokeWidth={2} />}
                  rightSlot={
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      className="text-text-muted hover:text-text-heading transition-all duration-150 ease-linear focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-black rounded p-0.5"
                    >
                      {showPassword ? (
                        <EyeOff size={15} strokeWidth={2} aria-hidden="true" />
                      ) : (
                        <Eye size={15} strokeWidth={2} aria-hidden="true" />
                      )}
                    </button>
                  }
                />

                {/* Remember me + Forgot password */}
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="remember-me"
                    className="flex items-center gap-2 text-[14px] leading-[20px] font-normal text-text-muted cursor-pointer select-none font-inter"
                  >
                    <div className="relative flex items-center justify-center w-4 h-4">
                      <input
                        type="checkbox"
                        id="remember-me"
                        name="remember-me"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="peer appearance-none w-4 h-4 rounded-sm border border-border-subtle bg-transparent checked:bg-accent-neon checked:border-border-subtle focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-black transition-all duration-150 ease-linear cursor-pointer"
                      />
                      <svg
                        className="absolute w-2.5 h-2.5 pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity duration-150 text-brand-black"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="4"
                        aria-hidden="true"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    Remember me
                  </label>
                  <Link
                    to="/forgot-password"
                    className="text-[14px] leading-[20px] font-normal text-text-body font-inter hover:underline transition-all duration-150 ease-linear"
                  >
                    Forgot password?
                  </Link>
                </div>

                {/* Primary CTA */}
                <Button variant="primary" fullWidth type="submit">
                  Login to Account
                </Button>

                {/* Divider */}
                <div className="flex items-center gap-3" role="separator">
                  <div className="flex-1 h-px bg-divider-line" />
                  <span className="text-[12px] leading-[16px] font-medium tracking-wide text-text-muted font-inter shrink-0">
                    NEW TO BOCC?
                  </span>
                  <div className="flex-1 h-px bg-divider-line" />
                </div>

                {/* Secondary CTA */}
                <Button
                  variant="outline"
                  fullWidth
                  type="button"
                  onClick={() => navigate('/role-selection')}
                >
                  Create an Account
                </Button>
              </form>
            </Card>

            {/* Disclaimer */}
            <p className="text-[14px] leading-[20px] font-normal text-center text-text-muted font-inter">
              By logging in, you agree to our{' '}
              <Link
                to="/legal/privacy-policy"
                className="text-text-body hover:text-text-heading underline underline-offset-2 transition-all duration-150 ease-linear"
              >
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link
                to="/legal/privacy-policy"
                className="text-text-body hover:text-text-heading underline underline-offset-2 transition-all duration-150 ease-linear"
              >
                Privacy Policy
              </Link>
              .
            </p>
          </div>
        </div>
      </section>

    </div>
  );
}
