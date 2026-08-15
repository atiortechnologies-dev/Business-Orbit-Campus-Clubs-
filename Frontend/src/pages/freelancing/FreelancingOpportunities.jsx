import { useState } from "react";
import { Link } from "react-router-dom";
import { Briefcase, Bookmark, Rocket, Sparkles, Lock } from "lucide-react";
import DashboardShell from "@/components/dashboard/DashboardShell";
import Button from "@/components/ui/Button";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

const TYPE_OPTIONS = ["Internship", "Full-time", "Part-time", "Freelance"];
const MODE_OPTIONS = ["Remote", "Hybrid", "On-site"];
const INDUSTRY_OPTIONS = [
  "All Industries",
  "Technology",
  "Finance",
  "Design",
  "Marketing",
];
const LEVEL_OPTIONS = ["Any Level", "Entry Level", "Intermediate", "Senior"];

const OPPORTUNITIES = [
  {
    id: "o1",
    title: "Lead UX Design Intern",
    company: "NovaCore Systems",
    location: "Singapore (Remote)",
    pay: "$1,200 - $1,800 /mo",
    deadline: "15 Oct 2023",
    posted: "2 days ago",
    desc: "NovaCore is a rapid-growth SaaS startup building next-gen project management tools for global engineering teams. We're looking for a design student who can take ownership of our core mobile workflows.",
    tags: ["Figma", "Prototyping", "User Research", "Internship"],
  },
  {
    id: "o2",
    title: "Junior Frontend Developer (React)",
    company: "FinStrat Global",
    location: "Hybrid · London, UK",
    pay: "£45k - £55k /yr",
    deadline: "02 Nov 2023",
    posted: "4 hours ago",
    desc: "FinStrat provides strategic financial analytics to Fortune 500 companies. Join our internal tools team to help build high-performance data visualization dashboards using React and D3.js.",
    tags: ["React", "Tailwind CSS", "D3.js", "Full-time"],
  },
  {
    id: "o3",
    title: "Freelance Content Strategist",
    company: "EcoGrow",
    location: "Remote",
    pay: "$35 - $60 /hr",
    deadline: "20 Oct 2023",
    posted: "1 week ago",
    desc: "We need a wordsmith to define our brand voice across web, social, and investor decks. EcoGrow is on a mission to democratize sustainable farming through IoT technology.",
    tags: ["Copywriting", "Brand Voice", "SEO", "Freelance"],
  },
];

export default function FreelancingOpportunitiesPage() {
  useDocumentTitle("Freelancing Opportunities — BOCC");
  const [industry, setIndustry] = useState(INDUSTRY_OPTIONS[0]);
  const [level, setLevel] = useState(LEVEL_OPTIONS[0]);

  return (
    <DashboardShell pageId="freelancing-opportunities">
      <div className="relative min-h-[80vh]">
        {/* OVERLAY / COMING SOON CARD */}
        <div className="absolute inset-0 z-20 flex justify-center items-start pt-12 sm:pt-20 p-4">
          <div className="max-w-lg w-full bg-surface-white/95 backdrop-blur-md border border-border-subtle rounded-2xl p-8 sm:p-10 shadow-2xl text-center flex flex-col items-center">
            {/* Icon Header */}
            <div className="w-16 h-16 rounded-2xl bg-brand-black flex items-center justify-center mb-6 shadow-md relative">
              <Briefcase
                size={32}
                strokeWidth={1.8}
                className="text-accent-neon"
              />
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-surface-white border border-border-subtle flex items-center justify-center">
                <Lock size={10} className="text-text-heading" />
              </span>
            </div>

            {/* Badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-black/5 border border-brand-black/10 text-caption font-semibold text-text-heading mb-4">
              <Sparkles size={14} className="text-brand-black" />
              <span>Coming Soon</span>
            </div>

            {/* Title & Description */}
            <h2 className="font-poppins font-bold text-page text-text-heading mb-3">
              Freelance & Gig Hub Opening Soon
            </h2>

            <p className="font-inter text-body text-text-muted mb-6 leading-relaxed">
              We are building a dedicated portal for student freelancers,
              interns, and startup teams to hire and work together. Stay tuned!
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 w-full">
              <Link to="/dashboard" className="flex-1">
                <Button variant="outline" fullWidth>
                  Back to Dashboard
                </Button>
              </Link>
              <Link to="/build-startup/journey" className="flex-1">
                <Button variant="primary" fullWidth className="gap-2">
                  <Rocket size={16} />
                  Build Startup
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* BLURRED BACKGROUND CONTENT */}
        <div className="filter blur-md pointer-events-none select-none opacity-40">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-brand-black flex items-center justify-center shrink-0">
              <Briefcase
                size={20}
                strokeWidth={2}
                className="text-accent-neon"
              />
            </div>
            <h1 className="font-poppins font-semibold text-page text-text-heading">
              Freelancing Opportunities
            </h1>
          </div>
          <p className="font-inter text-body text-text-body max-w-2xl mb-6">
            Explore internships, freelance projects, full-time roles, and
            startup opportunities shared by companies in the BOCC ecosystem.
          </p>

          <div className="flex items-center gap-8 border-b border-divider-line mb-8">
            <span className="pb-3 border-b-2 border-brand-black text-text-heading font-inter font-semibold text-small">
              Opportunities
            </span>
            <div className="pb-3 text-text-muted font-inter text-small">
              My Applications
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <aside className="lg:col-span-3 space-y-6">
              <div>
                <h4 className="font-inter text-caption font-bold text-text-heading uppercase tracking-wide mb-3">
                  Opportunity Type
                </h4>
                <div className="space-y-2">
                  {TYPE_OPTIONS.map((t) => (
                    <label
                      key={t}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        tabIndex={-1}
                        className="h-4 w-4 rounded border-border-subtle text-brand-black focus:ring-brand-black"
                      />
                      <span className="font-inter text-small text-text-body">
                        {t}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-inter text-caption font-bold text-text-heading uppercase tracking-wide mb-3">
                  Work Mode
                </h4>
                <div className="space-y-2">
                  {MODE_OPTIONS.map((m) => (
                    <label
                      key={m}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        tabIndex={-1}
                        className="h-4 w-4 rounded border-border-subtle text-brand-black focus:ring-brand-black"
                      />
                      <span className="font-inter text-small text-text-body">
                        {m}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-caption font-medium text-text-heading font-inter">
                  Industry
                </label>
                <select
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  tabIndex={-1}
                  className="w-full rounded-md border border-border-subtle bg-surface-white text-sm text-text-body font-inter min-h-[44px] px-3 focus:outline-none"
                >
                  {INDUSTRY_OPTIONS.map((o) => (
                    <option key={o}>{o}</option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-caption font-medium text-text-heading font-inter">
                  Experience Level
                </label>
                <select
                  value={level}
                  onChange={(e) => setLevel(e.target.value)}
                  tabIndex={-1}
                  className="w-full rounded-md border border-border-subtle bg-surface-white text-sm text-text-body font-inter min-h-[44px] px-3 focus:outline-none"
                >
                  {LEVEL_OPTIONS.map((o) => (
                    <option key={o}>{o}</option>
                  ))}
                </select>
              </div>
            </aside>

            <div className="lg:col-span-9">
              <p className="font-inter text-small text-text-muted mb-4">
                Showing{" "}
                <span className="font-bold text-text-heading">
                  {OPPORTUNITIES.length}
                </span>{" "}
                of 24 opportunities
              </p>
              <div className="space-y-4">
                {OPPORTUNITIES.map((o) => (
                  <div
                    key={o.id}
                    className="bg-surface-white border border-border-subtle rounded-lg p-6 shadow-card"
                  >
                    <div className="flex justify-between items-start gap-4 mb-2">
                      <div>
                        <h3 className="font-poppins font-semibold text-card text-text-heading">
                          {o.title}
                        </h3>
                        <p className="font-inter text-small font-medium text-text-muted">
                          {o.company} · {o.location}
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="font-inter font-bold text-small text-text-heading">
                          {o.pay}
                        </p>
                        <p className="font-inter text-caption text-text-muted">
                          Deadline: {o.deadline}
                        </p>
                      </div>
                    </div>
                    <p className="font-inter text-small text-text-body mb-4 line-clamp-2">
                      {o.desc}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {o.tags.map((t) => (
                        <span
                          key={t}
                          className="px-2 py-1 bg-canvas-bg text-text-muted font-inter text-caption rounded"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center justify-between border-t border-divider-line pt-4">
                      <span className="font-inter text-caption text-text-muted italic">
                        Posted {o.posted}
                      </span>
                      <div className="flex gap-3">
                        <div className="flex items-center gap-2 px-4 py-2 border border-border-subtle rounded-lg font-inter font-semibold text-small text-text-heading">
                          <Bookmark size={16} strokeWidth={2} /> Save
                        </div>
                        <div className="px-6 py-2 bg-action-bg text-action-text rounded-lg font-inter font-semibold text-small">
                          View Details
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
