import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  Download,
  Zap,
  Clock,
  CheckCircle,
  XCircle,
  Calendar,
  ArrowRight,
  Filter,
  RotateCcw,
  Loader2,
} from "lucide-react";
import AdminShell from "@/components/admin/AdminShell";
import DataTable from "@/components/ui/DataTable";
import Badge from "@/components/ui/Badge";
import StatCard from "@/components/ui/StatCard";
import ComingSoon from "@/components/ui/ComingSoon";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { downloadCsv } from "@/utils/csv";
import { getReviewQueue } from "@/api/admin/adminReviewApi";

const STATUS_VARIANT = {
  Pending: "info",
  "Under Review": "warning",
  Approved: "success",
  Rejected: "error",
};

const STAGE_OPTIONS = ["All Stages", "Idea", "Validation", "MVP", "Traction"];
const STATUS_OPTIONS = ["All Statuses", "Pending", "Under Review"];

export default function ReviewQueuePage() {
  useDocumentTitle("Stage Approval Queue — BOCC Admin");
  const navigate = useNavigate();

  const { data, isLoading: loading, error } = useQuery({
    queryKey: ["adminReviewQueue"],
    queryFn: getReviewQueue,
  });

  const submissions = data?.data?.submissions || [];
  const stats = data?.data?.stats || {
    pendingReviews: 0,
    approvedToday: 0,
    rejectedToday: 0,
    meetingsPending: 0,
  };

  // Client-side Filters
  const [stageFilter, setStageFilter] = useState("All Stages");
  const [statusFilter, setStatusFilter] = useState("All Statuses");
  const [chapterFilter, setChapterFilter] = useState("All Chapters");
  const [dateFilter, setDateFilter] = useState("");

  const chapterOptions = [
    "All Chapters",
    ...new Set(submissions.map((s) => s.chapter).filter(Boolean)),
  ];

  const visibleSubmissions = submissions.filter((s) => {
    if (stageFilter !== "All Stages" && s.stage !== stageFilter) return false;
    if (statusFilter !== "All Statuses" && s.status !== statusFilter)
      return false;
    if (chapterFilter !== "All Chapters" && s.chapter !== chapterFilter)
      return false;
    if (dateFilter && s.date !== dateFilter) return false;
    return true;
  });

  function handleResetFilters() {
    setStageFilter("All Stages");
    setStatusFilter("All Statuses");
    setChapterFilter("All Chapters");
    setDateFilter("");
  }

  const columns = [
    {
      key: "name",
      label: "Startup Name",
      width: "1.4fr",
      mobileLabel: false,
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-md bg-canvas-bg border border-border-subtle flex items-center justify-center font-bold text-text-heading text-xs select-none shrink-0">
            {row.name.charAt(0).toUpperCase()}
          </div>
          <p className="font-poppins font-semibold text-small text-text-heading truncate">
            {row.name}
          </p>
        </div>
      ),
    },
    { key: "founder", label: "Founder", width: "1.1fr" },
    { key: "chapter", label: "Chapter", width: "1.1fr" },
    {
      key: "stage",
      label: "Current Stage",
      width: "1fr",
      render: (row) => <Badge variant="brand">{row.stage}</Badge>,
    },
    { key: "date", label: "Submission Date", width: "1.1fr" },
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
    {
      key: "actions",
      label: "",
      width: "0.8fr",
      mobileLabel: false,
      render: () => (
        <span className="flex items-center gap-1 font-inter font-semibold text-small text-text-heading">
          View <ArrowRight size={14} strokeWidth={2} />
        </span>
      ),
    },
  ];

  return (
    <AdminShell>
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="font-poppins font-semibold text-page text-text-heading">
            Stage Approval Queue
          </h1>
          <p className="font-inter text-body text-text-body mt-1">
            Review startup submissions across all stages of the BOCC Startup
            Journey.
          </p>
        </div>
        <div className="flex gap-2">
          <ComingSoon label="Bulk Actions" position="bottom" inline>
            <span className="flex items-center gap-1.5 bg-surface-white border border-border-subtle px-4 py-2 rounded-lg text-text-heading font-poppins font-semibold text-small">
              <Zap size={14} strokeWidth={2} /> Bulk Actions
            </span>
          </ComingSoon>
          <button
            type="button"
            onClick={() =>
              downloadCsv("review-queue", columns, visibleSubmissions)
            }
            className="flex items-center gap-1.5 bg-surface-white border border-border-subtle px-4 py-2 rounded-lg text-text-heading font-poppins font-semibold text-small hover:bg-canvas-bg transition-colors"
          >
            <Download size={14} strokeWidth={2} /> Export Report
          </button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          label="Pending Reviews"
          value={stats.pendingReviews.toString()}
          icon={<Clock size={18} strokeWidth={2} />}
          subtext="Awaiting admin action"
        />
        <StatCard
          label="Approved Today"
          value={stats.approvedToday.toString()}
          icon={<CheckCircle size={18} strokeWidth={2} />}
          subtext="Completed today"
        />
        <StatCard
          label="Rejected Today"
          value={stats.rejectedToday.toString()}
          icon={<XCircle size={18} strokeWidth={2} />}
          subtext="Revisions requested"
        />
        <StatCard
          label="Meetings Pending"
          value={stats.meetingsPending.toString()}
          icon={<Calendar size={18} strokeWidth={2} />}
          subtext="Scheduled calls"
        />
      </div>

      {/* Filter Bar */}
      <div className="bg-canvas-bg border border-border-subtle rounded-lg p-4 mb-6 flex flex-wrap items-center gap-3">
        <span className="flex items-center gap-1.5 font-poppins font-semibold text-caption uppercase tracking-wider text-text-muted shrink-0">
          <Filter size={14} strokeWidth={2} /> Filters
        </span>
        <select
          value={stageFilter}
          onChange={(e) => setStageFilter(e.target.value)}
          className="bg-surface-white border border-border-subtle rounded-md text-text-body font-inter text-small py-2 px-2 focus:outline-none focus:ring-1 focus:ring-brand-black"
        >
          {STAGE_OPTIONS.map((opt) => (
            <option key={opt}>{opt}</option>
          ))}
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-surface-white border border-border-subtle rounded-md text-text-body font-inter text-small py-2 px-2 focus:outline-none focus:ring-1 focus:ring-brand-black"
        >
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt}>{opt}</option>
          ))}
        </select>
        <select
          value={chapterFilter}
          onChange={(e) => setChapterFilter(e.target.value)}
          className="bg-surface-white border border-border-subtle rounded-md text-text-body font-inter text-small py-2 px-2 focus:outline-none focus:ring-1 focus:ring-brand-black"
        >
          {chapterOptions.map((opt) => (
            <option key={opt}>{opt}</option>
          ))}
        </select>
        <input
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="bg-surface-white border border-border-subtle rounded-md text-text-body font-inter text-small py-2 px-2 focus:outline-none focus:ring-1 focus:ring-brand-black"
        />
        <button
          type="button"
          onClick={handleResetFilters}
          className="ml-auto flex items-center gap-1.5 font-inter font-medium text-small text-text-muted hover:text-text-heading transition-colors"
        >
          <RotateCcw size={14} strokeWidth={2} /> Reset
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 size={32} className="animate-spin text-text-muted" />
        </div>
      ) : error ? (
        <div className="flex justify-center py-16 text-error">
          <p>Failed to load review queue. Please try again.</p>
        </div>
      ) : (
        <>
          <DataTable
            columns={columns}
            rows={visibleSubmissions}
            onRowClick={(row) =>
              navigate(`/admin/reviews/ideation?id=${row.id}`)
            }
            emptyMessage="No submissions match the current filters."
          />
          <div className="flex justify-between items-center mt-4">
            <span className="font-inter text-small text-text-muted">
              Showing {visibleSubmissions.length} of {submissions.length}{" "}
              submissions
            </span>
          </div>
        </>
      )}
    </AdminShell>
  );
}
