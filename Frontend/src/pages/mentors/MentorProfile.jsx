import { Link } from "react-router-dom";
import {
  ChevronRight,
  Building2,
  Tag,
  Clock,
  Star,
  Bookmark,
  Award,
  Brain,
} from "lucide-react";
import DashboardShell from "@/components/dashboard/DashboardShell";
import Badge from "@/components/ui/Badge";
import ComingSoon from "@/components/ui/ComingSoon";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

const EXPERTISE = [
  "Product Strategy",
  "UX Architecture",
  "User Research",
  "Design Systems",
  "Growth Hacking",
];
const INDUSTRIES = ["FinTech", "E-commerce", "SaaS"];
const EXPERIENCE = [
  {
    role: "Past Startup Advisor",
    org: "PayLink (Acquired by Stripe)",
    desc: "Guided the founding team from seed to Series B, focusing on product-market fit and design-led growth.",
    years: "2018 - 2021",
  },
  {
    role: "Incubator Mentor",
    org: "Y Combinator (W19)",
    desc: "Provided weekly office hours to 12 FinTech batches focusing on UX compliance and checkout optimization.",
    years: "2019",
  },
];
const REVIEWS = [
  {
    name: "Marcus T.",
    role: "Founder at Verve",
    text: "Sarah completely changed how we looked at our onboarding flow. Her insights on friction reduction were instrumental to our 30% jump in conversion.",
  },
  {
    name: "Lina Chen",
    role: "UX Student",
    text: "Incredibly patient and articulate. She helps you find the answer yourself rather than just giving it to you.",
  },
];
const STATS = [
  { label: "Active Mentees", value: "3" },
  { label: "Sessions", value: "45" },
  { label: "Avg. Rating", value: "4.9" },
  { label: "Response Time", value: "2h" },
];
const ACHIEVEMENTS = [
  { icon: Award, label: "Top 1% Mentor", sub: "Q4 2023 Achievement" },
  { icon: Brain, label: "Expert Strategist", sub: "Verified Skill Badge" },
];

export default function MentorProfilePage() {
  useDocumentTitle("Sarah Jenkins — Mentor Profile — BOCC");

  return (
    <DashboardShell pageId="mentor-profile">
      <nav className="mb-6 flex items-center gap-2 text-text-muted font-inter font-normal text-small">
        <Link
          to="/mentors"
          className="hover:text-text-heading transition-colors"
        >
          Mentors
        </Link>
        <ChevronRight size={14} strokeWidth={2} />
        <span className="text-text-heading font-semibold">Mentor Profile</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-surface-white border border-border-subtle rounded-lg p-6 text-center">
            <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-brand-black text-accent-neon flex items-center justify-center font-poppins font-bold text-page">
              SJ
            </div>
            <h2 className="font-poppins font-semibold text-card text-text-heading mb-1">
              Sarah Jenkins
            </h2>
            <p className="font-inter text-small text-text-muted mb-4">
              Lead Product Designer
            </p>
            <div className="text-left space-y-3 pt-4 border-t border-divider-line">
              <div className="flex items-center gap-2 font-inter text-small text-text-body">
                <Building2
                  size={16}
                  strokeWidth={2}
                  className="text-text-muted"
                />{" "}
                Stripe
              </div>
              <div className="flex items-center gap-2 font-inter text-small text-text-body">
                <Tag size={16} strokeWidth={2} className="text-text-muted" />{" "}
                FinTech & SaaS
              </div>
              <div className="flex items-center gap-2 font-inter text-small text-text-body">
                <Clock size={16} strokeWidth={2} className="text-text-muted" />{" "}
                12 Years
              </div>
              <Badge variant="success">Available this week</Badge>
            </div>
          </div>
        </div>

        <div className="lg:col-span-6 space-y-6">
          <section className="bg-surface-white border border-border-subtle rounded-lg p-8">
            <h3 className="font-poppins font-semibold text-body text-text-heading mb-4">
              About Sarah
            </h3>
            <p className="font-inter text-small text-text-body leading-relaxed">
              I am a design leader passionate about building scalable financial
              infrastructure and mentoring the next generation of product
              creators. With over a decade of experience across Silicon Valley
              startups and enterprise giants, I focus on bridging the gap
              between business strategy and human-centered design.
            </p>
          </section>

          <section className="bg-surface-white border border-border-subtle rounded-lg p-8">
            <h3 className="font-poppins font-semibold text-body text-text-heading mb-4">
              Expertise
            </h3>
            <p className="font-inter text-caption text-text-muted uppercase tracking-wide mb-2">
              Areas of Expertise
            </p>
            <div className="flex flex-wrap gap-2 mb-4">
              {EXPERTISE.map((e) => (
                <span
                  key={e}
                  className="px-3 py-1 bg-canvas-bg border border-border-subtle rounded-lg font-inter text-small text-text-heading"
                >
                  {e}
                </span>
              ))}
            </div>
            <p className="font-inter text-caption text-text-muted uppercase tracking-wide mb-2">
              Industries
            </p>
            <div className="flex flex-wrap gap-2">
              {INDUSTRIES.map((i) => (
                <span
                  key={i}
                  className="px-3 py-1 bg-canvas-bg border border-border-subtle rounded-lg font-inter text-small text-text-heading"
                >
                  {i}
                </span>
              ))}
            </div>
          </section>

          <section className="bg-surface-white border border-border-subtle rounded-lg overflow-hidden">
            <div className="px-8 py-6 border-b border-divider-line">
              <h3 className="font-poppins font-semibold text-body text-text-heading">
                Mentorship Experience
              </h3>
            </div>
            <div className="divide-y divide-border-subtle">
              {EXPERIENCE.map((e) => (
                <div
                  key={e.role}
                  className="p-8 flex justify-between items-start gap-4"
                >
                  <div>
                    <h4 className="font-poppins font-semibold text-small text-text-heading">
                      {e.role}
                    </h4>
                    <p className="font-inter text-small text-text-muted">
                      {e.org}
                    </p>
                    <p className="font-inter text-caption text-text-body mt-2">
                      {e.desc}
                    </p>
                  </div>
                  <span className="font-inter text-caption text-text-muted shrink-0">
                    {e.years}
                  </span>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-surface-white border border-border-subtle rounded-lg p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-poppins font-semibold text-body text-text-heading">
                Reviews & Ratings
              </h3>
              <div className="flex items-center gap-2">
                <Star
                  size={18}
                  strokeWidth={2}
                  className="text-warning"
                  fill="currentColor"
                />
                <span className="font-poppins font-semibold text-card text-text-heading">
                  4.9
                </span>
                <span className="font-inter text-small text-text-muted">
                  (45 reviews)
                </span>
              </div>
            </div>
            <div className="space-y-5">
              {REVIEWS.map((r) => (
                <div
                  key={r.name}
                  className="pb-5 border-b border-divider-line last:border-0 last:pb-0"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-full bg-canvas-bg border border-border-subtle" />
                    <div>
                      <p className="font-inter font-bold text-small text-text-heading">
                        {r.name}
                      </p>
                      <p className="font-inter text-caption text-text-muted">
                        {r.role}
                      </p>
                    </div>
                  </div>
                  <p className="font-inter text-small text-text-body italic">
                    "{r.text}"
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="lg:col-span-3 space-y-6">
          <div className="bg-surface-white border border-border-subtle rounded-lg p-6">
            <h4 className="font-inter text-caption font-bold text-text-muted uppercase tracking-wide mb-4">
              Mentor Statistics
            </h4>
            <div className="grid grid-cols-2 gap-y-4">
              {STATS.map((s) => (
                <div key={s.label}>
                  <p className="font-poppins font-bold text-card text-text-heading">
                    {s.value}
                  </p>
                  <p className="font-inter text-caption text-text-muted">
                    {s.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-surface-white border border-border-subtle rounded-lg p-6 shadow-card">
            <Link
              to="/mentors/request"
              className="w-full block text-center py-3 bg-action-bg text-action-text rounded-lg font-poppins font-semibold text-small hover:opacity-90 transition-all mb-3"
            >
              Request Mentorship
            </Link>
            <ComingSoon label="Save Mentor" position="top" className="w-full">
              <span className="w-full flex items-center justify-center gap-2 py-3 border border-border-subtle rounded-lg font-inter font-semibold text-small text-text-heading">
                <Bookmark size={18} strokeWidth={2} /> Save Mentor
              </span>
            </ComingSoon>
            <p className="text-center font-inter text-caption text-text-muted mt-4">
              Typical response within 24 hours.
            </p>
          </div>

          <div className="bg-surface-white border border-border-subtle rounded-lg p-6">
            <h4 className="font-poppins font-semibold text-body text-text-heading mb-4">
              Achievements
            </h4>
            <div className="space-y-4">
              {ACHIEVEMENTS.map(({ icon: Icon, label, sub }) => (
                <div key={label} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-canvas-bg flex items-center justify-center shrink-0">
                    <Icon
                      size={18}
                      strokeWidth={2}
                      className="text-text-heading"
                    />
                  </div>
                  <div>
                    <p className="font-inter font-bold text-small text-text-heading">
                      {label}
                    </p>
                    <p className="font-inter text-caption text-text-muted">
                      {sub}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
