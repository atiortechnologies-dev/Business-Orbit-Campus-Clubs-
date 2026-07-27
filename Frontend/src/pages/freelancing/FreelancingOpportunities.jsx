import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, SlidersHorizontal } from 'lucide-react';
import { freelancingService } from '@/lib/freelancingService';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/lib/AuthContext';
import OpportunityCard from '@/components/freelancing/OpportunityCard';

const oppTypes = ['Internship', 'Full-time', 'Part-time', 'Freelance'];
const workModes = ['Remote', 'Hybrid', 'On-site'];
const industries = ['All Industries', 'SaaS', 'Cloud Infrastructure', 'FinTech', 'HealthTech', 'EdTech', 'CleanTech'];
const experienceLevels = ['Any Level', 'Entry', 'Mid', 'Senior', 'Lead'];

export default function FreelancingOpportunities() {
  const { toast } = useToast();
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('opportunities');
  const [query, setQuery] = useState('');
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedModes, setSelectedModes] = useState([]);
  const [industry, setIndustry] = useState('All Industries');
  const [experience, setExperience] = useState('Any Level');
  const [sortBy, setSortBy] = useState('newest');
  const [page, setPage] = useState(1);
  const perPage = 6;

  useEffect(() => {
    freelancingService
      .listOpportunities()
      .then(setOpportunities)
      .catch(() => toast({ title: 'Error', description: 'Could not load opportunities.', variant: 'destructive' }))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    let result = opportunities.filter((opp) => {
      const matchQuery = !query || opp.job_title?.toLowerCase().includes(query.toLowerCase()) || opp.company?.toLowerCase().includes(query.toLowerCase());
      const matchType = selectedTypes.length === 0 || selectedTypes.includes(opp.opportunity_type);
      const matchMode = selectedModes.length === 0 || selectedModes.includes(opp.work_mode);
      const matchIndustry = industry === 'All Industries' || opp.industry === industry;
      const matchExp = experience === 'Any Level' || opp.experience_level === experience;
      return matchQuery && matchType && matchMode && matchIndustry && matchExp;
    });
    if (sortBy === 'newest') result = [...result].reverse();
    return result;
  }, [opportunities, query, selectedTypes, selectedModes, industry, experience, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const paged = filtered.slice((page - 1) * perPage, page * perPage);

  const toggleType = (t) => setSelectedTypes((prev) => prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]);
  const toggleMode = (m) => setSelectedModes((prev) => prev.includes(m) ? prev.filter((x) => x !== m) : [...prev, m]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-[28px] font-bold text-slate-900 tracking-tight">Freelancing Opportunities</h1>
        <p className="mt-1 text-sm text-slate-500 max-w-2xl">Browse hand-picked freelance gigs, internships, and full-time roles from BOCC partner companies.</p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-6 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('opportunities')}
          className={`pb-3 text-sm font-medium transition-colors ${
            activeTab === 'opportunities'
              ? 'text-slate-900 border-b-2 border-slate-900 -mb-px'
              : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          Opportunities
        </button>
        <Link
          to="/freelancing/my-applications"
          className={`pb-3 text-sm font-medium transition-colors ${
            activeTab === 'applications'
              ? 'text-slate-900 border-b-2 border-slate-900 -mb-px'
              : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          My Applications
        </Link>
      </div>

      {activeTab === 'opportunities' && (
        <div className="grid lg:grid-cols-[260px_1fr] gap-6">
          {/* Filters */}
          <aside className="space-y-5">
            <div className="rounded-xl border border-slate-200 bg-white p-5">
              <div className="flex items-center gap-2 mb-4">
                <SlidersHorizontal className="w-4 h-4 text-slate-400" />
                <h3 className="text-sm font-semibold text-slate-900">Filters</h3>
              </div>

              <div className="mb-5">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2.5">Opportunity Type</p>
                <div className="space-y-2">
                  {oppTypes.map((t) => (
                    <label key={t} className="flex items-center gap-2.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedTypes.includes(t)}
                        onChange={() => toggleType(t)}
                        className="w-4 h-4 rounded border-slate-300 text-slate-900 focus:ring-slate-400"
                      />
                      <span className="text-sm text-slate-600">{t}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="mb-5">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2.5">Work Mode</p>
                <div className="space-y-2">
                  {workModes.map((m) => (
                    <label key={m} className="flex items-center gap-2.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedModes.includes(m)}
                        onChange={() => toggleMode(m)}
                        className="w-4 h-4 rounded border-slate-300 text-slate-900 focus:ring-slate-400"
                      />
                      <span className="text-sm text-slate-600">{m}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="mb-5">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2.5">Industry</p>
                <select
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  className="w-full h-9 px-3 rounded-lg border border-slate-200 bg-white text-sm text-slate-600 focus:outline-none focus:border-slate-400 cursor-pointer"
                >
                  {industries.map((i) => <option key={i} value={i}>{i}</option>)}
                </select>
              </div>

              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2.5">Experience Level</p>
                <select
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  className="w-full h-9 px-3 rounded-lg border border-slate-200 bg-white text-sm text-slate-600 focus:outline-none focus:border-slate-400 cursor-pointer"
                >
                  {experienceLevels.map((l) => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>
            </div>
          </aside>

          {/* Opportunities list */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-slate-500">
                Showing <span className="font-medium text-slate-700">{filtered.length}</span> opportunities
              </p>
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-slate-400 uppercase tracking-wide">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="h-8 px-2.5 rounded-lg border border-slate-200 bg-white text-sm text-slate-600 focus:outline-none focus:border-slate-400 cursor-pointer"
                >
                  <option value="newest">Newest</option>
                  <option value="oldest">Oldest</option>
                </select>
              </div>
            </div>

            {loading ? (
              <div className="space-y-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="rounded-xl border border-slate-200 bg-white p-5 animate-pulse">
                    <div className="flex gap-3.5">
                      <div className="w-12 h-12 rounded-lg bg-slate-100" />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 w-1/3 bg-slate-100 rounded" />
                        <div className="h-3 w-1/4 bg-slate-100 rounded" />
                      </div>
                    </div>
                    <div className="mt-3 h-3 w-full bg-slate-100 rounded" />
                    <div className="mt-2 h-3 w-2/3 bg-slate-100 rounded" />
                  </div>
                ))}
              </div>
            ) : paged.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-300 bg-white py-16 text-center">
                <p className="text-slate-400 text-sm">No opportunities match your filters.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {paged.map((opp) => <OpportunityCard key={opp.id} opportunity={opp} />)}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-1.5 mt-6">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="w-8 h-8 inline-flex items-center justify-center rounded-lg border border-slate-200 text-slate-500 disabled:opacity-40 hover:bg-slate-50"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                {Array.from({ length: totalPages }).slice(0, 5).map((_, i) => (
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
                {totalPages > 5 && <span className="px-1 text-slate-400">...</span>}
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="w-8 h-8 inline-flex items-center justify-center rounded-lg border border-slate-200 text-slate-500 disabled:opacity-40 hover:bg-slate-50"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}