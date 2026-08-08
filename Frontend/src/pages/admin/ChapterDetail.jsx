import { useEffect, useState } from "react";
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
} from "lucide-react";
import AdminShell from "@/components/admin/AdminShell";
import DataTable from "@/components/ui/DataTable";
import Badge from "@/components/ui/Badge";
import StatCard from "@/components/ui/StatCard";
import ComingSoon from "@/components/ui/ComingSoon";
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

export default function ChapterDetailPage() {
  const [activeTab, setActiveTab] = useState("Overview");
  const { chapterId } = useParams();

  useDocumentTitle("Chapter Details — BOCC Admin");

  const [chapterData, setChapterData] = useState(null);
  const [students, setStudents] = useState([]);
  const [startups, setStartups] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

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
      label: "Startup",
      width: "1.3fr",
      render: (row) => (
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-md bg-brand-black text-white flex items-center justify-center font-poppins font-bold text-caption shrink-0">
            <Rocket size={14} />
          </div>
          <span className="font-inter font-medium text-small text-text-heading truncate">
            {row.startup_name}
          </span>
        </div>
      ),
    },
    {
      key: "founder_name",
      label: "Founder",
      width: "1.2fr",
      render: (row) => (
        <div>
          <span className="font-inter font-medium text-small text-text-heading block truncate">
            {row.founder_name}
          </span>
          <span className="font-inter text-caption text-text-muted block truncate">
            {row.founder_email}
          </span>
        </div>
      ),
    },
    {
      key: "stage",
      label: "Stage",
      width: "0.9fr",
      render: (row) => <Badge variant="brand">{row.stage}</Badge>,
    },
    {
      key: "progress_percentage",
      label: "Progress",
      width: "1fr",
      render: (row) => (
        <div className="flex items-center gap-2">
          <div className="flex-1 h-2 rounded-full bg-canvas-bg border border-border-subtle overflow-hidden">
            <div
              className="h-full bg-brand-black transition-all"
              style={{ width: `${row.progress_percentage}%` }}
            />
          </div>
          <span className="font-inter text-caption text-text-muted">
            {row.progress_percentage}%
          </span>
        </div>
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
        <div className="lg:col-span-3">
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
        <div className="lg:col-span-6 space-y-6">
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
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <StatCard
                  label="Total Startups"
                  value={startups.length.toString()}
                />
                <StatCard
                  label="Active Startups"
                  value={startups.length.toString()}
                />
                <StatCard label="Pending Approval" value="0" />
              </div>
              <DataTable
                columns={startupColumns}
                rows={startups}
                emptyMessage="No startups found for this chapter."
              />
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

        {/* Right: quick actions */}
        <div className="lg:col-span-3 space-y-6">
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
        </div>
      </div>
    </AdminShell>
  );
}
