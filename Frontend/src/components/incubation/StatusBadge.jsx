import React from 'react';
import { cn } from '@/lib/utils';

const config = {
  open: { label: 'Open', className: 'bg-emerald-50 text-emerald-600' },
  waitlist: { label: 'Waitlist', className: 'bg-amber-50 text-amber-600' },
  closed: { label: 'Closed', className: 'bg-slate-100 text-slate-500' },
  application_in_review: { label: 'Application in Review', className: 'bg-emerald-50 text-emerald-600' },
  submitted: { label: 'Submitted', className: 'bg-slate-100 text-slate-600' },
  draft: { label: 'Draft', className: 'bg-slate-100 text-slate-500' },
  screening: { label: 'Screening', className: 'bg-blue-50 text-blue-600' },
  review: { label: 'Under Review', className: 'bg-slate-100 text-slate-600' },
  interview: { label: 'Interview', className: 'bg-violet-50 text-violet-600' },
  accepted: { label: 'Accepted', className: 'bg-emerald-50 text-emerald-600' },
  rejected: { label: 'Rejected', className: 'bg-rose-50 text-rose-600' },
  withdrawn: { label: 'Withdrawn', className: 'bg-slate-100 text-slate-500' }
};

export default function StatusBadge({ status, className }) {
  const c = config[status] || { label: status, className: 'bg-slate-100 text-slate-600' };
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wide',
        c.className,
        className
      )}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
      {c.label}
    </span>
  );
}