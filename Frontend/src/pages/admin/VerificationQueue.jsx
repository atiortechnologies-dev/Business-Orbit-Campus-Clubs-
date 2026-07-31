import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Download,
  Zap,
  Eye,
  CheckCircle,
  XCircle,
  FileText,
  Clock,
} from "lucide-react";
import AdminShell from "@/components/admin/AdminShell";
import DataTable from "@/components/ui/DataTable";
import Badge from "@/components/ui/Badge";
import ComingSoon from "@/components/ui/ComingSoon";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { downloadCsv } from "@/utils/csv";

const USERS = [
  {
    id: "u1",
    name: "Elena Rodriguez",
    email: "elena.rodriguez@oxford.ac.uk",
    initials: "ER",
    role: "Chapter Lead",
    org: "Oxford Chapter",
    regDate: "2024-10-18",
    status: "Pending",
    docs: 3,
  },
  {
    id: "u2",
    name: "Marcus Thorne",
    email: "marcus.thorne@berlinhub.de",
    initials: "MT",
    role: "Organization Admin",
    org: "Berlin Hub",
    regDate: "2024-10-17",
    status: "Pending",
    docs: 2,
  },
  {
    id: "u3",
    name: "Suki Tanaka",
    email: "suki.tanaka@kyotofoundation.jp",
    initials: "ST",
    role: "Volunteer",
    org: "Kyoto Foundation",
    regDate: "2024-10-15",
    status: "Flagged",
    docs: 1,
  },
];

const ROLE_OPTIONS = [
  "All Roles",
  "Organization Admin",
  "Chapter Lead",
  "Volunteer",
];
const STATUS_OPTIONS = ["All Status", "Pending", "Flagged"];
const CHAPTER_OPTIONS = [
  "All Chapters",
  "Oxford Chapter",
  "Berlin Hub",
  "Kyoto Foundation",
];

const STATUS_VARIANT = { Pending: "warning", Flagged: "error" };

export default function VerificationQueuePage() {
  useDocumentTitle("User Verification Queue — BOCC Admin");
  const navigate = useNavigate();

  const [roleFilter, setRoleFilter] = useState("All Roles");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [chapterFilter, setChapterFilter] = useState("All Chapters");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [dateFilterOpen, setDateFilterOpen] = useState(false);

  const visibleUsers = USERS.filter((u) => {
    if (roleFilter !== "All Roles" && u.role !== roleFilter) return false;
    if (statusFilter !== "All Status" && u.status !== statusFilter)
      return false;
    if (chapterFilter !== "All Chapters" && u.org !== chapterFilter)
      return false;
    if (dateFrom && u.regDate < dateFrom) return false;
    if (dateTo && u.regDate > dateTo) return false;
    return true;
  });

  const dateRangeLabel =
    dateFrom || dateTo
      ? `${dateFrom || "…"} → ${dateTo || "…"}`
      : "Last 30 Days";

  const columns = [
    {
      key: "name",
      label: "User Name",
      width: "2fr",
      mobileLabel: false,
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-canvas-bg border border-border-subtle flex items-center justify-center font-poppins font-bold text-text-heading text-xs shrink-0 select-none">
            {row.initials}
          </div>
          <div className="min-w-0">
            <p
              className="font-poppins font-semibold text-small text-text-heading truncate"
              title={row.name}
            >
              {row.name}
            </p>
            <p
              className="font-inter text-caption text-text-muted truncate"
              title={row.email}
            >
              {row.email}
            </p>
          </div>
        </div>
      ),
    },
    { key: "role", label: "Role", width: "1.3fr" },
    { key: "org", label: "Chapter", width: "1.3fr" },
    { key: "regDate", label: "Reg. Date", width: "1fr" },
    {
      key: "status",
      label: "Status",
      width: "1fr",
      render: (row) => (
        <Badge variant={STATUS_VARIANT[row.status]}>{row.status}</Badge>
      ),
    },
    {
      key: "docs",
      label: "Documents",
      width: "1fr",
      render: (row) => (
        <span className="flex items-center gap-1.5 font-inter text-small text-text-muted">
          <FileText size={14} strokeWidth={2} /> {row.docs}
        </span>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      width: "1.2fr",
      mobileLabel: false,
      render: () => (
        <div className="flex items-center gap-1">
          <span
            className="p-1.5 rounded-md text-text-muted hover:text-text-heading hover:bg-canvas-bg transition-colors"
            title="View"
          >
            <Eye size={16} strokeWidth={2} />
          </span>
          <span
            className="p-1.5 rounded-md text-success hover:bg-success/10 transition-colors"
            title="Approve"
          >
            <CheckCircle size={16} strokeWidth={2} />
          </span>
          <span
            className="p-1.5 rounded-md text-error hover:bg-error/10 transition-colors"
            title="Reject"
          >
            <XCircle size={16} strokeWidth={2} />
          </span>
        </div>
      ),
    },
  ];

  return (
    <AdminShell>
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="font-poppins font-semibold text-page text-text-heading">
            User Verification Queue
          </h1>
          <p className="font-inter text-body text-text-body mt-1">
            Review and manage pending identity verifications from across all
            chapters.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() =>
              downloadCsv(
                "verification-queue",
                [
                  { key: "name", label: "User Name" },
                  { key: "email", label: "Email" },
                  { key: "role", label: "Role" },
                  { key: "org", label: "Chapter" },
                  { key: "regDate", label: "Reg. Date" },
                  { key: "status", label: "Status" },
                  { key: "docs", label: "Documents" },
                ],
                visibleUsers,
              )
            }
            className="flex items-center gap-1.5 bg-surface-white border border-border-subtle px-4 py-2 rounded-lg text-text-heading font-poppins font-semibold text-small hover:bg-canvas-bg transition-colors"
          >
            <Download size={14} strokeWidth={2} /> Export CSV
          </button>
          <ComingSoon label="Bulk Action" position="bottom" inline>
            <span className="flex items-center gap-1.5 bg-surface-white border border-border-subtle px-4 py-2 rounded-lg text-text-heading font-poppins font-semibold text-small">
              <Zap size={14} strokeWidth={2} /> Bulk Action
            </span>
          </ComingSoon>
        </div>
      </div>

      {/* Filters — real, client-side, matching Incubator Applications.jsx's pattern */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-surface-white border border-border-subtle rounded-lg p-4 shadow-card space-y-1">
          <label className="font-poppins font-semibold text-caption text-text-muted uppercase tracking-wider">
            Role
          </label>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="w-full bg-canvas-bg border border-border-subtle rounded-md text-text-body font-inter text-small py-2 px-2 focus:outline-none focus:ring-1 focus:ring-brand-black"
          >
            {ROLE_OPTIONS.map((opt) => (
              <option key={opt}>{opt}</option>
            ))}
          </select>
        </div>
        <div className="bg-surface-white border border-border-subtle rounded-lg p-4 shadow-card space-y-1">
          <label className="font-poppins font-semibold text-caption text-text-muted uppercase tracking-wider">
            Status
          </label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full bg-canvas-bg border border-border-subtle rounded-md text-text-body font-inter text-small py-2 px-2 focus:outline-none focus:ring-1 focus:ring-brand-black"
          >
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt}>{opt}</option>
            ))}
          </select>
        </div>
        <div className="bg-surface-white border border-border-subtle rounded-lg p-4 shadow-card space-y-1">
          <label className="font-poppins font-semibold text-caption text-text-muted uppercase tracking-wider">
            Chapter
          </label>
          <select
            value={chapterFilter}
            onChange={(e) => setChapterFilter(e.target.value)}
            className="w-full bg-canvas-bg border border-border-subtle rounded-md text-text-body font-inter text-small py-2 px-2 focus:outline-none focus:ring-1 focus:ring-brand-black"
          >
            {CHAPTER_OPTIONS.map((opt) => (
              <option key={opt}>{opt}</option>
            ))}
          </select>
        </div>
        <div className="bg-surface-white border border-border-subtle rounded-lg p-4 shadow-card space-y-1 relative">
          <label className="font-poppins font-semibold text-caption text-text-muted uppercase tracking-wider block">
            Date Range
          </label>
          <button
            type="button"
            onClick={() => setDateFilterOpen((v) => !v)}
            className="w-full text-left font-inter text-small text-text-body pt-2 hover:text-text-heading transition-colors"
          >
            {dateRangeLabel}
          </button>
          {dateFilterOpen && (
            <div className="absolute top-full left-0 mt-1 z-20 bg-surface-white border border-border-subtle rounded-md shadow-overlay p-4 flex flex-col gap-3 w-64">
              <label className="flex flex-col gap-1">
                <span className="font-inter text-caption text-text-muted">
                  From
                </span>
                <input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="px-2 py-1.5 bg-canvas-bg border border-border-subtle rounded-md font-inter text-small text-text-heading focus:outline-none focus:ring-1 focus:ring-brand-black"
                />
              </label>
              <label className="flex flex-col gap-1">
                <span className="font-inter text-caption text-text-muted">
                  To
                </span>
                <input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="px-2 py-1.5 bg-canvas-bg border border-border-subtle rounded-md font-inter text-small text-text-heading focus:outline-none focus:ring-1 focus:ring-brand-black"
                />
              </label>
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => {
                    setDateFrom("");
                    setDateTo("");
                  }}
                  className="font-inter text-caption text-text-muted hover:text-text-heading transition-colors"
                >
                  Clear
                </button>
                <button
                  type="button"
                  onClick={() => setDateFilterOpen(false)}
                  className="font-inter font-semibold text-caption text-text-heading"
                >
                  Apply
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-9">
          <DataTable
            columns={columns}
            rows={visibleUsers}
            onRowClick={() => navigate("/admin/verification/detail")}
            emptyMessage="No users match the current filters."
          />
          <div className="flex justify-between items-center mt-4">
            <span className="font-inter text-small text-text-muted">
              Showing {visibleUsers.length} of {USERS.length} entries
            </span>
          </div>
        </div>

        <div className="lg:col-span-3 space-y-6">
          <div className="bg-surface-white border border-border-subtle rounded-lg p-6 shadow-card">
            <div className="flex items-center gap-2 text-text-muted mb-2">
              <Clock size={16} strokeWidth={2} />
              <p className="font-inter font-medium text-caption uppercase tracking-wider">
                Queue Velocity
              </p>
            </div>
            <p className="font-poppins font-semibold text-section text-text-heading">
              2.4h
            </p>
            <p className="font-inter text-small text-success mt-1">
              +12% faster vs last week
            </p>
          </div>

          <div className="bg-surface-white border border-border-subtle rounded-lg p-6 shadow-card">
            <h4 className="font-poppins font-semibold text-body text-text-heading mb-2">
              Identity Audit Report
            </h4>
            <p className="font-inter text-small text-text-muted mb-4">
              Full export of every decision made in this queue, for compliance
              records.
            </p>
            <ComingSoon
              label="Download Audit Trail"
              position="top"
              inline={false}
            >
              <span className="flex items-center justify-center gap-2 w-full py-2.5 border border-border-subtle rounded-md font-poppins font-semibold text-small text-text-heading">
                <Download size={16} strokeWidth={2} /> Download Audit Trail
              </span>
            </ComingSoon>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
