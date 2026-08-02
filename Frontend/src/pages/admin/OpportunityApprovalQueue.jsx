import { useState, useEffect, useCallback } from "react";
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
  Loader2,
} from "lucide-react";
import AdminShell from "@/components/admin/AdminShell";
import DataTable from "@/components/ui/DataTable";
import Badge from "@/components/ui/Badge";
import StatCard from "@/components/ui/StatCard";
import ComingSoon from "@/components/ui/ComingSoon";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import api from "@/api/axiosInstance";

const STATUS_VARIANT = {
  PENDING: "warning",
  ACTIVE: "success",
  REJECTED: "error",
  DRAFT: "neutral",
  CHANGES_REQUESTED: "warning",
};

const TYPE_OPTIONS = [
  { label: "All Types", value: "" },
  { label: "Internship", value: "INTERNSHIP" },
  { label: "Job", value: "JOB" },
  { label: "Project", value: "PROJECT" },
  { label: "Collaboration", value: "COLLABORATION" },
];

const STATUS_OPTIONS = [
  { label: "All Statuses", value: "" },
  { label: "Pending", value: "PENDING" },
  { label: "Approved", value: "ACTIVE" },
  { label: "Rejected", value: "REJECTED" },
  { label: "Draft", value: "DRAFT" },
];

export default function OpportunityApprovalQueuePage() {
  useDocumentTitle("Opportunity Approval Queue — BOCC Admin");

  const [typeFilter, setTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [opportunities, setOpportunities] = useState([]);
  const [metrics, setMetrics] = useState({ pending: 0, approved: 0, rejected: 0, drafts: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  
  // Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const limit = 10;

  const fetchOpportunities = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        page,
        limit,
      };
      if (typeFilter) params.type = typeFilter;
      if (statusFilter) params.status = statusFilter;
      
      const response = await api.get("/admin/opportunities", { params });
      if (response.data?.data) {
        setOpportunities(response.data.data.opportunities || []);
        setMetrics(response.data.data.metricCards || { pending: 0, approved: 0, rejected: 0, drafts: 0 });
        setTotalPages(response.data.data.total_pages || 1);
        setTotalRecords(response.data.data.total_records || 0);
      }
    } catch (err) {
      console.error("Failed to fetch opportunities", err);
      setError("Failed to load opportunities. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, [page, limit, typeFilter, statusFilter]);

  useEffect(() => {
    fetchOpportunities();
  }, [fetchOpportunities]);
  
  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [typeFilter, statusFilter]);

  const handleAction = async (id, action) => {
    try {
      if (action === 'approve') {
        await api.post(`/admin/opportunities/${id}/approve`);
      } else if (action === 'reject') {
        const reason = window.prompt("Enter rejection reason:");
        if (!reason) return; // Cancelled
        await api.post(`/admin/opportunities/${id}/reject`, { reason });
      }
      // Refresh list after action
      fetchOpportunities();
    } catch (err) {
      console.error(`Failed to ${action} opportunity`, err);
      alert(`Failed to ${action} opportunity. Please try again.`);
    }
  };

  const handleBulkApprove = async () => {
    const confirm = window.confirm(`Are you sure you want to approve ${selectedIds.length} opportunities?`);
    if (!confirm) return;
    try {
      await api.post("/admin/opportunities/bulk-approve", { opportunityIds: selectedIds });
      setSelectedIds([]);
      fetchOpportunities();
    } catch (err) {
      console.error("Failed to bulk approve", err);
      alert("Failed to bulk approve. Please try again.");
    }
  };

  const columns = [
    {
      key: "checkbox",
      label: "",
      width: "40px",
      mobileLabel: false,
      render: (row) => (
        <input
          type="checkbox"
          checked={selectedIds.includes(row._id)}
          onChange={(e) => {
            if (e.target.checked) {
              setSelectedIds(prev => [...prev, row._id]);
            } else {
              setSelectedIds(prev => prev.filter(id => id !== row._id));
            }
          }}
          className="w-4 h-4 rounded border-border-subtle text-brand-black focus:ring-brand-black cursor-pointer"
        />
      ),
    },
    {
      key: "title",
      label: "Opportunity Title",
      width: "1.8fr",
      render: (row) => (
        <div>
          <p className="font-poppins font-semibold text-small text-text-heading">
            {row.title}
          </p>
          <p className="font-inter text-caption text-text-muted">{row._id}</p>
        </div>
      ),
    },
    {
      key: "company",
      label: "Company",
      width: "1.2fr",
      className: "text-text-body",
      render: (row) => (
        <span>{row.company_id?.company_name || "Unknown"}</span>
      ),
    },
    {
      key: "type",
      label: "Type",
      width: "1fr",
      render: (row) => (
        <span className="px-2 py-0.5 bg-canvas-bg rounded font-inter text-caption text-text-body border border-border-subtle">
          {row.opportunity_type?.replace(/_/g, ' ') || "N/A"}
        </span>
      ),
    },
    {
      key: "posted",
      label: "Posted",
      width: "1fr",
      className: "text-text-body",
      render: (row) => (
        <span>{new Date(row.created_at).toLocaleDateString()}</span>
      ),
    },
    {
      key: "deadline",
      label: "Deadline",
      width: "1fr",
      className: "text-text-body",
      render: (row) => (
        <span>{row.deadline ? new Date(row.deadline).toLocaleDateString() : "N/A"}</span>
      ),
    },
    {
      key: "status",
      label: "Status",
      width: "0.9fr",
      render: (row) => (
        <Badge variant={STATUS_VARIANT[row.status] || "neutral"}>
          {row.status?.replace(/_/g, ' ') || "UNKNOWN"}
        </Badge>
      ),
    },
    {
      key: "reviewer",
      label: "Reviewer",
      width: "1.1fr",
      render: (row) =>
        row.assigned_reviewer_id ? (
          <div className="flex items-center gap-2">
            <span className="font-inter text-small text-text-body">
              Assigned
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
      render: (row) => (
        <div className="flex items-center gap-1">
          <Link
            to={`/admin/opportunities/review?id=${row._id}`}
            className="p-1.5 rounded-md text-text-muted hover:text-text-heading hover:bg-canvas-bg transition-colors"
            title="View Details"
          >
            <Eye size={16} strokeWidth={2} />
          </Link>
          <button
            onClick={() => handleAction(row._id, 'approve')}
            title="Approve"
            className="p-1.5 rounded-md text-success hover:bg-success/10 transition-colors"
          >
            <Check size={16} strokeWidth={2} />
          </button>
          <button
            onClick={() => handleAction(row._id, 'reject')}
            title="Reject"
            className="p-1.5 rounded-md text-error hover:bg-error/10 transition-colors"
          >
            <X size={16} strokeWidth={2} />
          </button>
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
          {selectedIds.length > 0 ? (
            <button
              onClick={handleBulkApprove}
              className="flex items-center gap-1.5 bg-action-bg text-action-text px-4 py-2 rounded-lg font-poppins font-semibold text-small hover:opacity-90 transition-opacity"
            >
              <CheckCheck size={14} strokeWidth={2} /> Bulk Approve ({selectedIds.length})
            </button>
          ) : (
            <span className="flex items-center gap-1.5 bg-canvas-bg text-text-muted px-4 py-2 rounded-lg font-poppins font-semibold text-small border border-border-subtle cursor-not-allowed">
              <CheckCheck size={14} strokeWidth={2} /> Bulk Approve
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          label="Pending Reviews"
          value={metrics.pending}
          icon={<Hourglass size={16} strokeWidth={2} />}
          trendDirection="up"
        />
        <StatCard
          label="Approved"
          value={metrics.approved}
          icon={<Verified size={16} strokeWidth={2} />}
        />
        <StatCard
          label="Rejected"
          value={metrics.rejected}
          icon={<Ban size={16} strokeWidth={2} />}
        />
        <StatCard
          label="Drafts"
          value={metrics.drafts}
          icon={<FileText size={16} strokeWidth={2} />}
        />
      </div>

      <div className="flex flex-wrap items-center gap-4 bg-surface-white border border-border-subtle rounded-lg p-4 mb-6 shadow-card">
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="bg-canvas-bg border border-border-subtle rounded-md text-text-body font-inter text-small py-1.5 px-2 focus:outline-none focus:ring-1 focus:ring-brand-black"
        >
          {TYPE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-canvas-bg border border-border-subtle rounded-md text-text-body font-inter text-small py-1.5 px-2 focus:outline-none focus:ring-1 focus:ring-brand-black"
        >
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      {error ? (
        <div className="bg-error/10 text-error p-4 rounded-lg font-inter text-sm mb-6 border border-error/20">
          {error}
        </div>
      ) : loading ? (
        <div className="flex items-center justify-center p-12 bg-surface-white border border-border-subtle rounded-lg">
          <Loader2 className="animate-spin text-brand-primary" size={32} />
          <span className="ml-3 font-inter text-text-muted">Loading opportunities...</span>
        </div>
      ) : (
        <>
          <DataTable
            columns={columns}
            rows={opportunities}
            emptyMessage="No opportunities match the current filters."
          />
          <div className="flex justify-between items-center mt-4">
            <p className="font-inter text-small text-text-muted">
              Showing {opportunities.length} of {totalRecords} results
            </p>
            {totalPages > 1 && (
              <div className="flex gap-2">
                <button
                  disabled={page === 1}
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  className="px-3 py-1 bg-surface-white border border-border-subtle rounded-md text-sm disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  disabled={page === totalPages}
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  className="px-3 py-1 bg-surface-white border border-border-subtle rounded-md text-sm disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </AdminShell>
  );
}
