import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import StatusBadge from './StatusBadge';

function Stat({ label, value }) {
  return (
    <div>
      <p className="text-[13px] font-semibold text-slate-800">{value}</p>
      <p className="text-[10px] uppercase tracking-wide text-slate-400">{label}</p>
    </div>
  );
}

export default function IncubatorCard({ incubator }) {
  const closed = incubator.status === 'closed';
  const waitlist = incubator.status === 'waitlist';

  return (
    <div className="group rounded-xl border border-slate-200 bg-white p-5 hover:shadow-lg hover:border-slate-300 transition-all duration-300">
      {/* Header */}
      <div className="flex items-start gap-3">
        <div className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center overflow-hidden shrink-0">
          {incubator.logo ? (
            <img src={incubator.logo} alt={incubator.name} className="w-full h-full object-cover" />
          ) : (
            <span className="text-lg font-bold text-slate-400">
              {incubator.name?.[0]}
            </span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-slate-900 truncate">{incubator.name}</h3>
          <p className="text-xs text-slate-400 truncate">{incubator.hub_name}</p>
        </div>
        <StatusBadge status={incubator.status} />
      </div>

      {/* Description */}
      <p className="mt-3 text-sm text-slate-500 line-clamp-2 leading-relaxed">
        {incubator.description}
      </p>

      {/* Stats */}
      <div className="mt-4 flex items-center gap-5 border-y border-slate-100 py-3">
        <Stat label="Startups" value={incubator.startup_count} />
        <Stat label="Success" value={incubator.success_rate} />
        <Stat label="Raised" value={incubator.funding_raised} />
      </div>

      {/* Tags */}
      <div className="mt-3 flex flex-wrap gap-1.5">
        {(incubator.industry_tags || []).slice(0, 3).map((tag) => (
          <span
            key={tag}
            className="px-2.5 py-1 rounded-full bg-blue-50 text-blue-600 text-[11px] font-medium"
          >
            {tag}
          </span>
        ))}
        <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-500 text-[11px] font-medium">
          {incubator.stage}
        </span>
      </div>

      {/* Actions */}
      <div className="mt-4 flex gap-2">
        <Link
          to={`/incubators/${incubator.id}`}
          className="flex-1 h-9 inline-flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
        >
          View Details
        </Link>
        <Link
          to={`/incubators/${incubator.id}`}
          className={`flex-1 h-9 inline-flex items-center justify-center gap-1.5 rounded-lg text-sm font-medium transition-colors ${
            closed
              ? 'bg-slate-100 text-slate-400 cursor-not-allowed pointer-events-none'
              : 'bg-slate-900 text-white hover:bg-slate-800'
          }`}
        >
          {waitlist ? 'Join Waitlist' : 'Apply Now'}
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}