import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  ChevronRight,
  User,
  Calendar,
  Paperclip,
  AlertCircle,
} from "lucide-react";
import AdminShell from "@/components/admin/AdminShell";
import Button from "@/components/ui/Button";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import api from "@/api/axiosInstance";

const FALLBACK_DRAFT = {
  title: "Maintenance Schedule",
  summary: "Scheduled infrastructure maintenance for the upcoming quarter.",
  body: "To ensure our digital infrastructure remains resilient and capable of supporting our growing campus population, we have scheduled a series of comprehensive maintenance updates throughout the upcoming quarter.",
  audience: ["Students", "Mentors"],
  priority: "Critical",
  publishMode: "now",
  scheduleDate: "",
  scheduleTime: "",
};

export default function PreviewAnnouncementPage() {
  useDocumentTitle("Preview Announcement — BOCC Admin");
  const navigate = useNavigate();
  const { state } = useLocation();
  const draft = state?.draft ?? FALLBACK_DRAFT;
  const [errorMsg, setErrorMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePublish = async () => {
    try {
      setIsSubmitting(true);
      setErrorMsg("");
      await api.post("/admin/announcements", {
        ...draft,
        status: "published",
        publishedAt: new Date().toISOString(),
      });
      navigate("/admin/announcements/published", { state: { draft } });
    } catch (e) {
      console.error("Failed to publish announcement", e);
      setErrorMsg(
        e?.response?.data?.message ||
          e?.message ||
          "Failed to publish announcement",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveDraft = async () => {
    try {
      setIsSubmitting(true);
      setErrorMsg("");
      await api.post("/admin/announcements", { ...draft, status: "draft" });
    } catch (e) {
      console.error("Failed to save draft", e);
      setErrorMsg(
        e?.response?.data?.message || e?.message || "Failed to save draft",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AdminShell>
      <nav className="mb-2 flex items-center gap-2 text-text-muted font-inter font-normal text-small">
        <Link
          to="/admin/announcements"
          className="hover:text-text-heading transition-colors"
        >
          Announcements
        </Link>
        <ChevronRight size={14} strokeWidth={2} />
        <span className="text-text-heading font-semibold">Preview</span>
      </nav>

      <div className="flex items-center justify-between mb-8">
        <h1 className="font-poppins font-semibold text-page text-text-heading">
          Preview Announcement
        </h1>
        <span className="px-3 py-1 bg-canvas-bg border border-border-subtle rounded-full font-inter font-semibold text-caption text-text-muted uppercase">
          Draft
        </span>
      </div>

      {errorMsg && (
        <div className="mb-6 p-3 bg-error/15 border border-error/30 text-error rounded-md text-small flex items-center gap-2">
          <AlertCircle size={16} className="shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8">
          <div className="bg-surface-white border border-border-subtle rounded-lg p-8">
            <div className="flex gap-2 mb-4">
              {draft.priority && draft.priority !== "Normal" && (
                <span
                  className={`px-2 py-0.5 rounded font-inter text-[10px] font-semibold uppercase ${draft.priority === "Critical" ? "bg-error/15 text-error" : "bg-warning/15 text-warning"}`}
                >
                  {draft.priority} Priority
                </span>
              )}
              {draft.audience.map((a) => (
                <span
                  key={a}
                  className="px-2 py-0.5 rounded bg-canvas-bg text-text-muted font-inter text-[10px] font-semibold uppercase"
                >
                  {a}
                </span>
              ))}
            </div>
            <h2 className="font-poppins font-semibold text-section text-text-heading mb-3">
              {draft.title}
            </h2>
            <div className="flex items-center gap-4 font-inter text-caption text-text-muted mb-6">
              <span className="flex items-center gap-1">
                <User size={14} strokeWidth={2} /> Published By: BOCC Admin
              </span>
              <span className="flex items-center gap-1">
                <Calendar size={14} strokeWidth={2} />{" "}
                {draft.publishMode === "schedule" && draft.scheduleDate
                  ? draft.scheduleDate
                  : "Publishing now"}
              </span>
            </div>
            <div className="font-inter text-body text-text-body leading-relaxed whitespace-pre-line">
              {draft.body}
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <div className="bg-surface-white border border-border-subtle rounded-lg p-6">
            <h4 className="font-inter font-semibold text-caption text-text-muted uppercase tracking-widest mb-4">
              Configuration Details
            </h4>
            <div className="space-y-4">
              <div>
                <p className="font-inter text-caption text-text-muted uppercase mb-1">
                  Target Audience
                </p>
                <div className="flex flex-wrap gap-2">
                  {draft.audience.map((a) => (
                    <span
                      key={a}
                      className="px-2 py-1 bg-canvas-bg rounded font-inter text-small text-text-heading"
                    >
                      {a}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <p className="font-inter text-caption text-text-muted uppercase mb-1">
                  Publishing Time
                </p>
                <p className="font-inter text-small text-text-heading">
                  {draft.publishMode === "schedule" && draft.scheduleDate
                    ? `Scheduled — ${draft.scheduleDate} ${draft.scheduleTime}`.trim()
                    : "Immediately"}
                </p>
              </div>
              <div>
                <p className="font-inter text-caption text-text-muted uppercase mb-1">
                  Priority
                </p>
                <p className="font-inter text-small text-text-heading">
                  {draft.priority}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-surface-white border border-dashed border-border-subtle rounded-lg p-6 flex items-start gap-3">
            <Paperclip
              size={18}
              strokeWidth={2}
              className="text-text-muted shrink-0 mt-0.5"
            />
            <p className="font-inter text-caption text-text-muted">
              No attachments added yet. Attachments can be added from the editor
              before publishing.
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mt-8 pt-6 border-t border-divider-line">
        <Link
          to="/admin/announcements/create"
          className="font-poppins font-semibold text-small text-text-muted hover:text-text-heading transition-colors"
        >
          Back to Edit
        </Link>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={handleSaveDraft}
            disabled={isSubmitting}
          >
            Save Draft
          </Button>
          <Button onClick={handlePublish} disabled={isSubmitting}>
            Publish Announcement
          </Button>
        </div>
      </div>
    </AdminShell>
  );
}
