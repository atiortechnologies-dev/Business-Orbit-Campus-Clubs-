import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ChevronRight,
  Edit,
  UserPlus,
  Download,
  Users,
  Rocket,
  GraduationCap,
  CalendarCheck,
  Loader2,
  Sparkles,
  Inbox,
  MoreVertical,
  Search,
  Filter,
  FileEdit,
  Mail,
  Settings,
  ClipboardCheck,
  TrendingUp,
  CheckCircle2,
} from "lucide-react";
import AdminShell from "@/components/admin/AdminShell";
import DataTable from "@/components/ui/DataTable";
import Badge from "@/components/ui/Badge";
import StatCard from "@/components/ui/StatCard";
import ComingSoon from "@/components/ui/ComingSoon";
import Pagination from "@/components/ui/Pagination";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { getChapterById } from "@/api/admin/adminChapterApi";

function initialsOf(name = "") {
  return (
    name
      .trim()
      .split(/\s+/)
      .map((p) => p[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() || "?"
  );
}

const CHAPTER_STATUS_VARIANT = {
  Active: "success",
  Pending: "warning",
  Inactive: "neutral",
};

const STUDENT_STATUS_VARIANT = {
  Active: "success",
  Completed: "success",
  Pending: "warning",
  Incomplete: "neutral",
};

const TABS = ["Overview", "Students", "Startups", "Events"];

const STARTUPS_PAGE_SIZE = 4;

export default function ChapterDetailPage() {
  const [activeTab, setActiveTab] = useState("Overview");
  const { chapterId } = useParams();

  useDocumentTitle("Chapter Details — BOCC Admin");

  const [chapterData, setChapterData] = useState(null);
  const [students, setStudents] = useState([]);
  const [startups, setStartups] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const [startupSearch, setStartupSearch] = useState("");
  const [startupStageFilter, setStartupStageFilter] = useState("");
  const [startupIndustryFilter, setStartupIndustryFilter] = useState("");
  const [startupFounderFilter, setStartupFounderFilter] = useState("");
  const [startupMentorFilter, setStartupMentorFilter] = useState("");
  const [startupStatusFilter, setStartupStatusFilter] = useState("");
  const [startupsPage, setStartupsPage] = useState(1);

  useEffect(() => {
    let isMounted = true;

    const fetchChapterDetails = async () => {
      try {
        setIsLoading(true);
        setIsError(false);

        const searchParams = new URLSearchParams(window.location.search);
        const targetId = chapterId || searchParams.get("id");

        if (!targetId) {
          setIsError(true);
          return;
        }

        const res = await getChapterById(targetId);
        const payload = res?.data?.data || res?.data || res;

        if (isMounted && payload) {
          setChapterData(payload.chapter);
          setStudents(payload.students || []);
          setStartups(payload.startups || []);
        }
      } catch (err) {
        console.error("Failed to load chapter details:", err);
        if (isMounted) setIsError(true);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchChapterDetails();

    return () => {
      isMounted = false;
    };
  }, [chapterId]);

  const startupStats = useMemo(() => {
    const total = startups.length;
    const active = startups.filter((s) => (s.progress_percentage || 0) > 0).length;
    // TODO(backend): getChapterDetails' startups[] has no canonical stage
    // taxonomy field (see the Stage column below) and no created_at, so
    // "Incubated"/"Launched" are a best-effort client-side classification
    // over the free-text stage string rather than a real computed value.
    const launched = startups.filter((s) =>
      (s.stage || "").toLowerCase().includes("launch"),
    ).length;
    const incubated = startups.filter((s) => {
      const stage = (s.stage || "").toLowerCase();
      return stage && !stage.includes("ideation") && !stage.includes("launch");
    }).length;
    return { total, active, incubated, launched };
  }, [startups]);

  const filteredStartups = useMemo(() => {
    const q = startupSearch.trim().toLowerCase();
    return startups.filter((s) => {
      if (q && !(s.startup_name || "").toLowerCase().includes(q)) return false;
      if (startupStageFilter && (s.stage || "—") !== startupStageFilter)
        return false;
      if (startupIndustryFilter && s.industry !== startupIndustryFilter)
        return false;
      if (startupFounderFilter && s.founder_name !== startupFounderFilter)
        return false;
      if (
        startupMentorFilter &&
        (s.mentor_name || "Unassigned") !== startupMentorFilter
      )
        return false;
      if (startupStatusFilter && (s.status || "—") !== startupStatusFilter)
        return false;
      return true;
    });
  }, [
    startups,
    startupSearch,
    startupStageFilter,
    startupIndustryFilter,
    startupFounderFilter,
    startupMentorFilter,
    startupStatusFilter,
  ]);

  const startupStageOptions = useMemo(
    () => [...new Set(startups.map((s) => s.stage).filter(Boolean))],
    [startups],
  );
  const startupIndustryOptions = useMemo(
    () => [...new Set(startups.map((s) => s.industry).filter(Boolean))],
    [startups],
  );
  const startupFounderOptions = useMemo(
    () => [...new Set(startups.map((s) => s.founder_name).filter(Boolean))],
    [startups],
  );
  const startupMentorOptions = useMemo(
    () => [...new Set(startups.map((s) => s.mentor_name || "Unassigned"))],
    [startups],
  );
  const startupStatusOptions = useMemo(
    () => [...new Set(startups.map((s) => s.status || "—"))],
    [startups],
  );

  const startupsTotalPages = Math.max(
    Math.ceil(filteredStartups.length / STARTUPS_PAGE_SIZE),
    1,
  );
  const paginatedStartups = useMemo(() => {
    const start = (startupsPage - 1) * STARTUPS_PAGE_SIZE;
    return filteredStartups.slice(start, start + STARTUPS_PAGE_SIZE);
  }, [filteredStartups, startupsPage]);

  if (isLoading) {
    return (
      <AdminShell>
        <div className="min-h-[50vh] flex items-center justify-center">
          <Loader2 size={28} className="animate-spin text-text-muted" />
        </div>
      </AdminShell>
    );
  }

  if (isError || !chapterData) {
    return (
      <AdminShell>
        <div className="min-h-[50vh] flex flex-col items-center justify-center text-center gap-3">
          <Inbox size={32} className="text-text-muted" />
          <p className="font-poppins font-semibold text-card text-text-heading">
            Couldn't load this chapter
          </p>
          <p className="font-inter text-small text-text-muted max-w-sm">
            This chapter's details aren't available or the ID is invalid.
          </p>
          <Link
            to="/admin/chapters"
            className="font-poppins font-semibold text-small text-text-heading hover:opacity-80 transition-opacity"
          >
            Back to Chapters
          </Link>
        </div>
      </AdminShell>
    );
  }

  const studentColumns = [
    {
      key: "name",
      label: "Student",
      width: "1.4fr",
      render: (row) => (
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-full bg-canvas-bg border border-border-subtle flex items-center justify-center font-poppins font-bold text-caption text-text-heading bg-cover bg-center"
            style={
              row.profile_photo
                ? { backgroundImage: `url(${row.profile_photo})` }
                : undefined
            }
          >
            {!row.profile_photo && initialsOf(row.name)}
          </div>
          <div>
            <span className="font-inter font-medium text-small text-text-heading block">
              {row.name}
            </span>
            <span className="font-inter text-caption text-text-muted">
              {row.email}
            </span>
          </div>
        </div>
      ),
    },
    { key: "degree", label: "Degree / Branch", width: "1.1fr" },
    { key: "graduation_year", label: "Grad Year", width: "0.9fr" },
    {
      key: "status",
      label: "Status",
      width: "0.9fr",
      render: (row) => (
        <Badge variant={STUDENT_STATUS_VARIANT[row.status] || "neutral"}>
          {row.status}
        </Badge>
      ),
    },
  ];

  const startupColumns = [
    {
      key: "startup_name",
      label: "Startup Name",
      width: "1.3fr",
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-md bg-canvas-bg border border-border-subtle flex items-center justify-center font-poppins font-bold text-caption text-text-heading shrink-0 select-none">
            {(row.startup_name || "?").charAt(0).toUpperCase()}
          </div>
          <p className="font-inter font-medium text-small text-text-heading truncate">
            {row.startup_name || "Untitled"}
          </p>
        </div>
      ),
    },
    {
      key: "founder_name",
      label: "Founder",
      width: "1.1fr",
      render: (row) => (
        <div>
          <p className="font-inter font-medium text-small text-text-heading truncate">
            {row.founder_name || "N/A"}
          </p>
          <p className="font-inter text-caption text-text-muted truncate">
            {row.founder_email}
          </p>
        </div>
      ),
    },
    {
      key: "industry",
      label: "Industry",
      width: "1fr",
      render: (row) => row.industry || "—",
    },
    {
      key: "stage",
      label: "Stage",
      width: "0.9fr",
      // TODO(backend): getChapterDetails' startups[].stage is free text
      // (st.stage, falling back to "Stage N") — not the canonical
      // Ideation/Validation/MVP/Traction/Launch & Pitch taxonomy from
      // stageDefinitions.js used everywhere else in this app (e.g.
      // postMeetingOutcome writes lowercase values from its own 6-stage
      // STAGE_ORDER, which even has an "incubation" step the canonical
      // taxonomy doesn't). Shown as-is rather than force-mapped.
      render: (row) => <Badge variant="brand">{row.stage || "—"}</Badge>,
    },
    {
      key: "progress",
      label: "Progress",
      width: "1.1fr",
      render: (row) => (
        <div className="flex items-center gap-2">
          <div className="flex-1 h-1.5 bg-canvas-bg rounded-full overflow-hidden max-w-[100px]">
            <div
              className="h-full bg-brand-black rounded-full"
              style={{ width: `${row.progress_percentage || 0}%` }}
            />
          </div>
          <span className="font-inter text-caption text-text-muted shrink-0">
            {row.progress_percentage || 0}%
          </span>
        </div>
      ),
    },
    {
      key: "mentor",
      label: "Mentor",
      width: "1fr",
      // TODO(backend): Startup has no direct mentor field — needs a
      // MentorAssignment join on the backend. Real "Unassigned" fallback
      // until that's populated, matching the chapter-lead fallback pattern.
      render: (row) => row.mentor_name || "Unassigned",
    },
    {
      key: "status",
      label: "Status",
      width: "0.8fr",
      // TODO(backend): Startup has no status field at all today.
      render: (row) => row.status || "—",
    },
    {
      key: "actions",
      label: "",
      width: "0.4fr",
      mobileLabel: false,
      render: (row) => (
        <Link
          to={`/admin/startups/detail?id=${row.id}`}
          aria-label={`View ${row.startup_name || "startup"}`}
          title="View"
          className="inline-flex items-center justify-center p-1.5 rounded-md text-text-muted hover:text-text-heading hover:bg-canvas-bg transition-colors"
        >
          <MoreVertical size={16} strokeWidth={2} />
        </Link>
      ),
    },
  ];

  return (
    <AdminShell>
      <nav className="mb-6 flex items-center gap-2 text-text-muted font-inter font-normal text-small">
        <Link
          to="/admin/chapters"
          className="hover:text-text-heading transition-colors"
        >
          Chapters
        </Link>
        <ChevronRight size={14} strokeWidth={2} />
        <span className="text-text-heading font-semibold">
          {chapterData.name}
        </span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: chapter profile card */}
        <div className="lg:col-span-2">
          <div className="bg-surface-white border border-border-subtle rounded-lg p-6 shadow-card lg:sticky lg:top-24">
            <div className="flex flex-col items-center text-center pb-6 border-b border-divider-line mb-6">
              <div className="w-20 h-20 rounded-xl bg-canvas-bg border border-border-subtle flex items-center justify-center font-poppins font-bold text-section text-text-heading mb-4 select-none">
                {initialsOf(chapterData.name)}
              </div>
              <h1 className="font-poppins font-semibold text-card text-text-heading">
                {chapterData.name}
              </h1>
              <p className="font-inter text-small text-text-muted">
                {chapterData.institution}
              </p>
              <span className="mt-3">
                <Badge
                  variant={
                    CHAPTER_STATUS_VARIANT[chapterData.status] || "neutral"
                  }
                >
                  {chapterData.status}
                </Badge>
              </span>
            </div>
            <div className="space-y-4">
              <div>
                <p className="font-inter text-caption text-text-muted uppercase tracking-wider mb-1">
                  Chapter Lead
                </p>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-canvas-bg border border-border-subtle flex items-center justify-center font-poppins font-bold text-[9px] text-text-heading select-none">
                    {initialsOf(chapterData.lead_name)}
                  </div>
                  <div>
                    <p className="font-inter text-small text-text-heading">
                      {chapterData.lead_name}
                    </p>
                    <p className="font-inter text-caption text-text-muted">
                      {chapterData.lead_email}
                    </p>
                  </div>
                </div>
              </div>
              <div>
                <p className="font-inter text-caption text-text-muted uppercase tracking-wider mb-1">
                  Founded
                </p>
                <p className="font-inter text-small text-text-heading">
                  {new Date(chapterData.created_at).toLocaleDateString(
                    "en-US",
                    {
                      month: "long",
                      year: "numeric",
                    },
                  )}
                </p>
              </div>
              {chapterData.description && (
                <div>
                  <p className="font-inter text-caption text-text-muted uppercase tracking-wider mb-1">
                    Description
                  </p>
                  <p className="font-inter text-small text-text-body leading-relaxed">
                    {chapterData.description}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Center: tabbed content */}
        <div className="lg:col-span-8 space-y-6">
          <div className="border-b border-divider-line flex gap-8">
            {TABS.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`pb-3 font-inter text-small transition-colors ${
                  activeTab === tab
                    ? "text-text-heading font-semibold border-b-2 border-brand-black"
                    : "text-text-muted hover:text-text-heading"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {activeTab === "Overview" && (
            <>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatCard
                  label="Total Students"
                  value={students.length.toString()}
                  icon={<Users size={16} strokeWidth={2} />}
                />
                <StatCard
                  label="Active Startups"
                  value={startups.length.toString()}
                  icon={<Rocket size={16} strokeWidth={2} />}
                />
                <StatCard
                  label="Mentors"
                  value={chapterData.stats?.mentors_count?.toString() || "0"}
                  icon={<GraduationCap size={16} strokeWidth={2} />}
                />
                <StatCard
                  label="Events"
                  value={chapterData.stats?.events_conducted?.toString() || "0"}
                  icon={<CalendarCheck size={16} strokeWidth={2} />}
                />
              </div>

              <div className="bg-surface-white border border-border-subtle rounded-lg p-6 shadow-card flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
                <div className="w-16 h-16 rounded-xl bg-canvas-bg border border-border-subtle flex items-center justify-center shrink-0">
                  <Sparkles
                    size={24}
                    strokeWidth={1.5}
                    className="text-text-muted"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-poppins font-semibold text-card text-text-heading mb-1">
                    Chapter Operational
                  </h3>
                  <p className="font-inter text-small text-text-muted">
                    {students.length} students & {startups.length} startups
                    enrolled under this chapter.
                  </p>
                </div>
                <ComingSoon label="Edit Chapter" position="top" inline>
                  <span className="px-5 py-2.5 border border-border-subtle rounded-lg font-poppins font-semibold text-small text-text-heading whitespace-nowrap cursor-pointer">
                    Edit Chapter
                  </span>
                </ComingSoon>
              </div>

              {/* Startups Table in Overview */}
              <div className="bg-surface-white border border-border-subtle rounded-lg overflow-hidden shadow-card">
                <div className="px-6 py-4 border-b border-divider-line bg-canvas-bg/50 flex justify-between items-center">
                  <h3 className="font-poppins font-semibold text-body text-text-heading">
                    Active Startups ({startups.length})
                  </h3>
                  <button
                    type="button"
                    onClick={() => setActiveTab("Startups")}
                    className="font-inter font-medium text-caption text-text-heading hover:opacity-80"
                  >
                    View All
                  </button>
                </div>
                <DataTable
                  columns={startupColumns}
                  rows={startups.slice(0, 5)}
                  emptyMessage="No startups registered under this chapter yet."
                />
              </div>

              {/* Students Table in Overview */}
              <div className="bg-surface-white border border-border-subtle rounded-lg overflow-hidden shadow-card">
                <div className="px-6 py-4 border-b border-divider-line bg-canvas-bg/50 flex justify-between items-center">
                  <h3 className="font-poppins font-semibold text-body text-text-heading">
                    Students Overview ({students.length})
                  </h3>
                  <button
                    type="button"
                    onClick={() => setActiveTab("Students")}
                    className="font-inter font-medium text-caption text-text-heading hover:opacity-80"
                  >
                    View All
                  </button>
                </div>
                <DataTable
                  columns={studentColumns}
                  rows={students.slice(0, 5)}
                  emptyMessage="No students assigned to this chapter yet."
                />
              </div>
            </>
          )}

          {activeTab === "Students" && (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <StatCard
                  label="Total Students"
                  value={students.length.toString()}
                />
                <StatCard
                  label="Active Students"
                  value={students.length.toString()}
                />
                <StatCard label="Incomplete Profiles" value="0" />
              </div>
              <DataTable
                columns={studentColumns}
                rows={students}
                emptyMessage="No students found for this chapter."
              />
            </>
          )}

          {activeTab === "Startups" && (
            <>
              <div>
                <h2 className="font-poppins font-semibold text-card text-text-heading">
                  Chapter Startups
                </h2>
                <p className="font-inter text-small text-text-muted mt-1">
                  Manage and monitor the portfolio of ventures within this
                  chapter.
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatCard
                  label="Total Startups"
                  value={startupStats.total.toString()}
                  icon={<Rocket size={16} strokeWidth={2} />}
                />
                <StatCard
                  label="Active Startups"
                  value={startupStats.active.toString()}
                  icon={<TrendingUp size={16} strokeWidth={2} />}
                />
                <StatCard
                  label="Incubated"
                  value={startupStats.incubated.toString()}
                  subtext={
                    startupStats.total
                      ? `${Math.round((startupStats.incubated / startupStats.total) * 100)}% of total`
                      : undefined
                  }
                  icon={<GraduationCap size={16} strokeWidth={2} />}
                />
                <StatCard
                  label="Launched"
                  value={startupStats.launched.toString()}
                  icon={<CheckCircle2 size={16} strokeWidth={2} />}
                />
              </div>

              <div className="bg-surface-white border border-border-subtle rounded-lg p-4 shadow-card flex flex-wrap items-center gap-1.5">
                <div className="relative flex-1 min-w-[100px]">
                  <Search
                    size={16}
                    strokeWidth={2}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
                  />
                  <input
                    type="text"
                    value={startupSearch}
                    onChange={(e) => {
                      setStartupsPage(1);
                      setStartupSearch(e.target.value);
                    }}
                    placeholder="Search Startup"
                    className="w-full pl-9 pr-2 min-h-10 rounded-md border border-border-subtle bg-canvas-bg text-sm text-text-body font-inter focus:outline-none focus:ring-1 focus:ring-brand-black"
                  />
                </div>
                <select
                  value={startupStageFilter}
                  onChange={(e) => {
                    setStartupsPage(1);
                    setStartupStageFilter(e.target.value);
                  }}
                  className="shrink-0 w-20 min-h-10 rounded-md border border-border-subtle bg-canvas-bg text-sm text-text-body font-inter px-1 focus:outline-none focus:ring-1 focus:ring-brand-black"
                >
                  <option value="">Stage</option>
                  {startupStageOptions.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
                <select
                  value={startupIndustryFilter}
                  onChange={(e) => {
                    setStartupsPage(1);
                    setStartupIndustryFilter(e.target.value);
                  }}
                  className="shrink-0 w-20 min-h-10 rounded-md border border-border-subtle bg-canvas-bg text-sm text-text-body font-inter px-1 focus:outline-none focus:ring-1 focus:ring-brand-black"
                >
                  <option value="">Industry</option>
                  {startupIndustryOptions.map((i) => (
                    <option key={i} value={i}>
                      {i}
                    </option>
                  ))}
                </select>
                <select
                  value={startupFounderFilter}
                  onChange={(e) => {
                    setStartupsPage(1);
                    setStartupFounderFilter(e.target.value);
                  }}
                  className="shrink-0 w-20 min-h-10 rounded-md border border-border-subtle bg-canvas-bg text-sm text-text-body font-inter px-1 focus:outline-none focus:ring-1 focus:ring-brand-black"
                >
                  <option value="">Founder</option>
                  {startupFounderOptions.map((f) => (
                    <option key={f} value={f}>
                      {f}
                    </option>
                  ))}
                </select>
                <select
                  value={startupMentorFilter}
                  onChange={(e) => {
                    setStartupsPage(1);
                    setStartupMentorFilter(e.target.value);
                  }}
                  className="shrink-0 w-20 min-h-10 rounded-md border border-border-subtle bg-canvas-bg text-sm text-text-body font-inter px-1 focus:outline-none focus:ring-1 focus:ring-brand-black"
                >
                  <option value="">Mentor</option>
                  {startupMentorOptions.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
                <select
                  value={startupStatusFilter}
                  onChange={(e) => {
                    setStartupsPage(1);
                    setStartupStatusFilter(e.target.value);
                  }}
                  className="shrink-0 w-20 min-h-10 rounded-md border border-border-subtle bg-canvas-bg text-sm text-text-body font-inter px-1 focus:outline-none focus:ring-1 focus:ring-brand-black"
                >
                  <option value="">Status</option>
                  {startupStatusOptions.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
                <ComingSoon label="More Filters" position="top" inline>
                  <span className="flex items-center justify-center p-2 border border-border-subtle rounded-md text-text-muted">
                    <Filter size={16} strokeWidth={2} />
                  </span>
                </ComingSoon>
              </div>

              <DataTable
                columns={startupColumns}
                rows={paginatedStartups}
                emptyMessage="No startups found for this chapter."
              />
              <Pagination
                currentPage={startupsPage}
                totalPages={startupsTotalPages}
                onPageChange={setStartupsPage}
              />
              <p className="font-inter text-small text-text-muted text-center">
                Showing {paginatedStartups.length} of {filteredStartups.length}{" "}
                startups
              </p>
            </>
          )}

          {activeTab === "Events" && (
            <div className="bg-surface-white border border-border-subtle rounded-lg p-12 text-center flex flex-col items-center">
              <CalendarCheck size={32} className="text-text-muted mb-3" />
              <h3 className="font-poppins font-semibold text-card text-text-heading mb-1">
                Chapter Events Opening Soon
              </h3>
              <p className="font-inter text-small text-text-muted max-w-sm mb-4">
                Event scheduling and attendance tracking modules are coming
                soon.
              </p>
            </div>
          )}
        </div>

        {/* Right: tab-specific quick panel */}
        <div className="lg:col-span-2 space-y-6">
          {activeTab === "Startups" ? (
            <>
              <div className="bg-surface-white border border-border-subtle rounded-lg p-6 shadow-card">
                <h3 className="font-inter font-semibold text-caption uppercase tracking-wider text-text-muted mb-4">
                  Quick Actions
                </h3>
                <div className="space-y-3">
                  <ComingSoon label="New Review" position="top">
                    <span className="flex items-center gap-3 w-full p-3 border border-border-subtle rounded-lg font-inter font-medium text-small text-text-heading cursor-pointer">
                      <FileEdit size={18} strokeWidth={2} /> New Review
                    </span>
                  </ComingSoon>
                  <ComingSoon label="Mass Outreach" position="top">
                    <span className="flex items-center gap-3 w-full p-3 border border-border-subtle rounded-lg font-inter font-medium text-small text-text-heading cursor-pointer">
                      <Mail size={18} strokeWidth={2} /> Mass Outreach
                    </span>
                  </ComingSoon>
                  <ComingSoon label="Export CSV" position="top">
                    <span className="flex items-center gap-3 w-full p-3 border border-border-subtle rounded-lg font-inter font-medium text-small text-text-heading cursor-pointer">
                      <Download size={18} strokeWidth={2} /> Export CSV
                    </span>
                  </ComingSoon>
                  <ComingSoon label="Chapter Config" position="top">
                    <span className="flex items-center gap-3 w-full p-3 border border-border-subtle rounded-lg font-inter font-medium text-small text-text-heading cursor-pointer">
                      <Settings size={18} strokeWidth={2} /> Chapter Config
                    </span>
                  </ComingSoon>
                </div>
              </div>

              <div className="bg-surface-white border border-border-subtle rounded-lg p-6 shadow-card">
                <h3 className="font-inter font-semibold text-caption uppercase tracking-wider text-text-muted mb-4">
                  Upcoming Audits
                </h3>
                {/* TODO(backend): no audits/compliance concept exists
                    anywhere in this app yet — real empty state instead of
                    fabricated entries. */}
                <div className="flex items-center gap-2 text-text-muted">
                  <ClipboardCheck size={16} strokeWidth={2} />
                  <p className="font-inter text-small">
                    No upcoming audits scheduled.
                  </p>
                </div>
              </div>
            </>
          ) : (
            <div className="bg-surface-white border border-border-subtle rounded-lg p-6 shadow-card">
              <h3 className="font-poppins font-semibold text-body text-text-heading mb-6">
                Quick Actions
              </h3>
              <div className="space-y-3">
                <ComingSoon label="Edit Chapter" position="top">
                  <span className="flex items-center justify-between w-full p-3 bg-brand-black text-white rounded-lg font-poppins font-semibold text-small cursor-pointer">
                    Edit Chapter <Edit size={18} strokeWidth={2} />
                  </span>
                </ComingSoon>
                <ComingSoon label="Assign Lead" position="top">
                  <span className="flex items-center justify-between w-full p-3 border border-border-subtle rounded-lg font-poppins font-semibold text-small text-text-heading cursor-pointer">
                    Assign Lead <UserPlus size={18} strokeWidth={2} />
                  </span>
                </ComingSoon>
                <button
                  type="button"
                  onClick={() => setActiveTab("Students")}
                  className="flex items-center justify-between w-full p-3 border border-border-subtle rounded-lg font-poppins font-semibold text-small text-text-heading hover:bg-canvas-bg transition-colors"
                >
                  View Students <Users size={18} strokeWidth={2} />
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("Startups")}
                  className="flex items-center justify-between w-full p-3 border border-border-subtle rounded-lg font-poppins font-semibold text-small text-text-heading hover:bg-canvas-bg transition-colors"
                >
                  View Startups <Rocket size={18} strokeWidth={2} />
                </button>
                <ComingSoon label="Export Data" position="top">
                  <span className="flex items-center justify-between w-full p-3 border border-border-subtle rounded-lg font-poppins font-semibold text-small text-text-heading cursor-pointer">
                    Export Data <Download size={18} strokeWidth={2} />
                  </span>
                </ComingSoon>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminShell>
  );
}
