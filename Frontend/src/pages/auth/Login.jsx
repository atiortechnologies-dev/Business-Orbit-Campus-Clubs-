import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  Loader2,
} from "lucide-react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Logo from "@/components/ui/Logo";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { loginUser } from "@/api/authApi";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateField(name, value) {
  if (name === "email") {
    if (!value.trim()) return "Email address is required.";
    if (!EMAIL_RE.test(value.trim())) return "Enter a valid email address.";
  }
  if (name === "password") {
    if (!value) return "Password is required.";
    if (value.length < 8) return "Password must be at least 8 characters.";
  }
  return "";
}

export default function LoginPage() {
  useDocumentTitle("Login — BOCC");
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState("");

  function handleBlur(name, value) {
    setTouched((t) => ({ ...t, [name]: true }));
    setErrors((e) => ({ ...e, [name]: validateField(name, value) }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setApiError("");

    const fields = { email, password };
    const allTouched = { email: true, password: true };
    const newErrors = Object.fromEntries(
      Object.entries(fields).map(([k, v]) => [k, validateField(k, v)]),
    );
    setTouched(allTouched);
    setErrors(newErrors);

    const valid = Object.values(newErrors).every((err) => !err);

    if (valid) {
      try {
        setIsSubmitting(true);

        const res = await loginUser({
          email: email.trim(),
          password,
        });

        console.log("LOGIN RESPONSE RAW:", res);

        // Extract redirect destination from every possible nesting level
        const destination =
          res?.data?.data?.redirect_to ||
          res?.data?.redirect_to ||
          res?.redirect_to ||
          "/dashboard";

        const accessToken =
          res?.data?.data?.accessToken ||
          res?.data?.accessToken ||
          res?.accessToken;

        const refreshToken =
          res?.data?.data?.refreshToken ||
          res?.data?.refreshToken ||
          res?.refreshToken;

        if (accessToken) localStorage.setItem("accessToken", accessToken);
        if (refreshToken) localStorage.setItem("refreshToken", refreshToken);

        console.log("NAVIGATING TO:", destination);

        // Force navigation
        navigate(destination, { replace: true });
      } catch (err) {
        console.error("LOGIN ERROR CATCH:", err);

        // Handle 403 or error payloads containing redirect_to
        const redirectOn403 =
          err.response?.data?.data?.redirect_to ||
          err.response?.data?.redirect_to ||
          err?.data?.redirect_to;

        if (redirectOn403) {
          console.log("NAVIGATING VIA 403 ERROR TO:", redirectOn403);
          navigate(redirectOn403, { replace: true });
          return;
        }

        setApiError(
          err.response?.data?.message ||
            err.message ||
            "Invalid email or password. Please try again.",
        );
      } finally {
        setIsSubmitting(false);
      }
    }
  }

  return (
    <div className="flex-1 grid lg:grid-cols-[44%_56%]">
      {/* Left Hero Section */}
      <section
        className="hidden lg:flex flex-col gap-8 pl-20 pr-4 pt-10 pb-14 bg-canvas-bg"
        aria-labelledby="hero-heading"
      >
        <svg
          viewBox="0 0 400 300"
          className="w-full aspect-[4/3] rounded-lg"
          role="img"
          aria-label="Illustration of campus clubs orbiting a central hub"
        >
          <ellipse
            cx="200"
            cy="150"
            rx="170"
            ry="70"
            fill="none"
            stroke="var(--color-border-subtle)"
            strokeWidth="1.5"
            transform="rotate(-8 200 150)"
          />
          <ellipse
            cx="200"
            cy="150"
            rx="130"
            ry="100"
            fill="none"
            stroke="var(--color-border-subtle)"
            strokeWidth="1.5"
            transform="rotate(12 200 150)"
          />
          <ellipse
            cx="200"
            cy="150"
            rx="90"
            ry="130"
            fill="none"
            stroke="var(--color-border-subtle)"
            strokeWidth="1.5"
            transform="rotate(-15 200 150)"
          />

          <circle cx="200" cy="150" r="26" fill="var(--color-brand-black)" />
          <circle cx="200" cy="150" r="9" fill="var(--color-accent-neon)" />

          <circle
            cx="332"
            cy="128"
            r="10"
            fill="var(--color-surface-white)"
            stroke="var(--color-brand-black)"
            strokeWidth="1.5"
          />
          <circle cx="332" cy="128" r="3" fill="var(--color-accent-neon)" />

          <circle
            cx="88"
            cy="185"
            r="8"
            fill="var(--color-surface-white)"
            stroke="var(--color-brand-black)"
            strokeWidth="1.5"
          />
          <circle cx="88" cy="185" r="2.5" fill="var(--color-accent-neon)" />

          <circle
            cx="255"
            cy="245"
            r="7"
            fill="var(--color-surface-white)"
            stroke="var(--color-brand-black)"
            strokeWidth="1.5"
          />

          <circle
            cx="140"
            cy="45"
            r="6"
            fill="var(--color-surface-white)"
            stroke="var(--color-brand-black)"
            strokeWidth="1.5"
          />

          <circle cx="60" cy="90" r="4" fill="var(--color-border-subtle)" />
          <circle cx="330" cy="220" r="4" fill="var(--color-border-subtle)" />
          <circle cx="230" cy="30" r="3" fill="var(--color-border-subtle)" />
        </svg>

        <div className="flex flex-col gap-4">
          <h1
            id="hero-heading"
            className="text-section font-semibold text-text-heading font-poppins"
          >
            Empowering the Next Generation of Business Leaders.
          </h1>
          <p className="text-body font-normal text-text-body font-inter">
            Join Business Orbit Campus Clubs (BOCC) to bridge the gap between
            academic innovation and global industry standard. Connect with
            mentors, investors, and fellow entrepreneurs to launch your
            professional journey.
          </p>
        </div>

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
          <p className="text-small font-normal text-text-muted font-inter">
            Trusted by students across 500+ campuses worldwide.
          </p>
        </div>
      </section>

      {/* Right Login Form Section */}
      <section
        className="flex flex-col px-4 sm:px-8 lg:px-12 pt-8 pb-14 bg-canvas-bg"
        aria-labelledby="login-heading"
      >
        <Link
          to="/landing"
          className="inline-flex items-center gap-1 text-small text-text-muted hover:text-text-heading transition-all duration-150 ease-linear self-start font-inter"
          aria-label="Back to home page"
        >
          <ChevronLeft size={14} strokeWidth={2} aria-hidden="true" />
          Back to Home
        </Link>

        <div className="flex-1 flex flex-col items-center justify-center gap-5 py-6">
          <div className="w-full max-w-[546px] flex flex-col items-center gap-5">
            <Logo variant="mark" size={28} />

            <div className="text-center flex flex-col gap-1.5">
              <h2
                id="login-heading"
                className="text-card font-medium text-text-heading font-poppins"
              >
                Welcome Back
              </h2>
              <p className="text-body font-normal text-text-body font-inter">
                Enter your credentials to access your BOCC portal.
              </p>
            </div>

            <Card className="w-full">
              <form
                onSubmit={handleSubmit}
                className="flex flex-col gap-4"
                noValidate
                aria-label="Login form"
              >
                {apiError && (
                  <div className="w-full p-3 bg-error/15 border border-error/30 text-error rounded-md text-small flex items-center gap-2">
                    <AlertCircle size={16} className="shrink-0" />
                    <span>{apiError}</span>
                  </div>
                )}

                <Input
                  id="login-email"
                  label="Email Address"
                  type="email"
                  placeholder="name@campusclub.com"
                  autoComplete="username"
                  value={email}
                  disabled={isSubmitting}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={() => handleBlur("email", email)}
                  error={touched.email ? errors.email : ""}
                  leftSlot={<Mail size={15} strokeWidth={2} />}
                />

                <Input
                  id="login-password"
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  disabled={isSubmitting}
                  onChange={(e) => setPassword(e.target.value)}
                  onBlur={() => handleBlur("password", password)}
                  error={touched.password ? errors.password : ""}
                  leftSlot={<Lock size={15} strokeWidth={2} />}
                  rightSlot={
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
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

                <div className="flex items-center justify-between">
                  <label
                    htmlFor="remember-me"
                    className="flex items-center gap-2 text-small font-normal text-text-muted cursor-pointer select-none font-inter"
                  >
                    <div className="relative flex items-center justify-center w-4 h-4">
                      <input
                        type="checkbox"
                        id="remember-me"
                        name="remember-me"
                        checked={rememberMe}
                        disabled={isSubmitting}
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
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    Remember me
                  </label>
                  <Link
                    to="/forgot-password"
                    className="text-small font-normal text-text-body font-inter hover:underline transition-all duration-150 ease-linear"
                  >
                    Forgot password?
                  </Link>
                </div>

                <Button
                  variant="primary"
                  fullWidth
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span className="inline-flex items-center gap-2">
                      <Loader2 size={16} className="animate-spin" />
                      Logging in...
                    </span>
                  ) : (
                    "Login to Account"
                  )}
                </Button>

                <div className="flex items-center gap-3" role="separator">
                  <div className="flex-1 h-px bg-divider-line" />
                  <span className="text-caption font-medium tracking-wide text-text-muted font-inter shrink-0">
                    NEW TO BOCC?
                  </span>
                  <div className="flex-1 h-px bg-divider-line" />
                </div>

                <Button
                  variant="outline"
                  fullWidth
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => navigate("/role-selection")}
                >
                  Create an Account
                </Button>
              </form>
            </Card>

            <p className="text-small font-normal text-center text-text-muted font-inter">
              By logging in, you agree to our{" "}
              <Link
                to="/legal/privacy-policy"
                className="text-text-body hover:text-text-heading underline underline-offset-2 transition-all duration-150 ease-linear"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
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
