import { CheckCircle2, Pencil, User } from "lucide-react";
import { Link } from "react-router-dom";
import MentorShell from "@/components/mentor/MentorShell";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

// Read-only "what others see" view — split out from the edit form, which
// now lives at Settings.jsx. No live shared state between the two yet
// (no fetch on either side today, both are seeded snapshots) — this uses
// the same seed values Settings.jsx starts with so the two don't visibly
// disagree, but editing one won't update the other until both are wired
// to a real profile fetch. TODO(backend): once GET /mentor/profile
// exists, both pages should read from it instead of hardcoded state.
const MENTOR = {
  fullName: "Priya Anand",
  jobTitle: "Senior Mentor",
  company: "Techstars",
  industry: "SaaS",
  yearsExperience: "12",
  expertise: ["Product Strategy", "Growth", "Fundraising"],
  bio: "Seasoned SaaS product leader with over 12 years of experience building and scaling early-stage teams.",
  stages: ["Idea", "Validation", "MVP", "Traction"],
  preferredIndustries: "Enterprise SaaS, B2B Marketplaces",
  weeklyAvailability: "2-4 hours / week",
  meetingPreference: "Hybrid",
};

export default function MentorProfilePage() {
  useDocumentTitle("Mentor Profile — BOCC");

  return (
    <MentorShell>
      <div className="mb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="font-poppins font-bold text-section text-text-heading mb-1">
            Mentor Profile
          </h1>
          <p className="font-inter text-body text-text-muted">
            This is what students and the BOCC community see when they look
            you up.
          </p>
        </div>
        <Link
          to="/mentor/settings"
          className="inline-flex items-center gap-2 border border-border-subtle text-text-heading font-inter font-medium text-small px-4 py-2.5 rounded-md hover:bg-canvas-bg transition-colors shrink-0"
        >
          <Pencil size={16} strokeWidth={2} />
          Edit Settings
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4 bg-surface-white border border-border-subtle rounded-xl shadow-card p-6 h-fit">
          <div className="flex flex-col items-center text-center">
            <div className="w-20 h-20 rounded-full bg-canvas-bg border border-border-subtle overflow-hidden mb-3 flex items-center justify-center text-text-muted">
              <User size={28} strokeWidth={1.5} />
            </div>
            <p className="font-poppins font-semibold text-card text-text-heading">
              {MENTOR.fullName}
            </p>
            <p className="font-inter text-small text-text-muted">
              {MENTOR.jobTitle}
            </p>
            <div className="flex gap-2 mt-3">
              <span className="font-inter text-caption font-medium bg-canvas-bg border border-border-subtle px-2.5 py-1 rounded-full">
                {MENTOR.company}
              </span>
              <span className="font-inter text-caption font-medium bg-canvas-bg border border-border-subtle px-2.5 py-1 rounded-full">
                {MENTOR.industry}
              </span>
            </div>
            <p className="font-inter text-caption text-text-muted mt-2">
              {MENTOR.yearsExperience} years exp.
            </p>

            <p className="flex items-center gap-1.5 font-inter text-caption font-medium text-success mt-4">
              <CheckCircle2 size={14} strokeWidth={2} />
              Verified Mentor Status
            </p>

            <div className="w-full mt-5 text-left">
              <p className="font-inter text-caption font-semibold uppercase tracking-wider text-text-muted mb-2">
                Expertise Highlights
              </p>
              <div className="flex flex-wrap gap-2">
                {MENTOR.expertise.map((item) => (
                  <span
                    key={item}
                    className="font-inter text-caption bg-accent-neon/15 text-text-heading px-2.5 py-1 rounded-full"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-8 flex flex-col gap-6">
          <div className="bg-surface-white border border-border-subtle rounded-xl shadow-card p-6">
            <h2 className="font-poppins font-semibold text-card text-text-heading mb-3">
              About
            </h2>
            <p className="font-inter text-small text-text-body leading-relaxed">
              {MENTOR.bio}
            </p>
          </div>

          <div className="bg-surface-white border border-border-subtle rounded-xl shadow-card p-6">
            <h2 className="font-poppins font-semibold text-card text-text-heading mb-4">
              Mentorship Preferences
            </h2>
            <div className="mb-4">
              <p className="font-inter text-caption font-semibold uppercase tracking-wider text-text-muted mb-2">
                Ideal Startup Stages
              </p>
              <div className="flex flex-wrap gap-2">
                {MENTOR.stages.map((stage) => (
                  <span
                    key={stage}
                    className="font-inter text-caption bg-canvas-bg border border-border-subtle px-2.5 py-1 rounded-full"
                  >
                    {stage}
                  </span>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <p className="font-inter text-caption font-semibold uppercase tracking-wider text-text-muted mb-1">
                  Preferred Industries
                </p>
                <p className="font-inter text-small text-text-body">
                  {MENTOR.preferredIndustries}
                </p>
              </div>
              <div>
                <p className="font-inter text-caption font-semibold uppercase tracking-wider text-text-muted mb-1">
                  Availability
                </p>
                <p className="font-inter text-small text-text-body">
                  {MENTOR.weeklyAvailability}
                </p>
              </div>
              <div>
                <p className="font-inter text-caption font-semibold uppercase tracking-wider text-text-muted mb-1">
                  Meeting Preference
                </p>
                <p className="font-inter text-small text-text-body">
                  {MENTOR.meetingPreference}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MentorShell>
  );
}
