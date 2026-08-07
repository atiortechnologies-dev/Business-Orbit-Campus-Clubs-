import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  CalendarClock,
  CalendarCheck,
  CalendarX,
  History,
  Eye,
  Loader2,
} from "lucide-react";
import AdminShell from "@/components/admin/AdminShell";
import DataTable from "@/components/ui/DataTable";
import Badge from "@/components/ui/Badge";
import StatCard from "@/components/ui/StatCard";
import Pagination from "@/components/ui/Pagination";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { getMeetings } from "@/api/admin/adminMeetingApi";
import { getChapters } from "@/api/admin/adminChapterApi";

const STAGES = [
  { value: "ideation", label: "Ideation" },
  { value: "validation", label: "Validation" },
  { value: "mvp", label: "MVP" },
  { value: "incubation", label: "Incubation" },
  { value: "traction", label: "Traction" },
  { value: "launch", label: "Launch" },
];

const STATUS_OPTIONS = [
  { value: "scheduled", label: "Upcoming" },
  { value: "completed", label: "Completed" },
  { value: "rescheduled", label: "Rescheduled" },
  { value: "cancelled", label: "Cancelled" },
];

const STATUS_VARIANT = {
  scheduled: "info",
  completed: "success",
  rescheduled: "warning",
  cancelled: "neutral",
};

const STATUS_LABEL = {
  scheduled: "Upcoming",
  completed: "Completed",
  rescheduled: "Rescheduled",
  cancelled: "Cancelled",
};

const PAGE_SIZE = 5;

const selectClasses =
  "min-h-11 rounded-md border border-border-subtle bg-surface-white text-sm text-text-body font-inter px-3 focus:outline-none focus:ring-1 focus:ring-brand-black";

export default function MeetingsDashboardPage() {
  useDocumentTitle("Meetings — BOCC Admin");

  const [page, setPage] = useState(1);
  const [chapters, setChapters] = useState([]);
  const [filters, setFilters] = useState({
    chapter: "",
    stage: "",
    status: "",
    date: "",
    sort: "desc",
  });

  const [rawMeetings, setRawMeetings] = useState([]);
  const [counts, setCounts] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Chapters list backs the "All Chapters" filter — this endpoint is real
  // and already wired for Chapter Management, so it's reused as-is here.
  useEffect(() => {
    getChapters()
      .then((res) => {
        const list = res?.data?.data || res?.data || res || [];
        setChapters(Array.isArray(list) ? list : []);
      })
      .catch(() => setChapters([]));
  }, []);

  useEffect(() => {
    let isMounted = true;

    const fetchMeetings = async () => {
      try {
        setIsLoading(true);
        setIsError(false);
        setErrorMessage("");

        const params = {};
        if (filters.chapter) params.chapter = filters.chapter;
        if (filters.stage) params.stage = filters.stage;
        if (filters.status) params.status = filters.status;
        if (filters.date) params.date = filters.date;
        if (filters.sort) params.sort = filters.sort;

        // TODO(backend): GET /admin/meetings doesn't exist yet — see
        // adminMeetingApi.js's getMeetings for the expected response shape.
        const res = await getMeetings(params);
        const payload = res?.data || res || {};
        const meetingsList = Array.isArray(payload.meetings)
          ? payload.meetings
          : Array.isArray(payload)
            ? payload
            : [];

        if (isMounted) {
          setRawMeetings(meetingsList);
          setCounts(payload.counts || {});
        }
      } catch (err) {
        console.error("Failed to fetch meetings:", err);
        if (isMounted) {
          setIsError(true);
          setErrorMessage(err?.message || "Failed to load meetings.");
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchMeetings();

    return () => {
      isMounted = false;
    };
  }, [filters]);

  const allFormattedMeetings = useMemo(() => {
    return rawMeetings.map((m) => {
      const startup = m.startup_id || m.startup || {};
      const scheduledDate = m.scheduledAt ? new Date(m.scheduledAt) : null;

      return {
        id: m._id || m.id,
        startupName: startup.startup_name || startup.name || "Untitled",
        founder: startup.student_id?.full_name || m.founder || "N/A",
        chapter: startup.chapter || m.chapter || "—",
        stage: m.stage,
        stageLabel:
          STAGES.find((s) => s.value === m.stage)?.label || m.stage || "—",
        date: scheduledDate ? scheduledDate.toLocaleDateString() : "—",
        time: scheduledDate
          ? scheduledDate.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })
          : "—",
        status: m.status || "scheduled",
      };
    });
  }, [rawMeetings]);

  const totalPages = Math.max(
    Math.ceil(allFormattedMeetings.length / PAGE_SIZE),
    1,
  );

  const paginatedMeetings = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return allFormattedMeetings.slice(start, start + PAGE_SIZE);
  }, [allFormattedMeetings, page]);

  const updateFilter = (key) => (e) => {
    setPage(1);
    setFilters((prev) => ({ ...prev, [key]: e.target.value }));
  };

  const columns = [
    {
      key: "startupName",
      label: "Startup",
      width: "1.4fr",
      className: "font-poppins font-semibold text-small text-text-heading",
    },
    { key: "founder", label: "Founder", width: "1.1fr" },
    { key: "chapter", label: "Chapter", width: "1.1fr" },
    { key: "stageLabel", label: "Current Stage", width: "1fr" },
    { key: "date", label: "Meeting Date", width: "1fr" },
    { key: "time", label: "Meeting Time", width: "0.8fr" },
    {
      key: "status",
      label: "Status",
      width: "0.9fr",
      render: (row) => (
        <Badge variant={STATUS_VARIANT[row.status] || "neutral"}>
          {STATUS_LABEL[row.status] || row.status}
        </Badge>
      ),
    },
    {
      key: "actions",
      label: "Action",
      width: "0.7fr",
      mobileLabel: false,
      render: (row) => (
        <Link
          to={`/admin/meetings/detail?id=${row.id}`}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-border-subtle text-text-heading hover:bg-canvas-bg transition-colors font-inter font-medium text-caption"
        >
          <Eye size={14} strokeWidth={2} /> View
        </Link>
      ),
    },
  ];

  return (
    <AdminShell>
      <div className="mb-8">
        <h1 className="font-poppins font-semibold text-page text-text-heading">
          Meetings
        </h1>
        <p className="font-inter text-body text-text-body mt-1">
          Track and manage every review meeting scheduled across chapters.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          label="Today's Meetings"
          value={(counts.today ?? 0).toString()}
          icon={<CalendarClock size={16} strokeWidth={2} />}
        />
        <StatCard
          label="Upcoming Meetings"
          value={(counts.upcoming ?? 0).toString()}
          icon={<CalendarClock size={16} strokeWidth={2} />}
        />
        <StatCard
          label="Completed Meetings"
          value={(counts.completed ?? 0).toString()}
          icon={<CalendarCheck size={16} strokeWidth={2} />}
        />
        <StatCard
          label="Rescheduled Meetings"
          value={(counts.rescheduled ?? 0).toString()}
          icon={<History size={16} strokeWidth={2} />}
        />
      </div>

      <div className="flex flex-wrap items-end gap-3 mb-6 bg-surface-white border border-border-subtle rounded-lg p-4 shadow-card">
        <div className="flex flex-col gap-1">
          <label
            htmlFor="filter-chapter"
            className="text-caption font-medium text-text-heading font-inter"
          >
            Chapter
          </label>
          <select
            id="filter-chapter"
            value={filters.chapter}
            onChange={updateFilter("chapter")}
            className={selectClasses}
          >
            <option value="">All Chapters</option>
            {chapters.map((c) => (
              <option key={c._id || c.id} value={c._id || c.id}>
                {c.chapter_name || c.college_name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label
            htmlFor="filter-stage"
            className="text-caption font-medium text-text-heading font-inter"
          >
            Stage
          </label>
          <select
            id="filter-stage"
            value={filters.stage}
            onChange={updateFilter("stage")}
            className={selectClasses}
          >
            <option value="">All Stages</option>
            {STAGES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label
            htmlFor="filter-status"
            className="text-caption font-medium text-text-heading font-inter"
          >
            Status
          </label>
          <select
            id="filter-status"
            value={filters.status}
            onChange={updateFilter("status")}
            className={selectClasses}
          >
            <option value="">All Statuses</option>
            {STATUS_OPTIONS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label
            htmlFor="filter-date"
            className="text-caption font-medium text-text-heading font-inter"
          >
            Date
          </label>
          <input
            id="filter-date"
            type="date"
            value={filters.date}
            onChange={updateFilter("date")}
            className={selectClasses}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label
            htmlFor="filter-sort"
            className="text-caption font-medium text-text-heading font-inter"
          >
            Sort
          </label>
          <select
            id="filter-sort"
            value={filters.sort}
            onChange={updateFilter("sort")}
            className={selectClasses}
          >
            <option value="desc">Newest First</option>
            <option value="asc">Oldest First</option>
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="w-8 h-8 text-brand-black animate-spin" />
        </div>
      ) : isError ? (
        <div className="p-8 text-center bg-error/10 text-error rounded-lg border border-error/20 flex flex-col items-center gap-2">
          <CalendarX size={28} strokeWidth={2} />
          <p className="font-poppins font-semibold text-body">
            Failed to load meetings.
          </p>
          <p className="font-inter text-small">
            {errorMessage || "Please try again later."}
          </p>
        </div>
      ) : (
        <>
          <DataTable
            columns={columns}
            rows={paginatedMeetings}
            emptyMessage="No meetings found for the selected filters."
            rowClassName={(row) =>
              row.status === "cancelled" ? "opacity-60" : ""
            }
          />
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
          <p className="font-inter text-small text-text-muted mt-4 text-center">
            Showing {paginatedMeetings.length} of{" "}
            {allFormattedMeetings.length} entries (Page {page} of{" "}
            {totalPages})
          </p>
        </>
      )}
    </AdminShell>
  );
}
