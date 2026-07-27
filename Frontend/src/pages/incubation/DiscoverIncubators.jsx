import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Plus, ArrowRight, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';
import { incubationService } from '@/lib/incubationService';
import { useToast } from '@/components/ui/use-toast';
import IncubatorCard from '@/components/incubation/IncubatorCard';
import { IncubatorCardSkeleton } from '@/components/incubation/Skeleton';

const filterConfig = [
  { key: 'industry', label: 'Industry', options: ['All', 'SaaS/Fintech', 'Deep Tech', 'CleanTech', 'HealthTech', 'EdTech'] },
  { key: 'stage', label: 'Startup Stage', options: ['All', 'Ideation', 'MVP', 'Seed', 'Growth'] },
  { key: 'program_type', label: 'Program Type', options: ['All', 'Accelerator', 'Incubator', 'Studio', 'Grant'] },
  { key: 'location', label: 'Location', options: ['All', 'Silicon Valley', 'Remote', 'New York', 'London', 'Bengaluru'] },
  { key: 'status', label: 'Application Status', options: ['All', 'open', 'waitlist', 'closed'] }
];

export default function DiscoverIncubators() {
  const { toast } = useToast();
  const [incubators, setIncubators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState({ industry: 'All', stage: 'All', program_type: 'All', location: 'All', status: 'All' });
  const [page, setPage] = useState(1);
  const perPage = 6;

  useEffect(() => {
    incubationService
      .listIncubators()
      .then(setIncubators)
      .catch(() => toast({ title: 'Error', description: 'Could not load incubators.', variant: 'destructive' }))
      .finally(() => setLoading(false));
  }, []);

  const featured = incubators.find((i) => i.featured) || incubators[0];

  const filtered = useMemo(() => {
    return incubators.filter((inc) => {
      const matchQuery = !query || inc.name?.toLowerCase().includes(query.toLowerCase()) || inc.description?.toLowerCase().includes(query.toLowerCase());
      const matchFilters = Object.entries(filters).every(([key, val]) => val === 'All' || inc[key] === val || (key === 'industry' && inc.industry_tags?.includes(val)));
      return matchQuery && matchFilters;
    });
  }, [incubators, query, filters]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const paged = filtered.slice((page - 1) * perPage, page * perPage);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Hero */}
      <div>
        <h1 className="text-2xl sm:text-[28px] font-bold text-slate-900 tracking-tight">Discover Incubators</h1>
        <p className="mt-1 text-sm text-slate-500">Explore programs tailored to accelerate your startup journey.</p>
      </div>

      {/* Filter bar */}
      <div className="flex flex-wrap gap-2.5">
        {filterConfig.map((f) => (
          <select
            key={f.key}
            value={filters[f.key]}
            onChange={(e) => { setFilters({ ...filters, [f.key]: e.target.value }); setPage(1); }}
            className="h-9 px-3 rounded-lg border border-slate-200 bg-white text-sm text-slate-600 focus:outline-none focus:border-slate-400 cursor-pointer"
          >
            {f.options.map((o) => (
              <option key={o} value={o}>{f.label}: {o === 'All' ? 'Any' : o}</option>
            ))}
          </select>
        ))}
      </div>

      {/* Featured banner */}
      {featured && !loading && (
        <div className="relative overflow-hidden rounded-2xl bg-slate-900 text-white p-6 sm:p-8">
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/95 to-slate-900/70" />
          <div className="relative flex flex-col sm:flex-row items-start gap-5">
            <div className="w-16 h-16 rounded-xl bg-white flex items-center justify-center shrink-0">
              {featured.logo ? (
                <img src={featured.logo} alt="" className="w-full h-full object-cover rounded-xl" />
              ) : (
                <Sparkles className="w-7 h-7 text-slate-900" />
              )}
            </div>
            <div className="flex-1">
              <span className="inline-block px-2.5 py-1 rounded-full bg-amber-400/90 text-slate-900 text-[11px] font-bold uppercase tracking-wide">Featured</span>
              <h2 className="mt-3 text-xl sm:text-2xl font-bold">{featured.name}</h2>
              <p className="mt-2 text-sm text-slate-300 max-w-2xl leading-relaxed">{featured.description}</p>
              <div className="mt-4 flex flex-wrap gap-2.5">
                <Link to={`/incubators/${featured.id}`} className="h-9 px-5 inline-flex items-center rounded-lg bg-white text-slate-900 text-sm font-semibold hover:bg-slate-100 transition-colors">
                  Apply Now
                </Link>
                <Link to={`/incubators/${featured.id}`} className="h-9 px-5 inline-flex items-center rounded-lg border border-white/30 text-white text-sm font-semibold hover:bg-white/10 transition-colors">
                  Learn More
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cards grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-900">All Programs</h3>
          <span className="text-sm text-slate-400">{filtered.length} programs</span>
        </div>

        {loading ? (
          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => <IncubatorCardSkeleton key={i} />)}
          </div>
        ) : paged.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 bg-white py-16 text-center">
            <p className="text-slate-400 text-sm">No incubators match your filters.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
            {paged.map((inc) => <IncubatorCard key={inc.id} incubator={inc} />)}
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-slate-200 pt-4">
          <p className="text-sm text-slate-400">
            Showing {paged.length} of {filtered.length} programs
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="w-8 h-8 inline-flex items-center justify-center rounded-lg border border-slate-200 text-slate-500 disabled:opacity-40 hover:bg-slate-50"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`w-8 h-8 inline-flex items-center justify-center rounded-lg border text-sm font-medium transition-colors ${
                  page === i + 1 ? 'bg-slate-900 text-white border-slate-900' : 'border-slate-200 text-slate-500 hover:bg-slate-50'
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="w-8 h-8 inline-flex items-center justify-center rounded-lg border border-slate-200 text-slate-500 disabled:opacity-40 hover:bg-slate-50"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* FAB */}
      <Link
        to="/incubators"
        className="fixed bottom-6 right-6 w-12 h-12 rounded-full bg-slate-900 text-white shadow-lg flex items-center justify-center hover:bg-slate-800 transition-colors"
        title="New"
      >
        <Plus className="w-5 h-5" />
      </Link>
    </div>
  );
}