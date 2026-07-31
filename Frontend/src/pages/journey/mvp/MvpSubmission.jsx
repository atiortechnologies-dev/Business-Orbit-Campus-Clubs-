import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  UploadCloud,
  Info,
  Link2,
  GitFork,
  ChevronRight,
  Image as ImageIcon,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import DashboardShell from "@/components/dashboard/DashboardShell";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import api from "@/api/axiosInstance";

const CHECKLIST_ITEMS = [
  { key: "mvpComplete", label: "MVP Completed" },
  { key: "demoReady", label: "Product Demo Ready" },
  { key: "repoAvailable", label: "Repository / Prototype Available" },
  { key: "docsAttached", label: "Documentation Attached" },
];

export default function MvpSubmissionPage() {
  useDocumentTitle("MVP Submission — BOCC");
  const navigate = useNavigate();

  const [checklist, setChecklist] = useState({
    mvpComplete: true,
    demoReady: true,
  });
  const [form, setForm] = useState({
    startupName: "EcoSphere Analytics",
    productType: "SaaS Platform",
    mvpTitle: "",
    description: "",
    liveDemoUrl: "",
    githubUrl: "",
    figmaUrl: "",
    demoVideoUrl: "",
    notes: "",
  });

  const toggleChecklist = (key) =>
    setChecklist((prev) => ({ ...prev, [key]: !prev[key] }));
  const updateField = (key) => (e) =>
    setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [savingDraft, setSavingDraft] = useState(false);

  const canSubmit =
    form.mvpTitle.trim().length > 0 &&
    form.description.trim().length > 0 &&
    form.liveDemoUrl.trim().length > 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canSubmit) return;
    setErrorMsg("");
    setIsSubmitting(true);
    try {
      await api.post("/mvp/submit", { ...form, checklist });
      navigate("/build-startup/journey/mvp/success");
    } catch (err) {
      setErrorMsg(
        err.response?.data?.message || err.message || "Failed to submit MVP.",
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
      await api.patch("/mvp/draft", { ...form, checklist });
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
    <DashboardShell pageId="mvp-submission">
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
        <span className="text-text-heading font-semibold">Submission</span>
      </nav>

      <h1 className="font-poppins font-semibold text-page text-text-heading mb-1">
        Stage 3 — MVP Submission
      </h1>
      <p className="font-inter text-body text-text-body mb-8 max-w-2xl">
        Congratulations on building your MVP! Submit your prototype for
        technical and business review before progressing to the next stage.
      </p>

      {errorMsg && (
        <div className="mb-6 p-3 bg-error/15 border border-error/30 text-error rounded-md text-small flex items-center gap-2">
          <AlertCircle size={16} className="shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {successMsg && (
        <div className="mb-6 p-3 bg-success/15 border border-success/30 text-success rounded-md text-small flex items-center gap-2">
          <CheckCircle2 size={16} className="shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 lg:grid-cols-12 gap-6"
      >
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-surface-white border border-border-subtle rounded-lg shadow-card p-6">
            <h3 className="font-poppins font-semibold text-body text-text-heading mb-4">
              Submission Checklist
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {CHECKLIST_ITEMS.map(({ key, label }) => (
                <label
                  key={key}
                  className="flex items-center gap-2.5 border border-border-subtle rounded-lg p-3 cursor-pointer hover:border-text-muted transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={checklist[key] || false}
                    onChange={() => toggleChecklist(key)}
                    className="w-4 h-4 accent-brand-black shrink-0"
                  />
                  <span
                    className={`font-inter text-small ${checklist[key] ? "text-text-heading font-medium" : "text-text-body"}`}
                  >
                    {label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="bg-surface-white border border-border-subtle rounded-lg shadow-card p-6 space-y-4">
            <h3 className="font-poppins font-semibold text-body text-text-heading">
              Submission Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
              <div>
                <label className="font-poppins font-semibold text-caption text-text-muted uppercase tracking-wider block mb-1.5">
                  Product Type
                </label>
                <input
                  type="text"
                  value={form.productType}
                  disabled
                  className="w-full bg-canvas-bg border border-border-subtle rounded-md text-text-muted font-inter text-body py-2.5 px-3 cursor-not-allowed"
                />
              </div>
            </div>

            <div>
              <label className="font-poppins font-semibold text-caption text-text-muted uppercase tracking-wider block mb-1.5">
                MVP Title
              </label>
              <input
                type="text"
                value={form.mvpTitle}
                onChange={updateField("mvpTitle")}
                placeholder="e.g., EcoSphere Core v1.0"
                className="w-full bg-canvas-bg border border-border-subtle rounded-md text-text-body font-inter text-body py-2.5 px-3 focus:outline-none focus:ring-1 focus:ring-brand-black"
              />
            </div>

            <div>
              <label className="font-poppins font-semibold text-caption text-text-muted uppercase tracking-wider block mb-1.5">
                Short Product Description
              </label>
              <textarea
                rows={3}
                value={form.description}
                onChange={updateField("description")}
                placeholder="Briefly explain what the prototype does and the core problem it solves..."
                className="w-full bg-canvas-bg border border-border-subtle rounded-md text-text-body font-inter text-body py-2.5 px-3 focus:outline-none focus:ring-1 focus:ring-brand-black resize-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-poppins font-semibold text-caption text-text-muted uppercase tracking-wider block mb-1.5">
                  Live Demo URL
                </label>
                <input
                  type="url"
                  value={form.liveDemoUrl}
                  onChange={updateField("liveDemoUrl")}
                  placeholder="https://demo.example.com"
                  className="w-full bg-canvas-bg border border-border-subtle rounded-md text-text-body font-inter text-body py-2.5 px-3 focus:outline-none focus:ring-1 focus:ring-brand-black"
                />
              </div>
              <div>
                <label className="font-poppins font-semibold text-caption text-text-muted uppercase tracking-wider block mb-1.5">
                  GitHub Repository (Optional)
                </label>
                <input
                  type="url"
                  value={form.githubUrl}
                  onChange={updateField("githubUrl")}
                  placeholder="https://github.com/..."
                  className="w-full bg-canvas-bg border border-border-subtle rounded-md text-text-body font-inter text-body py-2.5 px-3 focus:outline-none focus:ring-1 focus:ring-brand-black"
                />
              </div>
              <div>
                <label className="font-poppins font-semibold text-caption text-text-muted uppercase tracking-wider block mb-1.5">
                  Figma / Prototype Link (Optional)
                </label>
                <input
                  type="url"
                  value={form.figmaUrl}
                  onChange={updateField("figmaUrl")}
                  placeholder="https://figma.com/..."
                  className="w-full bg-canvas-bg border border-border-subtle rounded-md text-text-body font-inter text-body py-2.5 px-3 focus:outline-none focus:ring-1 focus:ring-brand-black"
                />
              </div>
              <div>
                <label className="font-poppins font-semibold text-caption text-text-muted uppercase tracking-wider block mb-1.5">
                  Demo Video URL (Optional)
                </label>
                <input
                  type="url"
                  value={form.demoVideoUrl}
                  onChange={updateField("demoVideoUrl")}
                  placeholder="https://youtube.com/..."
                  className="w-full bg-canvas-bg border border-border-subtle rounded-md text-text-body font-inter text-body py-2.5 px-3 focus:outline-none focus:ring-1 focus:ring-brand-black"
                />
              </div>
            </div>

            <div>
              <label className="font-poppins font-semibold text-caption text-text-muted uppercase tracking-wider block mb-1.5">
                Upload Supporting Documents
              </label>
              <label className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-border-subtle rounded-lg py-8 cursor-pointer hover:border-text-muted transition-colors">
                <UploadCloud
                  size={26}
                  strokeWidth={1.5}
                  className="text-text-muted"
                />
                <p className="font-poppins font-semibold text-small text-text-heading">
                  Drag and drop files here
                </p>
                <p className="font-inter text-caption text-text-muted">
                  PDF, DOCX, or ZIP (Max 50MB)
                </p>
                <input
                  type="file"
                  accept=".pdf,.docx,.zip"
                  className="hidden"
                />
              </label>
            </div>

            <div>
              <label className="font-poppins font-semibold text-caption text-text-muted uppercase tracking-wider block mb-1.5">
                Additional Notes
              </label>
              <textarea
                rows={2}
                value={form.notes}
                onChange={updateField("notes")}
                placeholder="Any specific instructions for reviewers..."
                className="w-full bg-canvas-bg border border-border-subtle rounded-md text-text-body font-inter text-body py-2.5 px-3 focus:outline-none focus:ring-1 focus:ring-brand-black resize-none"
              />
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-4">
          <div className="bg-surface-white border border-border-subtle rounded-lg shadow-card p-5">
            <div className="flex items-center justify-between mb-4">
              <p className="font-inter font-semibold text-caption text-text-muted uppercase tracking-wider">
                Submission Preview
              </p>
              <span className="bg-warning/10 text-warning font-poppins font-semibold text-caption px-2.5 py-0.5 rounded-full">
                Draft
              </span>
            </div>
            <div className="h-28 rounded-lg border-2 border-dashed border-border-subtle bg-canvas-bg flex flex-col items-center justify-center gap-1.5 mb-4">
              <ImageIcon
                size={20}
                strokeWidth={1.5}
                className="text-text-muted"
              />
              <p className="font-inter text-caption text-text-muted">
                No visual attached
              </p>
            </div>
            <h4 className="font-poppins font-semibold text-body text-text-heading">
              {form.mvpTitle || "MVP Title Appears Here"}
            </h4>
            <p className="font-inter text-small text-text-muted mt-1">
              {form.description ||
                "Your short product description will be displayed here for reviewers to quickly understand your value proposition."}
            </p>
            <div className="flex flex-wrap gap-2 mt-3">
              {form.liveDemoUrl && (
                <span className="flex items-center gap-1 bg-canvas-bg border border-border-subtle rounded-md px-2 py-1 font-inter text-caption text-text-body">
                  <Link2 size={12} strokeWidth={2} /> Live
                </span>
              )}
              {form.githubUrl && (
                <span className="flex items-center gap-1 bg-canvas-bg border border-border-subtle rounded-md px-2 py-1 font-inter text-caption text-text-body">
                  <GitFork size={12} strokeWidth={2} /> GitHub
                </span>
              )}
            </div>
          </div>

          <div className="bg-canvas-bg border border-border-subtle rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Info size={16} strokeWidth={2} className="text-text-muted" />
              <p className="font-inter font-semibold text-caption text-text-muted uppercase tracking-wider">
                Review Process
              </p>
            </div>
            <p className="font-inter text-small text-text-body">
              Submissions are reviewed by the Technical Steering Committee
              within 5 business days. You'll receive a notification once the
              status changes to "Under Review."
            </p>
          </div>
        </div>

        <div className="lg:col-span-12 flex items-center justify-between pt-6 border-t border-divider-line">
          <p className="font-inter text-caption text-text-muted">
            Once submitted, your MVP cannot be edited while under review.
          </p>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleSaveDraft}
              disabled={isSubmitting || savingDraft}
              className="font-poppins font-semibold text-small text-text-heading hover:opacity-80 transition-opacity disabled:opacity-50"
            >
              {savingDraft ? "Saving..." : "Save Draft"}
            </button>
            <button
              type="submit"
              disabled={!canSubmit || isSubmitting || savingDraft}
              className="bg-action-bg text-action-text px-6 py-2.5 rounded-md hover:opacity-90 active:scale-[0.98] transition-all font-poppins font-semibold text-small disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Submitting..." : "Submit MVP"}
            </button>
          </div>
        </div>
      </form>
    </DashboardShell>
  );
}
