import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, ArrowRight, Loader2 } from "lucide-react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import PasswordStrengthMeter from "@/components/auth/PasswordStrengthMeter";
import { registerUser } from "@/api/auth/authApi";

function computeStrength(password) {
  if (!password) return 0;
  let score = 0;
  if (password.length >= 8) score += 1;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score += 1;
  if (/\d/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;
  return score;
}

export default function RoleSignupForm({
  roleId,
  title,
  subtitle,
  icon,
  fields,
  isLoadingChapters = false,
}) {
  const navigate = useNavigate();

  // Initialize values safely
  const [values, setValues] = useState(() =>
    Object.fromEntries(fields.map((f) => [f.name, ""])),
  );

  // Sync state if fields load dynamically
  useEffect(() => {
    setValues((prev) => {
      const next = { ...prev };
      fields.forEach((f) => {
        if (!(f.name in next)) next[f.name] = "";
      });
      return next;
    });
  }, [fields]);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const updateField = (name) => (e) =>
    setValues((prev) => ({ ...prev, [name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (!agreed) {
      setError("Please accept the Terms of Service to continue.");
      return;
    }

    setError("");
    setIsLoading(true);

    const payload = {
      ...values,
      password,
      confirm_password: confirmPassword,
      role: roleId,
      degree: "BTech",
    };

    try {
      const res = await registerUser(payload);

      if (res.data?.accessToken) {
        localStorage.setItem("accessToken", res.data.accessToken);
      }
      if (res.data?.refreshToken) {
        localStorage.setItem("refreshToken", res.data.refreshToken);
      }

      // Safe navigation using response payload
      const redirectTo = res.data?.redirect_to || "/email-verification";
      navigate(redirectTo);
    } catch (err) {
      setError(
        err.message || "An unexpected error occurred. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center px-4 py-12 bg-canvas-bg">
      <Card className="max-w-xl w-full">
        <div className="flex flex-col items-center text-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-lg bg-brand-black flex items-center justify-center">
            {icon}
          </div>
          <div>
            <h1 className="font-poppins font-semibold text-card text-text-heading">
              {title}
            </h1>
            <p className="font-inter text-small text-text-muted mt-1">
              {subtitle}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {fields.map((field) => (
              <div
                key={field.name}
                className={field.colSpan === 2 ? "sm:col-span-2" : ""}
              >
                {field.type === "select" ? (
                  <div className="flex flex-col gap-1">
                    <label
                      htmlFor={`${roleId}-${field.name}`}
                      className="text-caption font-medium text-text-heading font-inter"
                    >
                      {field.label}
                    </label>
                    <select
                      id={`${roleId}-${field.name}`}
                      value={values[field.name] || ""}
                      onChange={updateField(field.name)}
                      required
                      disabled={
                        isLoading ||
                        (field.name === "college" && isLoadingChapters)
                      }
                      className="w-full rounded-md border border-border-subtle bg-surface-white text-sm text-text-body font-inter min-h-[44px] px-3 focus:outline-none focus:border-brand-black focus:ring-1 focus:ring-brand-black disabled:opacity-50"
                    >
                      <option value="" disabled>
                        {field.name === "college" && isLoadingChapters
                          ? "Loading colleges..."
                          : `Select ${field.label.toLowerCase()}`}
                      </option>
                      {field.options?.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <Input
                    id={`${roleId}-${field.name}`}
                    label={field.label}
                    type={field.type || "text"}
                    placeholder={field.placeholder}
                    helperText={field.helperText}
                    value={values[field.name] || ""}
                    onChange={updateField(field.name)}
                    required
                    disabled={isLoading}
                  />
                )}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              id={`${roleId}-password`}
              label="Password"
              type={showPassword ? "text" : "password"}
              placeholder="At least 8 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
              rightSlot={
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff size={18} strokeWidth={2} />
                  ) : (
                    <Eye size={18} strokeWidth={2} />
                  )}
                </button>
              }
            />
            <Input
              id={`${roleId}-confirm-password`}
              label="Confirm Password"
              type={showPassword ? "text" : "password"}
              placeholder="Re-enter your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          {password && (
            <PasswordStrengthMeter strength={computeStrength(password)} />
          )}

          <label className="flex items-start gap-2.5 cursor-pointer pt-1">
            <input
              type="checkbox"
              checked={agreed}
              onChange={() => setAgreed((v) => !v)}
              disabled={isLoading}
              className="w-4 h-4 mt-0.5 accent-brand-black shrink-0 disabled:opacity-50"
            />
            <span className="font-inter text-small text-text-body">
              I agree to the{" "}
              <Link
                to="/legal/privacy-policy"
                className="underline underline-offset-2 hover:text-text-heading"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                to="/legal/privacy-policy"
                className="underline underline-offset-2 hover:text-text-heading"
              >
                Privacy Policy
              </Link>
              .
            </span>
          </label>

          {error && (
            <p
              role="alert"
              className="font-inter text-small text-error bg-error/10 p-2 rounded-md"
            >
              {error}
            </p>
          )}

          <Button
            type="submit"
            variant="primary"
            fullWidth
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2
                  size={16}
                  strokeWidth={2}
                  className="animate-spin mr-2"
                />
                Creating Account...
              </>
            ) : (
              <>
                Create Account
                <ArrowRight size={16} strokeWidth={2} />
              </>
            )}
          </Button>
        </form>

        <p className="text-center font-inter text-small text-text-muted mt-6">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-text-body underline underline-offset-2 hover:text-text-heading"
          >
            Login
          </Link>{" "}
          ·{" "}
          <Link
            to="/role-selection"
            className="text-text-body hover:text-text-heading"
          >
            Back
          </Link>
        </p>
      </Card>
    </div>
  );
}
