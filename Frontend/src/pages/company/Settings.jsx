import { useEffect, useState } from "react";
import { ChevronRight, AlertCircle } from "lucide-react";
import CompanyShell from "@/components/company/CompanyShell";
import ComingSoon from "@/components/ui/ComingSoon";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { getMyProfile, updateProfile } from "@/api/auth/profileApi";

const ROLE = "company";

const ACCOUNT_SETTINGS = [
  { label: "Change Password", desc: "Update your login credentials" },
  {
    label: "Notification Settings",
    desc: "Manage email and push notification alerts",
  },
  {
    label: "Privacy & Security",
    desc: "Profile visibility and data usage controls",
  },
  {
    label: "Deactivate Account",
    desc: "Temporarily disable your account or close it",
  },
];

export default function CompanySettingsPage() {
  useDocumentTitle("Company Settings — BOCC");

  const [loading, setLoading] = useState(true);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [industry, setIndustry] = useState("");
  const [size, setSize] = useState("");
  const [website, setWebsite] = useState("");
  const [saved, setSaved] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const res = await getMyProfile(ROLE);
        const data = res?.data || res;
        if (data) {
          setFullName(data.fullName || data.full_name || "");
          setEmail(data.email || "");
          setPhone(data.phone || "");
          setCompanyName(data.companyName || data.company_name || "");
          setIndustry(data.industry || "");
          setSize(data.size || data.companySize || "");
          setWebsite(data.website || "");
        }
      } catch (err) {
        // No profile saved yet — fields stay blank, first Save creates one.
        console.error("Failed to load company profile:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const canSave = fullName.trim().length > 0 && companyName.trim().length > 0;

  async function handleSave() {
    if (!canSave) return;
    setErrorMsg("");
    try {
      await updateProfile(ROLE, {
        fullName,
        phone,
        companyName,
        industry,
        size,
        website,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      console.error("Failed to save company profile:", err);
      setErrorMsg(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to save profile.",
      );
    }
  }

  return (
    <CompanyShell>
      <div className="mb-8">
        <h1 className="font-poppins font-bold text-section text-text-heading mb-1">
          Company Settings
        </h1>
        <p className="font-inter text-body text-text-muted">
          Manage your account and company information.
        </p>
      </div>

      {errorMsg && (
        <div className="mb-6 p-3 bg-error/15 border border-error/30 text-error rounded-md text-small flex items-center gap-2">
          <AlertCircle size={16} className="shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {loading ? (
        <div className="bg-surface-white border border-border-subtle rounded-xl shadow-card p-6 font-inter text-small text-text-muted">
          Loading your profile...
        </div>
      ) : (
        <div className="flex flex-col gap-6 max-w-3xl">
          <section className="bg-surface-white border border-border-subtle rounded-xl shadow-card p-6">
            <h2 className="font-poppins font-semibold text-card text-text-heading mb-4">
              Basic Information
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Full Name" value={fullName} onChange={setFullName} />
              <Field label="Email (Read Only)" value={email} disabled />
              <Field label="Phone Number" value={phone} onChange={setPhone} />
            </div>
          </section>

          <section className="bg-surface-white border border-border-subtle rounded-xl shadow-card p-6">
            <h2 className="font-poppins font-semibold text-card text-text-heading mb-4">
              Company Information
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field
                label="Company Name"
                value={companyName}
                onChange={setCompanyName}
              />
              <Field label="Industry" value={industry} onChange={setIndustry} />
              <Field
                label="Size of Organization"
                value={size}
                onChange={setSize}
                placeholder="e.g. 500 - 1,000 Employees"
              />
              <Field label="Website" value={website} onChange={setWebsite} />
            </div>
          </section>

          <section className="bg-surface-white border border-border-subtle rounded-xl shadow-card p-6">
            <h2 className="font-poppins font-semibold text-card text-text-heading mb-4">
              Account Settings
            </h2>
            <div className="flex flex-col divide-y divide-border-subtle">
              {ACCOUNT_SETTINGS.map((item) => (
                <ComingSoon
                  key={item.label}
                  label={item.label}
                  position="top"
                  inline={false}
                  className="flex items-center justify-between py-3"
                >
                  <div className="text-left">
                    <p className="font-poppins font-semibold text-small text-text-heading">
                      {item.label}
                    </p>
                    <p className="font-inter text-caption text-text-muted">
                      {item.desc}
                    </p>
                  </div>
                  <ChevronRight
                    size={16}
                    strokeWidth={2}
                    className="text-text-muted shrink-0"
                  />
                </ComingSoon>
              ))}
            </div>
          </section>

          <div className="flex items-center justify-end gap-3">
            <span
              className={`font-inter text-small text-success transition-opacity duration-150 ${saved ? "opacity-100" : "opacity-0"}`}
              aria-live="polite"
            >
              Saved
            </span>
            <button
              type="button"
              onClick={handleSave}
              disabled={!canSave}
              className="bg-action-bg text-action-text font-poppins font-semibold text-small px-5 py-2.5 rounded-md hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Save Changes
            </button>
          </div>
        </div>
      )}
    </CompanyShell>
  );
}

function Field({ label, value, onChange, disabled = false, placeholder }) {
  return (
    <div>
      <label className="font-inter font-medium text-caption uppercase tracking-wider text-text-muted mb-1.5 block">
        {label}
      </label>
      <input
        type="text"
        value={value}
        disabled={disabled}
        placeholder={placeholder}
        onChange={onChange ? (e) => onChange(e.target.value) : undefined}
        className="w-full bg-canvas-bg border border-border-subtle rounded-md px-3 py-2.5 font-inter text-small text-text-body focus:outline-none focus:ring-1 focus:ring-brand-black transition-all disabled:text-text-muted disabled:cursor-not-allowed"
      />
    </div>
  );
}
