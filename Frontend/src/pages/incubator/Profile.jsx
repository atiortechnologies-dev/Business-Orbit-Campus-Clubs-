import { Pencil, Globe, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import IncubatorShell from "@/components/incubator/IncubatorShell";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

// Read-only "what students see" view. Settings.jsx is local-state-only
// today (no getMyProfile wiring — a pre-existing stub, not something
// this pass adds), so this reads the same seeded shape rather than
// inventing a real fetch this page doesn't have either. TODO(backend):
// once GET /incubator/profile exists, wire both pages to it.
const INCUBATOR = {
  incubatorName: "BOCC Incubator",
  repName: "Sarah Jenkins",
  website: "https://www.incubatorhub.io",
  address: "42 Innovation Drive, Suite 100, San Francisco, CA",
  about:
    "We provide early-stage tech startups with the capital, mentorship, and network they need to scale rapidly. Our focus is on sustainable AI and fintech solutions.",
  stages: "Pre-seed to Seed",
  maxStartups: "25",
  industries: ["Artificial Intelligence", "Fintech", "SaaS"],
};

export default function IncubatorProfilePage() {
  useDocumentTitle("Incubator Profile — BOCC");

  return (
    <IncubatorShell>
      <div className="mb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="font-poppins font-bold text-section text-text-heading mb-1">
            Incubator Profile
          </h1>
          <p className="font-inter text-body text-text-muted">
            This is what students see when they look up your incubator.
          </p>
        </div>
        <Link
          to="/incubator/settings"
          className="inline-flex items-center gap-2 border border-border-subtle text-text-heading font-inter font-medium text-small px-4 py-2.5 rounded-md hover:bg-canvas-bg transition-colors shrink-0"
        >
          <Pencil size={16} strokeWidth={2} />
          Edit Settings
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4 bg-surface-white border border-border-subtle rounded-xl shadow-card p-6 h-fit">
          <div className="flex flex-col items-center text-center">
            <div className="w-20 h-20 rounded-2xl bg-canvas-bg border border-border-subtle mb-3 flex items-center justify-center font-poppins font-bold text-text-heading text-2xl select-none">
              BI
            </div>
            <p className="font-poppins font-semibold text-card text-text-heading">
              {INCUBATOR.incubatorName}
            </p>
            <p className="font-inter text-small text-text-muted">
              {INCUBATOR.repName} • Lead Representative
            </p>

            <div className="w-full mt-5 flex flex-col gap-2 text-left">
              <a
                href={INCUBATOR.website}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 font-inter text-caption text-text-heading hover:underline"
              >
                <Globe size={14} strokeWidth={2} />
                {INCUBATOR.website.replace(/^https?:\/\//, "")}
              </a>
              <p className="flex items-start gap-1.5 font-inter text-caption text-text-muted">
                <MapPin size={14} strokeWidth={2} className="shrink-0 mt-0.5" />
                {INCUBATOR.address}
              </p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-8 flex flex-col gap-6">
          <section className="bg-surface-white border border-border-subtle rounded-xl shadow-card p-6">
            <h2 className="font-poppins font-semibold text-card text-text-heading mb-3">
              About
            </h2>
            <p className="font-inter text-small text-text-body leading-relaxed">
              {INCUBATOR.about}
            </p>
          </section>

          <section className="bg-surface-white border border-border-subtle rounded-xl shadow-card p-6">
            <h2 className="font-poppins font-semibold text-card text-text-heading mb-4">
              Program Details
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <p className="font-inter text-caption font-semibold uppercase tracking-wider text-text-muted mb-1">
                  Target Stages
                </p>
                <p className="font-inter text-small text-text-body">
                  {INCUBATOR.stages}
                </p>
              </div>
              <div>
                <p className="font-inter text-caption font-semibold uppercase tracking-wider text-text-muted mb-1">
                  Max Startups per Cohort
                </p>
                <p className="font-inter text-small text-text-body">
                  {INCUBATOR.maxStartups}
                </p>
              </div>
            </div>
            <div>
              <p className="font-inter text-caption font-semibold uppercase tracking-wider text-text-muted mb-2">
                Industries
              </p>
              <div className="flex flex-wrap gap-2">
                {INCUBATOR.industries.map((item) => (
                  <span
                    key={item}
                    className="font-inter text-caption bg-canvas-bg border border-border-subtle px-2.5 py-1 rounded-full"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </section>
        </div>
      </div>
    </IncubatorShell>
  );
}
