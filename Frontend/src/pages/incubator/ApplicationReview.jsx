import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Printer,
  CheckCircle,
  FileText,
  TrendingUp,
  Download,
  AlertCircle,
} from "lucide-react";
import IncubatorShell from "@/components/incubator/IncubatorShell";
import ComingSoon from "@/components/ui/ComingSoon";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import api from "@/api/axiosInstance";

export default function ApplicationReview() {
  useDocumentTitle("Application Review — BOCC Incubator Portal");
  const [notes, setNotes] = useState("");
  const [selectedDecision, setSelectedDecision] = useState(null); // 'approve' | 'revisions' | 'reject'
  const [draftSaved, setDraftSaved] = useState(false);
  const [decisionSubmitted, setDecisionSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (draftSaved) {
      const timer = setTimeout(() => setDraftSaved(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [draftSaved]);

  useEffect(() => {
    if (decisionSubmitted) {
      const timer = setTimeout(() => setDecisionSubmitted(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [decisionSubmitted]);

  return (
    <IncubatorShell>
      <div className="mb-6 flex items-center justify-between">
        <Link
          to="/incubator/applications"
          className="flex items-center gap-2 text-text-muted hover:text-text-heading font-poppins font-semibold text-small transition-all"
        >
          <ArrowLeft size={16} strokeWidth={2} />
          Back to Queue
        </Link>
      </div>

      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-12 lg:col-span-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div>
              <h1 className="font-poppins font-bold text-section text-text-heading mb-2">
                NeuralPath AI
              </h1>
              <div className="flex flex-wrap items-center gap-2">
                <span className="bg-canvas-bg text-text-heading px-3 py-1 rounded-full font-poppins font-semibold text-caption border border-border-subtle">
                  App ID: #2024-089
                </span>
                <span className="bg-action-bg text-action-text px-3 py-1 rounded-full font-poppins font-bold text-caption uppercase select-none">
                  Under Review
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => window.print()}
              className="bg-surface-white border border-border-subtle px-4 py-2.5 rounded-lg font-poppins font-semibold text-small text-text-heading flex items-center gap-2 hover:bg-canvas-bg cursor-pointer transition-colors"
            >
              <Printer size={16} strokeWidth={2} />
              Print PDF
            </button>
          </div>

          <section className="bg-surface-white border border-border-subtle rounded-xl p-6 shadow-card transition-colors duration-150 ease-linear">
            <h3 className="font-poppins font-semibold text-caption text-text-muted uppercase tracking-wider mb-4">
              Application Overview
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="flex flex-col gap-0.5">
                <span className="font-poppins font-semibold text-[11px] leading-[16px] text-text-muted uppercase">
                  Lead Founder
                </span>
                <span className="font-inter text-small font-semibold text-text-heading">
                  Elena Rodriguez
                </span>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="font-poppins font-semibold text-[11px] leading-[16px] text-text-muted uppercase">
                  University/College
                </span>
                <span className="font-inter text-small font-semibold text-text-heading truncate">
                  School of Engineering
                </span>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="font-poppins font-semibold text-[11px] leading-[16px] text-text-muted uppercase">
                  Stage
                </span>
                <span className="font-inter text-small font-semibold text-text-heading">
                  Pre-Seed / Prototype
                </span>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="font-poppins font-semibold text-[11px] leading-[16px] text-text-muted uppercase">
                  Industry
                </span>
                <span className="font-inter text-small font-semibold text-text-heading">
                  HealthTech / AI
                </span>
              </div>
            </div>
          </section>

          <section className="bg-surface-white border border-border-subtle rounded-xl p-6 shadow-card transition-colors duration-150 ease-linear">
            <h3 className="font-poppins font-bold text-card text-text-heading mb-3">
              Problem Statement
            </h3>
            <div className="font-inter text-body text-text-body space-y-4">
              <p>
                Currently, diagnostic radiology experiences a 30% bottleneck due
                to high volumes of routine screening scans. Radiologists spend
                significant time on baseline assessments, leading to burnout and
                delayed results for critical cases.
              </p>
              <p>
                Small to mid-sized clinical practices lack the budget for
                high-end enterprise AI suites, creating a gap in quality care
                for suburban and rural healthcare providers.
              </p>
            </div>
          </section>

          <section className="bg-surface-white border border-border-subtle rounded-xl p-6 shadow-card transition-colors duration-150 ease-linear">
            <h3 className="font-poppins font-bold text-card text-text-heading mb-3">
              Solution Overview
            </h3>
            <div className="font-inter text-body text-text-body">
              <p>
                NeuralPath AI is a lightweight, edge-computing based diagnostic
                assistant designed for cost-effective integration. We provide a
                'First-Pass' analysis layer that flags potential anomalies and
                organizes queue priority based on severity detected in
                real-time. Our proprietary model reduces initial scan review
                time by 45%.
              </p>
            </div>
          </section>

          <section className="bg-surface-white border border-border-subtle rounded-xl p-6 shadow-card transition-colors duration-150 ease-linear">
            <h3 className="font-poppins font-bold text-card text-text-heading mb-4">
              Validation &amp; MVP
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <CheckCircle
                  size={18}
                  className="text-success mt-0.5 flex-shrink-0"
                />
                <span className="font-inter text-small text-text-body">
                  MVP successfully piloted at City General Hospital with 5,000
                  anonymized datasets.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle
                  size={18}
                  className="text-success mt-0.5 flex-shrink-0"
                />
                <span className="font-inter text-small text-text-body">
                  92% accuracy in identifying stage-1 pulmonary nodules vs. 84%
                  industry average.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle
                  size={18}
                  className="text-success mt-0.5 flex-shrink-0"
                />
                <span className="font-inter text-small text-text-body">
                  Signed LOIs from 3 regional clinics for beta phase testing
                  starting Q3 2024.
                </span>
              </li>
            </ul>
          </section>

          <section className="bg-surface-white border border-border-subtle rounded-xl p-6 shadow-card transition-colors duration-150 ease-linear">
            <h3 className="font-poppins font-bold text-card text-text-heading mb-4">
              Supporting Documents
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ComingSoon
                label="Download Pitch Deck"
                position="top"
                inline={false}
              >
                <div className="flex items-center justify-between p-4 border border-border-subtle rounded-lg hover:bg-canvas-bg cursor-pointer transition-colors w-full">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-canvas-bg rounded flex items-center justify-center text-text-muted">
                      <FileText size={20} strokeWidth={2} />
                    </div>
                    <div className="flex flex-col text-left">
                      <span className="font-poppins font-semibold text-small text-text-heading">
                        Pitch Deck
                      </span>
                      <span className="font-inter text-xs text-text-muted">
                        PDF · 4.2 MB
                      </span>
                    </div>
                  </div>
                  <Download size={18} className="text-text-muted" />
                </div>
              </ComingSoon>

              <ComingSoon
                label="Download Financial Model"
                position="top"
                inline={false}
              >
                <div className="flex items-center justify-between p-4 border border-border-subtle rounded-lg hover:bg-canvas-bg cursor-pointer transition-colors w-full">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-canvas-bg rounded flex items-center justify-center text-text-muted">
                      <TrendingUp size={20} strokeWidth={2} />
                    </div>
                    <div className="flex flex-col text-left">
                      <span className="font-poppins font-semibold text-small text-text-heading">
                        Financial Model
                      </span>
                      <span className="font-inter text-xs text-text-muted">
                        XLSX · 1.8 MB
                      </span>
                    </div>
                  </div>
                  <Download size={18} className="text-text-muted" />
                </div>
              </ComingSoon>
            </div>
          </section>
        </div>

        <div className="col-span-12 lg:col-span-4 space-y-6">
          <div className="bg-surface-white border-2 border-brand-black dark:border-border-subtle rounded-xl p-6 shadow-card flex flex-col gap-6 transition-colors duration-150 ease-linear">
            <div>
              <h3 className="font-poppins font-bold text-card text-text-heading mb-1">
                Reviewer Decision
              </h3>
              <p className="font-inter text-small text-text-muted">
                Record your evaluation notes and final verdict below.
              </p>
            </div>

            {errorMsg && (
              <div className="p-3 bg-error/15 border border-error/30 text-error rounded-md text-small flex items-center gap-2">
                <AlertCircle size={16} className="shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div className="flex flex-col gap-2">
              <label className="font-poppins font-semibold text-small text-text-heading">
                Reviewer Notes
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full bg-canvas-bg border border-border-subtle rounded-lg p-3 font-inter text-small text-text-body focus:outline-none focus:ring-1 focus:ring-brand-black transition-all resize-none"
                placeholder="Add observations on team composition, market fit, or technical viability..."
                rows={6}
              />
            </div>

            <div className="flex flex-col gap-3">
              <button
                type="button"
                onClick={() => setSelectedDecision("approve")}
                className={`w-full py-2.5 rounded-lg font-poppins font-semibold text-small transition-all flex items-center justify-center gap-2 border ${
                  selectedDecision === "approve"
                    ? "bg-action-bg text-action-text border-brand-black"
                    : "bg-canvas-bg text-text-heading border-border-subtle hover:bg-canvas-bg/80"
                }`}
              >
                Approve for Incubation
              </button>

              <button
                type="button"
                onClick={() => setSelectedDecision("revisions")}
                className={`w-full py-2.5 rounded-lg font-poppins font-semibold text-small transition-all flex items-center justify-center gap-2 border ${
                  selectedDecision === "revisions"
                    ? "bg-action-bg text-action-text border-brand-black"
                    : "bg-canvas-bg text-text-heading border-border-subtle hover:bg-canvas-bg/80"
                }`}
              >
                Request Revisions
              </button>

              <button
                type="button"
                onClick={() => setSelectedDecision("reject")}
                className={`w-full py-2.5 rounded-lg font-poppins font-semibold text-small transition-all flex items-center justify-center gap-2 border ${
                  selectedDecision === "reject"
                    ? "bg-error text-white border-error"
                    : "bg-transparent text-error border-transparent hover:bg-error/10"
                }`}
              >
                Reject Application
              </button>
            </div>

            <div className="border-t border-divider-line pt-4 flex items-center justify-between">
              <button
                type="button"
                disabled={!notes.trim()}
                onClick={() => {
                  if (notes.trim()) {
                    setErrorMsg("");
                    api
                      .post("/notes", { entityId: "app-2024-089", text: notes })
                      .then(() => setDraftSaved(true))
                      .catch((err) => {
                        console.error("Failed to save notes:", err);
                        setErrorMsg(
                          err?.response?.data?.message ||
                            err?.message ||
                            "Failed to save notes.",
                        );
                      });
                  }
                }}
                className="text-text-muted hover:text-text-heading font-poppins font-semibold text-small transition-colors focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Save Draft
              </button>

              <button
                type="button"
                disabled={!selectedDecision}
                onClick={async () => {
                  setErrorMsg("");
                  try {
                    await api.post(
                      "/incubators/applications/app-2024-089/decision",
                      {
                        decision: selectedDecision,
                        reviewerNotes: notes,
                      },
                    );
                    setDecisionSubmitted(true);
                  } catch (err) {
                    console.error("Failed to submit decision:", err);
                    setErrorMsg(
                      err?.response?.data?.message ||
                        err?.message ||
                        "Failed to submit decision.",
                    );
                  }
                }}
                className={`px-5 py-2.5 rounded-md font-poppins font-semibold text-small transition-all ${
                  selectedDecision
                    ? "bg-action-bg text-action-text hover:opacity-90 active:scale-[0.98] cursor-pointer"
                    : "bg-canvas-bg text-text-muted cursor-not-allowed"
                }`}
              >
                Submit Decision
              </button>
            </div>

            <div
              className={`text-center font-inter text-small text-success mt-2 select-none transition-opacity duration-150 ${draftSaved ? "opacity-100" : "opacity-0"}`}
              aria-live="polite"
            >
              Draft saved
            </div>

            {decisionSubmitted && (
              <div className="p-3 bg-canvas-bg border border-border-subtle rounded-lg flex items-center gap-2 text-text-heading animate-fade-in">
                <AlertCircle size={18} className="text-success flex-shrink-0" />
                <span className="font-inter text-xs">Decision Submitted</span>
              </div>
            )}
          </div>

          <div className="bg-canvas-bg rounded-xl p-6 border border-border-subtle transition-colors duration-150 ease-linear">
            <h4 className="font-poppins font-semibold text-caption text-text-muted uppercase tracking-widest mb-4">
              Application Timeline
            </h4>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="mt-1.5 w-2 h-2 rounded-full bg-text-muted flex-shrink-0"></div>
                <div className="flex flex-col">
                  <span className="font-poppins font-semibold text-small text-text-heading">
                    Submitted
                  </span>
                  <span className="font-inter text-xs text-text-muted">
                    May 12, 2024 · 09:14 AM
                  </span>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="mt-1.5 w-2 h-2 rounded-full bg-text-muted flex-shrink-0"></div>
                <div className="flex flex-col">
                  <span className="font-poppins font-semibold text-small text-text-heading">
                    Screening Passed
                  </span>
                  <span className="font-inter text-xs text-text-muted">
                    May 15, 2024 · 02:30 PM
                  </span>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="mt-1.5 w-2 h-2 rounded-full bg-brand-black dark:bg-white flex-shrink-0 ring-4 ring-brand-black/10 dark:ring-white/10"></div>
                <div className="flex flex-col">
                  <span className="font-poppins font-bold text-small text-text-heading">
                    Review Started
                  </span>
                  <span className="font-inter text-xs text-text-muted">
                    Currently active
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </IncubatorShell>
  );
}
