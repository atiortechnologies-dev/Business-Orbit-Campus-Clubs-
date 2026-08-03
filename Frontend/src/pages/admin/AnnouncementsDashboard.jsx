import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { Plus, Archive, FileEdit, Eye, Edit, Zap, Loader2 } from "lucide-react";
import AdminShell from "@/components/admin/AdminShell";
import DataTable from "@/components/ui/DataTable";
import Badge from "@/components/ui/Badge";
import StatCard from "@/components/ui/StatCard";
import ComingSoon from "@/components/ui/ComingSoon";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { getAnnouncements } from "@/api/admin/adminAnnouncementApi";

const STATUS_VARIANT = {
  Published: "success",
  Scheduled: "info",
  Draft: "neutral",
};
const PRIORITY_VARIANT = {
  Critical: "error",
  Important: "warning",
  Normal: "neutral",
};

const STATUS_OPTIONS = ["All Status", "Published", "Scheduled", "Draft"];
const PRIORITY_OPTIONS = ["All Priority", "Critical", "Important", "Normal"];

export default function AnnouncementsDashboardPage() {
  useDocumentTitle("Announcements — BOCC Admin");

  const [statusFilter, setStatusFilter] = useState("All Status");
  const [priorityFilter, setPriorityFilter] = useState("All Priority");

  const [announcements, setAnnouncements] = useState([]);
  const [stats, setStats] = useState({
    total_views_today: 0,
    published_today: 0,
    scheduled: 0,
    drafts: 0,
  });
  const [loading, setLoading] = useState(true);

  const fetchAnnouncementsData = useCallback(async () => {
    try {
      setLoading(true);
      const params = {};
      if (statusFilter !== "All Status") params.status = statusFilter;
      if (priorityFilter !== "All Priority") params.priority = priorityFilter;

      const res = await getAnnouncements(params);
      const data = res?.data || res;

      // Extract array payload and stats
      setAnnouncements(Array.isArray(data) ? data : data?.data || []);
      if (res?.stats) setStats(res.stats);
    } catch (err) {
      console.error("Failed to load announcements:", err);
    } finally {
      setLoading(false);
    }
  }, [statusFilter, priorityFilter]);

  useEffect(() => {
    fetchAnnouncementsData();
  }, [fetchAnnouncementsData]);

  const columns = [
    {
      key: "title",
      label: "Title & Meta",
      width: "2.2fr",
      render: (row) => (
        <div>
          <p className="font-poppins font-semibold text-small text-text-heading">
            {row.title}
          </p>
          <p className="font-inter text-caption text-text-muted mt-0.5 line-clamp-1">
            {row.short_summary}
          </p>
          <p className="font-inter text-caption text-text-muted mt-1">
            {row.author_id?.full_name || "Admin"} ·{" "}
            {new Date(
              row.created_at || row.createdAt || Date.now(),
            ).toLocaleDateString()}
          </p>
        </div>
      ),
    },
    {
      key: "target_audience",
      label: "Audience",
      width: "1.3fr",
      render: (row) => (
        <div className="flex flex-wrap gap-1">
          {(row.target_audience || []).map((a) => (
            <span
              key={a}
              className="px-2 py-0.5 rounded bg-canvas-bg text-text-muted font-inter text-[10px] font-semibold uppercase"
            >
              {a}
            </span>
          ))}
        </div>
      ),
    },
    {
      key: "priority",
      label: "Priority",
      width: "0.9fr",
      render: (row) => (
        <Badge variant={PRIORITY_VARIANT[row.priority] || "neutral"}>
          {row.priority || "Normal"}
        </Badge>
      ),
    },
    {
      key: "status",
      label: "Status",
      width: "0.9fr",
      render: (row) => (
        <Badge variant={STATUS_VARIANT[row.status] || "neutral"}>
          {row.status}
        </Badge>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      width: "1fr",
      mobileLabel: false,
      render: () => (
        <div className="flex items-center gap-1">
          <ComingSoon
            label="Edit"
            position="top"
            inline
            className="p-1.5 rounded-md text-text-muted hover:text-text-heading hover:bg-canvas-bg transition-colors"
          >
            <Edit size={16} strokeWidth={2} />
          </ComingSoon>
          <ComingSoon
            label="Preview"
            position="top"
            inline
            className="p-1.5 rounded-md text-text-muted hover:text-text-heading hover:bg-canvas-bg transition-colors"
          >
            <Eye size={16} strokeWidth={2} />
          </ComingSoon>
          <ComingSoon
            label="Archive"
            position="top"
            inline
            className="p-1.5 rounded-md text-text-muted hover:text-text-heading hover:bg-canvas-bg transition-colors"
          >
            <Archive size={16} strokeWidth={2} />
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
            Announcements
          </h1>
          <p className="font-inter text-body text-text-body mt-1">
            Manage announcements visible across the BOCC platform.
          </p>
        </div>
        <div className="flex gap-2">
          <ComingSoon label="Archived" position="bottom" inline>
            <span className="flex items-center gap-1.5 bg-surface-white border border-border-subtle px-4 py-2 rounded-lg text-text-heading font-poppins font-semibold text-small cursor-pointer">
              <Archive size={14} strokeWidth={2} /> Archived
            </span>
          </ComingSoon>
          <ComingSoon label="Drafts" position="bottom" inline>
            <span className="flex items-center gap-1.5 bg-surface-white border border-border-subtle px-4 py-2 rounded-lg text-text-heading font-poppins font-semibold text-small cursor-pointer">
              <FileEdit size={14} strokeWidth={2} /> Drafts
            </span>
          </ComingSoon>
          <Link
            to="/admin/announcements/create"
            className="flex items-center gap-1.5 bg-action-bg text-action-text px-4 py-2 rounded-lg font-poppins font-semibold text-small hover:opacity-90 transition-all"
          >
            <Plus size={14} strokeWidth={2} /> New Announcement
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
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
            Priority
          </label>
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="w-full bg-canvas-bg border border-border-subtle rounded-md text-text-body font-inter text-small py-2 px-2 focus:outline-none focus:ring-1 focus:ring-brand-black"
          >
            {PRIORITY_OPTIONS.map((opt) => (
              <option key={opt}>{opt}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-9">
          {loading ? (
            <div className="flex items-center justify-center py-20 bg-surface-white border border-border-subtle rounded-lg">
              <Loader2 size={32} className="animate-spin text-text-muted" />
            </div>
          ) : (
            <>
              <DataTable
                columns={columns}
                rows={announcements}
                emptyMessage="No announcements match the current filters."
              />
              <p className="font-inter text-small text-text-muted mt-4">
                Showing {announcements.length} announcements
              </p>
            </>
          )}
        </div>

        <div className="lg:col-span-3 space-y-6">
          <StatCard
            label="Total Views Today"
            value={stats.total_views_today || "0"}
            icon={<Eye size={16} strokeWidth={2} />}
          />
          <div className="bg-surface-white border border-border-subtle rounded-lg p-6 shadow-card space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-inter text-small text-text-body">
                Published Today
              </span>
              <span className="font-poppins font-semibold text-body text-text-heading">
                {stats.published_today || 0}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-inter text-small text-text-body">
                Scheduled
              </span>
              <span className="font-poppins font-semibold text-body text-text-heading">
                {stats.scheduled || 0}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-inter text-small text-text-body">
                Drafts
              </span>
              <span className="font-poppins font-semibold text-body text-text-heading">
                {stats.drafts || 0}
              </span>
            </div>
          </div>
          <div className="bg-surface-white border border-border-subtle rounded-lg p-6 shadow-card">
            <div className="flex items-center gap-2 text-text-muted mb-3">
              <Zap size={16} strokeWidth={2} />
              <p className="font-inter font-medium text-caption uppercase tracking-wider">
                System Logs
              </p>
            </div>
            <ul className="space-y-3">
              <li>
                <p className="font-inter text-small text-text-heading">
                  Announcement module loaded successfully.
                </p>
                <p className="font-inter text-caption text-text-muted">
                  Just now
                </p>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
