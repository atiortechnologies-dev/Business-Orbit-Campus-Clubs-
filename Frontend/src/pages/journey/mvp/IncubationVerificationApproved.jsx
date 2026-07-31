import { Link } from "react-router-dom";
import {
  ChevronRight,
  Check,
  BadgeCheck,
  Calendar,
  Lock,
  ArrowRight,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import DashboardShell from "@/components/dashboard/DashboardShell";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

const STEPS = [
  "Step 1: Incubation Proof Uploaded",
  "Step 2: Verification Under Review",
  "Step 3: Verification Approved",
  "Step 4: Stage 4 Unlocked",
];

const SUMMARY = [
  { label: "Startup Name", value: "Nexus AI Systems" },
  { label: "Incubator Name", value: "Silicon Valley Hub" },
  { label: "Program Name", value: "Q3 Winter Cohort 2024" },
  { label: "Verification Date", value: "Nov 05, 2023" },
  { label: "Verified By", value: "Dr. Sarah Jenkins", span: true },
];

const DELIVERABLES = ["User metrics", "Customer feedback", "Updated product"];

const JOURNEY = [
  { label: "Ideation", status: "Done", done: true },
  { label: "Validation", status: "Done", done: true },
  { label: "MVP/Prototype", status: "Done", done: true },
  { label: "Traction", status: "Unlocked/Active", current: true },
  { label: "Launch", status: "Locked", locked: true },
];

const ACHIEVEMENTS = [
  "Incubation Verified",
  "Stage 3 Completed",
  "Traction Stage Available",
];

const MILESTONES = ["MVP Approved", "Incubation Verified", "Stage 4 Unlocked"];

export default function IncubationVerificationApprovedPage() {
  useDocumentTitle("Incubation Verified — BOCC");

  return (
    <DashboardShell pageId="incubation-verification-approved">
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
        <span className="text-text-heading font-semibold">
          Verification Approved
        </span>
      </nav>

      <div className="mb-8">
        <h1 className="font-poppins font-semibold text-page text-text-heading mb-2">
          Congratulations!
        </h1>
        <p className="font-inter text-body text-text-body max-w-2xl">
          <span className="font-semibold text-text-heading">
            Incubation Successfully Verified.
          </span>{" "}
          Your incubation documents have been verified successfully by the BOCC
          team. You can now begin the Traction stage of your startup journey.
        </p>
      </div>

      <div className="mb-8">
        <Link
          to="/build-startup/journey/traction"
          className="inline-flex items-center gap-2 px-8 py-4 bg-brand-black text-white font-poppins font-semibold rounded-lg hover:opacity-90 transition-all"
        >
          Start Traction Stage
          <ArrowRight size={18} strokeWidth={2} />
        </Link>
      </div>

      <div className="mb-10 bg-surface-white border border-border-subtle p-8 rounded-lg relative">
        <div className="absolute top-5 left-8 right-8 h-0.5 bg-brand-black z-0" />
        <div className="relative flex items-center justify-between">
          {STEPS.map((label) => (
            <div
              key={label}
              className="relative z-10 flex flex-col items-center"
            >
              <div className="w-10 h-10 rounded-full bg-brand-black text-white flex items-center justify-center border-4 border-surface-white">
                <Check size={18} strokeWidth={2} />
              </div>
              <span className="mt-3 font-inter text-caption text-text-heading text-center whitespace-pre-line">
                {label.replace(": ", ":\n")}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-6">
          <section className="bg-surface-white border border-border-subtle rounded-lg p-8">
            <div className="flex justify-between items-start mb-6">
              <h3 className="font-poppins font-semibold text-body text-text-heading">
                Verification Summary
              </h3>
              <span className="bg-brand-black text-white px-4 py-1.5 rounded-full font-inter text-caption font-semibold flex items-center gap-2">
                <BadgeCheck size={14} strokeWidth={2} />
                Verified
              </span>
            </div>
            <div className="grid grid-cols-2 gap-y-6 gap-x-12">
              {SUMMARY.map(({ label, value, span }) => (
                <div key={label} className={span ? "col-span-2" : ""}>
                  <p className="font-inter text-caption text-text-muted uppercase tracking-wider mb-1">
                    {label}
                  </p>
                  <p className="font-inter font-semibold text-small text-text-heading">
                    {value}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-surface-white border border-border-subtle rounded-lg p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4">
              <span className="font-inter text-caption bg-canvas-bg text-text-heading px-3 py-1 rounded border border-border-subtle">
                Next Stage
              </span>
            </div>
            <h3 className="font-poppins font-semibold text-body text-text-heading mb-6">
              Stage 4 – Traction
            </h3>
            <div className="space-y-6">
              <div>
                <p className="font-inter text-caption text-text-muted uppercase tracking-wider mb-2">
                  Stage Objective
                </p>
                <p className="font-inter text-small text-text-heading">
                  Market entry and user acquisition
                </p>
              </div>
              <div>
                <p className="font-inter text-caption text-text-muted uppercase tracking-wider mb-2">
                  Key Deliverables
                </p>
                <div className="flex flex-wrap gap-2">
                  {DELIVERABLES.map((d) => (
                    <span
                      key={d}
                      className="px-3 py-1 bg-canvas-bg font-inter text-small rounded border border-border-subtle"
                    >
                      {d}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <p className="font-inter text-caption text-text-muted uppercase tracking-wider mb-2">
                  Expected Timeline
                </p>
                <p className="font-inter text-small text-text-heading flex items-center gap-2">
                  <Calendar size={18} strokeWidth={2} />
                  12 weeks
                </p>
              </div>
            </div>
          </section>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <div className="bg-surface-white border border-border-subtle rounded-lg p-6">
            <h4 className="font-poppins font-semibold text-body text-text-heading mb-6">
              Startup Journey
            </h4>
            <div className="space-y-6">
              {JOURNEY.map((stage, i) => {
                const isLast = i === JOURNEY.length - 1;
                return (
                  <div key={stage.label} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                          stage.done
                            ? "border-2 border-brand-black bg-brand-black text-white"
                            : stage.current
                              ? "border-2 border-brand-black bg-surface-white"
                              : "border-2 border-border-subtle bg-canvas-bg"
                        }`}
                      >
                        {stage.done && <Check size={14} strokeWidth={2} />}
                        {stage.current && (
                          <span className="w-2.5 h-2.5 rounded-full bg-brand-black" />
                        )}
                        {stage.locked && (
                          <Lock
                            size={12}
                            strokeWidth={2}
                            className="text-text-muted"
                          />
                        )}
                      </div>
                      {!isLast && (
                        <div
                          className={`w-0.5 h-10 mt-1 ${stage.done ? "bg-brand-black" : "bg-border-subtle"}`}
                        />
                      )}
                    </div>
                    <div>
                      <p
                        className={`font-inter font-semibold text-small ${stage.locked ? "text-text-muted" : "text-text-heading"}`}
                      >
                        {stage.label}
                      </p>
                      <p
                        className={`font-inter text-caption ${stage.current ? "text-text-heading font-semibold" : "text-text-muted"}`}
                      >
                        {stage.status}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-brand-black text-white rounded-lg p-8 relative overflow-hidden">
            <div className="relative z-10">
              <Sparkles size={32} strokeWidth={2} className="mb-4" />
              <h4 className="font-poppins font-semibold text-body mb-4">
                Achievements Unlocked
              </h4>
              <ul className="space-y-2">
                {ACHIEVEMENTS.map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-2 font-inter text-caption"
                  >
                    <BadgeCheck size={16} strokeWidth={2} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-white opacity-10 rounded-full" />
          </div>

          <div className="bg-surface-white border border-border-subtle rounded-lg p-6">
            <h4 className="font-poppins font-semibold text-body text-text-heading mb-4">
              Milestones Completed
            </h4>
            <div className="space-y-3">
              {MILESTONES.map((item) => (
                <div
                  key={item}
                  className="flex items-center justify-between p-3 bg-canvas-bg rounded"
                >
                  <span className="font-inter text-small text-text-body">
                    {item}
                  </span>
                  <CheckCircle2
                    size={16}
                    strokeWidth={2}
                    className="text-brand-black"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
