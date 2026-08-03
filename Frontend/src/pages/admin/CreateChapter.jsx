import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ChevronRight,
  Info,
  MapPin,
  User,
  SlidersHorizontal,
  FileText,
  HelpCircle,
  ArrowRight,
  Loader2,
  AlertCircle,
} from "lucide-react";
import AdminShell from "@/components/admin/AdminShell";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { createChapter } from "@/api/admin/chapterApi";

const CHAPTER_TYPES = ["University", "College", "School", "Incubator"];
const STATUS_OPTIONS = ["Pending", "Active", "Inactive"];

export default function CreateChapterPage() {
  useDocumentTitle("Create New Chapter — BOCC Admin");
  const navigate = useNavigate();

  const [form, setForm] = useState({
    chapterName: "",
    institutionName: "",
    chapterType: CHAPTER_TYPES[0],
    country: "",
    state: "",
    city: "",
    address: "",
    leadName: "",
    leadEmail: "",
    leadPhone: "",
    status: "Pending",
    description: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const update = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const canSubmit =
    form.chapterName.trim().length > 0 &&
    form.institutionName.trim().length > 0 &&
    !submitting;

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (!canSubmit) return;

    try {
      setSubmitting(true);
      setErrorMsg("");

      // Full payload preserving all metadata fields
      const payload = {
        name: form.chapterName.trim(),
        institution: form.institutionName.trim(),
        type: form.chapterType,
        country: form.country.trim(),
        state: form.state.trim(),
        city: form.city.trim(),
        address: form.address.trim(),
        lead_name: form.leadName.trim(),
        lead_email: form.leadEmail.trim(),
        lead_phone: form.leadPhone.trim(),
        status: form.status,
        description: form.description.trim(),
      };

      // Call API
      const res = await createChapter(payload);
      const createdData = res?.data || res;
      const chapterId = createdData?.id || createdData?._id;

      if (chapterId) {
        // Redirect directly to details page
        navigate(`/admin/chapters/detail?id=${chapterId}`);
      } else {
        navigate("/admin/chapters");
      }
    } catch (err) {
      console.error("Failed to create chapter:", err);
      setErrorMsg(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to create chapter. Please check all fields and try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AdminShell>
      <nav className="mb-2 flex items-center gap-2 text-text-muted font-inter font-normal text-small">
        <Link
          to="/admin/chapters"
          className="hover:text-text-heading transition-colors"
        >
          Chapters
        </Link>
        <ChevronRight size={14} strokeWidth={2} />
        <span className="text-text-heading font-semibold">New Chapter</span>
      </nav>

      <h1 className="font-poppins font-semibold text-page text-text-heading mb-1">
        Create New Chapter
      </h1>
      <p className="font-inter text-body text-text-muted mb-8">
        Initialize a new BOCC chapter for an institution before managing
        students, startups and events.
      </p>

      {errorMsg && (
        <div className="mb-6 p-4 bg-error/15 border border-error/30 text-error rounded-md text-small flex items-center gap-2">
          <AlertCircle size={16} className="shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-surface-white border border-border-subtle rounded-lg max-w-4xl shadow-card"
      >
        <div className="p-8 space-y-10">
          {/* 1. Basic Information */}
          <section className="space-y-5">
            <div className="flex items-center gap-2 border-b border-divider-line pb-3">
              <Info size={18} strokeWidth={2} className="text-text-heading" />
              <h2 className="font-poppins font-semibold text-small uppercase tracking-widest text-text-heading">
                1. Basic Information
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Input
                id="chapterName"
                label="Chapter Name *"
                required
                placeholder="e.g. Stanford Innovators"
                value={form.chapterName}
                onChange={update("chapterName")}
                disabled={submitting}
              />
              <Input
                id="institutionName"
                label="Institution Name *"
                required
                placeholder="e.g. Stanford University"
                value={form.institutionName}
                onChange={update("institutionName")}
                disabled={submitting}
              />
              <div className="md:col-span-2 flex flex-col gap-1">
                <label
                  htmlFor="chapterType"
                  className="text-caption font-medium text-text-heading font-inter"
                >
                  Chapter Type
                </label>
                <select
                  id="chapterType"
                  value={form.chapterType}
                  onChange={update("chapterType")}
                  disabled={submitting}
                  className="w-full rounded-md border border-border-subtle bg-surface-white text-sm text-text-body font-inter min-h-[44px] px-3 focus:outline-none focus:border-brand-black focus:ring-1 focus:ring-brand-black transition-all"
                >
                  {CHAPTER_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </section>

          {/* 2. Location */}
          <section className="space-y-5">
            <div className="flex items-center gap-2 border-b border-divider-line pb-3">
              <MapPin size={18} strokeWidth={2} className="text-text-heading" />
              <h2 className="font-poppins font-semibold text-small uppercase tracking-widest text-text-heading">
                2. Location
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Input
                id="country"
                label="Country"
                placeholder="e.g. United States"
                value={form.country}
                onChange={update("country")}
                disabled={submitting}
              />
              <Input
                id="state"
                label="State / Province"
                placeholder="e.g. California"
                value={form.state}
                onChange={update("state")}
                disabled={submitting}
              />
              <Input
                id="city"
                label="City"
                placeholder="e.g. Palo Alto"
                value={form.city}
                onChange={update("city")}
                disabled={submitting}
              />
              <Input
                id="address"
                label="Full Address (Optional)"
                placeholder="450 Serra Mall"
                value={form.address}
                onChange={update("address")}
                disabled={submitting}
              />
            </div>
          </section>

          {/* 3. Chapter Lead */}
          <section className="space-y-5">
            <div className="flex items-center gap-2 border-b border-divider-line pb-3">
              <User size={18} strokeWidth={2} className="text-text-heading" />
              <h2 className="font-poppins font-semibold text-small uppercase tracking-widest text-text-heading">
                3. Chapter Lead
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Input
                id="leadName"
                label="Lead Name"
                placeholder="Full name of the lead"
                value={form.leadName}
                onChange={update("leadName")}
                disabled={submitting}
              />
              <Input
                id="leadEmail"
                label="Email"
                type="email"
                placeholder="lead@institution.edu"
                value={form.leadEmail}
                onChange={update("leadEmail")}
                disabled={submitting}
              />
              <Input
                id="leadPhone"
                label="Phone Number"
                type="tel"
                placeholder="+1 (555) 000-0000"
                value={form.leadPhone}
                onChange={update("leadPhone")}
                disabled={submitting}
              />
              <div className="md:col-span-2 p-4 bg-canvas-bg border-l-4 border-border-subtle rounded flex items-start gap-3">
                <HelpCircle
                  size={18}
                  strokeWidth={2}
                  className="text-text-muted shrink-0 mt-0.5"
                />
                <p className="font-inter text-small text-text-muted italic">
                  If the lead is not yet registered, an invitation email will be
                  sent after chapter creation.
                </p>
              </div>
            </div>
          </section>

          {/* 4 & 5. Status + Description */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <section className="space-y-5">
              <div className="flex items-center gap-2 border-b border-divider-line pb-3">
                <SlidersHorizontal
                  size={18}
                  strokeWidth={2}
                  className="text-text-heading"
                />
                <h2 className="font-poppins font-semibold text-small uppercase tracking-widest text-text-heading">
                  4. Chapter Status
                </h2>
              </div>
              <div className="flex flex-col gap-1">
                <label
                  htmlFor="status"
                  className="text-caption font-medium text-text-heading font-inter"
                >
                  Status
                </label>
                <select
                  id="status"
                  value={form.status}
                  onChange={update("status")}
                  disabled={submitting}
                  className="w-full rounded-md border border-border-subtle bg-surface-white text-sm text-text-body font-inter min-h-[44px] px-3 focus:outline-none focus:border-brand-black focus:ring-1 focus:ring-brand-black transition-all"
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </section>

            <section className="space-y-5">
              <div className="flex items-center gap-2 border-b border-divider-line pb-3">
                <FileText
                  size={18}
                  strokeWidth={2}
                  className="text-text-heading"
                />
                <h2 className="font-poppins font-semibold text-small uppercase tracking-widest text-text-heading">
                  5. Description
                </h2>
              </div>
              <div className="flex flex-col gap-1">
                <label
                  htmlFor="description"
                  className="text-caption font-medium text-text-heading font-inter"
                >
                  Description (Optional)
                </label>
                <textarea
                  id="description"
                  rows={4}
                  placeholder="Brief mission statement or background..."
                  value={form.description}
                  onChange={update("description")}
                  disabled={submitting}
                  className="w-full rounded-md border border-border-subtle bg-surface-white text-sm text-text-body font-inter p-3 focus:outline-none focus:border-brand-black focus:ring-1 focus:ring-brand-black transition-all resize-none"
                />
              </div>
            </section>
          </div>
        </div>

        <div className="p-8 border-t border-divider-line flex items-center justify-between bg-canvas-bg/30">
          <Link
            to="/admin/chapters"
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
            Create Chapter
            {!submitting && <ArrowRight size={16} strokeWidth={2} />}
          </Button>
        </div>
      </form>
    </AdminShell>
  );
}
