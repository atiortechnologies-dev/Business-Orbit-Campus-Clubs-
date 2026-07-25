import React from "react";
import { Plus, FolderOpen, Users, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

const postings = [
  {
    title: "Staff Backend Engineer",
    meta: "Engineering • Remote • Full-time",
    status: "ACTIVE",
    applicants: 42,
  },
  {
    title: "UX Researcher",
    meta: "Design • New York • Contract",
    status: "ACTIVE",
    applicants: 18,
  },
  {
    title: "Marketing Associate",
    meta: "Growth • London • Full-time",
    status: "DRAFT",
    applicants: null,
  },
];

export default function RightPanel() {
  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <div className="bg-white rounded-xl border border-[#EEEEEE] p-5">
        <h2 className="text-base font-bold text-black mb-4">Quick Actions</h2>
        <div className="space-y-2.5">
          <button className="w-full flex items-center justify-center gap-2 bg-black text-white text-sm font-semibold py-2.5 rounded-lg hover:bg-gray-800 transition-colors">
            <Plus className="w-4 h-4" />
            Post New Opportunity
          </button>
          <button className="w-full flex items-center justify-center gap-2 bg-white border border-[#E5E7EB] text-black text-sm font-semibold py-2.5 rounded-lg hover:bg-gray-50 transition-colors">
            <FolderOpen className="w-4 h-4" />
            Manage Opportunities
          </button>
          <button className="w-full flex items-center justify-center gap-2 bg-white border border-[#E5E7EB] text-black text-sm font-semibold py-2.5 rounded-lg hover:bg-gray-50 transition-colors">
            <Users className="w-4 h-4" />
            View Applicants
          </button>
        </div>
      </div>

      {/* Latest Postings */}
      <div className="bg-white rounded-xl border border-[#EEEEEE] overflow-hidden">
        <div className="px-5 py-4 border-b border-[#EEEEEE] flex items-center gap-2">
          <FileText className="w-4 h-4 text-gray-500" />
          <h2 className="text-base font-bold text-black">Latest Postings</h2>
        </div>
        <div className="divide-y divide-[#F5F5F5]">
          {postings.map((p) => (
            <div key={p.title} className="px-5 py-4 hover:bg-gray-50/50 cursor-pointer">
              <div className="flex items-start justify-between gap-3">
                <p className="font-semibold text-sm text-black">{p.title}</p>
                <span
                  className={cn(
                    "text-[10px] font-bold px-2 py-0.5 rounded",
                    p.status === "ACTIVE"
                      ? "bg-[#DEF7EC] text-emerald-700"
                      : "bg-[#E5E7EB] text-gray-600"
                  )}
                >
                  {p.status}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">{p.meta}</p>
              <p className="text-xs text-gray-400 mt-2">
                {p.applicants !== null ? `${p.applicants} Applicants` : "-- Applicants"}
              </p>
            </div>
          ))}
        </div>
        <div className="px-5 py-3 text-center border-t border-[#EEEEEE]">
          <button className="text-[11px] font-bold tracking-wider text-gray-500 hover:text-black">
            SEE ALL JOB POSTS
          </button>
        </div>
      </div>
    </div>
  );
}