import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  UploadCloud,
  Plus,
  CheckCircle2,
  Eye,
  AlertCircle,
} from "lucide-react";
import DashboardShell from "@/components/dashboard/DashboardShell";
import Button from "@/components/ui/Button";
import ComingSoon from "@/components/ui/ComingSoon";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import api from "@/api/axiosInstance";

const STAGE_OPTIONS = ["Ideation", "MVP", "Early Traction", "Growth"];
const TIPS = [
  "Keep your deck under 12 slides for better engagement.",
  "Highlight your student traction or unique university insights.",
  "Ensure your funding requirement matches Marcus's typical ticket size ($250k-$1.5M).",
];

export default function SendPitchDeckPage() {
  useDocumentTitle("Send Pitch Deck — BOCC");
  const navigate = useNavigate();

  const [form, setForm] = useState({
    startupName: "",
    stage: STAGE_OPTIONS[0],
    pitch: "",
    funding: "",
    website: "",
    message: "",
    demoLink: "",
  });
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [savingDraft, setSavingDraft] = useState(false);

  const update = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const canSubmit =
    form.startupName.trim().length > 0 && form.pitch.trim().length > 0;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setErrorMsg("");
    setIsSubmitting(true);
    try {
      await api.post("/investors/inv-123/pitches", form);
      navigate("/investors/chat");
    } catch (err) {
      setErrorMsg(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to send pitch deck.",
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
      await api.patch("/investors/inv-123/pitches/draft", form);
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
    <DashboardShell pageId="send-pitch-deck">
      <div className="mb-8">
        <h1 className="font-poppins font-semibold text-page text-text-heading mb-2">
          Submit Pitch Deck
        </h1>
        <p className="font-inter text-body text-text-body">
          Prepare your materials to pitch to top-tier student venture partners.
        </p>
      </div>

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

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-surface-white border border-border-subtle rounded-lg p-8 space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="flex flex-col gap-1">
                <label className="text-caption font-medium text-text-heading font-inter">
                  Startup Name
                </label>
                <input
                  value={form.startupName}
                  onChange={update("startupName")}
                  type="text"
                  placeholder="e.g. NexaTech Solutions"
                  className="w-full rounded-md border border-border-subtle bg-surface-white text-sm text-text-body font-inter min-h-[44px] px-3 focus:outline-none focus:border-brand-black focus:ring-1 focus:ring-brand-black transition-all"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-caption font-medium text-text-heading font-inter">
                  Startup Stage
                </label>
                <select
                  value={form.stage}
                  onChange={update("stage")}
                  className="w-full rounded-md border border-border-subtle bg-surface-white text-sm text-text-body font-inter min-h-[44px] px-3 focus:outline-none focus:border-brand-black focus:ring-1 focus:ring-brand-black transition-all"
                >
                  {STAGE_OPTIONS.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-caption font-medium text-text-heading font-inter">
                One-line Elevator Pitch
              </label>
              <input
                value={form.pitch}
                onChange={update("pitch")}
                type="text"
                placeholder="Explain your startup in one concise sentence"
                className="w-full rounded-md border border-border-subtle bg-surface-white text-sm text-text-body font-inter min-h-[44px] px-3 focus:outline-none focus:border-brand-black focus:ring-1 focus:ring-brand-black transition-all"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-caption font-medium text-text-heading font-inter">
                Pitch Deck Upload
              </label>
              <ComingSoon label="Upload Pitch Deck" position="top">
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
                    PDF (max. 15MB)
                  </p>
                </div>
              </ComingSoon>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="flex flex-col gap-1">
                <label className="text-caption font-medium text-text-heading font-inter">
                  Funding Requirement ($)
                </label>
                <input
                  value={form.funding}
                  onChange={update("funding")}
                  type="text"
                  placeholder="e.g. 250,000"
                  className="w-full rounded-md border border-border-subtle bg-surface-white text-sm text-text-body font-inter min-h-[44px] px-3 focus:outline-none focus:border-brand-black focus:ring-1 focus:ring-brand-black transition-all"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-caption font-medium text-text-heading font-inter">
                  Website URL
                </label>
                <input
                  value={form.website}
                  onChange={update("website")}
                  type="url"
                  placeholder="https://"
                  className="w-full rounded-md border border-border-subtle bg-surface-white text-sm text-text-body font-inter min-h-[44px] px-3 focus:outline-none focus:border-brand-black focus:ring-1 focus:ring-brand-black transition-all"
                />
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-caption font-medium text-text-heading font-inter">
                Short Message to Investor
              </label>
              <textarea
                rows={4}
                value={form.message}
                onChange={update("message")}
                placeholder="Briefly introduce yourself and why you're a fit for this investor..."
                className="w-full rounded-md border border-border-subtle bg-surface-white text-sm text-text-body font-inter p-3 focus:outline-none focus:border-brand-black focus:ring-1 focus:ring-brand-black transition-all resize-none"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="flex flex-col gap-1">
                <label className="text-caption font-medium text-text-heading font-inter">
                  Product Demo Link (Optional)
                </label>
                <input
                  value={form.demoLink}
                  onChange={update("demoLink")}
                  type="url"
                  placeholder="Loom or YouTube link"
                  className="w-full rounded-md border border-border-subtle bg-surface-white text-sm text-text-body font-inter min-h-[44px] px-3 focus:outline-none focus:border-brand-black focus:ring-1 focus:ring-brand-black transition-all"
                />
              </div>
              <ComingSoon label="Add Supporting Documents" position="top">
                <div className="flex flex-col gap-1">
                  <span className="text-caption font-medium text-text-heading font-inter">
                    Supporting Documents (Optional)
                  </span>
                  <span className="flex items-center gap-2 min-h-[44px] px-3 border border-border-subtle rounded-md font-inter text-sm text-text-muted">
                    <Plus size={16} strokeWidth={2} /> Add Files
                  </span>
                </div>
              </ComingSoon>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <Link
              to="/investors/profile"
              className="px-6 py-2.5 font-inter font-semibold text-small text-text-muted hover:text-text-heading transition-colors"
            >
              Cancel
            </Link>
            <div className="flex gap-3">
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
                {isSubmitting ? "Sending..." : "Send Pitch Deck"}
              </Button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <div className="bg-surface-white border border-border-subtle rounded-lg overflow-hidden">
            <div className="h-16 bg-canvas-bg relative">
              <div className="absolute -bottom-6 left-6 w-14 h-14 rounded-lg bg-brand-black text-accent-neon flex items-center justify-center font-poppins font-bold text-small border-2 border-surface-white">
                MT
              </div>
            </div>
            <div className="pt-10 pb-6 px-6">
              <h3 className="font-poppins font-semibold text-card text-text-heading">
                Marcus Thorne
              </h3>
              <p className="font-inter text-small text-text-muted mb-4">
                Managing Partner, Atlas Ventures
              </p>
              <div className="space-y-3 pt-4 border-t border-divider-line">
                <div>
                  <p className="font-inter text-[10px] uppercase tracking-wide text-text-muted font-bold mb-1">
                    Investment Focus
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {["Fintech", "SaaS", "DeepTech"].map((t) => (
                      <span
                        key={t}
                        className="px-2 py-0.5 bg-canvas-bg rounded text-[11px] font-medium text-text-heading"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="font-inter text-[10px] uppercase tracking-wide text-text-muted font-bold mb-1">
                    Preferred Stage
                  </p>
                  <p className="font-inter text-small text-text-heading">
                    Seed, Series A
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-canvas-bg border border-border-subtle rounded-lg p-6">
            <h4 className="font-poppins font-semibold text-small text-text-heading mb-4">
              Pitching Tips
            </h4>
            <ul className="space-y-3">
              {TIPS.map((tip) => (
                <li key={tip} className="flex gap-3">
                  <CheckCircle2
                    size={16}
                    strokeWidth={2}
                    className="text-brand-black shrink-0 mt-0.5"
                  />
                  <p className="font-inter text-small text-text-muted">{tip}</p>
                </li>
              ))}
            </ul>
          </div>

          <ComingSoon
            label="Preview Pitch"
            position="top"
            className="w-full flex items-center justify-between p-4 border border-border-subtle rounded-lg bg-surface-white"
          >
            <span className="flex items-center gap-3 font-inter font-medium text-small text-text-heading">
              <Eye size={18} strokeWidth={2} className="text-text-muted" />{" "}
              Preview Pitch
            </span>
          </ComingSoon>
        </div>
      </div>
    </DashboardShell>
  );
}
