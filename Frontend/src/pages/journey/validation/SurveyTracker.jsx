import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, FileUp, ChevronRight, ArrowRight, TrendingUp, AlertCircle } from 'lucide-react';
import DashboardShell from '@/components/dashboard/DashboardShell';
import StatCard from '@/components/ui/StatCard';
import ComingSoon from '@/components/ui/ComingSoon';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

const RECENT = [
  { id: 65, sentiment: 'Positive Sentiment', tag: 'Product Fit' },
  { id: 64, sentiment: 'Neutral Sentiment', tag: 'UI Feedback' },
  { id: 63, sentiment: 'Negative Sentiment', tag: 'Pricing Concern' },
];

const LEARNINGS = [
  { quote: '"80% of respondents struggle with manual data entry."', note: 'Found in Batch 2 (Responses 20–45). This confirms the core pain point identified in our initial ideation session.' },
  { quote: '"Mobile accessibility is a secondary but frequent request."', note: 'Users mentioned they often need to check status updates while in the field.' },
];

export default function SurveyTrackerPage() {
  useDocumentTitle('Survey Tracker — BOCC');
  const navigate = useNavigate();
  const [responses] = useState({ total: 65, target: 100, positive: 42, negative: 23 });

  const completion = Math.round((responses.total / responses.target) * 100);

  const handleContinue = () => {
    // TODO(backend): persist survey-tracker state for the current student.
    navigate('/build-startup/journey/validation/evidence-upload');
  };

  return (
    <DashboardShell pageId="survey-tracker">
      <nav className="mb-2 flex items-center gap-2 text-text-muted font-inter font-normal text-small">
        <Link to="/dashboard" className="hover:text-text-heading transition-colors">Dashboard</Link>
        <ChevronRight size={14} strokeWidth={2} />
        <Link to="/build-startup/journey/validation" className="hover:text-text-heading transition-colors">Validation</Link>
        <ChevronRight size={14} strokeWidth={2} />
        <span className="text-text-heading font-semibold">Survey Tracker</span>
      </nav>

      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
        <div>
          <h1 className="font-poppins font-semibold text-page text-text-heading mb-1">Survey Tracker</h1>
          <p className="font-inter text-body text-text-body">Track your customer-discovery progress and sentiment analysis.</p>
        </div>
        <div className="text-right shrink-0">
          <p className="font-poppins font-semibold text-card text-text-heading">{responses.total} / {responses.target}</p>
          <p className="font-inter text-caption text-text-muted uppercase tracking-wider">Responses Collected</p>
        </div>
      </div>

      <div className="h-2 bg-canvas-bg rounded-full overflow-hidden mb-8">
        <div className="h-full bg-brand-black rounded-full transition-all" style={{ width: `${completion}%` }} />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Responses" value={responses.total} />
        <StatCard label="Positive Feedback" value={responses.positive} />
        <StatCard label="Negative Feedback" value={responses.negative} />
        <StatCard label="Completion" value={`${completion}%`} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
        <div className="lg:col-span-8 bg-surface-white border border-border-subtle rounded-lg shadow-card p-6">
          <h3 className="font-poppins font-semibold text-body text-text-heading mb-4">Key Learnings &amp; Notes</h3>
          <div className="bg-canvas-bg rounded-lg p-4 space-y-4">
            {LEARNINGS.map(({ quote, note }) => (
              <div key={quote} className="flex gap-3">
                <TrendingUp size={16} strokeWidth={2} className="text-text-muted shrink-0 mt-0.5" />
                <div>
                  <p className="font-inter font-semibold italic text-small text-text-heading">{quote}</p>
                  <p className="font-inter text-small text-text-muted mt-0.5">{note}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-4 space-y-4">
          <div className="bg-brand-black rounded-lg p-6 text-center">
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-3">
              <Plus size={20} strokeWidth={2} className="text-white" />
            </div>
            <h4 className="font-poppins font-semibold text-body text-white mb-1">Add Responses</h4>
            <p className="font-inter text-caption text-white/70 mb-4">Manually input survey results from 1-on-1 interviews.</p>
            <ComingSoon label="Add Survey Responses" position="top" inline>
              <span className="block w-full bg-white text-brand-black py-2 rounded-md font-poppins font-semibold text-caption uppercase tracking-wider">
                Add Survey Responses
              </span>
            </ComingSoon>
          </div>
          <div className="bg-surface-white border border-border-subtle rounded-lg shadow-card p-6 text-center">
            <div className="w-10 h-10 rounded-full bg-canvas-bg border border-border-subtle flex items-center justify-center mx-auto mb-3">
              <FileUp size={18} strokeWidth={2} className="text-text-body" />
            </div>
            <h4 className="font-poppins font-semibold text-body text-text-heading mb-1">Bulk Import</h4>
            <p className="font-inter text-caption text-text-muted mb-4">Upload .csv or Excel files from external survey tools.</p>
            <ComingSoon label="Upload Results" position="top" inline>
              <span className="block w-full border border-border-subtle text-text-heading py-2 rounded-md font-poppins font-semibold text-caption uppercase tracking-wider">
                Upload Results
              </span>
            </ComingSoon>
          </div>
        </div>
      </div>

      <div className="bg-surface-white border border-border-subtle rounded-lg shadow-card overflow-hidden mb-8">
        <div className="flex items-center justify-between bg-canvas-bg px-5 py-3">
          <p className="font-inter font-semibold text-caption text-text-muted uppercase tracking-wider">Recent Activity</p>
          <p className="font-inter text-caption text-text-muted">Last updated: 2 hours ago</p>
        </div>
        <div className="divide-y divide-divider-line">
          {RECENT.map(({ id, sentiment, tag }) => (
            <div key={id} className="flex items-center justify-between px-5 py-3">
              <div className="flex items-center gap-3">
                <AlertCircle size={16} strokeWidth={2} className="text-text-muted" />
                <div>
                  <p className="font-inter font-semibold text-small text-text-heading">Response #{id}</p>
                  <p className="font-inter text-caption text-text-muted">{sentiment} · {tag}</p>
                </div>
              </div>
              <ChevronRight size={16} strokeWidth={2} className="text-text-muted" />
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between pt-6 border-t border-divider-line">
        <button
          type="button"
          // TODO(backend): persist as a draft against the student's account.
          className="font-poppins font-semibold text-small text-text-heading hover:opacity-80 transition-opacity"
        >
          Save Draft
        </button>
        <button
          type="button"
          onClick={handleContinue}
          className="inline-flex items-center gap-2 bg-action-bg text-action-text px-6 py-2.5 rounded-md hover:opacity-90 active:scale-[0.98] transition-all font-poppins font-semibold text-small"
        >
          Continue
          <ArrowRight size={16} strokeWidth={2} />
        </button>
      </div>
    </DashboardShell>
  );
}
