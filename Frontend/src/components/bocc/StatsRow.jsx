import React from "react";
import { ArrowUpRight } from "lucide-react";

const stats = [
  {
    label: "ACTIVE OPPORTUNITIES",
    value: "12",
    sub: "+2 this week",
    subColor: "text-emerald-600",
  },
  {
    label: "TOTAL APPLICANTS",
    value: "1,248",
    sub: "+15%",
    subColor: "text-emerald-600",
  },
  {
    label: "SHORTLISTED",
    value: "84",
    sub: "Next: Interviews",
    subColor: "text-gray-500",
  },
  {
    label: "CLOSED OPPORTUNITIES",
    value: "50",
    sub: "Past 12 months",
    subColor: "text-gray-500",
  },
];

export default function StatsRow() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((s) => (
        <div
          key={s.label}
          className="bg-white rounded-xl border border-[#EEEEEE] p-5 hover:shadow-sm transition-shadow"
        >
          <div className="flex items-start justify-between">
            <p className="text-[11px] font-semibold tracking-wider text-gray-400">
              {s.label}
            </p>
            <ArrowUpRight className="w-4 h-4 text-gray-300" />
          </div>
          <p className="text-3xl font-bold text-black mt-3">{s.value}</p>
          <p className={`text-xs font-medium mt-1 ${s.subColor}`}>{s.sub}</p>
        </div>
      ))}
    </div>
  );
}