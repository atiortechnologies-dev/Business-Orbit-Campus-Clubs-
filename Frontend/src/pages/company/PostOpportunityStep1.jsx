import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UploadCloud, Info, ShieldCheck, AlertCircle } from "lucide-react";
import CompanyShell from "@/components/company/CompanyShell";
import PostOpportunityStepper from "@/components/company/PostOpportunityStepper";
import Button from "@/components/ui/Button";
import ComingSoon from "@/components/ui/ComingSoon";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { postOpportunityDraft, updateDraft } from "./postOpportunityDraft";
import api from "@/api/axiosInstance";

const TYPE_OPTIONS = ["Full-time", "Contract", "Internship", "Part-time"];
const MODE_OPTIONS = ["Remote", "On-site", "Hybrid"];

export default function PostOpportunityStep1Page() {
  useDocumentTitle("Post Opportunity — Basic Information — BOCC");
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: postOpportunityDraft.title,
    type: postOpportunityDraft.type,
    department: "",
    workMode: postOpportunityDraft.workMode,
    location: postOpportunityDraft.location,
    duration: "",
    openings: 1,
    deadline: "",
    salaryRange: postOpportunityDraft.salaryRange,
  });

  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const update = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const canProceed = form.title.trim().length > 0;

  const handleNext = () => {
    if (!canProceed) return;
    updateDraft({
      title: form.title,
      type: form.type,
      workMode: form.workMode,
      location: form.location,
      salaryRange: form.salaryRange,
    });
    navigate("/company/post-opportunity/step-2");
  };

  const handleSaveDraft = async () => {
    try {
      setErrorMsg("");
      setSuccessMsg("");
      await api.post("/opportunities/drafts", form);
      setSuccessMsg("Draft saved successfully.");
    } catch (err) {
      console.error("Failed to save draft:", err);
      setErrorMsg(
        err?.response?.data?.message || err?.message || "Failed to save draft.",
      );
    }
  };

  return (
    <CompanyShell>
      <div className="mb-2">
        <h1 className="font-poppins font-semibold text-page text-text-heading">
          Post New Opportunity
        </h1>
        <p className="font-inter text-body text-text-body mt-1">
          Fill in the details below to start recruiting top talent.
        </p>
      </div>

      <PostOpportunityStepper current={1} />

      {errorMsg && (
        <div className="mt-4 p-3 bg-error/15 border border-error/30 text-error rounded-md text-small flex items-center gap-2">
          <AlertCircle size={16} className="shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}
      {successMsg && (
        <div className="mt-4 p-3 bg-success/15 border border-success/30 text-success rounded-md text-small flex items-center gap-2">
          <AlertCircle size={16} className="shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      <div className="bg-surface-white border border-border-subtle rounded-lg overflow-hidden mt-4">
        <div className="p-6 border-b border-divider-line">
          <h3 className="font-poppins font-semibold text-body text-text-heading">
            Step 1: Basic Information
          </h3>
        </div>
        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
          <div className="space-y-5">
            <div className="flex flex-col gap-1">
              <label className="text-caption font-medium text-text-heading font-inter">
                Opportunity Title <span className="text-error">*</span>
              </label>
              <input
                value={form.title}
                onChange={update("title")}
                type="text"
                placeholder="e.g. Senior Frontend Engineer"
                className="w-full rounded-md border border-border-subtle bg-surface-white text-sm text-text-body font-inter min-h-[44px] px-3 focus:outline-none focus:border-brand-black focus:ring-1 focus:ring-brand-black transition-all"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-caption font-medium text-text-heading font-inter">
                  Opportunity Type <span className="text-error">*</span>
                </label>
                <select
                  value={form.type}
                  onChange={update("type")}
                  className="w-full rounded-md border border-border-subtle bg-surface-white text-sm text-text-body font-inter min-h-[44px] px-3 focus:outline-none focus:border-brand-black focus:ring-1 focus:ring-brand-black transition-all"
                >
                  {TYPE_OPTIONS.map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-caption font-medium text-text-heading font-inter">
                  Department
                </label>
                <input
                  value={form.department}
                  onChange={update("department")}
                  type="text"
                  placeholder="e.g. Engineering"
                  className="w-full rounded-md border border-border-subtle bg-surface-white text-sm text-text-body font-inter min-h-[44px] px-3 focus:outline-none focus:border-brand-black focus:ring-1 focus:ring-brand-black transition-all"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-caption font-medium text-text-heading font-inter">
                  Work Mode <span className="text-error">*</span>
                </label>
                <select
                  value={form.workMode}
                  onChange={update("workMode")}
                  className="w-full rounded-md border border-border-subtle bg-surface-white text-sm text-text-body font-inter min-h-[44px] px-3 focus:outline-none focus:border-brand-black focus:ring-1 focus:ring-brand-black transition-all"
                >
                  {MODE_OPTIONS.map((m) => (
                    <option key={m}>{m}</option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-caption font-medium text-text-heading font-inter">
                  Location
                </label>
                <input
                  value={form.location}
                  onChange={update("location")}
                  type="text"
                  placeholder="e.g. New York, NY"
                  className="w-full rounded-md border border-border-subtle bg-surface-white text-sm text-text-body font-inter min-h-[44px] px-3 focus:outline-none focus:border-brand-black focus:ring-1 focus:ring-brand-black transition-all"
                />
              </div>
            </div>
          </div>

          <div className="space-y-5">
            <div className="flex flex-col gap-1">
              <label className="text-caption font-medium text-text-heading font-inter">
                Company Logo
              </label>
              <ComingSoon label="Upload Company Logo" position="top">
                <div className="border-2 border-dashed border-border-subtle rounded-lg p-6 flex flex-col items-center gap-2 hover:bg-canvas-bg transition-colors">
                  <UploadCloud
                    size={28}
                    strokeWidth={1.5}
                    className="text-text-muted"
                  />
                  <p className="font-poppins font-semibold text-small text-text-heading">
                    Click to upload or drag and drop
                  </p>
                  <p className="font-inter text-caption text-text-muted">
                    SVG, PNG, JPG (max. 800x400px)
                  </p>
                </div>
              </ComingSoon>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-caption font-medium text-text-heading font-inter">
                  Duration
                </label>
                <input
                  value={form.duration}
                  onChange={update("duration")}
                  type="text"
                  placeholder="e.g. 6 Months"
                  className="w-full rounded-md border border-border-subtle bg-surface-white text-sm text-text-body font-inter min-h-[44px] px-3 focus:outline-none focus:border-brand-black focus:ring-1 focus:ring-brand-black transition-all"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-caption font-medium text-text-heading font-inter">
                  No. of Openings <span className="text-error">*</span>
                </label>
                <input
                  value={form.openings}
                  onChange={update("openings")}
                  type="number"
                  min="1"
                  className="w-full rounded-md border border-border-subtle bg-surface-white text-sm text-text-body font-inter min-h-[44px] px-3 focus:outline-none focus:border-brand-black focus:ring-1 focus:ring-brand-black transition-all"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-caption font-medium text-text-heading font-inter">
                  Application Deadline
                </label>
                <input
                  value={form.deadline}
                  onChange={update("deadline")}
                  type="date"
                  className="w-full rounded-md border border-border-subtle bg-surface-white text-sm text-text-body font-inter min-h-[44px] px-3 focus:outline-none focus:border-brand-black focus:ring-1 focus:ring-brand-black transition-all"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-caption font-medium text-text-heading font-inter">
                  Salary/Stipend Range
                </label>
                <input
                  value={form.salaryRange}
                  onChange={update("salaryRange")}
                  type="text"
                  placeholder="e.g. $80k - $120k"
                  className="w-full rounded-md border border-border-subtle bg-surface-white text-sm text-text-body font-inter min-h-[44px] px-3 focus:outline-none focus:border-brand-black focus:ring-1 focus:ring-brand-black transition-all"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-divider-line flex items-center justify-between">
          <Button variant="outline" onClick={handleSaveDraft}>
            Save as Draft
          </Button>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => navigate("/company/my-opportunities")}
              className="px-6 py-2.5 font-inter font-semibold text-small text-text-muted hover:text-text-heading transition-colors"
            >
              Cancel
            </button>
            <Button onClick={handleNext} disabled={!canProceed}>
              Next Step
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <div className="bg-brand-black text-white rounded-lg p-6 flex gap-4">
          <Info
            size={20}
            strokeWidth={2}
            className="text-accent-neon shrink-0"
          />
          <div>
            <h4 className="font-poppins font-semibold text-small">
              Optimization Tip
            </h4>
            <p className="font-inter text-small opacity-80 mt-1">
              Clearly stating the salary range and work mode increases
              application quality by up to 40%.
            </p>
          </div>
        </div>
        <div className="bg-canvas-bg border border-border-subtle rounded-lg p-6 flex gap-4">
          <ShieldCheck
            size={20}
            strokeWidth={2}
            className="text-text-muted shrink-0"
          />
          <div>
            <h4 className="font-poppins font-semibold text-small text-text-heading">
              Privacy Control
            </h4>
            <p className="font-inter text-small text-text-muted mt-1">
              Your company details are only visible to verified applicants who
              meet your minimum requirements.
            </p>
          </div>
        </div>
      </div>
    </CompanyShell>
  );
}
