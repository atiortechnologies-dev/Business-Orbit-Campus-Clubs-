import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ChevronRight,
  MapPin,
  Edit,
  UserPlus,
  Download,
  Users,
  Rocket,
  GraduationCap,
  CalendarCheck,
  Verified,
  UserRoundPlus,
  Wallet,
  Map,
  Plus,
} from "lucide-react";
import AdminShell from "@/components/admin/AdminShell";
import DataTable from "@/components/ui/DataTable";
import Badge from "@/components/ui/Badge";
import StatCard from "@/components/ui/StatCard";
import ComingSoon from "@/components/ui/ComingSoon";
import PlaceholderGraphic from "@/components/ui/PlaceholderGraphic";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

const CHAPTER = {
  name: "Stanford Alpha",
  initial: "S",
  institution: "Stanford University",
  status: "Active",
  location: "Palo Alto, USA",
  lead: "Elena Rodriguez",
  leadInitials: "ER",
  contact: "elena.r@stanford.edu",
  founded: "September 2022",
};

const ACTIVITY = [
  {
    icon: Verified,
    text: 'Startup "Eco-Track" was verified.',
    meta: "Review completed by Admin Sarah Jenkins.",
    time: "2h ago",
  },
  {
    icon: UserRoundPlus,
    text: "50 new students joined the chapter.",
    meta: "Bulk upload from Registrar office.",
    time: "5h ago",
  },
  {
    icon: CalendarCheck,
    text: '"Fall Pitch Night" scheduled.',
    meta: "Location: Memorial Auditorium. Expected: 200+",
    time: "Yesterday",
  },
];

const STUDENTS = [
  {
    id: "s1",
    name: "Alex Chen",
    startup: "Eco-Track",
    stage: "Seed",
    mentor: "Sarah J.",
    progress: 75,
    status: "Active",
  },
  {
    id: "s2",
    name: "Jordan Smith",
    startup: "FinFlow",
    stage: "Pre-Seed",
    mentor: "Michael R.",
    progress: 40,
    status: "Reviewing",
  },
  {
    id: "s3",
    name: "Maria Garcia",
    startup: "HealthPulse",
    stage: "Growth",
    mentor: "Elena R.",
    progress: 90,
    status: "Active",
  },
  {
    id: "s4",
    name: "Sam Wilson",
    startup: "Solaris",
    stage: "Idea",
    mentor: "David K.",
    progress: 20,
    status: "Pending",
  },
  {
    id: "s5",
    name: "Li Wei",
    startup: "QuantumPay",
    stage: "Seed",
    mentor: "Sarah J.",
    progress: 65,
    status: "Active",
  },
];

const STARTUPS = [
  {
    id: "st1",
    name: "Vortex AI",
    domain: "vortex-sys.io",
    initials: "VX",
    founder: "Alex Rivera",
    industry: "SaaS / ML",
    stage: "Series A",
    progress: 75,
    mentor: "Sarah Chen",
    status: "Active",
  },
  {
    id: "st2",
    name: "Lumina Health",
    domain: "lumina.health",
    initials: "LP",
    founder: "David Park",
    industry: "Healthtech",
    stage: "Seed",
    progress: 40,
    mentor: "Marcus Walberg",
    status: "Pending",
  },
  {
    id: "st3",
    name: "Swiftly Fin",
    domain: "swiftly.app",
    initials: "SF",
    founder: "Lina G.",
    industry: "Fintech",
    stage: "MVP",
    progress: 95,
    mentor: "John D.",
    status: "Active",
  },
  {
    id: "st4",
    name: "EcoGrid",
    domain: "ecogrid.io",
    initials: "EG",
    founder: "Sam Wilson",
    industry: "Energy",
    stage: "Growth",
    progress: 20,
    mentor: "Elena Ross",
    status: "Rejected",
  },
];

const EVENTS = [
  {
    id: "e1",
    name: "Annual Tech Summit",
    venue: "Grand Hall A",
    category: "Networking",
    date: "Oct 24, 2023",
    registrations: 450,
    capacity: 500,
    status: "Active",
  },
  {
    id: "e2",
    name: "Founder's Workshop",
    venue: "Online (Zoom)",
    category: "Education",
    date: "Nov 12, 2023",
    registrations: 124,
    capacity: 200,
    status: "Pending",
  },
  {
    id: "e3",
    name: "Q3 Startup Mixer",
    venue: "The Hub",
    category: "Social",
    date: "Sep 15, 2023",
    registrations: 210,
    capacity: 200,
    status: "Completed",
  },
];

const STUDENT_STATUS_VARIANT = {
  Active: "success",
  Reviewing: "warning",
  Pending: "neutral",
};
const STARTUP_STATUS_VARIANT = {
  Active: "success",
  Pending: "warning",
  Rejected: "neutral",
};
const EVENT_STATUS_VARIANT = {
  Active: "success",
  Pending: "neutral",
  Completed: "neutral",
};

const TABS = ["Overview", "Students", "Startups", "Events"];

export default function ChapterDetailPage() {
  useDocumentTitle("Chapter Detail — BOCC Admin");
  const [activeTab, setActiveTab] = useState("Overview");

  const studentColumns = [
    {
      key: "name",
      label: "Student",
      width: "1.4fr",
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-canvas-bg border border-border-subtle" />
          <span className="font-inter font-medium text-small text-text-heading">
            {row.name}
          </span>
        </div>
      ),
    },
    { key: "startup", label: "Startup", width: "1.1fr" },
    { key: "stage", label: "Stage", width: "0.9fr" },
    { key: "mentor", label: "Mentor", width: "0.9fr" },
    {
      key: "progress",
      label: "Progress",
      width: "1fr",
      render: (row) => (
        <div className="w-24 h-1.5 bg-canvas-bg rounded-full overflow-hidden">
          <div
            className="bg-brand-black h-full rounded-full"
            style={{ width: `${row.progress}%` }}
          />
        </div>
      ),
    },
    {
      key: "status",
      label: "Status",
      width: "0.9fr",
      render: (row) => (
        <Badge variant={STUDENT_STATUS_VARIANT[row.status]}>{row.status}</Badge>
      ),
    },
  ];

  const startupColumns = [
    {
      key: "name",
      label: "Startup Name",
      width: "1.5fr",
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-md bg-canvas-bg border border-border-subtle flex items-center justify-center font-poppins font-bold text-[10px] text-text-heading shrink-0">
            {row.initials}
          </div>
          <div>
            <p className="font-inter font-medium text-small text-text-heading">
              {row.name}
            </p>
            <p className="font-inter text-caption text-text-muted">
              {row.domain}
            </p>
          </div>
        </div>
      ),
    },
    { key: "founder", label: "Founder", width: "1fr" },
    { key: "industry", label: "Industry", width: "1fr" },
    { key: "stage", label: "Current Stage", width: "0.9fr" },
    {
      key: "progress",
      label: "Progress",
      width: "1fr",
      render: (row) => (
        <div className="w-20 h-1.5 bg-canvas-bg rounded-full overflow-hidden">
          <div
            className="bg-brand-black h-full rounded-full"
            style={{ width: `${row.progress}%` }}
          />
        </div>
      ),
    },
    { key: "mentor", label: "Mentor", width: "0.9fr" },
    {
      key: "status",
      label: "Status",
      width: "0.9fr",
      render: (row) => (
        <Badge variant={STARTUP_STATUS_VARIANT[row.status]}>{row.status}</Badge>
      ),
    },
  ];

  const eventColumns = [
    {
      key: "name",
      label: "Event Name",
      width: "1.6fr",
      render: (row) => (
        <div>
          <p className="font-inter font-medium text-small text-text-heading">
            {row.name}
          </p>
          <p className="font-inter text-caption text-text-muted">{row.venue}</p>
        </div>
      ),
    },
    { key: "category", label: "Category", width: "1fr" },
    { key: "date", label: "Date", width: "1fr" },
    {
      key: "registrations",
      label: "Registrations",
      width: "1.1fr",
      render: (row) => (
        <div className="flex flex-col gap-1">
          <span className="font-inter text-small text-text-body">
            {row.registrations}/{row.capacity}
          </span>
          <div className="w-full h-1 bg-canvas-bg rounded-full overflow-hidden">
            <div
              className="bg-brand-black h-full rounded-full"
              style={{
                width: `${Math.min(100, Math.round((row.registrations / row.capacity) * 100))}%`,
              }}
            />
          </div>
        </div>
      ),
    },
    {
      key: "status",
      label: "Status",
      width: "0.9fr",
      render: (row) => (
        <Badge variant={EVENT_STATUS_VARIANT[row.status]}>{row.status}</Badge>
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
        <span className="text-text-heading font-semibold">{CHAPTER.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: chapter profile */}
        <div className="lg:col-span-3">
          <div className="bg-surface-white border border-border-subtle rounded-lg p-6 shadow-card lg:sticky lg:top-24">
            <div className="flex flex-col items-center text-center pb-6 border-b border-divider-line mb-6">
              <div className="w-20 h-20 rounded-xl bg-canvas-bg border border-border-subtle flex items-center justify-center font-poppins font-bold text-section text-text-heading mb-4">
                {CHAPTER.initial}
              </div>
              <h1 className="font-poppins font-semibold text-card text-text-heading">
                {CHAPTER.name}
              </h1>
              <p className="font-inter text-small text-text-muted">
                {CHAPTER.institution}
              </p>
              <span className="mt-3">
                <Badge variant="success">{CHAPTER.status}</Badge>
              </span>
            </div>
            <div className="space-y-4">
              <div>
                <p className="font-inter text-caption text-text-muted uppercase tracking-wider mb-1">
                  Location
                </p>
                <p className="flex items-center gap-1.5 font-inter text-small text-text-heading">
                  <MapPin
                    size={14}
                    strokeWidth={2}
                    className="text-text-muted"
                  />{" "}
                  {CHAPTER.location}
                </p>
              </div>
              <div>
                <p className="font-inter text-caption text-text-muted uppercase tracking-wider mb-1">
                  Chapter Lead
                </p>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-canvas-bg border border-border-subtle flex items-center justify-center font-poppins font-bold text-[9px] text-text-heading">
                    {CHAPTER.leadInitials}
                  </div>
                  <p className="font-inter text-small text-text-heading">
                    {CHAPTER.lead}
                  </p>
                </div>
              </div>
              <div>
                <p className="font-inter text-caption text-text-muted uppercase tracking-wider mb-1">
                  Contact
                </p>
                <p className="font-inter text-small text-text-heading">
                  {CHAPTER.contact}
                </p>
              </div>
              <div>
                <p className="font-inter text-caption text-text-muted uppercase tracking-wider mb-1">
                  Founded
                </p>
                <p className="font-inter text-small text-text-heading">
                  {CHAPTER.founded}
                </p>
              </div>
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
                  value="1,248"
                  icon={<Users size={16} strokeWidth={2} />}
                  subtext="+12%"
                  trendDirection="up"
                  className="col-span-2"
                />
                <StatCard
                  label="Active Startups"
                  value="42"
                  icon={<Rocket size={16} strokeWidth={2} />}
                />
                <StatCard
                  label="Mentors"
                  value="18"
                  icon={<GraduationCap size={16} strokeWidth={2} />}
                />
              </div>
              <div className="bg-brand-black text-white rounded-lg p-6 flex items-center justify-between">
                <div>
                  <p className="font-poppins font-semibold text-card">
                    Seed Funding Stage
                  </p>
                  <p className="font-inter text-small opacity-80">
                    Next review cycle starts in 14 days.
                  </p>
                </div>
                <ComingSoon label="View Queue" position="top" inline>
                  <span className="px-4 py-2 bg-white text-brand-black rounded-full font-poppins font-semibold text-small">
                    View Queue
                  </span>
                </ComingSoon>
              </div>
              <div className="bg-surface-white border border-border-subtle rounded-lg overflow-hidden shadow-card">
                <div className="px-6 py-4 border-b border-divider-line bg-canvas-bg/50 flex justify-between items-center">
                  <h3 className="font-poppins font-semibold text-body text-text-heading">
                    Recent Activity
                  </h3>
                  <ComingSoon label="View All" position="bottom" inline>
                    <span className="font-poppins font-semibold text-caption text-text-heading">
                      View All
                    </span>
                  </ComingSoon>
                </div>
                <div className="p-6 space-y-6">
                  {ACTIVITY.map(({ icon: Icon, text, meta, time }) => (
                    <div key={text} className="flex gap-4">
                      <div className="w-8 h-8 rounded-full bg-canvas-bg border border-border-subtle flex items-center justify-center shrink-0">
                        <Icon
                          size={16}
                          strokeWidth={2}
                          className="text-text-muted"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <p className="font-inter font-semibold text-small text-text-heading">
                            {text}
                          </p>
                          <span className="font-inter text-caption text-text-muted shrink-0 ml-2">
                            {time}
                          </span>
                        </div>
                        <p className="font-inter text-caption text-text-muted mt-0.5">
                          {meta}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {activeTab === "Students" && (
            <>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatCard label="Total Students" value="1,248" />
                <StatCard label="Active Startups" value="42" />
                <StatCard label="Completion Rate" value="86%" />
                <StatCard label="Pending Reviews" value="12" />
              </div>
              <DataTable
                columns={studentColumns}
                rows={STUDENTS}
                emptyMessage="No students found."
              />
            </>
          )}

          {activeTab === "Startups" && (
            <>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatCard
                  label="Total Startups"
                  value="42"
                  subtext="+3 this month"
                  trendDirection="up"
                />
                <StatCard label="Active Startups" value="38" />
                <StatCard label="Incubated" value="12" subtext="28% of total" />
                <StatCard label="Launched" value="5" />
              </div>
              <DataTable
                columns={startupColumns}
                rows={STARTUPS}
                emptyMessage="No startups found."
              />
            </>
          )}

          {activeTab === "Events" && (
            <>
              <div className="flex justify-between items-center">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 flex-1">
                  <StatCard label="Upcoming" value="12" />
                  <StatCard label="Completed" value="48" />
                  <StatCard label="Registrations" value="2.4k" />
                  <StatCard label="Attendance" value="86%" />
                </div>
              </div>
              <div className="flex justify-end">
                <ComingSoon label="Create Event" position="top" inline>
                  <span className="flex items-center gap-1.5 bg-action-bg text-action-text px-4 py-2 rounded-lg font-poppins font-semibold text-small">
                    <Plus size={14} strokeWidth={2} /> Create Event
                  </span>
                </ComingSoon>
              </div>
              <DataTable
                columns={eventColumns}
                rows={EVENTS}
                emptyMessage="No events found."
              />
            </>
          )}
        </div>

        {/* Right: quick actions + health */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-surface-white border border-border-subtle rounded-lg p-6 shadow-card">
            <h3 className="font-poppins font-semibold text-body text-text-heading mb-6">
              Quick Actions
            </h3>
            <div className="space-y-3">
              <ComingSoon label="Edit Chapter" position="top">
                <span className="flex items-center justify-between w-full p-3 bg-brand-black text-white rounded-lg font-poppins font-semibold text-small">
                  Edit Chapter <Edit size={18} strokeWidth={2} />
                </span>
              </ComingSoon>
              <ComingSoon label="Assign Lead" position="top">
                <span className="flex items-center justify-between w-full p-3 border border-border-subtle rounded-lg font-poppins font-semibold text-small text-text-heading">
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
              <ComingSoon label="Export Data" position="top">
                <span className="flex items-center justify-between w-full p-3 border border-border-subtle rounded-lg font-poppins font-semibold text-small text-text-heading">
                  Export Data <Download size={18} strokeWidth={2} />
                </span>
              </ComingSoon>
              <ComingSoon label="Verify Chapter" position="top">
                <span className="flex items-center justify-between w-full p-3 border border-border-subtle rounded-lg font-poppins font-semibold text-small text-text-heading">
                  Verify Chapter <Verified size={18} strokeWidth={2} />
                </span>
              </ComingSoon>
              <ComingSoon label="Approve Funding" position="top">
                <span className="flex items-center justify-between w-full p-3 border border-border-subtle rounded-lg font-poppins font-semibold text-small text-text-heading">
                  Approve Funding <Wallet size={18} strokeWidth={2} />
                </span>
              </ComingSoon>
            </div>
          </div>

          <div className="bg-surface-white border border-border-subtle rounded-lg overflow-hidden shadow-card">
            <div className="p-4 bg-canvas-bg/50 border-b border-divider-line">
              <p className="font-inter font-semibold text-caption text-text-muted uppercase tracking-widest">
                Chapter Health
              </p>
            </div>
            <div className="p-6">
              <div className="flex items-end justify-between mb-2">
                <p className="font-poppins font-semibold text-section text-text-heading">
                  94%
                </p>
                <span className="font-inter font-semibold text-small text-success">
                  Excellent
                </span>
              </div>
              <div className="w-full h-2 bg-canvas-bg rounded-full overflow-hidden">
                <div
                  className="bg-brand-black h-full rounded-full"
                  style={{ width: "94%" }}
                />
              </div>
              <p className="font-inter text-caption text-text-muted mt-4 leading-relaxed">
                Health score is based on member engagement, startup activity,
                and reporting consistency over the last 30 days.
              </p>
            </div>
          </div>

          <PlaceholderGraphic
            icon={Map}
            label="Campus View"
            className="h-40 rounded-lg"
          />
        </div>
      </div>
    </AdminShell>
  );
}
