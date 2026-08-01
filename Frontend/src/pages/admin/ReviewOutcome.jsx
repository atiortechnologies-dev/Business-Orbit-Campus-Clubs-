import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Leaf,
  CheckCircle,
  _Unlock,
  Lock,
  Star,
  Upload,
  Mail,
  Undo2,
  Info,
  PenLine,
  AlertCircle,
} from "lucide-react";
import AdminShell from "@/components/admin/AdminShell";
import Badge from "@/components/ui/Badge";
import ComingSoon from "@/components/ui/ComingSoon";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import api from "@/api/axiosInstance";

const TIMELINE = [
  { label: "Review Submitted", time: "Oct 12, 10:45 AM by Admin Sarah" },
  { label: "Technical Audit Cleared", time: "Oct 14, 02:15 PM · Score: 92%" },
  {
    label: "Milestone Unlocked: Traction",
    time: "Pending Publication. Notification queued.",
    current: true,
  },
];

export default function ReviewOutcomePage() {
  useDocumentTitle("Review Outcome: EcoLoop — BOCC Admin");
  const navigate = useNavigate();
  const [published, setPublished] = useState(false);
  const [revisions, setRevisions] = useState([
    { text: "Clarify revenue model for Q4 campus rollout.", done: true },
    { text: "Submit Letters of Intent from 3 campus vendors.", done: false },
  ]);
  const [errorMsg, setErrorMsg] = useState("");

  function toggleRevision(index) {
    setRevisions((prev) =>
      prev.map((r, i) => (i === index ? { ...r, done: !r.done } : r)),
    );
  }

  return (
    <AdminShell>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
        <section className="lg:col-span-8 bg-surface-white border border-border-subtle rounded-lg p-6 shadow-card flex flex-col sm:flex-row justify-between items-start gap-4">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-brand-black text-white flex items-center justify-center shrink-0">
                <Leaf size={22} strokeWidth={2} />
              </div>
              <div>
                <h1 className="font-poppins font-semibold text-card text-text-heading">
                  EcoLoop
                </h1>
                <p className="font-inter text-small text-text-muted">
                  Sustainable Logistics Infrastructure
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge variant="brand">
                <CheckCircle size={12} strokeWidth={2} /> Approved
              </Badge>
              <Badge variant="neutral">Series A Pathway</Badge>
            </div>
          </div>
          <div className="text-right shrink-0">
            <p className="font-inter text-caption text-text-muted uppercase mb-1">
              Final Score
            </p>
            <p
              className="font-poppins font-bold text-text-heading"
              style={{ fontSize: "40px", lineHeight: 1 }}
            >
              94
              <span className="text-section text-text-muted font-medium">
                /100
              </span>
            </p>
          </div>
        </section>

        <section className="lg:col-span-4 bg-surface-white border border-border-subtle rounded-lg p-6 shadow-card">
          <h3 className="font-inter font-semibold text-caption text-text-muted uppercase tracking-wider mb-6">
            Maturity Progress
          </h3>
          <div className="relative flex items-center justify-between mb-6">
            <div className="absolute top-[18px] left-0 right-0 h-px bg-border-subtle" />
            <div className="absolute top-[18px] left-0 w-1/2 h-px bg-brand-black" />
            <div className="relative z-10 flex flex-col items-center gap-2">
              <div className="w-9 h-9 rounded-full bg-brand-black text-white flex items-center justify-center border-4 border-surface-white">
                <CheckCircle size={16} strokeWidth={2} />
              </div>
              <span className="font-inter text-caption text-text-heading">
                MVP
              </span>
            </div>
            <div className="relative z-10 flex flex-col items-center gap-2">
              <div className="w-9 h-9 rounded-full bg-canvas-bg border-2 border-brand-black flex items-center justify-center">
                <div className="w-2.5 h-2.5 rounded-full bg-accent-neon animate-pulse" />
              </div>
              <span className="font-inter font-bold text-caption text-text-heading">
                Traction
              </span>
            </div>
            <div className="relative z-10 flex flex-col items-center gap-2">
              <div className="w-9 h-9 rounded-full bg-canvas-bg border border-border-subtle flex items-center justify-center">
                <Lock size={14} strokeWidth={2} className="text-text-muted" />
              </div>
              <span className="font-inter text-caption text-text-muted">
                Scale
              </span>
            </div>
          </div>
          <p className="font-inter text-small text-text-muted pt-4 border-t border-divider-line">
            Approval unlocks the{" "}
            <strong className="text-text-heading">Traction Stage</strong>.
            EcoLoop is now eligible for University Seed Funding Phase II.
          </p>
        </section>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 space-y-6">
          <section className="bg-surface-white border border-border-subtle rounded-lg shadow-card overflow-hidden">
            <div className="px-6 py-4 border-b border-border-subtle bg-canvas-bg/50 flex items-center justify-between">
              <h3 className="font-poppins font-semibold text-body text-text-heading">
                Approved with Suggestions
              </h3>
              <PenLine size={18} strokeWidth={2} className="text-text-muted" />
            </div>
            <div className="p-6 space-y-4">
              <p className="font-inter text-body text-text-body">
                "The panel was highly impressed with the carbon footprint
                tracking algorithm. However, for full traction rollout, we
                suggest formalizing the partnership with the Campus Facilities
                department to ensure data integrity."
              </p>
              <div className="p-4 bg-canvas-bg rounded-md border-l-4 border-brand-black">
                <h4 className="font-inter font-semibold text-small text-text-heading mb-2">
                  Technical Guidance:
                </h4>
                <ul className="list-disc list-inside space-y-1 font-inter text-small text-text-muted">
                  <li>Implement OAuth2 for external facility API endpoints.</li>
                  <li>
                    Consider edge-case handling for semester-break low-activity
                    periods.
                  </li>
                </ul>
              </div>
            </div>
          </section>

          <section className="bg-surface-white border border-border-subtle rounded-lg shadow-card overflow-hidden">
            <div className="px-6 py-4 border-b border-border-subtle bg-canvas-bg/50">
              <h3 className="font-poppins font-semibold text-body text-text-heading">
                Unlock Timeline
              </h3>
            </div>
            <div className="p-6 space-y-6">
              {TIMELINE.map(({ label, time, current }) => (
                <div key={label} className="flex items-start gap-4">
                  {current ? (
                    <div className="w-7 h-7 rounded-full bg-brand-black text-white flex items-center justify-center shrink-0">
                      <Star size={14} strokeWidth={2} />
                    </div>
                  ) : (
                    <div className="w-2 h-2 rounded-full bg-text-muted mt-2.5 ml-2.5 shrink-0" />
                  )}
                  <div>
                    <p
                      className={`font-inter font-medium text-small ${current ? "text-text-heading font-bold" : "text-text-heading"}`}
                    >
                      {label}
                    </p>
                    <p className="font-inter text-caption text-text-muted">
                      {time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="lg:col-span-5">
          <section className="bg-surface-white border border-border-subtle rounded-lg p-6 shadow-card sticky top-24">
            <h3 className="font-inter font-semibold text-caption text-text-muted uppercase tracking-wider mb-6">
              Final Execution
            </h3>

            {errorMsg && (
              <div className="mb-4 p-3 bg-error/15 border border-error/30 text-error rounded-md text-small flex items-center gap-2">
                <AlertCircle size={16} className="shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {published ? (
              <div className="p-4 bg-success/10 border border-success/30 rounded-md flex items-center gap-2 text-success font-inter text-small mb-3">
                <CheckCircle size={16} strokeWidth={2} /> Published — EcoLoop
                promoted to Traction.
              </div>
            ) : (
              <button
                type="button"
                onClick={async () => {
                  try {
                    setErrorMsg("");
                    await api.post("/applications/decision", {
                      status: "published",
                      revisions,
                    });
                    setPublished(true);
                  } catch (err) {
                    console.error("Failed to publish decision:", err);
                    setErrorMsg(
                      err?.response?.data?.message ||
                        err?.message ||
                        "Failed to publish decision",
                    );
                  }
                }}
                className="w-full py-4 bg-action-bg text-action-text font-poppins font-semibold text-small rounded-md flex items-center justify-center gap-3 hover:opacity-90 active:scale-[0.98] transition-all mb-3"
              >
                <Upload size={18} strokeWidth={2} /> Publish Result
              </button>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <ComingSoon label="Notify Founder" position="top" inline={false}>
                <span className="flex items-center justify-center gap-2 py-3 border border-border-subtle rounded-md font-inter font-medium text-small text-text-heading">
                  <Mail size={16} strokeWidth={2} /> Notify Founder
                </span>
              </ComingSoon>
              <button
                type="button"
                onClick={() => navigate("/admin/reviews")}
                className="flex items-center justify-center gap-2 py-3 border border-border-subtle rounded-md font-inter font-medium text-small text-text-heading hover:bg-canvas-bg transition-colors"
              >
                <Undo2 size={16} strokeWidth={2} /> Return to Queue
              </button>
            </div>

            <div className="mt-8 pt-8 border-t border-divider-line">
              <h4 className="font-inter font-semibold text-caption text-text-muted uppercase mb-3">
                Revision Actions
              </h4>
              <p className="font-inter text-small text-text-muted italic mb-4">
                In the event of a revision request, this list is appended to the
                founder's dashboard.
              </p>
              <div className="space-y-3">
                {revisions.map((item, i) => (
                  <label
                    key={item.text}
                    className="flex items-start gap-3 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={item.done}
                      onChange={() => toggleRevision(i)}
                      className="mt-1 rounded border-border-subtle text-brand-black focus:ring-brand-black"
                    />
                    <p
                      className={`font-inter text-small ${item.done ? "line-through text-text-muted" : "text-text-body"}`}
                    >
                      {item.text}
                    </p>
                  </label>
                ))}
              </div>
            </div>

            <div className="mt-6 flex items-center gap-2 text-error bg-error/10 border border-error/20 p-3 rounded-md">
              <Info size={16} strokeWidth={2} className="shrink-0" />
              <span className="font-inter text-caption uppercase">
                Rejection would trigger a mandatory cooldown of 30 days.
              </span>
            </div>
          </section>
        </div>
      </div>
    </AdminShell>
  );
}
