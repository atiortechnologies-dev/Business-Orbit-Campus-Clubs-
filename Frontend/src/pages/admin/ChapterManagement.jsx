import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Building2,
  Users,
  Rocket,
  CalendarCheck,
  Edit,
  Archive,
  Download,
  Loader2,
} from "lucide-react";
import AdminShell from "@/components/admin/AdminShell";
import DataTable from "@/components/ui/DataTable";
import Badge from "@/components/ui/Badge";
import StatCard from "@/components/ui/StatCard";
import ComingSoon from "@/components/ui/ComingSoon";
import Pagination from "@/components/ui/Pagination";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { getChapters } from "@/api/admin/adminChapterApi";

const STATUS_VARIANT = {
  Active: "success",
  Pending: "warning",
  Probation: "neutral",
};

const GROWTH = [24, 38, 52, 68, 44, 21];
const GROWTH_MONTHS = ["Jan", "Mar", "May", "Jul", "Sep", "Nov"];

const PAGE_SIZE = 10;

export default function ChapterManagementPage() {
  useDocumentTitle("Chapter Management — BOCC Admin");

  const [page, setPage] = useState(1);

  // Fetching state
  const [rawChapters, setRawChapters] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let isMounted = true;

    const fetchChapters = async () => {
      try {
        setIsLoading(true);
        setIsError(false);
        setErrorMessage("");

        const res = await getChapters();
        const chaptersList = res?.data?.data || res?.data || res || [];

        if (isMounted) {
          setRawChapters(Array.isArray(chaptersList) ? chaptersList : []);
        }
      } catch (err) {
        console.error("Failed to fetch chapters:", err);
        if (isMounted) {
          setIsError(true);
          setErrorMessage(err?.message || "Failed to load chapters.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchChapters();

    return () => {
      isMounted = false;
    };
  }, []);

  // Format all raw chapters
  const allFormattedChapters = useMemo(() => {
    return rawChapters.map((c) => ({
      id: c._id || c.id,
      name: c.chapter_name || c.college_name,
      initial: (c.chapter_name || c.college_name || "C")
        .charAt(0)
        .toUpperCase(),
      institution: c.college_name,
      lead: c.lead_id?.full_name || "Unassigned",
      students: c.total_members || 0,
      startups: c.active_startups || 0,
      status: c.status || "Active",
    }));
  }, [rawChapters]);

  // Aggregate stats dynamically
  const { totalStudents, totalStartups } = useMemo(() => {
    return allFormattedChapters.reduce(
      (acc, c) => {
        acc.totalStudents += Number(c.students) || 0;
        acc.totalStartups += Number(c.startups) || 0;
        return acc;
      },
      { totalStudents: 0, totalStartups: 0 },
    );
  }, [allFormattedChapters]);

  // Pagination calculations on all formatted chapters
  const totalPages = Math.max(
    Math.ceil(allFormattedChapters.length / PAGE_SIZE),
    1,
  );

  const paginatedChapters = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return allFormattedChapters.slice(start, start + PAGE_SIZE);
  }, [allFormattedChapters, page]);

  const columns = [
    {
      key: "name",
      label: "Chapter Name",
      width: "1.6fr",
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-md bg-canvas-bg border border-border-subtle flex items-center justify-center font-poppins font-bold text-text-heading text-small shrink-0 select-none">
            {row.initial || row.name?.charAt(0)}
          </div>
          <span className="font-poppins font-semibold text-small text-text-heading">
            {row.name}
          </span>
        </div>
      ),
    },
    {
      key: "institution",
      label: "Institution",
      width: "1.4fr",
      className: "text-text-body",
    },
    {
      key: "lead",
      label: "Chapter Lead",
      width: "1.2fr",
      className: "text-text-body",
    },
    {
      key: "students",
      label: "Students",
      width: "0.8fr",
      render: (row) => row.students?.toLocaleString() || "0",
    },
    { key: "startups", label: "Startups", width: "0.7fr" },
    {
      key: "status",
      label: "Status",
      width: "0.8fr",
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
      render: (row) => (
        <div className="flex items-center gap-1">
          <Link
            to={`/admin/chapters/detail?id=${row.id}`}
            className="p-1.5 rounded-md text-text-muted hover:text-text-heading hover:bg-canvas-bg transition-colors"
            title="View"
          >
            <Users size={16} strokeWidth={2} />
          </Link>
          <ComingSoon
            label="Edit"
            position="top"
            inline
            className="p-1.5 rounded-md text-text-muted hover:text-text-heading hover:bg-canvas-bg transition-colors"
          >
            <Edit size={16} strokeWidth={2} />
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
            Chapter Management
          </h1>
          <p className="font-inter text-body text-text-body mt-1">
            Oversee and regulate centralized BOCC campus operations across all
            institutions.
          </p>
        </div>
        <Link
          to="/admin/chapters/create"
          className="flex items-center gap-1.5 bg-action-bg text-action-text px-4 py-2 rounded-lg font-poppins font-semibold text-small hover:opacity-90 transition-opacity"
        >
          <Building2 size={14} strokeWidth={2} /> Create New Chapter
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          label="Total Chapters"
          value={allFormattedChapters.length.toString()}
          icon={<Building2 size={16} strokeWidth={2} />}
          subtext="Total onboarding"
          trendDirection="up"
        />
        <StatCard
          label="Active Students"
          value={totalStudents.toLocaleString()}
          icon={<Users size={16} strokeWidth={2} />}
          subtext="Summed across chapters"
        />
        <StatCard
          label="Active Startups"
          value={totalStartups.toLocaleString()}
          icon={<Rocket size={16} strokeWidth={2} />}
          subtext="Summed across chapters"
        />
        <StatCard
          label="Upcoming Events"
          value="18"
          icon={<CalendarCheck size={16} strokeWidth={2} />}
          subtext="This month"
        />
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="w-8 h-8 text-brand-black animate-spin" />
        </div>
      ) : isError ? (
        <div className="p-8 text-center bg-error/10 text-error rounded-lg border border-error/20 mb-8">
          <p className="font-poppins font-semibold text-body">
            Failed to load chapters.
          </p>
          <p className="font-inter text-small mt-2">
            {errorMessage || "Please try again later."}
          </p>
        </div>
      ) : (
        <>
          <DataTable
            columns={columns}
            rows={paginatedChapters}
            emptyMessage="No chapters found."
          />
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
          <p className="font-inter text-small text-text-muted mt-4 mb-8 text-center">
            Showing {paginatedChapters.length} of {allFormattedChapters.length}{" "}
            entries (Page {page} of {totalPages})
          </p>
        </>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 bg-surface-white border border-border-subtle rounded-lg p-6 shadow-card">
          <h3 className="font-poppins font-semibold text-body text-text-heading mb-6">
            Chapter Growth Distribution
          </h3>
          <div className="flex items-end gap-3 h-32">
            {GROWTH.map((value, i) => (
              <div
                key={i}
                className="flex-1 bg-canvas-bg rounded-t-sm hover:bg-brand-black transition-colors"
                style={{ height: `${value}%` }}
                title={`${value}%`}
              />
            ))}
          </div>
          <div className="flex justify-between mt-2 pt-2 border-t border-divider-line font-inter text-caption text-text-muted uppercase">
            {GROWTH_MONTHS.map((m) => (
              <span key={m}>{m}</span>
            ))}
          </div>
        </div>
        <div className="lg:col-span-4 bg-surface-white border border-border-subtle rounded-lg p-6 shadow-card flex flex-col justify-between">
          <div>
            <h3 className="font-poppins font-semibold text-body text-text-heading mb-2">
              Regional Spotlight
            </h3>
            <p className="font-inter text-small text-text-muted">
              Pacific Region leads in startup registrations for Q4.
            </p>
          </div>
          <div className="flex justify-center py-4">
            <div className="w-20 h-20 rounded-full border-4 border-canvas-bg flex items-center justify-center relative">
              <div
                className="absolute inset-0 rounded-full border-4 border-brand-black"
                style={{ clipPath: "inset(0 0 25% 0)" }}
              />
              <span className="font-poppins font-semibold text-body text-text-heading">
                75%
              </span>
            </div>
          </div>
          <ComingSoon label="Generate Report" position="top" inline>
            <span className="block text-center font-poppins font-semibold text-small text-text-heading underline decoration-2 underline-offset-4 cursor-pointer">
              Generate Report
            </span>
          </ComingSoon>
        </div>
      </div>
    </AdminShell>
  );
}
