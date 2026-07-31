import { Link } from "react-router-dom";
import {
  FileText,
  File,
  ClipboardCheck,
  HelpCircle,
  Download,
  Lightbulb,
  ArrowRight,
  ChevronRight,
} from "lucide-react";
import DashboardShell from "@/components/dashboard/DashboardShell";
import ComingSoon from "@/components/ui/ComingSoon";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

const RESOURCES = [
  {
    icon: FileText,
    title: "Startup Idea Template",
    desc: "A comprehensive framework to structure your initial thoughts and unique value proposition.",
    action: "Preview Document",
  },
  {
    icon: File,
    title: "Sample Idea Doc",
    desc: "Review a successful ideation document from a previous BOCC cohort for inspiration.",
    action: "Preview Document",
  },
  {
    icon: ClipboardCheck,
    title: "Guidelines",
    desc: "Official program requirements and submission standards for Stage 1.",
    action: "Read Guidelines",
  },
  {
    icon: HelpCircle,
    title: "FAQs",
    desc: "Commonly asked questions about the ideation phase and student support resources.",
    action: "Visit FAQ Center",
  },
];

const TIPS = [
  {
    title: "Keep it simple",
    desc: "Don't over-engineer your initial concept. Focus on the core value proposition that resonates with early users.",
  },
  {
    title: "Focus on the problem first",
    desc: "A solution in search of a problem rarely succeeds. Clearly define the pain point you are addressing.",
  },
  {
    title: "Be objective",
    desc: "Separate your ego from your idea. Seek feedback that challenges your assumptions rather than confirming them.",
  },
];

export default function IdeationResourcesPage() {
  useDocumentTitle("Templates & Resources — BOCC");

  return (
    <DashboardShell pageId="ideation-resources">
      <nav className="mb-2 flex items-center gap-2 text-text-muted font-inter font-normal text-small">
        <Link
          to="/dashboard"
          className="hover:text-text-heading transition-colors"
        >
          Dashboard
        </Link>
        <ChevronRight size={14} strokeWidth={2} />
        <Link
          to="/build-startup/journey/ideation"
          className="hover:text-text-heading transition-colors"
        >
          Ideation
        </Link>
        <ChevronRight size={14} strokeWidth={2} />
        <span className="text-text-heading font-semibold">
          Templates &amp; Resources
        </span>
      </nav>

      <h1 className="font-poppins font-semibold text-page text-text-heading mb-1">
        Templates &amp; Resources
      </h1>
      <p className="font-inter text-body text-text-body mb-8">
        Equip yourself with the tools you need to validate your startup concept.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {RESOURCES.map(({ icon: Icon, title, desc, action }) => (
            <div
              key={title}
              className="bg-surface-white border border-border-subtle rounded-lg shadow-card p-5 flex flex-col"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-md bg-canvas-bg border border-border-subtle flex items-center justify-center">
                  <Icon size={18} strokeWidth={2} className="text-text-body" />
                </div>
                <ComingSoon label="Download" position="top" inline>
                  <span className="p-1.5 rounded-md text-text-muted hover:bg-canvas-bg transition-colors">
                    <Download size={16} strokeWidth={2} />
                  </span>
                </ComingSoon>
              </div>
              <h3 className="font-poppins font-semibold text-body text-text-heading mb-1">
                {title}
              </h3>
              <p className="font-inter text-small text-text-muted flex-1">
                {desc}
              </p>
              <ComingSoon label={action} position="top" inline className="mt-3">
                <span className="font-poppins font-semibold text-caption text-text-heading hover:opacity-80 transition-opacity">
                  {action}
                </span>
              </ComingSoon>
            </div>
          ))}
        </div>

        <aside className="lg:col-span-4 bg-brand-black rounded-lg p-6 h-fit">
          <div className="flex items-center gap-2 mb-5">
            <Lightbulb size={18} strokeWidth={2} className="text-accent-neon" />
            <h2 className="font-poppins font-semibold text-caption text-white uppercase tracking-wider">
              Stage 1 Tips
            </h2>
          </div>
          <div className="space-y-4">
            {TIPS.map(({ title, desc }) => (
              <div key={title}>
                <h3 className="font-poppins font-semibold text-small text-white">
                  {title}
                </h3>
                <p className="font-inter text-caption text-white/70 mt-1">
                  {desc}
                </p>
              </div>
            ))}
          </div>
          <div className="h-px bg-white/10 my-5" />
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-accent-neon" />
            <p className="font-inter text-small text-white/80">
              12 mentors online
            </p>
          </div>
        </aside>
      </div>

      <div className="flex justify-center mt-10 pt-8 border-t border-divider-line">
        <Link
          to="/build-startup/journey/ideation/submit"
          className="inline-flex items-center gap-2 bg-action-bg text-action-text px-8 py-3 rounded-md hover:opacity-90 active:scale-[0.98] transition-all font-poppins font-semibold text-body"
        >
          Continue to Idea Submission
          <ArrowRight size={18} strokeWidth={2} />
        </Link>
      </div>
    </DashboardShell>
  );
}
