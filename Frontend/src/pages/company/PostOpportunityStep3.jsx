import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  UploadCloud,
  Lightbulb,
  Eye,
  HelpCircle,
  AlertCircle,
} from "lucide-react";
import CompanyShell from "@/components/company/CompanyShell";
import PostOpportunityStepper from "@/components/company/PostOpportunityStepper";
import Button from "@/components/ui/Button";
import ComingSoon from "@/components/ui/ComingSoon";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { postOpportunityDraft, updateDraft } from "./postOpportunityDraft";
import api from "@/api/axiosInstance";

const FIELDS = [
  {
    key: "overview",
    label: "Opportunity Overview",
    hint: "High-level summary of the role and its impact within the organization.",
    max: 500,
    rows: 4,
    required: true,
    placeholder: "Enter a brief overview...",
  },
  {
    key: "responsibilities",
    label: "Key Responsibilities",
    hint: "What will the candidate be doing on a daily basis?",
    max: 1000,
    rows: 6,
    required: true,
    placeholder: "List the primary tasks and expectations...",
  },
];

export default function PostOpportunityStep3Page() {
  useDocumentTitle("Post Opportunity — Description — BOCC");
  const navigate = useNavigate();

  const [form, setForm] = useState({
    overview: postOpportunityDraft.overview,
    responsibilities: "",
    learningOutcomes: "",
    benefits: "",
    selectionProcess: "",
    notes: "",
  });

  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const update = (field, max) => (e) => {
    if (e.target.value.length > max) return;
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const canProceed =
    form.overview.trim().length > 0 && form.responsibilities.trim().length > 0;

  const handleNext = () => {
    if (!canProceed) return;
    updateDraft({ overview: form.overview });
    navigate("/company/post-opportunity/step-4");
  };

  const handleSaveDraft = async () => {
    try {
      setErrorMsg("");
      setSuccessMsg("");
      await api.post("/opportunities/drafts", {
        ...postOpportunityDraft,
        ...form,
      });
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
      </div>

      <PostOpportunityStepper current={3} />

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
            Step 3: Opportunity Description
          </h3>
          <p className="font-inter text-small text-text-muted mt-1">
            Detail what makes this role unique and what candidates will gain.
          </p>
        </div>

        <div className="p-8 space-y-6">
          {FIELDS.map(
            ({ key, label, hint, max, rows, required, placeholder }) => (
              <div key={key} className="flex flex-col gap-1">
                <label className="text-caption font-medium text-text-heading font-inter">
                  {label} {required && <span className="text-error">*</span>}
                </label>
                <p className="font-inter text-caption text-text-muted mb-1">
                  {hint}
                </p>
                <div className="relative">
                  <textarea
                    rows={rows}
                    value={form[key]}
                    onChange={update(key, max)}
                    placeholder={placeholder}
                    className="w-full rounded-md border border-border-subtle bg-surface-white text-sm text-text-body font-inter p-3 focus:outline-none focus:border-brand-black focus:ring-1 focus:ring-brand-black transition-all resize-none"
                  />
                  <span className="absolute bottom-3 right-3 font-mono text-[10px] text-text-muted">
                    {form[key].length} / {max}
                  </span>
                </div>
              </div>
            ),
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-1">
              <label className="text-caption font-medium text-text-heading font-inter">
                Learning Outcomes
              </label>
              <div className="relative">
                <textarea
                  rows={4}
                  value={form.learningOutcomes}
                  onChange={update("learningOutcomes", 400)}
                  placeholder="What skills will they acquire?"
                  className="w-full rounded-md border border-border-subtle bg-surface-white text-sm text-text-body font-inter p-3 focus:outline-none focus:border-brand-black focus:ring-1 focus:ring-brand-black transition-all resize-none"
                />
                <span className="absolute bottom-3 right-3 font-mono text-[10px] text-text-muted">
                  {form.learningOutcomes.length} / 400
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-caption font-medium text-text-heading font-inter">
                Benefits & Perks
              </label>
              <div className="relative">
                <textarea
                  rows={4}
                  value={form.benefits}
                  onChange={update("benefits", 400)}
                  placeholder="Insurance, equity, remote-friendly, etc."
                  className="w-full rounded-md border border-border-subtle bg-surface-white text-sm text-text-body font-inter p-3 focus:outline-none focus:border-brand-black focus:ring-1 focus:ring-brand-black transition-all resize-none"
                />
                <span className="absolute bottom-3 right-3 font-mono text-[10px] text-text-muted">
                  {form.benefits.length} / 400
                </span>
              </div>
            </div>
          </div>

          <div className="p-5 bg-canvas-bg border border-border-subtle rounded-lg space-y-1">
            <label className="text-caption font-medium text-text-heading font-inter">
              Selection Process
            </label>
            <div className="relative">
              <textarea
                rows={3}
                value={form.selectionProcess}
                onChange={update("selectionProcess", 300)}
                placeholder="Describe the interview stages (e.g., Portfolio Review -> Technical Round -> HR)"
                className="w-full rounded-md border border-border-subtle bg-surface-white text-sm text-text-body font-inter p-3 focus:outline-none focus:border-brand-black focus:ring-1 focus:ring-brand-black transition-all resize-none"
              />
              <span className="absolute bottom-3 right-3 font-mono text-[10px] text-text-muted">
                {form.selectionProcess.length} / 300
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-caption font-medium text-text-heading font-inter">
              Additional Notes
            </label>
            <div className="relative">
              <textarea
                rows={2}
                value={form.notes}
                onChange={update("notes", 250)}
                placeholder="Any other relevant details or travel requirements..."
                className="w-full rounded-md border border-border-subtle bg-surface-white text-sm text-text-body font-inter p-3 focus:outline-none focus:border-brand-black focus:ring-1 focus:ring-brand-black transition-all resize-none"
              />
              <span className="absolute bottom-3 right-3 font-mono text-[10px] text-text-muted">
                {form.notes.length} / 250
              </span>
            </div>
          </div>

          <div className="pt-4 border-t border-divider-line">
            <label className="text-caption font-medium text-text-heading font-inter">
              Supporting Documents (Optional)
            </label>
            <ComingSoon
              label="Upload Supporting Documents"
              position="top"
              className="mt-1"
            >
              <div className="border-2 border-dashed border-border-subtle rounded-lg p-8 flex flex-col items-center gap-2 hover:bg-canvas-bg transition-colors">
                <UploadCloud
                  size={32}
                  strokeWidth={1.5}
                  className="text-text-muted"
                />
                <p className="font-poppins font-semibold text-small text-text-heading">
                  Click to upload or drag and drop
                </p>
                <p className="font-inter text-caption text-text-muted">
                  PDF, DOCX or JPEG (Max 10MB)
                </p>
              </div>
            </ComingSoon>
          </div>
        </div>

        <div className="p-6 border-t border-divider-line flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate("/company/post-opportunity/step-2")}
            className="px-6 py-2.5 font-inter font-semibold text-small text-text-muted hover:text-text-heading transition-colors"
          >
            Previous
          </button>
          <div className="flex gap-3">
            <Button variant="outline" onClick={handleSaveDraft}>
              Save Draft
            </Button>
            <Button onClick={handleNext} disabled={!canProceed}>
              Next Step
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <div className="p-4 bg-brand-black text-white rounded-lg flex items-start gap-3">
          <Lightbulb
            size={20}
            strokeWidth={2}
            className="text-accent-neon shrink-0"
          />
          <div>
            <p className="font-poppins font-semibold text-caption">
              Tip: Be Precise
            </p>
            <p className="font-inter text-caption opacity-80 mt-0.5">
              Detailed descriptions lead to 40% higher quality applications.
            </p>
          </div>
        </div>
        <div className="p-4 bg-surface-white border border-border-subtle rounded-lg flex items-start gap-3">
          <Eye size={20} strokeWidth={2} className="text-text-muted shrink-0" />
          <div>
            <p className="font-poppins font-semibold text-caption text-text-heading">
              Preview Mode
            </p>
            <p className="font-inter text-caption text-text-muted mt-0.5">
              See how candidates will view this listing on the portal.
            </p>
          </div>
        </div>
        <div className="p-4 bg-surface-white border border-border-subtle rounded-lg flex items-start gap-3">
          <HelpCircle
            size={20}
            strokeWidth={2}
            className="text-text-muted shrink-0"
          />
          <div>
            <p className="font-poppins font-semibold text-caption text-text-heading">
              Need Help?
            </p>
            <p className="font-inter text-caption text-text-muted mt-0.5">
              Contact our recruitment consultants for advice.
            </p>
          </div>
        </div>
      </div>
    </CompanyShell>
  );
}
