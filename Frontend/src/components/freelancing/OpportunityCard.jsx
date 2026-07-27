import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Briefcase, Clock } from 'lucide-react';

export default function OpportunityCard({ opportunity }) {
  const initial = opportunity.company?.[0] || 'C';

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 hover:shadow-md hover:border-slate-300 transition-all duration-200">
      <div className="flex items-start gap-3.5">
        <div className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center shrink-0 overflow-hidden">
          {opportunity.company_logo ? (
            <img src={opportunity.company_logo} alt={opportunity.company} className="w-full h-full object-cover" />
          ) : (
            <span className="text-lg font-bold text-slate-500">{initial}</span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-slate-900 truncate">{opportunity.job_title}</h3>
          <p className="text-sm text-slate-500 truncate">{opportunity.company}</p>
          <div className="flex items-center gap-3 mt-1 text-xs text-slate-400">
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {opportunity.location}
            </span>
            <span className="flex items-center gap-1">
              <Briefcase className="w-3 h-3" />
              {opportunity.work_mode}
            </span>
          </div>
        </div>
        <div className="text-right shrink-0">
          {opportunity.pay_range && (
            <p className="text-sm font-semibold text-slate-800">{opportunity.pay_range}</p>
          )}
          {opportunity.deadline && (
            <p className="text-xs text-slate-400 mt-0.5">Due {opportunity.deadline}</p>
          )}
        </div>
      </div>

      <p className="mt-3 text-sm text-slate-500 line-clamp-2 leading-relaxed">
        {opportunity.description}
      </p>

      {opportunity.tags?.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {opportunity.tags.slice(0, 4).map((tag, i) => (
            <span key={i} className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[11px] font-medium">
              {tag}
            </span>
          ))}
        </div>
      )}

      <div className="mt-4 flex items-center justify-between">
        {opportunity.posted_date && (
          <span className="flex items-center gap-1 text-xs text-slate-400">
            <Clock className="w-3 h-3" />
            Posted {opportunity.posted_date}
          </span>
        )}
        <div className="flex gap-2 ml-auto">
          <button className="h-9 px-4 rounded-lg border border-slate-300 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">
            Save
          </button>
          <Link
            to={`/freelancing/opportunity/${opportunity.id}`}
            className="h-9 px-4 inline-flex items-center rounded-lg bg-slate-900 text-white text-sm font-medium hover:bg-slate-800 transition-colors"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}