import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  Rocket,
  Route,
  GraduationCap,
  CreditCard,
  Building2,
  MousePointerClick,
  UserCheck,
  Terminal,
  ChevronDown,
  Ticket,
  MessageCircle,
} from "lucide-react";
import DashboardShell from "@/components/dashboard/DashboardShell";
import ComingSoon from "@/components/ui/ComingSoon";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

const CATEGORIES = [
  {
    icon: Rocket,
    title: "Getting Started",
    desc: "New here? Learn the basics of navigating the BOCC Platform.",
  },
  {
    icon: Route,
    title: "Startup Journey",
    desc: "Milestones, documentation, and phase requirements for founders.",
  },
  {
    icon: GraduationCap,
    title: "Mentors",
    desc: "Connecting with experts and managing mentorship sessions.",
  },
  {
    icon: CreditCard,
    title: "Investors",
    desc: "Pitching, equity tracking, and investor relationship tools.",
  },
  {
    icon: Building2,
    title: "Incubators",
    desc: "Manage physical space and cohort-wide support resources.",
  },
  {
    icon: MousePointerClick,
    title: "Opportunities",
    desc: "Grants, competitions, and specialized program listings.",
  },
  {
    icon: UserCheck,
    title: "Account & Security",
    desc: "Password resets, 2FA, and permission settings management.",
  },
  {
    icon: Terminal,
    title: "Technical Issues",
    desc: "Troubleshooting bugs, API access, and system status info.",
  },
];

const FAQS = [
  {
    q: "How do I update my startup's business plan on the dashboard?",
    a: "Navigate to the 'My Startup' tab in your main dashboard. Click on 'Documents' and locate the 'Business Plan' section. Select 'Upload New Version' to replace your existing document while maintaining your version history.",
  },
  {
    q: "Can I request a mentor specifically from a different industry?",
    a: "Yes. While our matching algorithm prioritizes industry alignment, you can manually browse the mentor directory and apply filters for cross-industry expertise to gain broader perspectives for your startup.",
  },
  {
    q: "What documentation is required for the Seed Phase?",
    a: "For the Seed Phase, you generally need an executive summary, a 12-month financial projection, a confirmed MVP scope document, and a valid business registration certificate.",
  },
];

const RESOURCES = [
  {
    tag: "Manual",
    title: "BOCC User Guide",
    desc: "Comprehensive guide for all platform features and user permissions.",
  },
  {
    tag: "Playbook",
    title: "Startup Journey Handbook",
    desc: "Step-by-step roadmap for growing your idea into a venture.",
  },
  {
    tag: "Finance",
    title: "Investment Readiness",
    desc: "Prepare your pitch deck and cap tables for real-world investors.",
  },
  {
    tag: "Legal",
    title: "Compliance Toolkit",
    desc: "Standard templates and checklists for regulatory filings.",
  },
  {
    tag: "Video",
    title: "Feature Masterclass",
    desc: "Video tutorials on advanced search and dashboard reporting.",
  },
];

const UPDATES = [
  {
    date: "Oct 24, 2024",
    version: "v2.4.0",
    note: "Enhanced Mentor Matching Algorithm with AI industry mapping.",
  },
  {
    date: "Oct 12, 2024",
    version: "v2.3.8",
    note: "Fixed dashboard loading latency for high-density document libraries.",
  },
  {
    date: "Sep 28, 2024",
    version: "v2.3.5",
    note: "New 'Opportunity Feed' filters for region-specific grants.",
  },
];

export default function HelpCenterPage() {
  useDocumentTitle("Help Center — BOCC");
  const [openFaq, setOpenFaq] = useState(null);
  const [search, setSearch] = useState("");

  return (
    <DashboardShell pageId="help-center">
      <section className="text-center max-w-2xl mx-auto mb-16">
        <h1 className="font-poppins font-semibold text-page text-text-heading mb-4">
          Help Center
        </h1>
        <p className="font-inter text-body text-text-body mb-8">
          Find answers to your questions, explore our startup ecosystem, and
          learn how to maximize your platform experience.
        </p>
        <div className="relative">
          <Search
            size={20}
            strokeWidth={2}
            className="absolute left-5 top-1/2 -translate-y-1/2 text-text-muted"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search articles, FAQs..."
            className="w-full pl-14 pr-6 py-4 bg-surface-white border-2 border-border-subtle rounded-xl font-inter text-body focus:outline-none focus:border-brand-black transition-all"
          />
        </div>
      </section>

      <section className="mb-16">
        <h2 className="font-poppins font-semibold text-body text-text-heading mb-6">
          Quick Help Categories
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {CATEGORIES.map(({ icon: Icon, title, desc }) => (
            <ComingSoon
              key={title}
              label={title}
              position="top"
              className="text-left"
            >
              <div className="bg-surface-white border border-border-subtle p-6 rounded-lg hover:border-brand-black transition-colors h-full">
                <Icon
                  size={30}
                  strokeWidth={1.5}
                  className="text-text-muted mb-4"
                />
                <h3 className="font-poppins font-semibold text-small text-text-heading mb-2">
                  {title}
                </h3>
                <p className="font-inter text-caption text-text-muted">
                  {desc}
                </p>
              </div>
            </ComingSoon>
          ))}
        </div>
      </section>

      <section className="mb-16 max-w-3xl mx-auto">
        <h2 className="font-poppins font-semibold text-body text-text-heading text-center mb-8">
          Frequently Asked Questions
        </h2>
        <div className="space-y-3">
          {FAQS.map(({ q, a }, i) => (
            <div
              key={q}
              className="bg-surface-white border border-border-subtle rounded-lg overflow-hidden"
            >
              <button
                type="button"
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full px-6 py-4 flex justify-between items-center text-left hover:bg-canvas-bg transition-colors"
              >
                <span className="font-inter font-semibold text-small text-text-heading pr-4">
                  {q}
                </span>
                <ChevronDown
                  size={18}
                  strokeWidth={2}
                  className={`text-text-muted shrink-0 transition-transform ${openFaq === i ? "rotate-180" : ""}`}
                />
              </button>
              {openFaq === i && (
                <div className="px-6 pb-4 font-inter text-small text-text-body">
                  {a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="mb-16">
        <h2 className="font-poppins font-semibold text-body text-text-heading mb-6">
          Learning Resources
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {RESOURCES.map(({ tag, title, desc }) => (
            <div
              key={title}
              className="bg-surface-white border border-border-subtle p-6 rounded-lg flex flex-col"
            >
              <span className="font-inter text-[10px] text-text-muted uppercase tracking-widest mb-2">
                {tag}
              </span>
              <h3 className="font-poppins font-semibold text-small text-text-heading mb-3">
                {title}
              </h3>
              <p className="font-inter text-caption text-text-muted mb-6 flex-grow">
                {desc}
              </p>
              <ComingSoon label={title} position="top">
                <span className="w-full block text-center border border-brand-black text-text-heading py-2 rounded-lg font-inter font-semibold text-caption hover:bg-brand-black hover:text-white transition-all cursor-pointer">
                  View Resource
                </span>
              </ComingSoon>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-16">
        <div className="flex justify-between items-end mb-6 border-b border-divider-line pb-4">
          <h2 className="font-poppins font-semibold text-body text-text-heading">
            Recent Platform Updates
          </h2>
        </div>
        <div className="space-y-2">
          {UPDATES.map(({ date, version, note }) => (
            <div
              key={version}
              className="flex items-center gap-4 py-3 border-b border-border-subtle hover:bg-canvas-bg transition-colors px-2 rounded"
            >
              <span className="font-inter text-caption text-text-muted w-24 shrink-0">
                {date}
              </span>
              <span className="bg-canvas-bg px-2 py-0.5 rounded font-inter text-[11px] font-semibold shrink-0">
                {version}
              </span>
              <p className="font-inter text-small text-text-body flex-grow">
                {note}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-brand-black text-white p-10 rounded-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h2 className="font-poppins font-semibold text-body mb-1">
            Still Need Help?
          </h2>
          <p className="font-inter text-small opacity-70">
            Our support team is available to assist with your technical or
            operational queries.
          </p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <Link
            to="/support/raise-ticket"
            className="flex-1 md:flex-none bg-accent-neon text-brand-black px-6 py-3 rounded-lg font-poppins font-semibold text-caption flex items-center justify-center gap-2 hover:opacity-90 transition-all whitespace-nowrap"
          >
            <Ticket size={18} strokeWidth={2} />
            Raise Support Ticket
          </Link>
          <ComingSoon label="Contact Support" position="top" inline>
            <span className="flex-1 md:flex-none border border-white/40 text-white px-6 py-3 rounded-lg font-poppins font-semibold text-caption flex items-center justify-center gap-2 hover:bg-white/10 transition-all whitespace-nowrap cursor-pointer">
              <MessageCircle size={18} strokeWidth={2} />
              Contact Support
            </span>
          </ComingSoon>
        </div>
      </section>
    </DashboardShell>
  );
}
