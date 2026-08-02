const fs = require('fs');
const file = '/home/jimfleax/Business-Orbit-Campus-Clubs-/Frontend/src/pages/admin/ChapterDetail.jsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Update Imports
content = content.replace('import { useState } from "react";', 'import { useState, useEffect } from "react";');
content = content.replace('import { Link } from "react-router-dom";', 'import { Link, useParams } from "react-router-dom";');
content = content.replace(
  'import { useDocumentTitle } from "@/hooks/useDocumentTitle";',
  'import { useDocumentTitle } from "@/hooks/useDocumentTitle";\nimport { adminChapterDetailApi } from "@/api/admin/adminApi";\nimport Modal from "@/components/ui/Modal";\nimport Input from "@/components/ui/Input";\nimport Button from "@/components/ui/Button";'
);

// 2. Remove Mocks but keep ACTIVITY and STATUS_VARIANTS
// Regex to remove const CHAPTER, STUDENTS, STARTUPS, EVENTS
content = content.replace(/const CHAPTER = \{[\s\S]*?\n\};\n\n/, '');
content = content.replace(/const STUDENTS = \[[\s\S]*?\n\];\n\n/, '');
content = content.replace(/const STARTUPS = \[[\s\S]*?\n\];\n\n/, '');
content = content.replace(/const EVENTS = \[[\s\S]*?\n\];\n\n/, '');

// 3. Add States and useEffect
const statesAndEffect = `  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("Overview");
  
  const [chapterData, setChapterData] = useState(null);
  const [studentsData, setStudentsData] = useState([]);
  const [startupsData, setStartupsData] = useState([]);
  const [eventsData, setEventsData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [leadUserId, setLeadUserId] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
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
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [activeTab, id]);

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
`;

content = content.replace(
  '  const [activeTab, setActiveTab] = useState("Overview");',
  statesAndEffect
);

// 4. Update UI variables in Overview
content = content.replace(/\{CHAPTER\.name\}/g, '{chapter.chapter_name || "Unknown Chapter"}');
content = content.replace(/\{CHAPTER\.initial\}/g, '{(chapter.chapter_name || "C").charAt(0)}');
content = content.replace(/\{CHAPTER\.institution\}/g, '{chapter.college_name || "Unknown Institution"}');
content = content.replace(/\{CHAPTER\.status\}/g, '{chapter.status || "Active"}');
content = content.replace(/\{CHAPTER\.location\}/g, '{chapter.location || "Location not set"}');
content = content.replace(/\{CHAPTER\.lead\}/g, '{typeof chapter.chapter_lead_id === "object" ? chapter.chapter_lead_id?.full_name : (chapter.chapter_lead_id || "Unassigned")}');
content = content.replace(/\{CHAPTER\.leadInitials\}/g, '{(typeof chapter.chapter_lead_id === "object" ? chapter.chapter_lead_id?.full_name : chapter.chapter_lead_id || "U").charAt(0)}');
content = content.replace(/\{CHAPTER\.contact\}/g, '{typeof chapter.chapter_lead_id === "object" ? chapter.chapter_lead_id?.email : "No contact info"}');
content = content.replace(/\{CHAPTER\.founded\}/g, '{chapter.created_at ? new Date(chapter.created_at).toLocaleDateString() : "-"}');

// 5. Update Column mapping for backend response
// Students mapping
content = content.replace(
  '            {row.name}',
  '            {row.user_id?.full_name || "Unknown"}'
);
content = content.replace(
  '    { key: "startup", label: "Startup", width: "1.1fr" },',
  '    { key: "college", label: "College", width: "1.1fr", render: (row) => row.college },'
);
content = content.replace(
  '    { key: "stage", label: "Stage", width: "0.9fr" },',
  '    { key: "degree", label: "Degree", width: "0.9fr", render: (row) => row.degree },'
);
content = content.replace(
  '    { key: "mentor", label: "Mentor", width: "0.9fr" },',
  '    { key: "graduation_year", label: "Grad. Year", width: "0.9fr", render: (row) => row.graduation_year },'
);
content = content.replace(
  '      key: "progress",',
  '      key: "profile_status",'
);
content = content.replace(
  '      label: "Progress",',
  '      label: "Profile Status",'
);
content = content.replace(
  /      render: \(row\) => \(\s*<div className="w-24 h-1\.5 bg-canvas-bg rounded-full overflow-hidden">\s*<div\s*className="bg-brand-black h-full rounded-full"\s*style=\{\{ width: `\$\{row\.progress\}%` \}\}\s*\/>\s*<\/div>\s*\),/g,
  '      render: (row) => (\n        <Badge variant={row.profile_status === "completed" ? "success" : "warning"}>{row.profile_status}</Badge>\n      ),'
);
content = content.replace(
  /      render: \(row\) => \(\s*<Badge variant=\{STUDENT_STATUS_VARIANT\[row\.status\]\}>\{row\.status\}<\/Badge>\s*\),/g,
  '      render: (row) => (\n        <Badge variant={row.status === "active" ? "success" : "neutral"}>{row.status || "Active"}</Badge>\n      ),'
);

// Startups mapping
content = content.replace(
  /\{row\.initials\}/g,
  '{(row.startup_name || "S").charAt(0)}'
);
content = content.replace(
  /\{row\.name\}/g,
  '{row.startup_name}'
);
content = content.replace(
  /\{row\.domain\}/g,
  '{row.industry}'
);
content = content.replace(
  '    { key: "founder", label: "Founder", width: "1fr" },',
  '    { key: "founder", label: "Student ID", width: "1fr", render: (row) => row.student_id },'
);
content = content.replace(
  '    { key: "stage", label: "Current Stage", width: "0.9fr" },',
  '    { key: "stage", label: "Current Stage", width: "0.9fr", render: (row) => row.current_stage },'
);
content = content.replace(
  '    { key: "industry", label: "Industry", width: "1fr" },',
  '    { key: "category", label: "Category", width: "1fr", render: (row) => row.category },'
);
content = content.replace(
  /      render: \(row\) => \(\s*<div className="w-20 h-1\.5 bg-canvas-bg rounded-full overflow-hidden">\s*<div\s*className="bg-brand-black h-full rounded-full"\s*style=\{\{ width: `\$\{row\.progress\}%` \}\}\s*\/>\s*<\/div>\s*\),/g,
  '      render: (row) => (\n        <div className="w-20 h-1.5 bg-canvas-bg rounded-full overflow-hidden">\n          <div\n            className="bg-brand-black h-full rounded-full"\n            style={{ width: `${row.progress_percentage || 0}%` }}\n          />\n        </div>\n      ),'
);
content = content.replace(
  '    { key: "mentor", label: "Mentor", width: "0.9fr" },',
  '    { key: "visibility", label: "Visibility", width: "0.9fr", render: (row) => row.visibility ? "Public" : "Private" },'
);
content = content.replace(
  /<Badge variant=\{STARTUP_STATUS_VARIANT\[row\.status\]\}>\{row\.status\}<\/Badge>/g,
  '<Badge variant={row.funding_status ? "success" : "neutral"}>{row.funding_status || "Unknown"}</Badge>'
);

// Events mapping
content = content.replace(
  /\{row\.name\}/g,
  '{row.title || row.name}'
);
content = content.replace(
  /\{row\.venue\}/g,
  '{row.location_venue || row.venue}'
);
content = content.replace(
  /\{row\.date\}/g,
  '{row.event_date ? new Date(row.event_date).toLocaleDateString() : row.date}'
);
content = content.replace(
  /\{row\.registrations\}\/\{row\.capacity\}/g,
  '{row.total_registrations}/{row.max_capacity}'
);
content = content.replace(
  /row\.registrations \/ row\.capacity/g,
  'row.total_registrations / row.max_capacity'
);
content = content.replace(
  /<Badge variant=\{EVENT_STATUS_VARIANT\[row\.status\]\}>\{row\.status\}<\/Badge>/g,
  '<Badge variant={row.status === "ACTIVE" ? "success" : row.status === "PENDING" ? "neutral" : "warning"}>{row.status}</Badge>'
);

// Assign Lead Quick Action
content = content.replace(
  /<ComingSoon label="Assign Lead" position="top">\s*<span className="flex items-center justify-between w-full p-3 border border-border-subtle rounded-lg font-poppins font-semibold text-small text-text-heading">\s*Assign Lead <UserPlus size=\{18\} strokeWidth=\{2\} \/>\s*<\/span>\s*<\/ComingSoon>/g,
  '<button onClick={() => setAssignModalOpen(true)} className="flex items-center justify-between w-full p-3 border border-border-subtle rounded-lg font-poppins font-semibold text-small text-text-heading hover:bg-canvas-bg transition-colors">\n  Assign Lead <UserPlus size={18} strokeWidth={2} />\n</button>'
);

// Add Modal to the bottom
content = content.replace(
  '    </AdminShell>',
  `      <Modal isOpen={assignModalOpen} onClose={() => setAssignModalOpen(false)} title="Assign Chapter Lead">
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
    </AdminShell>`
);

// Table Rows mapping
content = content.replace(/rows=\{STUDENTS\}/g, 'rows={studentsData}');
content = content.replace(/rows=\{STARTUPS\}/g, 'rows={startupsData}');
content = content.replace(/rows=\{EVENTS\}/g, 'rows={eventsData}');

// Overview Stats
content = content.replace(
  /<StatCard\s*label="Total Students"\s*value="1,248"\s*icon=\{\<Users size=\{16\} strokeWidth=\{2\} \/\>\}\s*subtext="\+12%"\s*trendDirection="up"\s*className="col-span-2"\s*\/>/,
  '<StatCard\n                  label="Total Students"\n                  value={metrics.total_students || 0}\n                  icon={<Users size={16} strokeWidth={2} />}\n                  className="col-span-2"\n                />'
);
content = content.replace(
  /<StatCard\s*label="Active Startups"\s*value="42"\s*icon=\{\<Rocket size=\{16\} strokeWidth=\{2\} \/\>\}\s*\/>/,
  '<StatCard\n                  label="Active Startups"\n                  value={metrics.active_startups || 0}\n                  icon={<Rocket size={16} strokeWidth={2} />}\n                />'
);
content = content.replace(
  /<StatCard\s*label="Mentors"\s*value="18"\s*icon=\{\<GraduationCap size=\{16\} strokeWidth=\{2\} \/\>\}\s*\/>/,
  '<StatCard\n                  label="Mentors"\n                  value={metrics.mentors_count || 0}\n                  icon={<GraduationCap size={16} strokeWidth={2} />}\n                />'
);

fs.writeFileSync(file, content);
