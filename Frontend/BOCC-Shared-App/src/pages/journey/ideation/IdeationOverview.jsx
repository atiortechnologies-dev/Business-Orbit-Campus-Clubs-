import { Link } from 'react-router-dom';
import { Lightbulb, FileEdit, Users, Award, BookOpen, ChevronRight, ArrowRight } from 'lucide-react';
import DashboardShell from '@/components/dashboard/DashboardShell';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

const STEPS = [
  { icon: FileEdit, title: 'Submit Your Idea', desc: 'Detail your problem, solution, and target audience.', href: '/build-startup/journey/ideation/submit' },
  { icon: Users, title: 'Review Meeting', desc: 'Meet with your assigned mentor to discuss your submission.', href: '/build-startup/journey/ideation/review-meeting' },
  { icon: Award, title: 'Review Result', desc: 'Get feedback and find out if Validation is unlocked.', href: '/build-startup/journey/ideation/review-result' },
  { icon: BookOpen, title: 'Templates & Resources', desc: 'Frameworks and guidelines to help you prepare.', href: '/build-startup/journey/ideation/resources' },
];

export default function IdeationOverviewPage() {
  useDocumentTitle('Stage 1: Ideation — BOCC');

  return (
    <DashboardShell pageId="ideation-overview">
      <nav className="mb-2 flex items-center gap-2 text-text-muted font-inter font-normal text-small">
        <Link to="/dashboard" className="hover:text-text-heading transition-colors">Dashboard</Link>
        <ChevronRight size={14} strokeWidth={2} />
        <Link to="/build-startup/journey" className="hover:text-text-heading transition-colors">Startup Journey</Link>
        <ChevronRight size={14} strokeWidth={2} />
        <span className="text-text-heading font-semibold">Ideation</span>
      </nav>

      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-lg bg-brand-black flex items-center justify-center shrink-0">
          <Lightbulb size={20} strokeWidth={2} className="text-accent-neon" />
        </div>
        <h1 className="font-poppins font-semibold text-page text-text-heading">Stage 1: Ideation</h1>
      </div>
      <p className="font-inter text-body text-text-body max-w-2xl mb-8">
        Every startup begins with a clearly articulated idea. Work through the steps below to
        submit your concept, meet with a mentor, and unlock Stage 2: Validation.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        {STEPS.map(({ icon: Icon, title, desc, href }) => (
          <Link
            key={title}
            to={href}
            className="flex items-start gap-4 p-6 bg-surface-white border border-border-subtle rounded-lg shadow-card hover:border-text-muted transition-colors"
          >
            <div className="w-10 h-10 rounded-md bg-canvas-bg border border-border-subtle flex items-center justify-center shrink-0">
              <Icon size={20} strokeWidth={2} className="text-text-body" />
            </div>
            <div className="min-w-0">
              <h3 className="font-poppins font-semibold text-body text-text-heading">{title}</h3>
              <p className="font-inter text-small text-text-muted mt-1">{desc}</p>
            </div>
          </Link>
        ))}
      </div>

      <Link
        to="/build-startup/journey/ideation/submit"
        className="inline-flex items-center gap-2 bg-action-bg text-action-text px-8 py-3 rounded-md hover:opacity-90 active:scale-[0.98] transition-all font-poppins font-semibold text-body"
      >
        Start Ideation
        <ArrowRight size={18} strokeWidth={2} />
      </Link>
    </DashboardShell>
  );
}
