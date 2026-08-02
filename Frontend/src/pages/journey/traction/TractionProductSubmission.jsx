import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ChevronRight,
  CheckCircle2,
  Circle,
  MoreVertical,
  Image as ImageIcon,
  AlertCircle,
} from "lucide-react";
import DashboardShell from "@/components/dashboard/DashboardShell";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import ComingSoon from "@/components/ui/ComingSoon";
import PlaceholderGraphic from "@/components/ui/PlaceholderGraphic";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import api from "@/api/axiosInstance";

const CHECKLIST = [
  { label: "User Feedback Collected", done: true },
  { label: "Improvements Implemented", done: true },
  { label: "Product Updated", done: false },
  { label: "Final Version Ready", done: false },
];

const TEXTAREA_CLASS =
  "w-full rounded-md border border-border-subtle bg-surface-white text-sm text-text-body font-inter p-3 focus:outline-none focus:border-brand-black focus:ring-1 focus:ring-brand-black transition-all";

export default function TractionProductSubmissionPage() {
  useDocumentTitle("Updated Product Submission — BOCC");
  const navigate = useNavigate();

  const [form, setForm] = useState({
    productUrl: "",
    repoUrl: "",
    demoUrl: "",
    deckUrl: "",
    version: "",
    releaseNotes: "",
    improvements: "",
    limitations: "",
  });

  const update = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const [errorMsg, setErrorMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const canSubmit =
    form.productUrl.trim().length > 0 && form.releaseNotes.trim().length > 0;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setErrorMsg("");
    setIsSubmitting(true);
    try {
      await api.post("/traction/product", form);
      navigate("/build-startup/journey/traction/review");
    } catch (err) {
      setErrorMsg(
        err.response?.data?.message ||
          err.message ||
          "Failed to submit product.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardShell pageId="updated-product-submission">
      <nav className="mb-2 flex items-center gap-2 text-text-muted font-inter font-normal text-small">
        <Link
          to="/dashboard"
          className="hover:text-text-heading transition-colors"
        >
          Dashboard
        </Link>
        <ChevronRight size={14} strokeWidth={2} />
        <Link
          to="/build-startup/journey/traction"
          className="hover:text-text-heading transition-colors"
        >
          Traction
        </Link>
        <ChevronRight size={14} strokeWidth={2} />
        <span className="text-text-heading font-semibold">
          Final Version Submission
        </span>
      </nav>

      <div className="mb-10">
        <h1 className="font-poppins font-semibold text-page text-text-heading mb-2">
          Updated Product Submission
        </h1>
        <p className="font-inter text-body text-text-body max-w-2xl mb-4">
          Upload the latest version of your product after implementing user
          feedback. This submission marks your formal exit from the incubation
          cycle.
        </p>

        {errorMsg && (
          <div className="p-3 bg-error/15 border border-error/30 text-error rounded-md text-small flex items-center gap-2 max-w-2xl">
            <AlertCircle size={16} className="shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main form */}
        <div className="lg:col-span-8">
          <section className="bg-surface-white border border-border-subtle rounded-lg p-8">
            <h3 className="font-poppins font-semibold text-body text-text-heading mb-6">
              Submission Details
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <Input
                id="productUrl"
                label="Updated Product URL"
                type="url"
                placeholder="https://your-product.com"
                value={form.productUrl}
                onChange={update("productUrl")}
              />
              <Input
                id="repoUrl"
                label="GitHub Repository (optional)"
                type="url"
                placeholder="https://github.com/org/repo"
                value={form.repoUrl}
                onChange={update("repoUrl")}
              />
              <Input
                id="demoUrl"
                label="Demo Video URL"
                type="url"
                placeholder="https://youtube.com/..."
                value={form.demoUrl}
                onChange={update("demoUrl")}
              />
              <Input
                id="deckUrl"
                label="Presentation Deck URL"
                type="url"
                placeholder="https://figma.com/proto/..."
                value={form.deckUrl}
                onChange={update("deckUrl")}
              />
              <Input
                id="version"
                label="Version Number"
                placeholder="e.g. v2.0.4-beta"
                value={form.version}
                onChange={update("version")}
                className="md:col-span-2 max-w-xs"
              />
            </div>

            <div className="space-y-6">
              <div className="flex flex-col gap-1">
                <label
                  htmlFor="releaseNotes"
                  className="text-caption font-medium text-text-heading font-inter"
                >
                  Release Notes
                </label>
                <textarea
                  id="releaseNotes"
                  rows={4}
                  placeholder="Briefly describe the key changes in this version..."
                  value={form.releaseNotes}
                  onChange={update("releaseNotes")}
                  className={TEXTAREA_CLASS}
                />
              </div>

              <div className="flex flex-col gap-1">
                <label
                  htmlFor="improvements"
                  className="text-caption font-medium text-text-heading font-inter"
                >
                  Major Improvements Made
                </label>
                <textarea
                  id="improvements"
                  rows={4}
                  placeholder="List the 3-5 biggest changes based on user feedback..."
                  value={form.improvements}
                  onChange={update("improvements")}
                  className={TEXTAREA_CLASS}
                />
              </div>

              <div className="flex flex-col gap-1">
                <label
                  htmlFor="limitations"
                  className="text-caption font-medium text-text-heading font-inter"
                >
                  Known Limitations
                </label>
                <textarea
                  id="limitations"
                  rows={3}
                  placeholder="Are there any features currently disabled or pending?"
                  value={form.limitations}
                  onChange={update("limitations")}
                  className={TEXTAREA_CLASS}
                />
              </div>
            </div>
          </section>
        </div>

        {/* Right sidebar: checklist + action */}
        <div className="lg:col-span-4 space-y-6">
          <section className="bg-canvas-bg border border-border-subtle rounded-lg p-8">
            <h3 className="font-poppins font-semibold text-body text-text-heading mb-6">
              Readiness Checklist
            </h3>
            <div className="space-y-3">
              {CHECKLIST.map(({ label, done }) => (
                <div
                  key={label}
                  className={`flex items-center justify-between p-4 border border-border-subtle rounded-lg ${
                    done ? "bg-surface-white" : "bg-canvas-bg opacity-60"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {done ? (
                      <CheckCircle2
                        size={20}
                        strokeWidth={2}
                        className="text-brand-black"
                      />
                    ) : (
                      <Circle
                        size={20}
                        strokeWidth={2}
                        className="text-text-muted"
                      />
                    )}
                    <span className="font-inter text-small text-text-body">
                      {label}
                    </span>
                  </div>
                  {!done && (
                    <span className="font-inter font-semibold text-[10px] text-text-muted uppercase tracking-wider">
                      Pending
                    </span>
                  )}
                </div>
              ))}
            </div>
          </section>

          <div className="bg-surface-white border border-border-subtle rounded-lg p-8 relative overflow-hidden">
            <div className="flex justify-between items-start mb-6">
              <h4 className="font-poppins font-semibold text-body text-text-heading">
                Product Snapshot
              </h4>
              <ComingSoon label="Snapshot Options" position="bottom" inline>
                <MoreVertical
                  size={18}
                  strokeWidth={2}
                  className="text-text-muted"
                />
              </ComingSoon>
            </div>
            <PlaceholderGraphic
              icon={ImageIcon}
              label="Product Snapshot"
              className="w-full aspect-video rounded mb-4"
            />
            <p className="font-inter text-caption text-text-muted">
              Your current submission preview will appear here. Ensure all links
              are accessible to the review board.
            </p>
          </div>

          <Button
            onClick={handleSubmit}
            disabled={!canSubmit || isSubmitting}
            fullWidth
            className="py-4 text-base"
          >
            {isSubmitting ? "Submitting..." : "Submit Updated Product"}
          </Button>
          <p className="text-center font-inter text-caption text-text-muted px-4 leading-relaxed">
            By submitting, you confirm that this version incorporates the
            required refinements from Stage 3.
          </p>
        </div>
      </div>
    </DashboardShell>
  );
}
