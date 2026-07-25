import { useMemo, useState } from 'react';
import { Search, LayoutGrid, List, SlidersHorizontal, ChevronLeft, ChevronRight, Play, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import InvestorShell from '@/components/investor/InvestorShell';
import Badge from '@/components/ui/Badge';
import ComingSoon from '@/components/ui/ComingSoon';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

const DECKS = [
  { id: 1, name: 'NeuraLinker', founder: 'Sarah Jenkins', chapter: 'Boston Chapter', stage: 'MVP', submitted: 'Oct 12', tags: ['AI/ML', 'SaaS'], description: 'Revolutionizing distributed computing by leveraging dormant browser processing power for large-scale workloads.', targetRaise: '$1.2M' },
  { id: 2, name: 'EcoGro Systems', founder: 'Marcus Chen', chapter: 'SF Chapter', stage: 'Traction', submitted: 'Oct 10', tags: ['AgTech', 'Sustainability'], description: 'Automated vertical hydroponic systems for urban restaurants, reducing food transport emissions significantly.', targetRaise: '$750K' },
  { id: 3, name: 'Solara Energy', founder: 'Elena Rodriguez', chapter: 'Miami Chapter', stage: 'Pre-Seed', submitted: 'Oct 08', tags: ['Clean Energy', 'Hardware'], description: 'Next-gen thin-film solar coating for commercial skyscrapers, turning entire glass facades into power sources.', targetRaise: '$2.5M' },
  { id: 4, name: 'Vellum Labs', founder: 'David Wu', chapter: 'NY Chapter', stage: 'MVP', submitted: 'Oct 05', tags: ['FinTech', 'Legal'], description: 'Smart-contract platform for automated trust fund management, ensuring conditional asset transfers.', targetRaise: '$450K' },
  { id: 5, name: 'BioSense', founder: 'Dr. Amara Okafor', chapter: 'Chicago Chapter', stage: 'Scaling', submitted: 'Oct 03', tags: ['HealthTech', 'Bio'], description: 'Non-invasive glucose monitoring via wearable photonic sensors, eliminating the need for daily pin-pricks.', targetRaise: '$4.8M' },
  { id: 6, name: 'OrbitLogistics', founder: 'Kyle Thompson', chapter: 'Seattle Chapter', stage: 'Pre-Revenue', submitted: 'Oct 01', tags: ['SpaceTech', 'Supply Chain'], description: 'Last-mile orbital delivery infrastructure using reusable micro-thrusters for precise positioning.', targetRaise: '$3.2M' },
];

const STAGE_VARIANT = { MVP: 'info', Traction: 'success', 'Pre-Seed': 'neutral', Scaling: 'success', 'Pre-Revenue': 'warning' };

export default function IncomingPitchDecksPage() {
  useDocumentTitle('Incoming Pitch Decks — BOCC');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid');

  const filteredDecks = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return DECKS;
    return DECKS.filter(
      (deck) =>
        deck.name.toLowerCase().includes(q) ||
        deck.founder.toLowerCase().includes(q) ||
        deck.tags.some((tag) => tag.toLowerCase().includes(q))
    );
  }, [searchQuery]);

  return (
    <InvestorShell>
      <div className="mb-6">
        <p className="font-inter text-caption font-semibold uppercase tracking-wider text-text-muted mb-1">
          Portal <span className="mx-1">/</span> Incoming Decks
        </p>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="font-poppins font-bold text-section text-text-heading mb-1">
              Incoming Pitch Decks
            </h1>
            <p className="font-inter text-body text-text-muted">
              Review the latest submissions from across the BOCC network.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center border border-border-subtle rounded-md overflow-hidden">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                aria-pressed={viewMode === 'grid'}
                className={`p-2 transition-colors ${viewMode === 'grid' ? 'bg-action-bg text-action-text' : 'text-text-muted hover:bg-canvas-bg'}`}
              >
                <LayoutGrid size={16} strokeWidth={2} />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('list')}
                aria-pressed={viewMode === 'list'}
                className={`p-2 transition-colors ${viewMode === 'list' ? 'bg-action-bg text-action-text' : 'text-text-muted hover:bg-canvas-bg'}`}
              >
                <List size={16} strokeWidth={2} />
              </button>
            </div>
            <ComingSoon label="Filter" position="top" inline className="inline-flex items-center gap-2 border border-border-subtle text-text-heading font-inter font-medium text-small px-4 py-2 rounded-md">
              <SlidersHorizontal size={16} strokeWidth={2} />
              Filter
            </ComingSoon>
          </div>
        </div>
      </div>

      <div className="relative mb-6">
        <Search size={18} strokeWidth={2} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search startups, founders, or industries..."
          className="w-full max-w-md bg-surface-white border border-border-subtle rounded-lg pl-10 pr-4 py-2.5 font-inter text-small text-text-body focus:outline-none focus:ring-1 focus:ring-brand-black transition-all"
        />
      </div>

      <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6' : 'flex flex-col gap-4'}>
        {filteredDecks.map((deck) => (
          <div
            key={deck.id}
            className={`bg-surface-white border border-border-subtle rounded-lg shadow-card p-6 flex flex-col ${viewMode === 'list' ? 'md:flex-row md:items-center md:gap-6' : ''}`}
          >
            <div className={viewMode === 'list' ? 'flex-1 min-w-0' : ''}>
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-md placeholder-box shrink-0" />
                <div className="text-right">
                  <Badge variant={STAGE_VARIANT[deck.stage] || 'neutral'}>{deck.stage}</Badge>
                  <p className="font-inter text-caption text-text-muted mt-1">Submitted {deck.submitted}</p>
                </div>
              </div>

              <h3 className="font-poppins font-semibold text-card text-text-heading">{deck.name}</h3>
              <p className="font-inter text-small text-text-muted mb-3">
                Founded by {deck.founder} &bull; {deck.chapter}
              </p>

              <div className="flex flex-wrap gap-2 mb-3">
                {deck.tags.map((tag) => (
                  <Badge key={tag} variant="neutral">{tag}</Badge>
                ))}
              </div>

              <p className="font-inter text-small text-text-body leading-relaxed mb-4">{deck.description}</p>

              <div className="flex items-center justify-between pt-3 border-t border-border-subtle">
                <div>
                  <p className="font-inter text-caption uppercase tracking-wider text-text-muted">Target Raise</p>
                  <p className="font-poppins font-semibold text-body text-text-heading">{deck.targetRaise}</p>
                </div>
              </div>
            </div>

            <div className={`flex items-center gap-2 ${viewMode === 'list' ? 'mt-4 md:mt-0 shrink-0' : 'mt-4'}`}>
              <Link
                to="/investor/pitch-decks/review"
                className="flex-1 inline-flex items-center justify-center gap-2 bg-action-bg text-action-text font-poppins font-semibold text-small px-4 py-2.5 rounded-md hover:opacity-90 transition-all"
              >
                <Play size={14} strokeWidth={2} />
                View Pitch Deck
              </Link>
              <ComingSoon label="Quick preview" position="top" inline className="p-2.5 border border-border-subtle rounded-md">
                <Eye size={16} strokeWidth={2} className="text-text-muted" />
              </ComingSoon>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 pt-6 border-t border-border-subtle">
        <p className="font-inter text-small text-text-muted">
          Showing {filteredDecks.length} of {DECKS.length} submissions
        </p>
        <div className="flex items-center gap-1">
          <button type="button" disabled className="p-2 rounded-md border border-border-subtle text-text-muted disabled:opacity-40 disabled:cursor-not-allowed">
            <ChevronLeft size={16} strokeWidth={2} />
          </button>
          <span className="px-3 py-1.5 rounded-md bg-action-bg text-action-text font-inter text-small font-medium">1</span>
          <button type="button" disabled className="p-2 rounded-md border border-border-subtle text-text-muted disabled:opacity-40 disabled:cursor-not-allowed">
            <ChevronRight size={16} strokeWidth={2} />
          </button>
        </div>
      </div>
    </InvestorShell>
  );
}
