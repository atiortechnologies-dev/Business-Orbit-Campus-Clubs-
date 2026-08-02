import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Plus,
  FileUp,
  ChevronRight,
  ArrowRight,
  TrendingUp,
  AlertCircle,
  Paperclip,
  X,
} from "lucide-react";
import DashboardShell from "@/components/dashboard/DashboardShell";
import StatCard from "@/components/ui/StatCard";
import Modal from "@/components/ui/Modal";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import api from "@/api/axiosInstance";

const SENTIMENT_LABELS = {
  positive: "Positive Sentiment",
  neutral: "Neutral Sentiment",
  negative: "Negative Sentiment",
};

const INITIAL_RECENT = [
  {
    id: 65,
    sentimentKey: "positive",
    sentiment: "Positive Sentiment",
    tag: "Product Fit",
  },
  {
    id: 64,
    sentimentKey: "neutral",
    sentiment: "Neutral Sentiment",
    tag: "UI Feedback",
  },
  {
    id: 63,
    sentimentKey: "negative",
    sentiment: "Negative Sentiment",
    tag: "Pricing Concern",
  },
];

const LEARNINGS = [
  {
    quote: '"80% of respondents struggle with manual data entry."',
    note: "Found in Batch 2 (Responses 20–45). This confirms the core pain point identified in our initial ideation session.",
  },
  {
    quote: '"Mobile accessibility is a secondary but frequent request."',
    note: "Users mentioned they often need to check status updates while in the field.",
  },
];

export default function SurveyTrackerPage() {
  useDocumentTitle("Survey Tracker — BOCC");
  const navigate = useNavigate();
  const [responses, setResponses] = useState({
    total: 65,
    target: 100,
    positive: 42,
    negative: 23,
  });
  const [recent, setRecent] = useState(INITIAL_RECENT);
  const [addOpen, setAddOpen] = useState(false);
  const [draft, setDraft] = useState({ sentiment: "positive", tag: "" });
  const [queuedFiles, setQueuedFiles] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [savingDraft, setSavingDraft] = useState(false);

  const completion = Math.round((responses.total / responses.target) * 100);

  const handleContinue = async () => {
    setErrorMsg("");
    setIsSubmitting(true);
    try {
      await api.post("/surveys", { responses, recent });
      navigate("/build-startup/journey/validation/evidence-upload");
    } catch (err) {
      setErrorMsg(
        err.response?.data?.message ||
          err.message ||
          "Failed to persist survey state.",
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
      await api.patch("/surveys/draft", { responses, recent });
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

  const addResponse = () => {
    if (!draft.tag.trim()) return;
    const nextId = Math.max(...recent.map((r) => r.id), responses.total) + 1;
    setRecent((prev) => [
      {
        id: nextId,
        sentimentKey: draft.sentiment,
        sentiment: SENTIMENT_LABELS[draft.sentiment],
        tag: draft.tag.trim(),
      },
      ...prev,
    ]);
    setResponses((prev) => ({
      ...prev,
      total: prev.total + 1,
      positive: prev.positive + (draft.sentiment === "positive" ? 1 : 0),
      negative: prev.negative + (draft.sentiment === "negative" ? 1 : 0),
    }));
    setDraft({ sentiment: "positive", tag: "" });
    setAddOpen(false);
  };

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const formData = new FormData();
      formData.append("surveyFile", file);
      await api.post("/surveys/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setQueuedFiles((prev) => [...prev, { name: file.name, size: file.size }]);
    } catch (err) {
      setErrorMsg(
        err.response?.data?.message ||
          err.message ||
          "Failed to upload survey file.",
      );
    }
    e.target.value = "";
  };

  const removeQueuedFile = (name) =>
    setQueuedFiles((prev) => prev.filter((f) => f.name !== name));

  return (
    <DashboardShell pageId="survey-tracker">
      <nav className="mb-2 flex items-center gap-2 text-text-muted font-inter font-normal text-small">
        <Link
          to="/dashboard"
          className="hover:text-text-heading transition-colors"
        >
          Dashboard
        </Link>
        <ChevronRight size={14} strokeWidth={2} />
        <Link
          to="/build-startup/journey/validation"
          className="hover:text-text-heading transition-colors"
        >
          Validation
        </Link>
        <ChevronRight size={14} strokeWidth={2} />
        <span className="text-text-heading font-semibold">Survey Tracker</span>
      </nav>

      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
        <div>
          <h1 className="font-poppins font-semibold text-page text-text-heading mb-1">
            Survey Tracker
          </h1>
          <p className="font-inter text-body text-text-body">
            Track your customer-discovery progress and sentiment analysis.
          </p>
        </div>
        <div className="text-right shrink-0">
          <p className="font-poppins font-semibold text-card text-text-heading">
            {responses.total} / {responses.target}
          </p>
          <p className="font-inter text-caption text-text-muted uppercase tracking-wider">
            Responses Collected
          </p>
        </div>
      </div>

      {errorMsg && (
        <div className="mb-6 p-3 bg-error/15 border border-error/30 text-error rounded-md text-small flex items-center gap-2">
          <AlertCircle size={16} className="shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {successMsg && (
        <div className="mb-6 p-3 bg-success/15 border border-success/30 text-success rounded-md text-small flex items-center gap-2">
          <AlertCircle size={16} className="shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      <div className="h-2 bg-canvas-bg rounded-full overflow-hidden mb-8">
        <div
          className="h-full bg-brand-black rounded-full transition-all"
          style={{ width: `${completion}%` }}
        />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Responses" value={responses.total} />
        <StatCard label="Positive Feedback" value={responses.positive} />
        <StatCard label="Negative Feedback" value={responses.negative} />
        <StatCard label="Completion" value={`${completion}%`} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
        <div className="lg:col-span-8 bg-surface-white border border-border-subtle rounded-lg shadow-card p-6">
          <h3 className="font-poppins font-semibold text-body text-text-heading mb-4">
            Key Learnings &amp; Notes
          </h3>
          <div className="bg-canvas-bg rounded-lg p-4 space-y-4">
            {LEARNINGS.map(({ quote, note }) => (
              <div key={quote} className="flex gap-3">
                <TrendingUp
                  size={16}
                  strokeWidth={2}
                  className="text-text-muted shrink-0 mt-0.5"
                />
                <div>
                  <p className="font-inter font-semibold italic text-small text-text-heading">
                    {quote}
                  </p>
                  <p className="font-inter text-small text-text-muted mt-0.5">
                    {note}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-4 space-y-4">
          <div className="bg-brand-black rounded-lg p-6 text-center">
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-3">
              <Plus size={20} strokeWidth={2} className="text-white" />
            </div>
            <h4 className="font-poppins font-semibold text-body text-white mb-1">
              Add Responses
            </h4>
            <p className="font-inter text-caption text-white/70 mb-4">
              Manually input survey results from 1-on-1 interviews.
            </p>
            <button
              type="button"
              onClick={() => setAddOpen(true)}
              className="block w-full bg-white text-brand-black py-2 rounded-md font-poppins font-semibold text-caption uppercase tracking-wider hover:opacity-90 transition-opacity"
            >
              Add Survey Responses
            </button>
          </div>
          <div className="bg-surface-white border border-border-subtle rounded-lg shadow-card p-6 text-center">
            <div className="w-10 h-10 rounded-full bg-canvas-bg border border-border-subtle flex items-center justify-center mx-auto mb-3">
              <FileUp size={18} strokeWidth={2} className="text-text-body" />
            </div>
            <h4 className="font-poppins font-semibold text-body text-text-heading mb-1">
              Bulk Import
            </h4>
            <p className="font-inter text-caption text-text-muted mb-4">
              Upload .csv or Excel files from external survey tools.
            </p>
            <label className="block w-full border border-border-subtle text-text-heading py-2 rounded-md font-poppins font-semibold text-caption uppercase tracking-wider hover:bg-canvas-bg transition-colors cursor-pointer">
              Upload Results
              <input
                type="file"
                accept=".csv,.xlsx,.xls"
                onChange={handleFileSelect}
                className="sr-only"
              />
            </label>
            {queuedFiles.length > 0 && (
              <div className="mt-3 space-y-1.5 text-left">
                {queuedFiles.map((f) => (
                  <div
                    key={f.name}
                    className="flex items-center justify-between gap-2 bg-canvas-bg border border-border-subtle rounded-md px-2.5 py-1.5"
                  >
                    <span className="flex items-center gap-1.5 min-w-0 font-inter text-caption text-text-body truncate">
                      <Paperclip
                        size={12}
                        strokeWidth={2}
                        className="shrink-0 text-text-muted"
                      />
                      {f.name}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeQueuedFile(f.name)}
                      aria-label={`Remove ${f.name}`}
                      className="shrink-0 text-text-muted hover:text-error transition-colors"
                    >
                      <X size={12} strokeWidth={2} />
                    </button>
                  </div>
                ))}
                <p className="font-inter text-caption text-text-muted">
                  Queued — imported once submitted for review.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <Modal
        isOpen={addOpen}
        onClose={() => setAddOpen(false)}
        title="Add survey response"
      >
        <div className="space-y-4">
          <div>
            <label className="font-poppins font-semibold text-caption text-text-muted uppercase tracking-wider block mb-1.5">
              Sentiment
            </label>
            <div className="flex gap-2">
              {Object.entries(SENTIMENT_LABELS).map(([key, label]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() =>
                    setDraft((prev) => ({ ...prev, sentiment: key }))
                  }
                  className={`flex-1 py-2 rounded-md border font-inter text-small transition-colors ${
                    draft.sentiment === key
                      ? "bg-brand-black text-white border-brand-black"
                      : "border-border-subtle text-text-body hover:bg-canvas-bg"
                  }`}
                >
                  {label.replace(" Sentiment", "")}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="font-poppins font-semibold text-caption text-text-muted uppercase tracking-wider block mb-1.5">
              Tag / Topic
            </label>
            <input
              type="text"
              value={draft.tag}
              onChange={(e) =>
                setDraft((prev) => ({ ...prev, tag: e.target.value }))
              }
              placeholder="e.g. Pricing Concern"
              className="w-full bg-canvas-bg border border-border-subtle rounded-md text-text-body font-inter text-body py-2.5 px-3 focus:outline-none focus:ring-1 focus:ring-brand-black"
            />
          </div>
          <button
            type="button"
            onClick={addResponse}
            disabled={!draft.tag.trim()}
            className="w-full bg-action-bg text-action-text py-2.5 rounded-md hover:opacity-90 active:scale-[0.98] transition-all font-poppins font-semibold text-small disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Add Response
          </button>
        </div>
      </Modal>

      <div className="bg-surface-white border border-border-subtle rounded-lg shadow-card overflow-hidden mb-8">
        <div className="flex items-center justify-between bg-canvas-bg px-5 py-3">
          <p className="font-inter font-semibold text-caption text-text-muted uppercase tracking-wider">
            Recent Activity
          </p>
          <p className="font-inter text-caption text-text-muted">
            Last updated: 2 hours ago
          </p>
        </div>
        <div className="divide-y divide-divider-line">
          {recent.map(({ id, sentiment, tag }) => (
            <div
              key={id}
              className="flex items-center justify-between px-5 py-3"
            >
              <div className="flex items-center gap-3">
                <AlertCircle
                  size={16}
                  strokeWidth={2}
                  className="text-text-muted"
                />
                <div>
                  <p className="font-inter font-semibold text-small text-text-heading">
                    Response #{id}
                  </p>
                  <p className="font-inter text-caption text-text-muted">
                    {sentiment} · {tag}
                  </p>
                </div>
              </div>
              <ChevronRight
                size={16}
                strokeWidth={2}
                className="text-text-muted"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between pt-6 border-t border-divider-line">
        <button
          type="button"
          onClick={handleSaveDraft}
          disabled={isSubmitting || savingDraft}
          className="font-poppins font-semibold text-small text-text-heading hover:opacity-80 transition-opacity disabled:opacity-50"
        >
          {savingDraft ? "Saving..." : "Save Draft"}
        </button>
        <button
          type="button"
          onClick={handleContinue}
          disabled={isSubmitting || savingDraft}
          className="inline-flex items-center gap-2 bg-action-bg text-action-text px-6 py-2.5 rounded-md hover:opacity-90 active:scale-[0.98] transition-all font-poppins font-semibold text-small disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Continuing..." : "Continue"}
          <ArrowRight size={16} strokeWidth={2} />
        </button>
      </div>
    </DashboardShell>
  );
}
