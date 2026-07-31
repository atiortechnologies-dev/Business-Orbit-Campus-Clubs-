import { Link } from "react-router-dom";
import {
  ChevronRight,
  Building2,
  MapPin,
  CheckCircle2,
  Star,
  Bookmark,
  Share2,
  ArrowRight,
} from "lucide-react";
import DashboardShell from "@/components/dashboard/DashboardShell";
import ComingSoon from "@/components/ui/ComingSoon";
import PlaceholderGraphic from "@/components/ui/PlaceholderGraphic";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

const RESPONSIBILITIES = [
  "Design and implement high-performance React components using Next.js.",
  "Collaborate with product designers to create seamless user experiences.",
  "Maintain and scale Node.js/Go backend services running on AWS.",
  "Participate in code reviews and mentor junior developers or interns.",
];

const PREFERRED = [
  "Previous experience with open-source contributions.",
  "Knowledge of GraphQL and Apollo Client.",
  "Participation in global hackathons or coding competitions.",
];

const SKILLS = [
  "TypeScript",
  "React.js",
  "Node.js",
  "PostgreSQL",
  "AWS",
  "Docker",
];

export default function OpportunityDetailPage() {
  useDocumentTitle("Senior Full-Stack Web Developer — BOCC");

  return (
    <DashboardShell pageId="opportunity-detail">
      <nav className="mb-2 flex items-center gap-2 text-text-muted font-inter font-normal text-small">
        <Link
          to="/freelancing"
          className="hover:text-text-heading transition-colors"
        >
          Freelancing
        </Link>
        <ChevronRight size={14} strokeWidth={2} />
        <span className="text-text-heading font-semibold">
          Opportunity Detail
        </span>
      </nav>

      <div className="mb-8">
        <h1 className="font-poppins font-semibold text-page text-text-heading mb-2">
          Senior Full-Stack Web Developer
        </h1>
        <div className="flex flex-wrap items-center gap-2 text-text-muted font-inter text-body">
          <Building2 size={18} strokeWidth={2} />{" "}
          <span>Nexus Systems Int.</span>
          <span className="mx-1">|</span>
          <MapPin size={18} strokeWidth={2} />{" "}
          <span>San Francisco, CA (Remote Friendly)</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-6">
          <section className="bg-surface-white border border-border-subtle rounded-lg p-8">
            <h3 className="font-poppins font-semibold text-body text-text-heading mb-4">
              Company Overview
            </h3>
            <p className="font-inter text-small text-text-body leading-relaxed">
              Nexus Systems is a leading provider of cloud-infrastructure
              solutions for emerging startups. Since 2018, we have pioneered the
              "Zero-Latency" networking protocol used by over 500 enterprise
              clients globally. Our mission is to democratize high-performance
              computing for every developer.
            </p>
          </section>

          <section className="bg-surface-white border border-border-subtle rounded-lg p-8">
            <h3 className="font-poppins font-semibold text-body text-text-heading mb-4">
              Opportunity Description
            </h3>
            <p className="font-inter text-small text-text-body leading-relaxed">
              We are seeking a highly motivated Senior Full-Stack Developer to
              join our core product team. You will be responsible for
              architecting scalable front-end components and optimizing our
              backend microservices. This role is ideal for a student
              entrepreneur looking to gain deep technical experience in a
              fast-paced environment.
            </p>
          </section>

          <section className="bg-surface-white border border-border-subtle rounded-lg p-8">
            <h3 className="font-poppins font-semibold text-body text-text-heading mb-4">
              Responsibilities
            </h3>
            <ul className="space-y-3 font-inter text-small text-text-body">
              {RESPONSIBILITIES.map((r) => (
                <li key={r} className="flex items-start gap-3">
                  <CheckCircle2
                    size={16}
                    strokeWidth={2}
                    className="text-brand-black shrink-0 mt-0.5"
                  />
                  <span>{r}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="bg-surface-white border border-border-subtle rounded-lg p-8">
            <h3 className="font-poppins font-semibold text-body text-text-heading mb-4">
              Required Skills
            </h3>
            <div className="flex flex-wrap gap-2">
              {SKILLS.map((s) => (
                <span
                  key={s}
                  className="px-3 py-1 bg-canvas-bg text-text-body font-inter text-caption rounded-full border border-border-subtle"
                >
                  {s}
                </span>
              ))}
            </div>
          </section>

          <section className="bg-surface-white border border-border-subtle rounded-lg p-8">
            <h3 className="font-poppins font-semibold text-body text-text-heading mb-4">
              Eligibility
            </h3>
            <p className="font-inter text-small text-text-body leading-relaxed">
              Open to final-year undergraduate or graduate students enrolled in
              Computer Science or related fields. Applicants must be able to
              commit to 20-30 hours per week for at least 6 months.
            </p>
          </section>

          <section className="bg-surface-white border border-border-subtle rounded-lg p-8">
            <h3 className="font-poppins font-semibold text-body text-text-heading mb-4">
              Preferred Qualifications
            </h3>
            <ul className="space-y-3 font-inter text-small text-text-body">
              {PREFERRED.map((p) => (
                <li key={p} className="flex items-start gap-3">
                  <Star
                    size={16}
                    strokeWidth={2}
                    className="text-text-muted shrink-0 mt-0.5"
                  />
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="bg-surface-white border border-border-subtle rounded-lg p-8">
            <h3 className="font-poppins font-semibold text-body text-text-heading mb-4">
              About Nexus Systems Int.
            </h3>
            <div className="flex flex-col md:flex-row gap-6 items-center">
              <PlaceholderGraphic
                icon={Building2}
                label="Team"
                className="w-full md:w-48 h-32 rounded-lg shrink-0"
              />
              <p className="font-inter text-small text-text-body leading-relaxed flex-1">
                Our culture is built on transparency and radical autonomy. We
                believe that small, focused teams can solve the world's most
                complex technical challenges. Join us to build the future of the
                internet.
              </p>
            </div>
          </section>
        </div>

        <div className="lg:col-span-4">
          <div className="sticky top-24 bg-surface-white border border-border-subtle rounded-lg p-6 space-y-6 shadow-card">
            <div className="text-center pb-6 border-b border-divider-line">
              <div className="w-16 h-16 mx-auto mb-3 rounded-lg bg-canvas-bg border border-border-subtle flex items-center justify-center">
                <Building2
                  size={28}
                  strokeWidth={2}
                  className="text-text-muted"
                />
              </div>
              <h4 className="font-poppins font-semibold text-card text-text-heading">
                Nexus Systems Int.
              </h4>
              <p className="font-inter text-caption text-text-heading font-medium mt-1">
                High-Growth Startup
              </p>
            </div>
            <div className="space-y-3 font-inter text-small">
              <div className="flex justify-between">
                <span className="text-text-muted">Website</span>
                <span className="text-text-heading font-semibold">
                  nexus-sys.io
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">Industry</span>
                <span className="text-text-heading">Cloud Infrastructure</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">Company Size</span>
                <span className="text-text-heading">50 - 200 employees</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">Posted Date</span>
                <span className="text-text-heading">Oct 12, 2023</span>
              </div>
              <div className="flex justify-between">
                <span className="text-error font-bold">Deadline</span>
                <span className="text-text-heading font-bold">
                  Nov 15, 2023
                </span>
              </div>
            </div>
            <div className="space-y-3">
              <Link
                to="/freelancing/apply"
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-action-bg text-action-text rounded-lg font-poppins font-semibold text-small hover:opacity-90 transition-all"
              >
                Apply Now <ArrowRight size={16} strokeWidth={2} />
              </Link>
              <ComingSoon
                label="Save Opportunity"
                position="top"
                className="w-full"
              >
                <span className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-border-subtle rounded-lg font-inter font-semibold text-small text-text-heading">
                  <Bookmark size={16} strokeWidth={2} /> Save Opportunity
                </span>
              </ComingSoon>
              <ComingSoon label="Share" position="top" className="w-full">
                <span className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-border-subtle rounded-lg font-inter font-semibold text-small text-text-muted">
                  <Share2 size={16} strokeWidth={2} /> Share
                </span>
              </ComingSoon>
            </div>
            <div className="bg-canvas-bg border border-border-subtle rounded-lg p-3 text-center">
              <p className="font-inter text-caption text-text-muted">
                54 students from BOCC have already applied
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
