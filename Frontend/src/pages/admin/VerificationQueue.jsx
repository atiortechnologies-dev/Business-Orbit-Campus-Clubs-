import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Download, Zap, Loader2 } from "lucide-react";
import AdminShell from "@/components/admin/AdminShell";
import DataTable from "@/components/ui/DataTable";
import Badge from "@/components/ui/Badge";
import ComingSoon from "@/components/ui/ComingSoon";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { downloadCsv } from "@/utils/csv";
import { getVerificationQueue } from "@/api/admin/adminUsersVerificationApi";

const ROLE_OPTIONS = [
  "All Roles",
  "Student",
  "Mentor",
  "Investor",
  "Incubator",
  "Company",
];
const STATUS_OPTIONS = [
  "All Statuses",
  "Pending",
  "Under Review",
  "Approved",
  "Rejected",
];
const STATUS_VARIANT = {
  Pending: "warning",
  "Under Review": "info",
  Approved: "success",
  Rejected: "error",
};

export default function VerificationQueuePage() {
  useDocumentTitle("User Verification Queue — BOCC Admin");
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Client-side filter states
  const [roleFilter, setRoleFilter] = useState("All Roles");
  const [statusFilter, setStatusFilter] = useState("All Statuses");
  const [dateFromInput, setDateFromInput] = useState("");
  const [dateToInput, setDateToInput] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const [selectedIds, setSelectedIds] = useState([]);

  // Fetch all pending users once on mount (No parameters required)
  useEffect(() => {
    async function fetchUsers() {
      try {
        setLoading(true);
        const res = await getVerificationQueue();
        const data = res?.data || res;
        setUsers(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to load verification queue:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchUsers();
  }, []);

  const handleApplyFilters = () => {
    setDateFrom(dateFromInput);
    setDateTo(dateToInput);
  };

  // Pure Client-Side Filtering Logic
  const visibleUsers = users.filter((u) => {
    if (roleFilter !== "All Roles" && u.role !== roleFilter) return false;
    if (statusFilter !== "All Statuses" && u.status !== statusFilter)
      return false;
    if (dateFrom && u.regDate < dateFrom) return false;
    if (dateTo && u.regDate > dateTo) return false;
    return true;
  });

  const allVisibleSelected =
    visibleUsers.length > 0 &&
    visibleUsers.every((u) => selectedIds.includes(u.id));

  function toggleSelectAll() {
    setSelectedIds(allVisibleSelected ? [] : visibleUsers.map((u) => u.id));
  }

  function toggleSelectRow(id) {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  }

  const columns = [
    {
      key: "select",
      label: "",
      width: "0.4fr",
      mobileLabel: false,
      render: (row) => (
        <input
          type="checkbox"
          checked={selectedIds.includes(row.id)}
          onChange={() => toggleSelectRow(row.id)}
          aria-label={`Select ${row.username}`}
          className="rounded border-border-subtle text-brand-black focus:ring-brand-black"
        />
      ),
    },
    {
      key: "username",
      label: "Username",
      width: "2fr",
      mobileLabel: false,
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-canvas-bg border border-border-subtle flex items-center justify-center font-poppins font-bold text-text-heading text-xs shrink-0 select-none">
            {row.username.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p
              className="font-poppins font-semibold text-small text-text-heading truncate"
              title={row.username}
            >
              {row.username}
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
    {
      key: "role",
      label: "Role",
      width: "1fr",
      render: (row) => <Badge variant="neutral">{row.role}</Badge>,
    },
    { key: "phone", label: "Phone Number", width: "1.3fr" },
    {
      key: "status",
      label: "Status",
      width: "1fr",
      render: (row) => (
        <Badge variant={STATUS_VARIANT[row.status] || "neutral"}>
          {row.status}
        </Badge>
      ),
    },
    { key: "regDate", label: "Registration Date", width: "1.2fr" },
    {
      key: "actions",
      label: "",
      width: "1fr",
      mobileLabel: false,
      render: (row) => (
        <button
          type="button"
          onClick={() =>
            navigate(
              `/admin/verification/${row.role.toLowerCase()}?id=${row.id}`,
            )
          }
          className="px-4 py-2 border border-border-subtle rounded-md font-poppins font-semibold text-caption text-text-heading hover:bg-canvas-bg transition-colors"
        >
          View Details
        </button>
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
            Review and verify newly registered users across the BOCC platform.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() =>
              downloadCsv("user-verification-queue", columns, visibleUsers)
            }
            className="flex items-center gap-1.5 bg-surface-white border border-border-subtle px-4 py-2 rounded-lg text-text-heading font-poppins font-semibold text-small hover:bg-canvas-bg transition-colors"
          >
            <Download size={14} strokeWidth={2} /> Export CSV
          </button>
          <ComingSoon
            label={`Bulk Actions${
              selectedIds.length ? ` (${selectedIds.length} selected)` : ""
            }`}
            position="bottom"
            inline
          >
            <span className="flex items-center gap-1.5 bg-brand-black text-white px-4 py-2 rounded-lg font-poppins font-semibold text-small">
              <Zap size={14} strokeWidth={2} /> Bulk Actions
            </span>
          </ComingSoon>
        </div>
      </div>

      {/* Client-side Filter Controls */}
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
        <div className="bg-surface-white border border-border-subtle rounded-lg p-4 shadow-card space-y-1 sm:col-span-2 lg:col-span-2">
          <label className="font-poppins font-semibold text-caption text-text-muted uppercase tracking-wider">
            Registration Date Range
          </label>
          <div className="flex items-center gap-2 pt-1">
            <input
              type="date"
              value={dateFromInput}
              onChange={(e) => setDateFromInput(e.target.value)}
              className="flex-1 min-w-0 bg-canvas-bg border border-border-subtle rounded-md text-text-body font-inter text-small py-2 px-2 focus:outline-none focus:ring-1 focus:ring-brand-black"
            />
            <span className="text-text-muted">—</span>
            <input
              type="date"
              value={dateToInput}
              onChange={(e) => setDateToInput(e.target.value)}
              className="flex-1 min-w-0 bg-canvas-bg border border-border-subtle rounded-md text-text-body font-inter text-small py-2 px-2 focus:outline-none focus:ring-1 focus:ring-brand-black"
            />
            <button
              type="button"
              onClick={handleApplyFilters}
              className="shrink-0 px-4 py-2 bg-action-bg text-action-text rounded-md font-poppins font-semibold text-caption hover:opacity-90 transition-opacity"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 size={32} className="animate-spin text-text-muted" />
        </div>
      ) : (
        <>
          <DataTable
            columns={[
              {
                key: "select-header",
                label: (
                  <input
                    type="checkbox"
                    checked={allVisibleSelected}
                    onChange={toggleSelectAll}
                    aria-label="Select all"
                    className="rounded border-border-subtle text-brand-black focus:ring-brand-black"
                  />
                ),
                width: "0.4fr",
                mobileLabel: false,
                render: columns[0].render,
              },
              ...columns.slice(1),
            ]}
            rows={visibleUsers}
            emptyMessage="No unverified users match the current filters."
          />
          <div className="flex justify-between items-center mt-4">
            <span className="font-inter text-small text-text-muted">
              Showing {visibleUsers.length} of {users.length} unverified users
            </span>
          </div>
        </>
      )}
    </AdminShell>
  );
}
