import { useMemo, useState } from "react";
import {
  Search,
  TrendingUp,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Badge from "@/components/ui/Badge";
import DataTable from "@/components/ui/DataTable";
import ComingSoon from "@/components/ui/ComingSoon";

const OPPORTUNITIES = [
  {
    id: 1,
    title: "Senior Systems Architect",
    ref: "ARCH-2024-001",
    type: "Full-time",
    postedDate: "Oct 12, 2023",
    applicants: 48,
    status: "Active",
  },
  {
    id: 2,
    title: "Regional Operations Director",
    ref: "OPS-2024-012",
    type: "Contract",
    postedDate: "Not Published",
    applicants: 0,
    status: "Pending Approval",
  },
  {
    id: 3,
    title: "Lead Frontend Developer",
    ref: "TECH-2023-455",
    type: "Internal",
    postedDate: "Aug 24, 2023",
    applicants: 12,
    status: "Closed",
  },
  {
    id: 4,
    title: "Market Research Analyst",
    ref: "MKT-2024-089",
    type: "Contract",
    postedDate: "Nov 05, 2023",
    applicants: 23,
    status: "Active",
  },
];

// Pending Approval reflects Admin's opportunity moderation queue (see
// admin/OpportunityApprovalQueue.jsx) — a posted opportunity sits here
// until an admin reviewer approves or rejects it, same as everywhere
// else in this app nothing is actually wired between the two screens.
const STATUS_VARIANT = {
  Active: "success",
  "Pending Approval": "warning",
  Draft: "neutral",
  Closed: "neutral",
};

const COLUMNS = [
  {
    key: "title",
    label: "Opportunity Details",
    width: "2fr",
    render: (opp) => (
      <div>
        <p className="font-inter font-semibold text-small text-text-heading">
          {opp.title}
        </p>
        <p className="font-inter text-caption text-text-muted mt-0.5">
          Ref: {opp.ref}
        </p>
      </div>
    ),
  },
  { key: "type", label: "Type", className: "text-text-body" },
  { key: "postedDate", label: "Posted Date", className: "text-text-body" },
  {
    key: "applicants",
    label: "Applicants",
    render: (opp) => (
      <span className="inline-flex items-center gap-1.5 font-inter font-semibold text-small text-text-heading">
        {opp.applicants}
        {opp.applicants > 0 && (
          <TrendingUp size={14} strokeWidth={2} className="text-text-muted" />
        )}
      </span>
    ),
  },
  {
    key: "status",
    label: "Status",
    render: (opp) => (
      <Badge variant={STATUS_VARIANT[opp.status]}>{opp.status}</Badge>
    ),
  },
  {
    key: "actions",
    label: "Actions",
    mobileLabel: false,
    render: () => (
      <ComingSoon
        label="Actions"
        position="top"
        inline
        className="p-1 text-text-muted hover:text-text-heading transition-colors"
      >
        <MoreVertical size={16} strokeWidth={2} />
      </ComingSoon>
    ),
  },
];

export default function OpportunitiesTable() {
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return OPPORTUNITIES;
    return OPPORTUNITIES.filter(
      (opp) =>
        opp.title.toLowerCase().includes(q) ||
        opp.ref.toLowerCase().includes(q),
    );
  }, [searchQuery]);

  return (
    <div className="flex flex-col gap-4">
      <div className="relative max-w-sm">
        <Search
          size={16}
          strokeWidth={2}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
        />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search opportunities..."
          className="w-full bg-surface-white border border-border-subtle rounded-md pl-9 pr-3 py-2.5 font-inter text-small text-text-body focus:outline-none focus:ring-1 focus:ring-brand-black transition-all"
        />
      </div>

      <DataTable
        columns={COLUMNS}
        rows={filtered}
        emptyMessage="No opportunities match your search."
      />

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
        <p className="font-inter text-small text-text-muted">
          Showing {filtered.length} of {OPPORTUNITIES.length}
        </p>
        <div className="flex items-center gap-1">
          <button
            type="button"
            disabled
            className="w-8 h-8 flex items-center justify-center rounded-md border border-border-subtle text-text-muted disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ChevronLeft size={16} strokeWidth={2} />
          </button>
          <span className="w-8 h-8 flex items-center justify-center rounded-md bg-action-bg text-action-text font-inter text-small font-medium">
            1
          </span>
          <button
            type="button"
            disabled
            className="w-8 h-8 flex items-center justify-center rounded-md border border-border-subtle text-text-muted disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ChevronRight size={16} strokeWidth={2} />
          </button>
        </div>
      </div>
    </div>
  );
}
