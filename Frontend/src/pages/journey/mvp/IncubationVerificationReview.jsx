import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ChevronRight,
  Check,
  FileText,
  Receipt,
  Info,
  AlertTriangle,
} from "lucide-react";
import DashboardShell from "@/components/dashboard/DashboardShell";
import Button from "@/components/ui/Button";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import {
  getIncubationVerificationStatus,
  getIncubationVerificationTimeline,
  getIncubationVerificationDocuments,
} from "@/api/startup/incubationApi";

const STEPS = [
  { label: "Proof Uploaded", status: "done" },
  { label: "Under Review", status: "current" },
  { label: "Verification Approved", status: "upcoming" },
  { label: "Traction Unlocked", status: "upcoming" },
];

const SUMMARY = [
  { label: "Startup Name", value: "Nexus AI Systems" },
  { label: "Incubator Name", value: "Silicon Valley Hub" },
  { label: "Incubation Program", value: "Q3 Winter Cohort 2024" },
  { label: "Submission Date", value: "Oct 12, 2023" },
  { label: "Estimated Time", value: "2–3 Business Days" },
];

const DOCUMENTS = [
  { icon: FileText, name: "Incubation_Letter_Nexus.pdf", date: "Oct 12, 2023" },
  {
    icon: Receipt,
    name: "Program_Completion_Certificate.pdf",
    date: "Oct 12, 2023",
  },
];

const TIMELINE = [
  { label: "Documents Submitted", date: "Oct 12, 14:30 PM", status: "done" },
  { label: "Under Review", date: "Oct 13, 09:15 AM", status: "current" },
  { label: "Verification Result", date: "Pending", status: "upcoming" },
  { label: "Stage 4 Unlocked", date: "Pending", status: "upcoming" },
];

export default function IncubationVerificationReviewPage() {
  useDocumentTitle("Incubation Verification — BOCC");

  const [statusData, setStatusData] = useState(null);
  const [timeline, setTimeline] = useState(TIMELINE);
  const [documents, setDocuments] = useState(DOCUMENTS);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [statusRes, timelineRes, docsRes] = await Promise.all([
          getIncubationVerificationStatus().catch(() => null),
          getIncubationVerificationTimeline().catch(() => null),
          getIncubationVerificationDocuments().catch(() => null),
        ]);

        if (statusRes?.data) setStatusData(statusRes.data);
        if (timelineRes?.data) setTimeline(timelineRes.data);
        if (docsRes?.data) setDocuments(docsRes.data);
      } catch (err) {
        console.error("Error fetching incubation verification details", err);
        setErrorMsg(
          err?.response?.data?.message ||
            err?.message ||
            "Failed to load verification details.",
        );
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <DashboardShell pageId="incubation-verification-review">
        <div className="p-8 text-center text-text-muted">
          Loading verification details...
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell pageId="incubation-verification-review">
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
          Incubation Verification
        </span>
      </nav>

      <div className="mb-10">
        <h1 className="font-poppins font-semibold text-page text-text-heading mb-2">
          Incubation Verification
        </h1>
        <p className="font-inter text-body text-text-body max-w-2xl">
          Your incubation documents have been submitted successfully and are
          currently being reviewed by the BOCC team. Once verification is
          complete, you will unlock the Traction stage.
        </p>
      </div>

      {errorMsg && (
        <div className="mb-6 p-3 bg-error/15 border border-error/30 text-error rounded-md text-small flex items-center gap-2 max-w-2xl">
          <AlertTriangle size={16} className="shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <div className="mb-10 border border-border-subtle bg-surface-white p-8 rounded-lg relative">
        <div className="absolute top-1/2 left-8 right-8 h-px bg-border-subtle -translate-y-1/2 z-0" />
        <div className="relative flex justify-between items-center w-full">
          {STEPS.map((step) => (
            <div
              key={step.label}
              className="relative z-10 flex flex-col items-center gap-3 bg-surface-white px-2"
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  step.status === "done"
                    ? "bg-brand-black text-white"
                    : step.status === "current"
                      ? "border-2 border-brand-black bg-surface-white"
                      : "border-2 border-border-subtle bg-surface-white"
                }`}
              >
                {step.status === "done" && <Check size={18} strokeWidth={2} />}
                {step.status === "current" && (
                  <span className="w-3 h-3 rounded-full bg-brand-black" />
                )}
              </div>
              <span
                className={`font-inter text-caption text-center ${
                  step.status === "upcoming"
                    ? "text-text-muted opacity-50"
                    : "font-semibold text-text-heading"
                }`}
              >
                {step.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-6">
          <section className="bg-surface-white border border-border-subtle rounded-lg p-8">
            <h3 className="font-poppins font-semibold text-body text-text-heading mb-6">
              Verification Summary
            </h3>
            <div className="grid grid-cols-2 gap-y-6 gap-x-12">
              {SUMMARY.map(({ label, value }) => (
                <div key={label}>
                  <p className="font-inter text-caption text-text-muted uppercase tracking-wider mb-1">
                    {label}
                  </p>
                  <p className="font-inter font-semibold text-small text-text-heading">
                    {value}
                  </p>
                </div>
              ))}
              <div>
                <p className="font-inter text-caption text-text-muted uppercase tracking-wider mb-1">
                  Current Status
                </p>
                <span className="inline-flex items-center px-3 py-1 bg-canvas-bg rounded-full font-inter text-caption border border-border-subtle">
                  <span className="w-2 h-2 rounded-full bg-text-muted mr-2" />
                  {statusData?.status || "Under Review"}
                </span>
              </div>
            </div>
          </section>

          <section className="bg-surface-white border border-border-subtle rounded-lg overflow-hidden">
            <div className="p-8 border-b border-border-subtle">
              <h3 className="font-poppins font-semibold text-body text-text-heading">
                Uploaded Documents
              </h3>
            </div>
            <table className="w-full text-left">
              <thead>
                <tr className="bg-canvas-bg border-b border-border-subtle">
                  <th className="px-8 py-4 font-inter text-caption text-text-muted uppercase">
                    Document Name
                  </th>
                  <th className="px-8 py-4 font-inter text-caption text-text-muted uppercase">
                    Upload Date
                  </th>
                  <th className="px-8 py-4 font-inter text-caption text-text-muted uppercase">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle">
                {documents.map(({ icon: Icon, name, date }) => {
                  const DocIcon = Icon || FileText;
                  return (
                    <tr
                      key={name}
                      className="hover:bg-canvas-bg transition-colors"
                    >
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-3">
                          <DocIcon
                            size={18}
                            strokeWidth={2}
                            className="text-text-muted"
                          />
                          <span className="font-inter text-small text-text-body">
                            {name}
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-5 font-inter text-small text-text-muted">
                        {date}
                      </td>
                      <td className="px-8 py-5">
                        <span className="font-inter text-caption text-text-muted italic">
                          Pending Verification
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </section>

          <section className="bg-canvas-bg border border-border-subtle rounded-lg p-8 flex gap-6">
            <div className="p-3 bg-surface-white border border-border-subtle rounded-lg h-fit shrink-0">
              <Info size={20} strokeWidth={2} className="text-text-heading" />
            </div>
            <div>
              <h4 className="font-poppins font-semibold text-body text-text-heading mb-2">
                Important Information
              </h4>
              <p className="font-inter text-small text-text-muted mb-4">
                The verification process ensures all milestone documentation
                meets BOCC standards for stage progression.
              </p>
              <ul className="space-y-2 font-inter text-small text-text-muted list-disc pl-5">
                <li>
                  All uploaded documents are currently locked for editing.
                </li>
                <li>
                  The Traction stage and its specific features will remain
                  inaccessible.
                </li>
                <li>
                  You will receive an email notification once the reviewer has
                  reached a decision.
                </li>
              </ul>
            </div>
          </section>

          <div className="flex items-center gap-4 pt-4">
            <Button>View Uploaded Documents</Button>
            <Link to="/dashboard">
              <Button variant="outline">Return to Dashboard</Button>
            </Link>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <div className="bg-surface-white border border-border-subtle rounded-lg p-6">
            <h3 className="font-inter font-semibold text-caption text-text-muted uppercase tracking-wider mb-6">
              Verification Timeline
            </h3>
            <div className="space-y-8 relative">
              <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-border-subtle" />
              {timeline.map((item) => (
                <div
                  key={item.label}
                  className={`relative flex gap-4 ${item.status === "upcoming" ? "opacity-40" : ""}`}
                >
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center z-10 shrink-0 ${
                      item.status === "done"
                        ? "bg-brand-black"
                        : item.status === "current"
                          ? "bg-surface-white border-2 border-brand-black"
                          : "bg-surface-white border-2 border-border-subtle"
                    }`}
                  >
                    {item.status === "done" && (
                      <Check size={14} strokeWidth={2} className="text-white" />
                    )}
                    {item.status === "current" && (
                      <span className="w-2 h-2 rounded-full bg-brand-black" />
                    )}
                  </div>
                  <div>
                    <p
                      className={`font-inter text-small ${item.status === "upcoming" ? "text-text-body" : "font-semibold text-text-heading"}`}
                    >
                      {item.label}
                    </p>
                    <p className="font-inter text-caption text-text-muted">
                      {item.date}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-surface-white border-2 border-brand-black rounded-lg p-6">
            <div className="flex items-start gap-3">
              <AlertTriangle
                size={20}
                strokeWidth={2}
                className="text-text-heading shrink-0"
              />
              <div>
                <p className="font-inter font-semibold text-caption text-text-heading uppercase mb-2">
                  Attention Required
                </p>
                <p className="font-inter text-small text-text-muted leading-relaxed">
                  If the verification team finds discrepancies or requires
                  additional information, the submission will be rejected. You
                  will then be required to resubmit all necessary documentation.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
