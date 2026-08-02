import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ChevronRight,
  UploadCloud,
  Paperclip,
  Check,
  AlertCircle,
} from "lucide-react";
import DashboardShell from "@/components/dashboard/DashboardShell";
import Button from "@/components/ui/Button";
import ComingSoon from "@/components/ui/ComingSoon";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import api from "@/api/axiosInstance";

const PROFILE = [
  { label: "Student Name", value: "Alex Rivera" },
  { label: "Email Address", value: "a.rivera@university.edu" },
  { label: "Phone Number", value: "+1 (555) 012-3456" },
  { label: "Startup Name", value: "EchoFlow Solutions" },
  { label: "Portfolio", value: "alexrivera.design" },
  { label: "LinkedIn", value: "linkedin.com/in/alexrivera" },
];

const AVAILABILITY_OPTIONS = [
  "Full-time (40h/week)",
  "Part-time (20h/week)",
  "Contract",
];

export default function FreelancingApplicationFormPage() {
  useDocumentTitle("Apply for UI/UX Design Intern — BOCC");
  const navigate = useNavigate();

  const [form, setForm] = useState({
    coverLetter: "",
    portfolioLink: "",
    availability: AVAILABILITY_OPTIONS[0],
    joiningDate: "",
  });
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [savingDraft, setSavingDraft] = useState(false);

  const update = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const canSubmit = form.coverLetter.trim().length > 0;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setErrorMsg("");
    setIsSubmitting(true);
    try {
      await api.post("/opportunities/freelance-123/applications", form);
      navigate("/freelancing/applied");
    } catch (err) {
      setErrorMsg(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to submit application.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveDraft = async () => {
    setErrorMsg("");
    setSuccessMsg("");
    setSavingDraft(true);
    try {
      await api.patch("/opportunities/freelance-123/applications/draft", form);
      setSuccessMsg("Draft saved successfully.");
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err) {
      setErrorMsg(
        err?.response?.data?.message || err?.message || "Failed to save draft.",
      );
    } finally {
      setSavingDraft(false);
    }
  };

  return (
    <DashboardShell pageId="freelancing-application-form">
      <nav className="mb-2 flex items-center gap-2 text-text-muted font-inter font-normal text-small">
        <Link
          to="/freelancing"
          className="hover:text-text-heading transition-colors"
        >
          Freelancing
        </Link>
        <ChevronRight size={14} strokeWidth={2} />
        <span className="text-text-heading font-semibold">Apply</span>
      </nav>

      <div className="mb-8">
        <h1 className="font-poppins font-semibold text-page text-text-heading mb-2">
          Apply for UI/UX Design Intern
        </h1>
        <p className="font-inter text-body text-text-body">
          at NovaCore Systems
        </p>
      </div>

      {errorMsg && (
        <div className="mb-6 p-3 bg-error/15 border border-error/30 text-error rounded-md text-small flex items-center gap-2 max-w-3xl">
          <AlertCircle size={16} className="shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {successMsg && (
        <div className="mb-6 p-3 bg-success/15 border border-success/30 text-success rounded-md text-small flex items-center gap-2 max-w-3xl">
          <Check size={16} className="shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      <div className="max-w-3xl space-y-6">
        <section className="bg-surface-white border border-border-subtle rounded-lg p-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-poppins font-semibold text-body text-text-heading">
              Application Summary
            </h3>
            <span className="px-3 py-1 bg-canvas-bg text-text-muted font-inter text-caption rounded-full">
              Pre-filled from Profile
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {PROFILE.map(({ label, value }) => (
              <div key={label}>
                <p className="font-inter text-caption text-text-muted uppercase tracking-wide mb-1">
                  {label}
                </p>
                <p className="font-inter font-semibold text-small text-text-heading">
                  {value}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-surface-white border border-border-subtle rounded-lg p-8 space-y-5">
          <h3 className="font-poppins font-semibold text-body text-text-heading">
            Application Details
          </h3>

          <ComingSoon label="Upload Resume" position="top">
            <div className="border-2 border-dashed border-border-subtle rounded-lg p-6 flex flex-col items-center gap-2 hover:bg-canvas-bg transition-colors">
              <UploadCloud
                size={28}
                strokeWidth={1.5}
                className="text-text-muted"
              />
              <p className="font-poppins font-semibold text-small text-text-heading">
                Upload Resume
              </p>
              <p className="font-inter text-caption text-text-muted">
                PDF, DOCX up to 10MB
              </p>
            </div>
          </ComingSoon>

          <div className="flex flex-col gap-1">
            <label
              htmlFor="coverLetter"
              className="text-caption font-medium text-text-heading font-inter"
            >
              Cover Letter <span className="text-error">*</span>
            </label>
            <textarea
              id="coverLetter"
              rows={5}
              placeholder="Explain why you are the best fit for this role..."
              value={form.coverLetter}
              onChange={update("coverLetter")}
              className="w-full rounded-md border border-border-subtle bg-surface-white text-sm text-text-body font-inter p-3 focus:outline-none focus:border-brand-black focus:ring-1 focus:ring-brand-black transition-all resize-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="flex flex-col gap-1">
              <label
                htmlFor="portfolioLink"
                className="text-caption font-medium text-text-heading font-inter"
              >
                Updated Portfolio Link
              </label>
              <input
                id="portfolioLink"
                type="url"
                placeholder="https://"
                value={form.portfolioLink}
                onChange={update("portfolioLink")}
                className="w-full rounded-md border border-border-subtle bg-surface-white text-sm text-text-body font-inter min-h-[44px] px-3 focus:outline-none focus:border-brand-black focus:ring-1 focus:ring-brand-black transition-all"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label
                htmlFor="availability"
                className="text-caption font-medium text-text-heading font-inter"
              >
                Availability
              </label>
              <select
                id="availability"
                value={form.availability}
                onChange={update("availability")}
                className="w-full rounded-md border border-border-subtle bg-surface-white text-sm text-text-body font-inter min-h-[44px] px-3 focus:outline-none focus:border-brand-black focus:ring-1 focus:ring-brand-black transition-all"
              >
                {AVAILABILITY_OPTIONS.map((a) => (
                  <option key={a}>{a}</option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label
                htmlFor="joiningDate"
                className="text-caption font-medium text-text-heading font-inter"
              >
                Expected Joining Date
              </label>
              <input
                id="joiningDate"
                type="date"
                value={form.joiningDate}
                onChange={update("joiningDate")}
                className="w-full rounded-md border border-border-subtle bg-surface-white text-sm text-text-body font-inter min-h-[44px] px-3 focus:outline-none focus:border-brand-black focus:ring-1 focus:ring-brand-black transition-all"
              />
            </div>
            <ComingSoon label="Attach Additional Documents" position="top">
              <div className="flex flex-col gap-1">
                <span className="text-caption font-medium text-text-heading font-inter">
                  Additional Documents (Optional)
                </span>
                <span className="flex items-center gap-2 min-h-[44px] px-3 border border-border-subtle rounded-md font-inter text-sm text-text-muted">
                  <Paperclip size={16} strokeWidth={2} /> Attach files...
                </span>
              </div>
            </ComingSoon>
          </div>
        </section>

        <section className="bg-canvas-bg border border-border-subtle rounded-lg p-6">
          <h4 className="font-poppins font-semibold text-body text-text-heading mb-4">
            Review Checklist
          </h4>
          <ul className="space-y-3 font-inter text-small">
            <li className="flex items-center gap-3 text-text-muted">
              <span className="w-5 h-5 rounded border border-border-subtle bg-surface-white shrink-0" />{" "}
              Resume Uploaded
            </li>
            <li
              className={`flex items-center gap-3 ${form.coverLetter.trim() ? "text-text-heading" : "text-text-muted"}`}
            >
              <span
                className={`w-5 h-5 rounded border flex items-center justify-center shrink-0 ${form.coverLetter.trim() ? "border-brand-black bg-surface-white" : "border-border-subtle bg-surface-white"}`}
              >
                {form.coverLetter.trim() && (
                  <Check
                    size={14}
                    strokeWidth={3}
                    className="text-brand-black"
                  />
                )}
              </span>
              Cover Letter Written
            </li>
            <li className="flex items-center gap-3 text-text-heading">
              <span className="w-5 h-5 rounded border border-brand-black bg-surface-white flex items-center justify-center shrink-0">
                <Check size={14} strokeWidth={3} className="text-brand-black" />
              </span>
              Profile Complete (Bio & Education)
            </li>
          </ul>
        </section>

        <div className="flex items-center justify-end gap-4 pt-2">
          <Link
            to="/freelancing/opportunity"
            className="px-6 py-2.5 border border-border-subtle rounded-lg font-poppins font-semibold text-small text-text-heading hover:bg-canvas-bg transition-colors"
          >
            Cancel
          </Link>
          <Button
            variant="outline"
            onClick={handleSaveDraft}
            disabled={isSubmitting || savingDraft}
          >
            {savingDraft ? "Saving..." : "Save Draft"}
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!canSubmit || isSubmitting || savingDraft}
          >
            {isSubmitting ? "Submitting..." : "Submit Application"}
          </Button>
        </div>
      </div>
    </DashboardShell>
  );
}
