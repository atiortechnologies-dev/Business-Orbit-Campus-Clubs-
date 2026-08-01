import { useState } from "react";
import { Link } from "react-router-dom";
import {
  _CheckCircle2,
  Download,
  ExternalLink,
  Info,
  ChevronRight,
  ArrowRight,
} from "lucide-react";
import DashboardShell from "@/components/dashboard/DashboardShell";
import ComingSoon from "@/components/ui/ComingSoon";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

const CHECKLIST_ITEMS = [
  {
    key: "research",
    title: "Conduct primary research",
    desc: "Define target audience and prepare interview scripts.",
  },
  {
    key: "surveys",
    title: "Reach 100 survey responses",
    desc: "Collect quantitative data to support your problem statement.",
  },
  {
    key: "fit",
    title: "Validate problem/solution fit",
    desc: "Analyze data to confirm if your solution solves the actual pain point.",
  },
  {
    key: "evidence",
    title: "Upload raw evidence",
    desc: "Submit interview recordings, transcripts, or survey raw data.",
  },
  {
    key: "report",
    title: "Submit final validation report",
    desc: "Compile findings into the standard BOCC template.",
  },
];

const RESOURCES = [
  { title: "Survey Template", meta: "PDF · 1.2 MB", icon: Download },
  { title: "Validation Guide", meta: "DOCX · 4.5 MB", icon: Download },
  { title: "Best Practices", meta: "Link · Web", icon: ExternalLink },
];

export default function ValidationOverviewPage() {
  useDocumentTitle("Stage 2: Validation — BOCC");
  const [checked, setChecked] = useState({ research: true });

  const toggle = (key) =>
    setChecked((prev) => ({ ...prev, [key]: !prev[key] }));
  const completedCount = CHECKLIST_ITEMS.filter(
    (item) => checked[item.key],
  ).length;
  const percent = Math.round((completedCount / CHECKLIST_ITEMS.length) * 100);

  return (
    <DashboardShell pageId="validation-overview">
      <nav className="mb-2 flex items-center gap-2 text-text-muted font-inter font-normal text-small">
        <Link
          to="/dashboard"
          className="hover:text-text-heading transition-colors"
        >
          Dashboard
        </Link>
        <ChevronRight size={14} strokeWidth={2} />
        <Link
          to="/build-startup/journey"
          className="hover:text-text-heading transition-colors"
        >
          Startup Journey
        </Link>
        <ChevronRight size={14} strokeWidth={2} />
        <span className="text-text-heading font-semibold">Validation</span>
      </nav>

      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-8">
        <div>
          <h1 className="font-poppins font-semibold text-page text-text-heading mb-1">
            Validation Overview
          </h1>
          <p className="font-inter text-body text-text-body max-w-xl">
            Testing your hypothesis through direct market engagement and data
            collection.
          </p>
        </div>
        <div className="text-right shrink-0">
          <p className="font-inter text-caption text-text-muted uppercase tracking-wider">
            Estimated Duration
          </p>
          <p className="font-poppins font-semibold text-card text-text-heading">
            3–4 Weeks
          </p>
        </div>
      </div>

      <div className="bg-surface-white border border-border-subtle rounded-lg shadow-card p-5 mb-8">
        <div className="flex items-center justify-between mb-2">
          <p className="font-inter font-semibold text-caption text-text-muted uppercase tracking-wider">
            Stage 2 of 5: Validation
          </p>
          <p className="font-poppins font-semibold text-small text-text-heading">
            {percent}% Complete
          </p>
        </div>
        <div className="h-2 bg-canvas-bg rounded-full overflow-hidden">
          <div
            className="h-full bg-brand-black rounded-full transition-all"
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 bg-surface-white border border-border-subtle rounded-lg shadow-card p-6">
          <h3 className="font-poppins font-semibold text-body text-text-heading mb-4">
            Action Checklist
          </h3>
          <div className="space-y-3">
            {CHECKLIST_ITEMS.map(({ key, title, desc }) => (
              <label
                key={key}
                className="flex items-start gap-3 border border-border-subtle rounded-lg p-4 cursor-pointer hover:border-text-muted transition-colors"
              >
                <input
                  type="checkbox"
                  checked={!!checked[key]}
                  onChange={() => toggle(key)}
                  className="w-4 h-4 mt-0.5 accent-brand-black shrink-0"
                />
                <div>
                  <p
                    className={`font-poppins font-semibold text-small ${checked[key] ? "text-text-muted line-through" : "text-text-heading"}`}
                  >
                    {title}
                  </p>
                  <p className="font-inter text-small text-text-muted mt-0.5">
                    {desc}
                  </p>
                </div>
              </label>
            ))}
          </div>

          <Link
            to="/build-startup/journey/validation/survey-tracker"
            className="inline-flex items-center gap-2 bg-action-bg text-action-text px-6 py-2.5 rounded-md hover:opacity-90 active:scale-[0.98] transition-all font-poppins font-semibold text-small mt-6"
          >
            Start Validation
            <ArrowRight size={16} strokeWidth={2} />
          </Link>
        </div>

        <div className="lg:col-span-4 space-y-4">
          <div>
            <p className="font-inter font-semibold text-caption text-text-muted uppercase tracking-wider mb-3">
              Required Resources
            </p>
            <div className="space-y-3">
              {RESOURCES.map(({ title, meta, icon: Icon }) => (
                <ComingSoon
                  key={title}
                  label={title}
                  position="left"
                  className="flex items-center gap-3 bg-surface-white border border-border-subtle rounded-lg shadow-card p-4 w-full"
                >
                  <div className="w-9 h-9 rounded-md bg-canvas-bg border border-border-subtle flex items-center justify-center shrink-0" />
                  <div className="min-w-0 flex-1 text-left">
                    <p className="font-poppins font-semibold text-small text-text-heading truncate">
                      {title}
                    </p>
                    <p className="font-inter text-caption text-text-muted">
                      {meta}
                    </p>
                  </div>
                  <Icon
                    size={16}
                    strokeWidth={2}
                    className="text-text-muted shrink-0"
                  />
                </ComingSoon>
              ))}
            </div>
          </div>

          <div className="bg-canvas-bg border border-border-subtle rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Info size={16} strokeWidth={2} className="text-text-muted" />
              <p className="font-inter font-semibold text-caption text-text-muted uppercase tracking-wider">
                Mentor Tip
              </p>
            </div>
            <p className="font-inter text-small text-text-body italic">
              "Don't lead the witness. Ask open-ended questions during your
              interviews to uncover genuine pain points."
            </p>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
