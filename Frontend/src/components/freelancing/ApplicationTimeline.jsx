import React from 'react';
import { Check } from 'lucide-react';

const STAGES = ['submitted', 'viewed', 'shortlisted', 'interview', 'selected'];
const LABELS = ['Submitted', 'Viewed', 'Shortlisted', 'Interview', 'Selected'];

export default function ApplicationTimeline({ status }) {
  if (status === 'rejected') {
    return (
      <div className="flex items-center gap-2">
        {LABELS.slice(0, 4).map((label, i) => (
          <React.Fragment key={i}>
            <div className="flex flex-col items-center gap-1.5">
              <div className="w-7 h-7 rounded-full bg-slate-200 flex items-center justify-center">
                {i < 4 && <Check className="w-3.5 h-3.5 text-slate-500" />}
              </div>
              <span className="text-[10px] text-slate-400">{label}</span>
            </div>
            {i < 3 && <div className="flex-1 h-px bg-slate-200 min-w-[20px]" />}
          </React.Fragment>
        ))}
        <div className="flex-1 h-px bg-slate-200 min-w-[20px]" />
        <div className="flex flex-col items-center gap-1.5">
          <div className="w-7 h-7 rounded-full bg-rose-500 flex items-center justify-center ring-4 ring-rose-100">
            <span className="text-white text-xs font-bold">✕</span>
          </div>
          <span className="text-[10px] text-rose-500 font-medium">Rejected</span>
        </div>
      </div>
    );
  }

  if (status === 'withdrawn') {
    return (
      <div className="flex items-center gap-2">
        <div className="flex flex-col items-center gap-1.5">
          <div className="w-7 h-7 rounded-full bg-slate-900 flex items-center justify-center">
            <Check className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="text-[10px] text-slate-600">Submitted</span>
        </div>
        <div className="flex-1 h-px bg-slate-200 min-w-[20px]" />
        <div className="flex flex-col items-center gap-1.5">
          <div className="w-7 h-7 rounded-full bg-slate-200 flex items-center justify-center">
            <span className="text-slate-400 text-xs">✕</span>
          </div>
          <span className="text-[10px] text-slate-400">Withdrawn</span>
        </div>
      </div>
    );
  }

  const currentIdx = STAGES.indexOf(status);

  return (
    <div className="flex items-center gap-2">
      {STAGES.map((stage, i) => (
        <React.Fragment key={i}>
          <div className="flex flex-col items-center gap-1.5">
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                i < currentIdx
                  ? 'bg-slate-900'
                  : i === currentIdx
                  ? 'bg-slate-900 ring-4 ring-slate-200'
                  : 'bg-slate-200'
              }`}
            >
              {i <= currentIdx ? (
                <Check className="w-3.5 h-3.5 text-white" />
              ) : (
                <span className="w-2 h-2 rounded-full bg-slate-400" />
              )}
            </div>
            <span className={`text-[10px] ${i <= currentIdx ? 'text-slate-700 font-medium' : 'text-slate-400'}`}>
              {LABELS[i]}
            </span>
          </div>
          {i < STAGES.length - 1 && (
            <div className={`flex-1 h-px min-w-[20px] ${i < currentIdx ? 'bg-slate-900' : 'bg-slate-200'}`} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}