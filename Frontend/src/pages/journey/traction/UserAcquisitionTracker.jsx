import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ChevronRight,
  ArrowRight,
  PlusCircle,
  Info,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import DashboardShell from "@/components/dashboard/DashboardShell";
import StatCard from "@/components/ui/StatCard";
import Input from "@/components/ui/Input";
import ComingSoon from "@/components/ui/ComingSoon";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import api from "@/api/axiosInstance";

const SUMMARY = [
  {
    label: "Total Users",
    value: "1,248",
    subtext: "+12% vs last week",
    trendDirection: "up",
  },
  { label: "Active Users", value: "432", subtext: "34% Retention Rate" },
  { label: "Weekly Growth", value: "8.4%", subtext: "Target: 10%" },
  { label: "Interviews", value: "24", subtext: "Goal: 50 by EOM" },
];

const UPDATES = [
  {
    date: "24 Oct, 2023",
    headline: "+120 New Users",
    note: '"Campaign on LinkedIn reached 5k impressions with 2% CTR."',
    tags: ["LinkedIn", "Traction"],
    latest: true,
  },
  {
    date: "18 Oct, 2023",
    headline: "Growth Audit Completed",
    note: "Identified bottleneck in onboarding funnel at step 3.",
  },
  {
    date: "12 Oct, 2023",
    headline: "Baseline Established",
    note: "Initial 50 users from closed beta recorded.",
  },
];

const CHANNELS = [
  "Direct Search",
  "Social Media",
  "Referral",
  "Paid Advertising",
];

export default function UserAcquisitionTrackerPage() {
  useDocumentTitle("User Acquisition Tracker — BOCC");

  const [form, setForm] = useState({
    users: "",
    activeUsers: "",
    audience: "",
    channel: CHANNELS[0],
    metrics: "",
    activities: "",
    learnings: "",
  });

  const update = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [savingDraft, setSavingDraft] = useState(false);

  const handleSaveDraft = async () => {
    setErrorMsg("");
    setSuccessMsg("");
    setSavingDraft(true);
    try {
      await api.patch("/traction/user-acquisition/draft", form);
      setSuccessMsg("Draft saved successfully.");
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err) {
      console.error("Failed to save draft:", err);
      setErrorMsg(
        err?.response?.data?.message || err?.message || "Failed to save draft.",
      );
    } finally {
      setSavingDraft(false);
    }
  };

  return (
    <DashboardShell pageId="user-acquisition-tracker">
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
          User Acquisition Tracker
        </span>
      </nav>

      <div className="mb-8">
        <h1 className="font-poppins font-semibold text-page text-text-heading mb-1">
          User Acquisition Tracker
        </h1>
        <p className="font-inter text-body text-text-body">
          Record your initial users, growth metrics, and product adoption.
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {SUMMARY.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          <section className="bg-canvas-bg border border-border-subtle rounded-lg p-6">
            <h3 className="font-poppins font-semibold text-body text-text-heading mb-5">
              Traction Entry
            </h3>

            {errorMsg && (
              <div className="mb-5 p-3 bg-error/15 border border-error/30 text-error rounded-md text-small flex items-center gap-2">
                <AlertCircle size={16} className="shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {successMsg && (
              <div className="mb-5 p-3 bg-success/15 border border-success/30 text-success rounded-md text-small flex items-center gap-2">
                <CheckCircle2 size={16} className="shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
              <Input
                id="users"
                label="Number of Users"
                type="number"
                placeholder="e.g. 500"
                value={form.users}
                onChange={update("users")}
              />
              <Input
                id="activeUsers"
                label="Active Users"
                type="number"
                placeholder="e.g. 150"
                value={form.activeUsers}
                onChange={update("activeUsers")}
              />
            </div>

            <Input
              id="audience"
              label="Target Audience"
              placeholder="e.g. Early-stage SaaS founders in EU"
              value={form.audience}
              onChange={update("audience")}
              className="mb-5"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
              <div className="flex flex-col gap-1">
                <label
                  htmlFor="channel"
                  className="text-caption font-medium text-text-heading font-inter"
                >
                  Acquisition Channel
                </label>
                <select
                  id="channel"
                  value={form.channel}
                  onChange={update("channel")}
                  className="w-full rounded-md border border-border-subtle bg-surface-white text-sm text-text-body font-inter min-h-[44px] px-3 focus:outline-none focus:border-brand-black focus:ring-1 focus:ring-brand-black transition-all"
                >
                  {CHANNELS.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </div>
              <Input
                id="metrics"
                label="Growth Metrics Tracked"
                placeholder="e.g. CAC, LTV, Churn"
                value={form.metrics}
                onChange={update("metrics")}
              />
            </div>

            <div className="flex flex-col gap-1 mb-5">
              <label
                htmlFor="activities"
                className="text-caption font-medium text-text-heading font-inter"
              >
                Marketing Activities
              </label>
              <textarea
                id="activities"
                rows={3}
                placeholder="Describe recent campaigns or experiments..."
                value={form.activities}
                onChange={update("activities")}
                className="w-full rounded-md border border-border-subtle bg-surface-white text-sm text-text-body font-inter p-3 focus:outline-none focus:border-brand-black focus:ring-1 focus:ring-brand-black transition-all"
              />
            </div>

            <div className="flex flex-col gap-1 mb-5">
              <label
                htmlFor="learnings"
                className="text-caption font-medium text-text-heading font-inter"
              >
                Key Learnings
              </label>
              <textarea
                id="learnings"
                rows={3}
                placeholder="What did the data reveal this week?"
                value={form.learnings}
                onChange={update("learnings")}
                className="w-full rounded-md border border-border-subtle bg-surface-white text-sm text-text-body font-inter p-3 focus:outline-none focus:border-brand-black focus:ring-1 focus:ring-brand-black transition-all"
              />
            </div>

            <div className="flex flex-col gap-1 mb-6">
              <label className="text-caption font-medium text-text-heading font-inter">
                Customer Testimonials (Optional)
              </label>
              <ComingSoon label="Upload Testimonials" position="top">
                <div className="border-2 border-dashed border-border-subtle rounded-lg p-6 flex flex-col items-center justify-center text-text-muted hover:border-brand-black transition-colors w-full">
                  <PlusCircle size={28} strokeWidth={2} className="mb-2" />
                  <p className="font-inter text-small">
                    Click to upload or drag &amp; drop testimonial screenshots
                  </p>
                </div>
              </ComingSoon>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-divider-line">
              <button
                type="button"
                onClick={handleSaveDraft}
                disabled={savingDraft}
                className="font-poppins font-semibold text-small text-text-heading hover:opacity-80 transition-opacity disabled:opacity-50"
              >
                {savingDraft ? "Saving..." : "Save Progress"}
              </button>

              <Link
                to="/build-startup/journey/traction/feedback-upload"
                className="inline-flex items-center justify-center gap-2 bg-action-bg text-action-text px-6 py-3 rounded-md hover:opacity-90 active:scale-[0.98] transition-all font-poppins font-semibold text-small"
              >
                Continue
                <ArrowRight size={16} strokeWidth={2} />
              </Link>
            </div>
          </section>
        </div>

        {/* Progress Timeline Sidebar */}
        <div className="space-y-6">
          <div className="bg-surface-white border border-border-subtle rounded-lg shadow-card p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-poppins font-semibold text-body text-text-heading">
                Recent Updates
              </h3>
              <ComingSoon label="View All" position="bottom" inline>
                <span className="flex items-center gap-1 font-inter text-caption text-text-muted">
                  View All <ChevronRight size={14} strokeWidth={2} />
                </span>
              </ComingSoon>
            </div>
            <div className="relative space-y-6 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-px before:bg-border-subtle">
              {UPDATES.map((item) => (
                <div key={item.date} className="relative pl-8">
                  <div className="absolute left-0 top-1.5 w-[23px] h-[23px] bg-canvas-bg border border-border-subtle rounded-full z-10 flex items-center justify-center">
                    <div
                      className={`w-2 h-2 rounded-full ${item.latest ? "bg-brand-black" : "bg-border-subtle"}`}
                    />
                  </div>
                  <p
                    className={`font-inter font-semibold text-caption ${item.latest ? "text-text-heading" : "text-text-muted"}`}
                  >
                    {item.date}
                  </p>
                  <p
                    className={`font-inter text-small mt-1 ${item.latest ? "font-semibold text-text-heading" : "text-text-body"}`}
                  >
                    {item.headline}
                  </p>
                  <p className="font-inter text-small text-text-muted mt-1 italic">
                    {item.note}
                  </p>
                  {item.tags && (
                    <div className="mt-2 flex gap-2">
                      {item.tags.map((tag) => (
                        <span
                          key={tag}
                          className="bg-canvas-bg px-2 py-0.5 rounded text-[10px] text-text-muted font-inter"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-brand-black rounded-lg p-6 text-white">
            <div className="flex items-start gap-3">
              <Info size={18} strokeWidth={2} className="shrink-0 mt-0.5" />
              <div>
                <p className="font-poppins font-semibold text-small mb-1">
                  Growth Tip
                </p>
                <p className="font-inter text-small text-white/70">
                  Consistent weekly tracking is key to noticing micro-trends
                  before they become macro-problems. Aim for at least 3 customer
                  interviews this week.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
