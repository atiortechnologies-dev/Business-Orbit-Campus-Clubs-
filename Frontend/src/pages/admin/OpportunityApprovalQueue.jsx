import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Download,
  CheckCheck,
  Eye,
  Check,
  X,
  Hourglass,
  Verified,
  Ban,
  FileText,
} from "lucide-react";
import AdminShell from "@/components/admin/AdminShell";
import DataTable from "@/components/ui/DataTable";
import Badge from "@/components/ui/Badge";
import StatCard from "@/components/ui/StatCard";
import ComingSoon from "@/components/ui/ComingSoon";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

const OPPORTUNITIES = [
  {
    id: "OP-8821",
    title: "Senior Product Design Lead",
    company: "Quantas Systems",
    type: "Job",
    posted: "Oct 12, 2023",
    deadline: "Nov 15, 2023",
    status: "Pending",
    reviewer: "Jane Doe",
    reviewerInitials: "JD",
  },
  {
    id: "OP-9012",
    title: "AI Research Internship",
    company: "Neural Foundry",
    type: "Internship",
    posted: "Oct 11, 2023",
    deadline: "Dec 01, 2023",
    status: "Approved",
    reviewer: "Mark Smith",
    reviewerInitials: "MS",
  },
  {
    id: "OP-7734",
    title: "Sustainable Campus Project",
    company: "EcoRoots Global",
    type: "Collaboration",
    posted: "Oct 10, 2023",
    deadline: "Oct 30, 2023",
    status: "Rejected",
    reviewer: null,
    reviewerInitials: null,
  },
  {
    id: "OP-1109",
    title: "Frontend Dev - Q4 Sprint",
    company: "DevOps Dynamics",
    type: "Project",
    posted: "Oct 09, 2023",
    deadline: "Nov 10, 2023",
    status: "Draft",
    reviewer: "Alex Rivera",
    reviewerInitials: "AR",
  },
];

const STATUS_VARIANT = {
  Pending: "warning",
  Approved: "success",
  Rejected: "error",
  Draft: "neutral",
};
const COMPANY_OPTIONS = [
  "All Companies",
  "Quantas Systems",
  "Neural Foundry",
  "EcoRoots Global",
  "DevOps Dynamics",
];
const TYPE_OPTIONS = [
  "All Types",
  "Internship",
  "Job",
  "Project",
  "Collaboration",
];
const STATUS_OPTIONS = [
  "All Statuses",
  "Pending",
  "Approved",
  "Rejected",
  "Draft",
];

export default function OpportunityApprovalQueuePage() {
  useDocumentTitle("Opportunity Approval Queue — BOCC Admin");

  const [companyFilter, setCompanyFilter] = useState("All Companies");
  const [typeFilter, setTypeFilter] = useState("All Types");
  const [statusFilter, setStatusFilter] = useState("All Statuses");

  const visible = OPPORTUNITIES.filter((o) => {
    if (companyFilter !== "All Companies" && o.company !== companyFilter)
      return false;
    if (typeFilter !== "All Types" && o.type !== typeFilter) return false;
    if (statusFilter !== "All Statuses" && o.status !== statusFilter)
      return false;
    return true;
  });

  const columns = [
    {
      key: "title",
      label: "Opportunity Title",
      width: "1.8fr",
      render: (row) => (
        <div>
          <p className="font-poppins font-semibold text-small text-text-heading">
            {row.title}
          </p>
          <p className="font-inter text-caption text-text-muted">{row.id}</p>
        </div>
      ),
    },
    {
      key: "company",
      label: "Company",
      width: "1.2fr",
      className: "text-text-body",
    },
    {
      key: "type",
      label: "Type",
      width: "1fr",
      render: (row) => (
        <span className="px-2 py-0.5 bg-canvas-bg rounded font-inter text-caption text-text-body border border-border-subtle">
          {row.type}
        </span>
      ),
    },
    {
      key: "posted",
      label: "Posted",
      width: "1fr",
      className: "text-text-body",
    },
    {
      key: "deadline",
      label: "Deadline",
      width: "1fr",
      className: "text-text-body",
    },
    {
      key: "status",
      label: "Status",
      width: "0.9fr",
      render: (row) => (
        <Badge variant={STATUS_VARIANT[row.status]}>{row.status}</Badge>
      ),
    },
    {
      key: "reviewer",
      label: "Reviewer",
      width: "1.1fr",
      render: (row) =>
        row.reviewer ? (
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-canvas-bg border border-border-subtle flex items-center justify-center font-poppins font-bold text-[9px] text-text-heading">
              {row.reviewerInitials}
            </div>
            <span className="font-inter text-small text-text-body">
              {row.reviewer}
            </span>
          </div>
        ) : (
          <span className="font-inter text-small text-text-muted italic">
            Unassigned
          </span>
        ),
    },
    {
      key: "actions",
      label: "Actions",
      width: "1.1fr",
      mobileLabel: false,
      render: () => (
        <div className="flex items-center gap-1">
          <Link
            to="/admin/opportunities/review"
            className="p-1.5 rounded-md text-text-muted hover:text-text-heading hover:bg-canvas-bg transition-colors"
            title="View Details"
          >
            <Eye size={16} strokeWidth={2} />
          </Link>
          <ComingSoon
            label="Approve"
            position="top"
            inline
            className="p-1.5 rounded-md text-success hover:bg-success/10 transition-colors"
          >
            <Check size={16} strokeWidth={2} />
          </ComingSoon>
          <ComingSoon
            label="Reject"
            position="top"
            inline
            className="p-1.5 rounded-md text-error hover:bg-error/10 transition-colors"
          >
            <X size={16} strokeWidth={2} />
          </ComingSoon>
        </div>
      ),
    },
  ];

  return (
    <AdminShell>
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="font-poppins font-semibold text-page text-text-heading">
            Opportunity Approval Queue
          </h1>
          <p className="font-inter text-body text-text-body mt-1">
            Review, approve, or reject opportunities submitted by ecosystem
            partners.
          </p>
        </div>
        <div className="flex gap-2">
          <ComingSoon label="Export List" position="bottom" inline>
            <span className="flex items-center gap-1.5 bg-surface-white border border-border-subtle px-4 py-2 rounded-lg text-text-heading font-poppins font-semibold text-small">
              <Download size={14} strokeWidth={2} /> Export List
            </span>
          </ComingSoon>
          <ComingSoon label="Bulk Approve" position="bottom" inline>
            <span className="flex items-center gap-1.5 bg-action-bg text-action-text px-4 py-2 rounded-lg font-poppins font-semibold text-small">
              <CheckCheck size={14} strokeWidth={2} /> Bulk Approve
            </span>
          </ComingSoon>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          label="Pending Reviews"
          value="128"
          icon={<Hourglass size={16} strokeWidth={2} />}
          subtext="+12% from yesterday"
          trendDirection="up"
        />
        <StatCard
          label="Approved"
          value="1,240"
          icon={<Verified size={16} strokeWidth={2} />}
          subtext="System healthy"
        />
        <StatCard
          label="Rejected"
          value="42"
          icon={<Ban size={16} strokeWidth={2} />}
          subtext="+3 reported issues"
        />
        <StatCard
          label="Drafts"
          value="18"
          icon={<FileText size={16} strokeWidth={2} />}
          subtext="Expiring soon"
        />
      </div>

      <div className="flex flex-wrap items-center gap-4 bg-surface-white border border-border-subtle rounded-lg p-4 mb-6 shadow-card">
        <select
          value={companyFilter}
          onChange={(e) => setCompanyFilter(e.target.value)}
          className="bg-canvas-bg border border-border-subtle rounded-md text-text-body font-inter text-small py-1.5 px-2 focus:outline-none focus:ring-1 focus:ring-brand-black"
        >
          {COMPANY_OPTIONS.map((opt) => (
            <option key={opt}>{opt}</option>
          ))}
        </select>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="bg-canvas-bg border border-border-subtle rounded-md text-text-body font-inter text-small py-1.5 px-2 focus:outline-none focus:ring-1 focus:ring-brand-black"
        >
          {TYPE_OPTIONS.map((opt) => (
            <option key={opt}>{opt}</option>
          ))}
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-canvas-bg border border-border-subtle rounded-md text-text-body font-inter text-small py-1.5 px-2 focus:outline-none focus:ring-1 focus:ring-brand-black"
        >
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt}>{opt}</option>
          ))}
        </select>
      </div>

      <DataTable
        columns={columns}
        rows={visible}
        emptyMessage="No opportunities match the current filters."
      />
      <p className="font-inter text-small text-text-muted mt-4">
        Showing {visible.length} of {OPPORTUNITIES.length} results
      </p>
    </AdminShell>
  );
}
