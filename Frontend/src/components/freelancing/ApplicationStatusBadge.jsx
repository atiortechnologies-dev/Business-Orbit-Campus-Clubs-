import React from 'react';

const config = {
  submitted: { label: 'Submitted', dot: 'bg-blue-500', text: 'text-blue-600', bg: 'bg-blue-50' },
  viewed: { label: 'Viewed', dot: 'bg-slate-400', text: 'text-slate-600', bg: 'bg-slate-100' },
  shortlisted: { label: 'Shortlisted', dot: 'bg-amber-500', text: 'text-amber-600', bg: 'bg-amber-50' },
  interview: { label: 'Interview', dot: 'bg-purple-500', text: 'text-purple-600', bg: 'bg-purple-50' },
  selected: { label: 'Selected', dot: 'bg-emerald-500', text: 'text-emerald-600', bg: 'bg-emerald-50' },
  rejected: { label: 'Rejected', dot: 'bg-rose-500', text: 'text-rose-600', bg: 'bg-rose-50' },
  withdrawn: { label: 'Withdrawn', dot: 'bg-slate-400', text: 'text-slate-500', bg: 'bg-slate-100' },
  default: { label: 'Pending', dot: 'bg-slate-400', text: 'text-slate-600', bg: 'bg-slate-100' }
};

export default function ApplicationStatusBadge({ status }) {
  const cfg = config[status] || config.default;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full ${cfg.bg} ${cfg.text} text-xs font-medium`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}