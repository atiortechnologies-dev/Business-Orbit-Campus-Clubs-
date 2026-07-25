import React from "react";
import { TrendingUp, MoreVertical, ChevronLeft, ChevronRight } from "lucide-react";

const opportunities = [
  {
    title: "Senior Systems Architect",
    ref: "#ARCH-2024-001",
    type: "Full-time",
    postedDate: "Oct 12, 2023",
    applicants: 48,
    status: "Active",
  },
  {
    title: "Regional Operations Director",
    ref: "#OPS-2024-012",
    type: "Contract",
    postedDate: "Not Published",
    applicants: 0,
    status: "Draft",
  },
  {
    title: "Lead Frontend Developer",
    ref: "#TECH-2023-455",
    type: "Internal",
    postedDate: "Aug 24, 2023",
    applicants: 12,
    status: "Closed",
  },
  {
    title: "Market Research Analyst",
    ref: "#MKT-2024-089",
    type: "Contract",
    postedDate: "Nov 05, 2023",
    applicants: 23,
    status: "Active",
  },
];

const statusConfig = {
  Active: {
    dotColor: "bg-black",
    textColor: "text-[#1a1a1a]",
  },
  Draft: {
    dotColor: "bg-[#999999]",
    textColor: "text-[#666666]",
  },
  Closed: {
    dotColor: "bg-[#999999]",
    textColor: "text-[#666666]",
  },
};

function StatusPill({ status }) {
  const config = statusConfig[status] || statusConfig.Draft;
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#f2f2f2] text-xs font-medium">
      <span className={`w-1.5 h-1.5 rounded-full ${config.dotColor}`} />
      <span className={config.textColor}>{status}</span>
    </span>
  );
}

export default function OpportunitiesTable() {
  return (
    <div className="bg-white border border-[#e0e0e0] rounded-lg overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="border-b border-[#e0e0e0] bg-[#fafafa]">
            <th className="text-left px-6 py-3 text-[10px] font-semibold uppercase tracking-wider text-[#999999]">
              Opportunity Details
            </th>
            <th className="text-left px-4 py-3 text-[10px] font-semibold uppercase tracking-wider text-[#999999]">
              Type
            </th>
            <th className="text-left px-4 py-3 text-[10px] font-semibold uppercase tracking-wider text-[#999999]">
              Posted Date
            </th>
            <th className="text-left px-4 py-3 text-[10px] font-semibold uppercase tracking-wider text-[#999999]">
              Applicants
            </th>
            <th className="text-left px-4 py-3 text-[10px] font-semibold uppercase tracking-wider text-[#999999]">
              Status
            </th>
            <th className="text-right px-6 py-3 text-[10px] font-semibold uppercase tracking-wider text-[#999999]">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {opportunities.map((opp, idx) => (
            <tr
              key={opp.ref}
              className={`border-b border-[#f0f0f0] hover:bg-[#fafafa] transition-colors ${
                idx === opportunities.length - 1 ? "border-b-0" : ""
              }`}
            >
              <td className="px-6 py-4">
                <p className="text-sm font-semibold text-[#1a1a1a]">
                  {opp.title}
                </p>
                <p className="text-xs text-[#999999] mt-0.5">
                  Ref: {opp.ref}
                </p>
              </td>
              <td className="px-4 py-4">
                <span className="text-sm text-[#666666]">{opp.type}</span>
              </td>
              <td className="px-4 py-4">
                <span className="text-sm text-[#666666]">{opp.postedDate}</span>
              </td>
              <td className="px-4 py-4">
                <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#1a1a1a]">
                  {opp.applicants}
                  {opp.applicants > 0 && (
                    <TrendingUp className="w-3.5 h-3.5 text-[#999999]" />
                  )}
                </span>
              </td>
              <td className="px-4 py-4">
                <StatusPill status={opp.status} />
              </td>
              <td className="px-6 py-4 text-right">
                <button className="text-[#999999] hover:text-[#1a1a1a] transition-colors p-1">
                  <MoreVertical className="w-4 h-4" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Footer / Pagination */}
      <div className="flex items-center justify-between px-6 py-4 border-t border-[#e0e0e0]">
        <p className="text-sm text-[#999999]">
          Showing 1 to 4 of 24 entries
        </p>
        <div className="flex items-center gap-1">
          <button className="w-8 h-8 flex items-center justify-center rounded-md border border-[#e0e0e0] text-[#666666] hover:bg-[#f5f5f5] transition-colors">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button className="w-8 h-8 flex items-center justify-center rounded-md bg-black text-white text-sm font-medium">
            1
          </button>
          <button className="w-8 h-8 flex items-center justify-center rounded-md border border-[#e0e0e0] text-[#666666] hover:bg-[#f5f5f5] transition-colors text-sm font-medium">
            2
          </button>
          <button className="w-8 h-8 flex items-center justify-center rounded-md border border-[#e0e0e0] text-[#666666] hover:bg-[#f5f5f5] transition-colors text-sm font-medium">
            3
          </button>
          <span className="w-8 h-8 flex items-center justify-center text-[#999999] text-sm">
            …
          </span>
          <button className="w-8 h-8 flex items-center justify-center rounded-md border border-[#e0e0e0] text-[#666666] hover:bg-[#f5f5f5] transition-colors text-sm font-medium">
            6
          </button>
          <button className="w-8 h-8 flex items-center justify-center rounded-md border border-[#e0e0e0] text-[#666666] hover:bg-[#f5f5f5] transition-colors">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}