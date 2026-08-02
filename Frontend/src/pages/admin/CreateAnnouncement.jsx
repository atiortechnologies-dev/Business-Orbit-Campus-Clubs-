import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ChevronRight,
  Bold,
  List,
  LinkIcon,
  Image as ImageIcon,
  Paperclip,
  Undo2,
  Redo2,
  Loader2,
  AlertCircle,
} from "lucide-react";
import AdminShell from "@/components/admin/AdminShell";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { createAnnouncement } from "@/api/admin/adminAnnouncementApi";

const AUDIENCE_OPTIONS = [
  "All Users",
  "Students",
  "Mentors",
  "Investors",
  "Incubators",
  "Companies",
  "Admins",
];
const CHAR_LIMIT = 2000;

export default function CreateAnnouncementPage() {
  useDocumentTitle("Create Announcement — BOCC Admin");
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [form, setForm] = useState({
    title: "",
    summary: "",
    body: "",
    audience: [],
    priority: "Normal",
  });

  const [errorMsg, setErrorMsg] = useState("");

  const update = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const toggleAudience = (option) => {
    setForm((prev) => ({
      ...prev,
      audience: prev.audience.includes(option)
        ? prev.audience.filter((a) => a !== option)
        : [...prev.audience, option],
    }));
  };

  const isTitleValid =
    form.title.trim().length >= 5 && form.title.trim().length <= 150;
  const isSummaryValid =
    form.summary.trim().length > 0 && form.summary.trim().length <= 250;
  const isBodyValid = form.body.trim().length >= 50;
  const isAudienceValid = form.audience.length > 0;

  const mutation = useMutation({
    mutationFn: createAnnouncement,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminAnnouncements"] });
      navigate("/admin/announcements", { replace: true });
    },
    onError: (err) => {
      console.error("Failed to create announcement:", err);
      setErrorMsg(
        err?.response?.data?.message || err?.message ||
          "Failed to create announcement. Please check all fields.",
      );
    },
  });

  const submitting = mutation.isPending;

  const canSubmit =
    isTitleValid &&
    isSummaryValid &&
    isBodyValid &&
    isAudienceValid &&
    !submitting;

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (!canSubmit) return;

    setErrorMsg("");

    const payload = {
      title: form.title.trim(),
      short_summary: form.summary.trim(),
      body_content: form.body.trim(),
      target_audience: form.audience,
      priority: form.priority,
    };

    mutation.mutate(payload);
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
        <span className="text-text-heading font-semibold">
          New Announcement
        </span>
      </nav>

      <h1 className="font-poppins font-semibold text-page text-text-heading mb-8">
        Create Announcement
      </h1>

      {errorMsg && (
        <div className="mb-6 p-4 bg-error/15 border border-error/30 text-error rounded-md text-small flex items-center gap-2">
          <AlertCircle size={16} className="shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 lg:grid-cols-12 gap-6"
      >
        <div className="lg:col-span-8 space-y-6">
          <section className="bg-surface-white border border-border-subtle rounded-lg p-8">
            <h3 className="font-poppins font-semibold text-body text-text-heading mb-6">
              Basic Info
            </h3>
            <div className="space-y-5">
              <Input
                id="title"
                label="Title (5-150 characters)"
                placeholder="Enter headline for the announcement..."
                value={form.title}
                onChange={update("title")}
              />
              <div className="flex flex-col gap-1">
                <label
                  htmlFor="summary"
                  className="text-caption font-medium text-text-heading font-inter"
                >
                  Short Summary (Max 250 characters)
                </label>
                <textarea
                  id="summary"
                  rows={2}
                  maxLength={250}
                  placeholder="Brief summary for notification previews..."
                  value={form.summary}
                  onChange={update("summary")}
                  className="w-full rounded-md border border-border-subtle bg-surface-white text-sm text-text-body font-inter p-3 focus:outline-none focus:border-brand-black focus:ring-1 focus:ring-brand-black transition-all resize-none"
                />
              </div>
            </div>
          </section>

          <section className="bg-surface-white border border-border-subtle rounded-lg p-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-poppins font-semibold text-body text-text-heading">
                Announcement Content
              </h3>
              <span className="font-inter text-caption text-text-muted">
                {form.body.length} / {CHAR_LIMIT}
              </span>
            </div>
            <div className="border border-border-subtle rounded-md overflow-hidden">
              <div className="flex items-center gap-1 p-2 border-b border-border-subtle bg-canvas-bg">
                <span className="p-1.5 text-text-muted">
                  <Bold size={16} strokeWidth={2} />
                </span>
                <span className="p-1.5 text-text-muted">
                  <List size={16} strokeWidth={2} />
                </span>
                <span className="p-1.5 text-text-muted">
                  <LinkIcon size={16} strokeWidth={2} />
                </span>
                <span className="p-1.5 text-text-muted">
                  <ImageIcon size={16} strokeWidth={2} />
                </span>
                <span className="p-1.5 text-text-muted">
                  <Paperclip size={16} strokeWidth={2} />
                </span>
                <div className="w-px h-4 bg-border-subtle mx-2" />
                <span className="p-1.5 text-text-muted">
                  <Undo2 size={16} strokeWidth={2} />
                </span>
                <span className="p-1.5 text-text-muted">
                  <Redo2 size={16} strokeWidth={2} />
                </span>
              </div>
              <textarea
                rows={12}
                maxLength={CHAR_LIMIT}
                placeholder="Type full content here (minimum 50 characters required)..."
                value={form.body}
                onChange={update("body")}
                className="w-full bg-transparent p-4 font-inter text-body text-text-body focus:outline-none resize-none"
              />
            </div>
          </section>

          <section className="bg-surface-white border border-border-subtle rounded-lg p-8">
            <h3 className="font-poppins font-semibold text-body text-text-heading mb-6">
              Target Audience
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {AUDIENCE_OPTIONS.map((option) => (
                <label
                  key={option}
                  className="flex items-center gap-2.5 cursor-pointer group"
                >
                  <input
                    type="checkbox"
                    checked={form.audience.includes(option)}
                    onChange={() => toggleAudience(option)}
                    className="w-4 h-4 rounded border-border-subtle text-brand-black focus:ring-brand-black"
                  />
                  <span className="font-inter text-small text-text-body group-hover:text-text-heading transition-colors">
                    {option}
                  </span>
                </label>
              ))}
            </div>
          </section>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <section className="bg-surface-white border border-border-subtle rounded-lg p-6">
            <h4 className="font-inter font-semibold text-caption text-text-muted uppercase tracking-widest mb-4">
              Priority Level
            </h4>
            <div className="space-y-3">
              {["Normal", "Important", "Critical"].map((level) => (
                <label
                  key={level}
                  className="flex items-center gap-2.5 cursor-pointer"
                >
                  <input
                    type="radio"
                    name="priority"
                    value={level}
                    checked={form.priority === level}
                    onChange={update("priority")}
                    className="w-4 h-4 border-border-subtle text-brand-black focus:ring-brand-black"
                  />
                  <span
                    className={`font-inter text-small ${
                      level === "Critical"
                        ? "text-error font-semibold"
                        : level === "Important"
                          ? "text-warning font-medium"
                          : "text-text-body"
                    }`}
                  >
                    {level}
                  </span>
                </label>
              ))}
            </div>
          </section>

          <section className="bg-surface-white border border-border-subtle rounded-lg p-6">
            <h4 className="font-inter font-semibold text-caption text-text-muted uppercase tracking-widest mb-4">
              Publishing Checklist
            </h4>
            <ul className="space-y-3 font-inter text-small">
              <li
                className={
                  isTitleValid ? "text-text-heading" : "text-text-muted"
                }
              >
                Title (5-150 chars)
              </li>
              <li
                className={
                  isSummaryValid ? "text-text-heading" : "text-text-muted"
                }
              >
                Summary provided
              </li>
              <li
                className={
                  isBodyValid ? "text-text-heading" : "text-text-muted"
                }
              >
                Content exceeds 50 characters
              </li>
              <li
                className={
                  isAudienceValid ? "text-text-heading" : "text-text-muted"
                }
              >
                At least 1 target audience selected
              </li>
            </ul>
          </section>
        </div>

        <div className="lg:col-span-12 flex items-center justify-between mt-8 pt-6 border-t border-divider-line">
          <Link
            to="/admin/announcements"
            className="font-poppins font-semibold text-small text-text-muted hover:text-text-heading transition-colors"
          >
            Cancel
          </Link>
          <Button
            type="submit"
            disabled={!canSubmit}
            className="inline-flex items-center gap-2"
          >
            {submitting && <Loader2 size={16} className="animate-spin" />}
            Submit Announcement
          </Button>
        </div>
      </form>
    </AdminShell>
  );
}
