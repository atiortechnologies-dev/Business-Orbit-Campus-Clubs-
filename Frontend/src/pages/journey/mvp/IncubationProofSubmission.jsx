import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  UploadCloud,
  File,
  Trash2,
  CheckCircle2,
  ChevronRight,
  Clock,
  AlertCircle,
} from "lucide-react";
import DashboardShell from "@/components/dashboard/DashboardShell";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import api from "@/api/axiosInstance";

const ACCEPTED_DOCS = [
  "Incubation Acceptance Letter",
  "Offer Letter",
  "Certificate of Incubation",
  "Letter of Intent",
  "Incubator Agreement",
];

const STEPS = [
  "Upload proof",
  "Admin review",
  "Status updated",
  "Stage 4 unlocked",
];

export default function IncubationProofSubmissionPage() {
  useDocumentTitle("Incubation Proof Submission — BOCC");
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [form, setForm] = useState({
    startupName: "EcoSphere Analytics",
    incubatorName: "",
    incubatorWebsite: "",
    dateOfAcceptance: "",
    duration: "",
    programName: "",
    notes: "",
  });
  const [file, setFile] = useState(null);

  const updateField = (key) => (e) =>
    setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const handleFile = (fileList) => {
    if (fileList[0])
      setFile({ name: fileList[0].name, size: fileList[0].size });
  };

  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [savingDraft, setSavingDraft] = useState(false);

  const canSubmit = form.incubatorName.trim().length > 0 && !!file;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canSubmit) return;
    setErrorMsg("");
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      Object.entries(form).forEach(([k, v]) => formData.append(k, v));
      if (file && fileInputRef.current?.files?.[0]) {
        formData.append("document", fileInputRef.current.files[0]);
      }

      await api.post("/incubation/proof", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      navigate("/build-startup/journey/mvp/incubation-verification");
    } catch (err) {
      setErrorMsg(
        err.response?.data?.message ||
          err.message ||
          "Failed to submit incubation proof.",
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
      await api.patch("/incubation/proof/draft", form);
      setSuccessMsg("Draft saved successfully.");
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err) {
      setErrorMsg(
        err.response?.data?.message || err.message || "Failed to save draft.",
      );
    } finally {
      setSavingDraft(false);
    }
  };

  return (
    <DashboardShell pageId="incubation-proof-submission">
      <nav className="mb-2 flex items-center gap-2 text-text-muted font-inter font-normal text-small">
        <Link
          to="/dashboard"
          className="hover:text-text-heading transition-colors"
        >
          Dashboard
        </Link>
        <ChevronRight size={14} strokeWidth={2} />
        <Link
          to="/build-startup/journey/mvp"
          className="hover:text-text-heading transition-colors"
        >
          MVP
        </Link>
        <ChevronRight size={14} strokeWidth={2} />
        <span className="text-text-heading font-semibold">
          Incubation Proof
        </span>
      </nav>

      <h1 className="font-poppins font-semibold text-page text-text-heading mb-1">
        Incubation Proof Submission
      </h1>
      <p className="font-inter text-body text-text-body mb-6 max-w-2xl">
        Upload your incubation acceptance proof to verify your startup's
        incubation status. Once verified, you'll unlock the next stage of your
        startup journey.
      </p>

      {errorMsg && (
        <div className="mb-6 p-3 bg-error/15 border border-error/30 text-error rounded-md text-small flex items-center gap-2 max-w-2xl">
          <AlertCircle size={16} className="shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {successMsg && (
        <div className="mb-6 p-3 bg-success/15 border border-success/30 text-success rounded-md text-small flex items-center gap-2 max-w-2xl">
          <CheckCircle2 size={16} className="shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 lg:grid-cols-12 gap-6"
      >
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-surface-white border border-border-subtle rounded-lg shadow-card p-6 space-y-4">
            <h3 className="font-poppins font-semibold text-body text-text-heading">
              Incubation Details
            </h3>

            <div>
              <label className="font-poppins font-semibold text-caption text-text-muted uppercase tracking-wider block mb-1.5">
                Startup Name
              </label>
              <input
                type="text"
                value={form.startupName}
                disabled
                className="w-full bg-canvas-bg border border-border-subtle rounded-md text-text-muted font-inter text-body py-2.5 px-3 cursor-not-allowed"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-poppins font-semibold text-caption text-text-muted uppercase tracking-wider block mb-1.5">
                  Incubator Name
                </label>
                <input
                  type="text"
                  value={form.incubatorName}
                  onChange={updateField("incubatorName")}
                  placeholder="Enter incubator name"
                  className="w-full bg-canvas-bg border border-border-subtle rounded-md text-text-body font-inter text-body py-2.5 px-3 focus:outline-none focus:ring-1 focus:ring-brand-black"
                />
              </div>
              <div>
                <label className="font-poppins font-semibold text-caption text-text-muted uppercase tracking-wider block mb-1.5">
                  Incubator Website (Optional)
                </label>
                <input
                  type="url"
                  value={form.incubatorWebsite}
                  onChange={updateField("incubatorWebsite")}
                  placeholder="https://..."
                  className="w-full bg-canvas-bg border border-border-subtle rounded-md text-text-body font-inter text-body py-2.5 px-3 focus:outline-none focus:ring-1 focus:ring-brand-black"
                />
              </div>
              <div>
                <label className="font-poppins font-semibold text-caption text-text-muted uppercase tracking-wider block mb-1.5">
                  Date of Acceptance
                </label>
                <input
                  type="date"
                  value={form.dateOfAcceptance}
                  onChange={updateField("dateOfAcceptance")}
                  className="w-full bg-canvas-bg border border-border-subtle rounded-md text-text-body font-inter text-body py-2.5 px-3 focus:outline-none focus:ring-1 focus:ring-brand-black"
                />
              </div>
              <div>
                <label className="font-poppins font-semibold text-caption text-text-muted uppercase tracking-wider block mb-1.5">
                  Incubation Duration (e.g. 6 months)
                </label>
                <input
                  type="text"
                  value={form.duration}
                  onChange={updateField("duration")}
                  placeholder="Enter duration"
                  className="w-full bg-canvas-bg border border-border-subtle rounded-md text-text-body font-inter text-body py-2.5 px-3 focus:outline-none focus:ring-1 focus:ring-brand-black"
                />
              </div>
            </div>

            <div>
              <label className="font-poppins font-semibold text-caption text-text-muted uppercase tracking-wider block mb-1.5">
                Incubation Program Name (Optional)
              </label>
              <input
                type="text"
                value={form.programName}
                onChange={updateField("programName")}
                placeholder="Enter program-specific name"
                className="w-full bg-canvas-bg border border-border-subtle rounded-md text-text-body font-inter text-body py-2.5 px-3 focus:outline-none focus:ring-1 focus:ring-brand-black"
              />
            </div>
          </div>

          <div className="bg-surface-white border border-border-subtle rounded-lg shadow-card p-6">
            <h3 className="font-poppins font-semibold text-body text-text-heading mb-4">
              Document Upload
            </h3>
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                handleFile(e.dataTransfer.files);
              }}
              className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-border-subtle rounded-lg py-10 text-center mb-3"
            >
              <UploadCloud
                size={26}
                strokeWidth={1.5}
                className="text-text-muted"
              />
              <p className="font-poppins font-semibold text-small text-text-heading">
                Drag &amp; Drop File
              </p>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="font-inter text-small text-text-heading underline underline-offset-2"
              >
                or Browse Files
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.jpg,.png"
                className="hidden"
                onChange={(e) => handleFile(e.target.files)}
              />
            </div>
            {file && (
              <div className="flex items-center gap-3 border border-border-subtle rounded-lg p-3">
                <File
                  size={18}
                  strokeWidth={2}
                  className="text-text-muted shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <p className="font-poppins font-semibold text-small text-text-heading truncate">
                    {file.name}
                  </p>
                </div>
                <CheckCircle2
                  size={16}
                  strokeWidth={2}
                  className="text-success shrink-0"
                />
                <button
                  type="button"
                  onClick={() => setFile(null)}
                  aria-label="Remove file"
                >
                  <Trash2
                    size={16}
                    strokeWidth={2}
                    className="text-text-muted hover:text-error transition-colors"
                  />
                </button>
              </div>
            )}
          </div>

          <div className="bg-surface-white border border-border-subtle rounded-lg shadow-card p-6">
            <h3 className="font-poppins font-semibold text-body text-text-heading mb-1.5">
              Additional Notes (Optional)
            </h3>
            <textarea
              rows={3}
              value={form.notes}
              onChange={updateField("notes")}
              placeholder="Share any additional information about your incubation program."
              className="w-full bg-canvas-bg border border-border-subtle rounded-md text-text-body font-inter text-body py-2.5 px-3 focus:outline-none focus:ring-1 focus:ring-brand-black resize-none"
            />
          </div>
        </div>

        <div className="lg:col-span-4 space-y-4">
          <div className="bg-surface-white border border-border-subtle rounded-lg shadow-card p-5">
            <p className="font-inter font-semibold text-caption text-text-muted uppercase tracking-wider mb-3">
              Accepted Documents
            </p>
            <div className="space-y-2">
              {ACCEPTED_DOCS.map((doc) => (
                <div key={doc} className="flex items-center gap-2">
                  <CheckCircle2
                    size={14}
                    strokeWidth={2}
                    className="text-success shrink-0"
                  />
                  <p className="font-inter text-small text-text-body">{doc}</p>
                </div>
              ))}
            </div>
            <p className="font-inter text-caption text-text-muted mt-3">
              Max file size: 10MB per document.
            </p>
          </div>

          <div className="bg-surface-white border border-border-subtle rounded-lg shadow-card p-5">
            <p className="font-inter font-semibold text-caption text-text-muted uppercase tracking-wider mb-4">
              Verification Process
            </p>
            <div className="space-y-3">
              {STEPS.map((step, i) => (
                <div key={step} className="flex items-center gap-2.5">
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center font-inter text-caption shrink-0 ${i === 0 ? "bg-brand-black text-white" : "border border-border-subtle text-text-muted"}`}
                  >
                    {i + 1}
                  </div>
                  <p
                    className={`font-inter text-small ${i === 0 ? "text-text-heading font-semibold" : "text-text-muted"}`}
                  >
                    {step}
                  </p>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-1.5 mt-4 pt-3 border-t border-divider-line">
              <Clock size={14} strokeWidth={2} className="text-text-muted" />
              <p className="font-inter text-caption text-text-muted">
                Est. time: 2–3 business days.
              </p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-12 flex items-center gap-3 pt-6 border-t border-divider-line">
          <button
            type="submit"
            disabled={!canSubmit || isSubmitting || savingDraft}
            className="bg-action-bg text-action-text px-6 py-2.5 rounded-md hover:opacity-90 active:scale-[0.98] transition-all font-poppins font-semibold text-small disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Submitting..." : "Submit for Verification"}
          </button>
          <button
            type="button"
            onClick={handleSaveDraft}
            disabled={isSubmitting || savingDraft}
            className="border border-border-subtle text-text-heading px-6 py-2.5 rounded-md hover:bg-canvas-bg transition-colors font-poppins font-semibold text-small disabled:opacity-50"
          >
            {savingDraft ? "Saving..." : "Save Draft"}
          </button>
          <p className="font-inter text-caption text-text-muted ml-2">
            Your submission cannot be edited while it is under verification.
          </p>
        </div>
      </form>
    </DashboardShell>
  );
}
