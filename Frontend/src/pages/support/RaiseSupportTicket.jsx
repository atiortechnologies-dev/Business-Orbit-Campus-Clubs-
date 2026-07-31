import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ChevronRight,
  Clock,
  CalendarCheck,
  Mail,
  Info,
  Image as ImageIcon,
  FileText,
  AlertCircle,
  Loader2,
} from "lucide-react";
import DashboardShell from "@/components/dashboard/DashboardShell";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import ComingSoon from "@/components/ui/ComingSoon";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { supportApi } from "@/api/supportApi";

const CATEGORIES = [
  "Technical Issue",
  "Startup Journey",
  "Account Management",
  "Billing & Invoices",
];
const PRIORITIES = ["Low", "Medium", "High"];

const SELECT_CLASS =
  "w-full rounded-md border border-border-subtle bg-surface-white text-sm text-text-body font-inter min-h-[44px] px-3 focus:outline-none focus:border-brand-black focus:ring-1 focus:ring-brand-black transition-all";

const UPLOAD_TYPES = [
  { icon: ImageIcon, label: "Images", hint: "PNG, JPG up to 10MB" },
  { icon: FileText, label: "PDFs", hint: "Single or multi-page" },
  { icon: FileText, label: "Documents", hint: "DOCX, TXT, Logs" },
];

export default function RaiseSupportTicketPage() {
  useDocumentTitle("Raise Support Ticket — BOCC");
  const navigate = useNavigate();

  const [form, setForm] = useState({
    subject: "",
    category: CATEGORIES[0],
    description: "",
  });
  const [priority, setPriority] = useState("Medium");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const update = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const canSubmit =
    form.subject.trim().length > 0 && form.description.trim().length > 0;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setLoading(true);
    setErrorMsg("");
    try {
      await supportApi.requestAssistance({
        subject: form.subject,
        category: form.category,
        priority,
        description: form.description,
      });
      navigate("/support");
    } catch (err) {
      console.error(err);
      setErrorMsg(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to submit ticket.",
      );
      setLoading(false);
    }
  };

  return (
    <DashboardShell pageId="raise-support-ticket">
      <nav className="mb-2 flex items-center gap-2 text-text-muted font-inter font-normal text-small">
        <Link
          to="/support"
          className="hover:text-text-heading transition-colors"
        >
          Help Center
        </Link>
        <ChevronRight size={14} strokeWidth={2} />
        <span className="text-text-heading font-semibold">Raise Ticket</span>
      </nav>

      <div className="mb-10 border-b border-divider-line pb-8">
        <h1 className="font-poppins font-semibold text-page text-text-heading mb-2">
          Raise Support Ticket
        </h1>
        <p className="font-inter text-body text-text-body">
          Provide details about your issue and our technical team will assist
          you within the SLA period.
        </p>

        {errorMsg && (
          <div className="mt-4 p-3 bg-error/15 border border-error/30 text-error rounded-md text-small flex items-center gap-2">
            <AlertCircle size={16} className="shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-6">
          <Input
            id="subject"
            label="Subject"
            placeholder="Brief summary of the issue"
            value={form.subject}
            onChange={update("subject")}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-1">
              <label
                htmlFor="category"
                className="text-caption font-medium text-text-heading font-inter"
              >
                Category
              </label>
              <select
                id="category"
                value={form.category}
                onChange={update("category")}
                className={SELECT_CLASS}
              >
                {CATEGORIES.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-caption font-medium text-text-heading font-inter">
                Priority
              </label>
              <div className="flex border border-border-subtle rounded-lg overflow-hidden h-[44px]">
                {PRIORITIES.map((p, i) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPriority(p)}
                    className={`flex-1 font-inter text-small transition-all ${
                      priority === p
                        ? "bg-brand-black text-white font-semibold"
                        : "bg-surface-white text-text-muted hover:bg-canvas-bg"
                    } ${i !== PRIORITIES.length - 1 ? "border-r border-border-subtle" : ""}`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label
              htmlFor="description"
              className="text-caption font-medium text-text-heading font-inter"
            >
              Description
            </label>
            <textarea
              id="description"
              rows={6}
              placeholder="Describe the issue in detail. Include steps to reproduce if applicable."
              value={form.description}
              onChange={update("description")}
              className="w-full rounded-md border border-border-subtle bg-surface-white text-sm text-text-body font-inter p-3 focus:outline-none focus:border-brand-black focus:ring-1 focus:ring-brand-black transition-all resize-none"
            />
          </div>

          <div className="flex flex-col gap-3">
            <label className="text-caption font-medium text-text-heading font-inter">
              Attachments
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {UPLOAD_TYPES.map(({ icon: Icon, label, hint }) => (
                <ComingSoon
                  key={label}
                  label={`Upload ${label}`}
                  position="top"
                >
                  <div className="border-2 border-dashed border-border-subtle rounded-lg p-6 flex flex-col items-center justify-center gap-1 hover:border-brand-black cursor-pointer transition-colors bg-canvas-bg w-full">
                    <Icon
                      size={20}
                      strokeWidth={2}
                      className="text-text-muted"
                    />
                    <span className="font-inter font-semibold text-caption text-text-body">
                      {label}
                    </span>
                    <span className="text-[10px] text-text-muted">{hint}</span>
                  </div>
                </ComingSoon>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-4">
          <div className="border border-border-subtle rounded-xl p-6 bg-surface-white sticky top-24">
            <h3 className="font-poppins font-semibold text-body text-text-heading mb-6">
              Support Information
            </h3>
            <div className="space-y-6">
              <div className="flex gap-3">
                <Clock
                  size={18}
                  strokeWidth={2}
                  className="text-text-muted shrink-0"
                />
                <div>
                  <p className="font-inter font-semibold text-caption text-text-heading">
                    Expected Response
                  </p>
                  <p className="font-inter text-small text-text-muted">
                    Under 24 hours (SLA Tier 1)
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <CalendarCheck
                  size={18}
                  strokeWidth={2}
                  className="text-text-muted shrink-0"
                />
                <div>
                  <p className="font-inter font-semibold text-caption text-text-heading">
                    Working Hours
                  </p>
                  <p className="font-inter text-small text-text-muted">
                    Mon – Fri, 09:00 – 18:00 EST
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <Mail
                  size={18}
                  strokeWidth={2}
                  className="text-text-muted shrink-0"
                />
                <div>
                  <p className="font-inter font-semibold text-caption text-text-heading">
                    Direct Email
                  </p>
                  <p className="font-inter text-small text-text-muted underline">
                    support@bocc-platform.com
                  </p>
                </div>
              </div>
              <div className="pt-4 border-t border-divider-line">
                <div className="bg-canvas-bg rounded-lg p-4 flex gap-3 items-start">
                  <Info
                    size={18}
                    strokeWidth={2}
                    className="text-text-heading shrink-0"
                  />
                  <p className="font-inter text-caption text-text-muted">
                    Please check our{" "}
                    <Link to="/support" className="text-text-heading underline">
                      Knowledge Base
                    </Link>{" "}
                    before submitting. 40% of issues are resolved instantly
                    through docs.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <footer className="mt-12 pt-6 border-t border-divider-line flex justify-end gap-4">
        <Link to="/support">
          <Button variant="outline">Cancel</Button>
        </Link>
        <Button onClick={handleSubmit} disabled={!canSubmit || loading}>
          {loading ? (
            <Loader2 className="animate-spin" size={18} />
          ) : (
            "Submit Ticket"
          )}
        </Button>
      </footer>
    </DashboardShell>
  );
}
