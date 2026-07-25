import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, MessageSquare, Calendar, BarChart3, Check, ExternalLink } from 'lucide-react';
import InvestorShell from '@/components/investor/InvestorShell';
import Badge from '@/components/ui/Badge';
import ComingSoon from '@/components/ui/ComingSoon';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

const SLIDES = [
  { id: 1, label: 'Executive Summary' },
  { id: 2, label: 'Problem' },
  { id: 3, label: 'Solution' },
  { id: 4, label: 'Market Analysis' },
  { id: 5, label: 'Technology' },
  { id: 6, label: 'Business Model' },
  { id: 7, label: 'Traction' },
  { id: 8, label: 'Team' },
];

const STATS = [
  { label: 'Market Size', value: '$2B', sub: 'TAM' },
  { label: 'Revenue', value: '$1.2M', sub: 'ARR' },
  { label: 'Funding Req', value: '$5.0M', sub: '' },
  { label: 'Current Stage', value: 'Series A', sub: '' },
];

const FOUNDING_TEAM = [
  { id: 1, name: 'Dr. Elena Vance', role: 'CEO — NASA Alum' },
  { id: 2, name: 'Marcus Thorne', role: 'CTO — ex-SpaceX' },
];

const KEY_HIGHLIGHTS = [
  'Reached $1.2M ARR in 14 months',
  '500+ early-access enterprise users',
  '300% YoY growth in test efficiency',
  '4 patents pending on ionic thrust',
];

// This viewer shows one seeded example (AeroFlow Dynamics) regardless of
// which deck was clicked — same honest-stub pattern as Incubator's
// ApplicationReview.jsx, since there's only one seeded pitch deck in this
// app, not a real multi-deck dataset yet.
export default function PitchDeckPage() {
  useDocumentTitle('AeroFlow Dynamics — Pitch Deck — BOCC');
  const [currentSlide, setCurrentSlide] = useState(4);
  const [investorNotes, setInvestorNotes] = useState('');
  const [notesSaved, setNotesSaved] = useState(false);

  const activeSlide = SLIDES.find((s) => s.id === currentSlide);

  const handleSaveNotes = () => {
    // TODO(backend): PATCH these due-diligence notes against this deck
    // ({ dealId, investorNotes }) once there's a real multi-deck dataset
    // for them to belong to.
    setNotesSaved(true);
    setTimeout(() => setNotesSaved(false), 2000);
  };

  return (
    <InvestorShell>
      <p className="font-inter text-caption font-semibold uppercase tracking-wider text-text-muted mb-4">
        <Link to="/investor/pitch-decks" className="hover:text-text-heading transition-colors">Pitch Decks</Link>
        <span className="mx-1">/</span> AeroFlow Dynamics
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-3 bg-surface-white border border-border-subtle rounded-lg shadow-card p-4 flex flex-col">
          <div className="flex items-center justify-between mb-4 px-2">
            <span className="font-poppins font-semibold text-small text-text-heading">Pitch Deck</span>
            <span className="font-inter text-caption text-text-muted">{SLIDES.length} Slides</span>
          </div>

          <div className="flex flex-col gap-1 flex-1 overflow-y-auto">
            {SLIDES.map((slide) => (
              <button
                key={slide.id}
                type="button"
                onClick={() => setCurrentSlide(slide.id)}
                className={`text-left px-3 py-2.5 rounded-md font-inter text-small transition-colors ${
                  slide.id === currentSlide
                    ? 'bg-action-bg text-action-text font-medium'
                    : 'text-text-body hover:bg-canvas-bg'
                }`}
              >
                {slide.id}. {slide.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border-subtle px-2">
            <div className="w-8 h-8 rounded-full bg-canvas-bg border border-border-subtle shrink-0" />
            <div className="min-w-0">
              <p className="font-poppins font-semibold text-caption text-text-heading truncate">Marcus Webb</p>
              <p className="font-inter text-caption text-text-muted truncate">Principal Investor</p>
            </div>
          </div>
          <ComingSoon label="Start Conversation" position="top" inline={false} className="mt-3 flex items-center justify-center gap-2 border border-border-subtle text-text-heading font-inter font-medium text-small px-4 py-2.5 rounded-md">
            <MessageSquare size={16} strokeWidth={2} />
            Start Conversation
          </ComingSoon>
        </div>

        <div className="lg:col-span-6 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h1 className="font-poppins font-bold text-card text-text-heading">
              {activeSlide?.label ?? 'Market Opportunity & Dynamics'}
            </h1>
          </div>

          <div className="placeholder-box aspect-video rounded-lg border border-border-subtle flex flex-col items-center justify-center gap-2 mb-4">
            <BarChart3 size={32} strokeWidth={1.5} className="text-text-muted" />
            <p className="font-inter text-small text-text-muted">Visualizing $2B market projection</p>
          </div>

          <div className="flex items-center justify-between mb-6">
            <button
              type="button"
              onClick={() => setCurrentSlide((prev) => Math.max(1, prev - 1))}
              disabled={currentSlide === 1}
              className="inline-flex items-center gap-1.5 font-inter font-medium text-small text-text-body hover:text-text-heading disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={16} strokeWidth={2} />
              Previous
            </button>
            <span className="font-inter text-small text-text-muted">
              Slide {currentSlide} of {SLIDES.length}
            </span>
            <button
              type="button"
              onClick={() => setCurrentSlide((prev) => Math.min(SLIDES.length, prev + 1))}
              disabled={currentSlide === SLIDES.length}
              className="inline-flex items-center gap-1.5 bg-action-bg text-action-text font-poppins font-semibold text-small px-4 py-2 rounded-md hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              Next
              <ChevronRight size={16} strokeWidth={2} />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {STATS.map((stat) => (
              <div key={stat.label} className="bg-surface-white border border-border-subtle rounded-lg p-4">
                <p className="font-inter text-caption uppercase tracking-wider text-text-muted mb-1">{stat.label}</p>
                <p className="font-poppins font-semibold text-body text-text-heading">{stat.value}</p>
                {stat.sub && <p className="font-inter text-caption text-text-muted">{stat.sub}</p>}
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-3 bg-surface-white border border-border-subtle rounded-lg shadow-card p-6 flex flex-col gap-6">
          <div>
            <div className="flex items-start justify-between mb-2">
              <div className="w-10 h-10 rounded-md placeholder-box shrink-0" />
              <Badge variant="success">Series A</Badge>
            </div>
            <h2 className="font-poppins font-semibold text-card text-text-heading">AeroFlow Dynamics</h2>
            <p className="font-inter text-caption text-text-muted mb-2">Palo Alto, CA</p>
            <p className="font-inter text-small text-text-body leading-relaxed mb-2">
              Next-gen propulsion systems for sustainable aviation.
            </p>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1 font-inter text-small text-text-body">
                <ExternalLink size={12} strokeWidth={2} /> aeroflow.tech
              </span>
              <Badge variant="neutral">Green Tech</Badge>
            </div>
          </div>

          <div>
            <p className="font-inter text-caption font-semibold uppercase tracking-wider text-text-muted mb-2">Founding Team</p>
            <div className="flex flex-col gap-3">
              {FOUNDING_TEAM.map((member) => (
                <div key={member.id} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-canvas-bg border border-border-subtle shrink-0" />
                  <div className="min-w-0">
                    <p className="font-poppins font-semibold text-small text-text-heading truncate">{member.name}</p>
                    <p className="font-inter text-caption text-text-muted truncate">{member.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="font-inter text-caption font-semibold uppercase tracking-wider text-text-muted mb-2">Key Highlights</p>
            <ul className="flex flex-col gap-2">
              {KEY_HIGHLIGHTS.map((item) => (
                <li key={item} className="flex items-start gap-2 font-inter text-small text-text-body">
                  <Check size={14} strokeWidth={2.5} className="text-success shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <label htmlFor="investor-notes" className="font-inter text-caption font-semibold uppercase tracking-wider text-text-muted mb-2 block">
              Investor Notes
            </label>
            <textarea
              id="investor-notes"
              value={investorNotes}
              onChange={(e) => setInvestorNotes(e.target.value)}
              placeholder="Add your due diligence notes here..."
              rows={4}
              className="w-full bg-canvas-bg border border-border-subtle rounded-md p-3 font-inter text-small text-text-body focus:outline-none focus:ring-1 focus:ring-brand-black transition-all resize-none"
            />
            <div className="flex items-center gap-3 mt-2">
              {notesSaved && <span className="font-inter text-caption text-success">Saved</span>}
              <button
                type="button"
                onClick={handleSaveNotes}
                className="font-poppins font-semibold text-caption text-text-heading hover:underline"
              >
                Save Notes
              </button>
            </div>
          </div>

          <ComingSoon label="Request Pitch Meeting" position="top" inline={false} className="flex items-center justify-center gap-2 bg-action-bg text-action-text font-poppins font-semibold text-small px-4 py-2.5 rounded-md">
            <Calendar size={16} strokeWidth={2} />
            Request Pitch Meeting
          </ComingSoon>
        </div>
      </div>
    </InvestorShell>
  );
}
