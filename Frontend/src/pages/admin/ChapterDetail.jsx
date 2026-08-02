import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
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
import { adminChapterDetailApi } from "@/api/admin/adminApi";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

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


const TABS = ["Overview", "Students", "Startups", "Events"];

export default function ChapterDetailPage() {
  useDocumentTitle("Chapter Detail — BOCC Admin");
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("Overview");
  
  const [chapterData, setChapterData] = useState(null);
  const [studentsData, setStudentsData] = useState([]);
  const [startupsData, setStartupsData] = useState([]);
  const [eventsData, setEventsData] = useState([]);
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [leadUserId, setLeadUserId] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (activeTab === "Overview" && !chapterData) {
          const res = await adminChapterDetailApi.getOverview(id);
          setChapterData(res.data.data);
        } else if (activeTab === "Students" && studentsData.length === 0) {
          const res = await adminChapterDetailApi.getStudents(id);
          setStudentsData(res.data.data || []);
        } else if (activeTab === "Startups" && startupsData.length === 0) {
          const res = await adminChapterDetailApi.getStartups(id);
          setStartupsData(res.data.data || []);
        } else if (activeTab === "Events" && eventsData.length === 0) {
          const res = await adminChapterDetailApi.getEvents(id);
          setEventsData(res.data.data || []);
        }
      } catch (error) {
        console.error("Failed to fetch data", error);
      }
    };
    fetchData();
  }, [activeTab, id, chapterData, studentsData.length, startupsData.length, eventsData.length]);

  const handleAssignLead = async () => {
    try {
      await adminChapterDetailApi.assignLead(id, { chapter_lead_id: leadUserId });
      setAssignModalOpen(false);
      setLeadUserId("");
      const res = await adminChapterDetailApi.getOverview(id);
      setChapterData(res.data.data);
    } catch (error) {
      console.error("Failed to assign lead", error);
    }
  };

  const chapter = chapterData?.chapter || {};
  const metrics = chapterData?.metrics || {};


  const studentColumns = [
    {
      key: "name",
      label: "Student",
      width: "1.4fr",
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-canvas-bg border border-border-subtle" />
          <span className="font-inter font-medium text-small text-text-heading">
            {row.user_id?.full_name || "Unknown"}
          </span>
        </div>
      ),
    },
    { key: "college", label: "College", width: "1.1fr", render: (row) => row.college },
    { key: "degree", label: "Degree", width: "0.9fr", render: (row) => row.degree },
    { key: "graduation_year", label: "Grad. Year", width: "0.9fr", render: (row) => row.graduation_year },
    {
      key: "profile_status",
      label: "Profile Status",
      width: "1fr",
      render: (row) => (
        <Badge variant={row.profile_status === "completed" ? "success" : "warning"}>{row.profile_status}</Badge>
      ),
    },
    {
      key: "status",
      label: "Status",
      width: "0.9fr",
      render: (row) => (
        <Badge variant={row.status === "active" ? "success" : "neutral"}>{row.status || "Active"}</Badge>
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
            {(row.startup_name || "S").charAt(0)}
          </div>
          <div>
            <p className="font-inter font-medium text-small text-text-heading">
              {row.startup_name}
            </p>
            <p className="font-inter text-caption text-text-muted">
              {row.industry}
            </p>
          </div>
        </div>
      ),
    },
    { key: "founder", label: "Student ID", width: "1fr", render: (row) => row.student_id },
    { key: "category", label: "Category", width: "1fr", render: (row) => row.category },
    { key: "stage", label: "Current Stage", width: "0.9fr", render: (row) => row.current_stage },
    {
      key: "progress",
      label: "Progress",
      width: "1fr",
      render: (row) => (
        <div className="w-20 h-1.5 bg-canvas-bg rounded-full overflow-hidden">
          <div
            className="bg-brand-black h-full rounded-full"
            style={{ width: `${row.progress_percentage || 0}%` }}
          />
        </div>
      ),
    },
    { key: "visibility", label: "Visibility", width: "0.9fr", render: (row) => row.visibility ? "Public" : "Private" },
    {
      key: "status",
      label: "Status",
      width: "0.9fr",
      render: (row) => (
        <Badge variant={row.funding_status ? "success" : "neutral"}>{row.funding_status || "Unknown"}</Badge>
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
            {row.startup_name}
          </p>
          <p className="font-inter text-caption text-text-muted">{row.location_venue || row.venue}</p>
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
            {row.total_registrations}/{row.max_capacity}
          </span>
          <div className="w-full h-1 bg-canvas-bg rounded-full overflow-hidden">
            <div
              className="bg-brand-black h-full rounded-full"
              style={{
                width: `${Math.min(100, Math.round((row.total_registrations / row.max_capacity) * 100))}%`,
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
        <Badge variant={row.status === "ACTIVE" ? "success" : row.status === "PENDING" ? "neutral" : "warning"}>{row.status}</Badge>
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
        <span className="text-text-heading font-semibold">{chapter.chapter_name || "Unknown Chapter"}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: chapter profile */}
        <div className="lg:col-span-3">
          <div className="bg-surface-white border border-border-subtle rounded-lg p-6 shadow-card lg:sticky lg:top-24">
            <div className="flex flex-col items-center text-center pb-6 border-b border-divider-line mb-6">
              <div className="w-20 h-20 rounded-xl bg-canvas-bg border border-border-subtle flex items-center justify-center font-poppins font-bold text-section text-text-heading mb-4">
                {(chapter.chapter_name || "C").charAt(0)}
              </div>
              <h1 className="font-poppins font-semibold text-card text-text-heading">
                {chapter.chapter_name || "Unknown Chapter"}
              </h1>
              <p className="font-inter text-small text-text-muted">
                {chapter.college_name || "Unknown Institution"}
              </p>
              <span className="mt-3">
                <Badge variant="success">{chapter.status || "Active"}</Badge>
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
                  {chapter.location || "Location not set"}
                </p>
              </div>
              <div>
                <p className="font-inter text-caption text-text-muted uppercase tracking-wider mb-1">
                  Chapter Lead
                </p>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-canvas-bg border border-border-subtle flex items-center justify-center font-poppins font-bold text-[9px] text-text-heading">
                    {((typeof chapter.chapter_lead_id === "object" ? chapter.chapter_lead_id?.full_name : chapter.chapter_lead_id) || "U").charAt(0)}
                  </div>
                  <p className="font-inter text-small text-text-heading">
                    {typeof chapter.chapter_lead_id === "object" ? chapter.chapter_lead_id?.full_name : (chapter.chapter_lead_id || "Unassigned")}
                  </p>
                </div>
              </div>
              <div>
                <p className="font-inter text-caption text-text-muted uppercase tracking-wider mb-1">
                  Contact
                </p>
                <p className="font-inter text-small text-text-heading">
                  {typeof chapter.chapter_lead_id === "object" ? chapter.chapter_lead_id?.email : "No contact info"}
                </p>
              </div>
              <div>
                <p className="font-inter text-caption text-text-muted uppercase tracking-wider mb-1">
                  Founded
                </p>
                <p className="font-inter text-small text-text-heading">
                  {chapter.created_at ? new Date(chapter.created_at).toLocaleDateString() : "-"}
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
                  value={metrics.total_students || 0}
                  icon={<Users size={16} strokeWidth={2} />}
                  className="col-span-2"
                />
                <StatCard
                  label="Active Startups"
                  value={metrics.active_startups || 0}
                  icon={<Rocket size={16} strokeWidth={2} />}
                />
                <StatCard
                  label="Mentors"
                  value={metrics.mentors_count || 0}
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
                rows={studentsData}
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
                rows={startupsData}
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
                rows={eventsData}
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
              <button onClick={() => setAssignModalOpen(true)} className="flex items-center justify-between w-full p-3 border border-border-subtle rounded-lg font-poppins font-semibold text-small text-text-heading hover:bg-canvas-bg transition-colors">
  Assign Lead <UserPlus size={18} strokeWidth={2} />
</button>
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
      <Modal isOpen={assignModalOpen} onClose={() => setAssignModalOpen(false)} title="Assign Chapter Lead">
        <div className="space-y-4">
          <Input 
            label="Lead User ID" 
            placeholder="Enter User ObjectId" 
            value={leadUserId} 
            onChange={(e) => setLeadUserId(e.target.value)} 
          />
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setAssignModalOpen(false)}>Cancel</Button>
            <Button onClick={handleAssignLead}>Assign Lead</Button>
          </div>
        </div>
      </Modal>
    </AdminShell>
  );
}
