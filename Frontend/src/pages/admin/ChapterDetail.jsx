import { useEffect, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
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
  Loader2,
  Sparkles,
  Inbox,
} from 'lucide-react';
import AdminShell from '@/components/admin/AdminShell';
import DataTable from '@/components/ui/DataTable';
import Badge from '@/components/ui/Badge';
import StatCard from '@/components/ui/StatCard';
import ComingSoon from '@/components/ui/ComingSoon';
import PlaceholderGraphic from '@/components/ui/PlaceholderGraphic';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { getChapterById } from '@/api/admin/chapterApi';

function initialsOf(name = '') {
  return (
    name
      .trim()
      .split(/\s+/)
      .map((p) => p[0])
      .slice(0, 2)
      .join('')
      .toUpperCase() || '?'
  );
}

function locationOf(chapter) {
  return [chapter.city, chapter.state || chapter.country]
    .filter(Boolean)
    .join(', ');
}

const CHAPTER_STATUS_VARIANT = { Active: 'success', Pending: 'warning', Inactive: 'neutral' };

const CHAPTER = {
  name: 'Stanford Alpha',
  initial: 'S',
  institution: 'Stanford University',
  status: 'Active',
  location: 'Palo Alto, USA',
  lead: 'Elena Rodriguez',
  leadInitials: 'ER',
  contact: 'elena.r@stanford.edu',
  founded: 'September 2022',
};

const ACTIVITY = [
  { icon: Verified, text: 'Startup "Eco-Track" was verified.', meta: 'Review completed by Admin Sarah Jenkins.', time: '2h ago' },
  { icon: UserRoundPlus, text: '50 new students joined the chapter.', meta: 'Bulk upload from Registrar office.', time: '5h ago' },
  { icon: CalendarCheck, text: '"Fall Pitch Night" scheduled.', meta: 'Location: Memorial Auditorium. Expected: 200+', time: 'Yesterday' },
];

const STUDENTS = [
  { id: 's1', name: 'Alex Chen', startup: 'Eco-Track', stage: 'Seed', mentor: 'Sarah J.', progress: 75, status: 'Active' },
  { id: 's2', name: 'Jordan Smith', startup: 'FinFlow', stage: 'Pre-Seed', mentor: 'Michael R.', progress: 40, status: 'Reviewing' },
  { id: 's3', name: 'Maria Garcia', startup: 'HealthPulse', stage: 'Growth', mentor: 'Elena R.', progress: 90, status: 'Active' },
  { id: 's4', name: 'Sam Wilson', startup: 'Solaris', stage: 'Idea', mentor: 'David K.', progress: 20, status: 'Pending' },
  { id: 's5', name: 'Li Wei', startup: 'QuantumPay', stage: 'Seed', mentor: 'Sarah J.', progress: 65, status: 'Active' },
];

const STARTUPS = [
  { id: 'st1', name: 'Vortex AI', domain: 'vortex-sys.io', initials: 'VX', founder: 'Alex Rivera', industry: 'SaaS / ML', stage: 'Series A', progress: 75, mentor: 'Sarah Chen', status: 'Active' },
  { id: 'st2', name: 'Lumina Health', domain: 'lumina.health', initials: 'LP', founder: 'David Park', industry: 'Healthtech', stage: 'Seed', progress: 40, mentor: 'Marcus Walberg', status: 'Pending' },
  { id: 'st3', name: 'Swiftly Fin', domain: 'swiftly.app', initials: 'SF', founder: 'Lina G.', industry: 'Fintech', stage: 'MVP', progress: 95, mentor: 'John D.', status: 'Active' },
  { id: 'st4', name: 'EcoGrid', domain: 'ecogrid.io', initials: 'EG', founder: 'Sam Wilson', industry: 'Energy', stage: 'Growth', progress: 20, mentor: 'Elena Ross', status: 'Rejected' },
];

const EVENTS = [
  { id: 'e1', name: 'Annual Tech Summit', venue: 'Grand Hall A', category: 'Networking', date: 'Oct 24, 2023', registrations: 450, capacity: 500, status: 'Active' },
  { id: 'e2', name: "Founder's Workshop", venue: 'Online (Zoom)', category: 'Education', date: 'Nov 12, 2023', registrations: 124, capacity: 200, status: 'Pending' },
  { id: 'e3', name: 'Q3 Startup Mixer', venue: 'The Hub', category: 'Social', date: 'Sep 15, 2023', registrations: 210, capacity: 200, status: 'Completed' },
];

const STUDENT_STATUS_VARIANT = { Active: 'success', Reviewing: 'warning', Pending: 'neutral' };
const STARTUP_STATUS_VARIANT = { Active: 'success', Pending: 'warning', Rejected: 'neutral' };
const EVENT_STATUS_VARIANT = { Active: 'success', Pending: 'neutral', Completed: 'neutral' };

const TABS = ['Overview', 'Students', 'Startups', 'Events'];

export default function ChapterDetailPage() {
  const [activeTab, setActiveTab] = useState('Overview');

  // A :chapterId param means this page was reached via a real chapter
  // (created through /admin/chapters/create) rather than the static
  // /admin/chapters/detail demo route below. Every chapter reachable by
  // id today is, by definition, brand new — there's no populated-by-id
  // example yet — so isNewChapter drives the empty-state Overview
  // rendering further down.
  const { chapterId } = useParams();
  const location = useLocation();
  useDocumentTitle(
    chapterId ? 'New Chapter Overview — BOCC Admin' : 'Chapter Detail — BOCC Admin',
  );
  const [newChapter, setNewChapter] = useState(location.state?.chapter || null);
  const [loadStatus, setLoadStatus] = useState(
    chapterId ? (location.state?.chapter ? 'ready' : 'loading') : 'static',
  );

  useEffect(() => {
    if (!chapterId || location.state?.chapter) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await getChapterById(chapterId);
        const data = res?.data || res;
        if (!cancelled) {
          setNewChapter(data);
          setLoadStatus('ready');
        }
      } catch (err) {
        // Honest failure — no GET /api/admin/chapters/:id exists yet, so
        // this always 404s/network-errors today. Once it's live, a
        // successful response replaces this catch path automatically.
        console.error('Failed to load chapter:', err);
        if (!cancelled) setLoadStatus('error');
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [chapterId, location.state]);

  const isNewChapter = Boolean(chapterId);

  // Unifies the two data sources (hardcoded demo vs. a freshly created
  // chapter) into the one shape the JSX below reads from, so nothing
  // past this point needs its own isNewChapter branch just to read a
  // field name.
  const chapter = isNewChapter
    ? {
        name: newChapter?.name || 'New Chapter',
        initial: initialsOf(newChapter?.name || 'New Chapter'),
        institution: newChapter?.institution || '—',
        status: newChapter?.status || 'Pending',
        location: locationOf(newChapter || {}) || '—',
        lead: newChapter?.lead_name || '—',
        leadInitials: newChapter?.lead_name ? initialsOf(newChapter.lead_name) : '—',
        contact: newChapter?.lead_email || '—',
        founded: new Date().toLocaleDateString('en-US', {
          month: 'long',
          year: 'numeric',
        }),
        description: newChapter?.description,
      }
    : CHAPTER;

  const students = isNewChapter ? [] : STUDENTS;
  const startups = isNewChapter ? [] : STARTUPS;
  const events = isNewChapter ? [] : EVENTS;

  if (loadStatus === 'loading') {
    return (
      <AdminShell>
        <div className="min-h-[50vh] flex items-center justify-center">
          <Loader2 size={28} className="animate-spin text-text-muted" />
        </div>
      </AdminShell>
    );
  }

  if (loadStatus === 'error') {
    return (
      <AdminShell>
        <div className="min-h-[50vh] flex flex-col items-center justify-center text-center gap-3">
          <Inbox size={32} className="text-text-muted" />
          <p className="font-poppins font-semibold text-card text-text-heading">
            Couldn't load this chapter
          </p>
          <p className="font-inter text-small text-text-muted max-w-sm">
            This chapter's details aren't available right now.
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
      key: 'name', label: 'Student', width: '1.4fr', render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-canvas-bg border border-border-subtle" />
          <span className="font-inter font-medium text-small text-text-heading">{row.name}</span>
        </div>
      ),
    },
    { key: 'startup', label: 'Startup', width: '1.1fr' },
    { key: 'stage', label: 'Stage', width: '0.9fr' },
    { key: 'mentor', label: 'Mentor', width: '0.9fr' },
    {
      key: 'progress', label: 'Progress', width: '1fr', render: (row) => (
        <div className="w-24 h-1.5 bg-canvas-bg rounded-full overflow-hidden">
          <div className="bg-brand-black h-full rounded-full" style={{ width: `${row.progress}%` }} />
        </div>
      ),
    },
    { key: 'status', label: 'Status', width: '0.9fr', render: (row) => <Badge variant={STUDENT_STATUS_VARIANT[row.status]}>{row.status}</Badge> },
  ];

  const startupColumns = [
    {
      key: 'name', label: 'Startup Name', width: '1.5fr', render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-md bg-canvas-bg border border-border-subtle flex items-center justify-center font-poppins font-bold text-[10px] text-text-heading shrink-0">{row.initials}</div>
          <div>
            <p className="font-inter font-medium text-small text-text-heading">{row.name}</p>
            <p className="font-inter text-caption text-text-muted">{row.domain}</p>
          </div>
        </div>
      ),
    },
    { key: 'founder', label: 'Founder', width: '1fr' },
    { key: 'industry', label: 'Industry', width: '1fr' },
    { key: 'stage', label: 'Current Stage', width: '0.9fr' },
    {
      key: 'progress', label: 'Progress', width: '1fr', render: (row) => (
        <div className="w-20 h-1.5 bg-canvas-bg rounded-full overflow-hidden">
          <div className="bg-brand-black h-full rounded-full" style={{ width: `${row.progress}%` }} />
        </div>
      ),
    },
    { key: 'mentor', label: 'Mentor', width: '0.9fr' },
    { key: 'status', label: 'Status', width: '0.9fr', render: (row) => <Badge variant={STARTUP_STATUS_VARIANT[row.status]}>{row.status}</Badge> },
  ];

  const eventColumns = [
    {
      key: 'name', label: 'Event Name', width: '1.6fr', render: (row) => (
        <div>
          <p className="font-inter font-medium text-small text-text-heading">{row.name}</p>
          <p className="font-inter text-caption text-text-muted">{row.venue}</p>
        </div>
      ),
    },
    { key: 'category', label: 'Category', width: '1fr' },
    { key: 'date', label: 'Date', width: '1fr' },
    {
      key: 'registrations', label: 'Registrations', width: '1.1fr', render: (row) => (
        <div className="flex flex-col gap-1">
          <span className="font-inter text-small text-text-body">{row.registrations}/{row.capacity}</span>
          <div className="w-full h-1 bg-canvas-bg rounded-full overflow-hidden">
            <div className="bg-brand-black h-full rounded-full" style={{ width: `${Math.min(100, Math.round((row.registrations / row.capacity) * 100))}%` }} />
          </div>
        </div>
      ),
    },
    { key: 'status', label: 'Status', width: '0.9fr', render: (row) => <Badge variant={EVENT_STATUS_VARIANT[row.status]}>{row.status}</Badge> },
  ];

  return (
    <AdminShell>
      <nav className="mb-6 flex items-center gap-2 text-text-muted font-inter font-normal text-small">
        <Link to="/admin/chapters" className="hover:text-text-heading transition-colors">Chapters</Link>
        <ChevronRight size={14} strokeWidth={2} />
        <span className="text-text-heading font-semibold">
          {isNewChapter ? 'New Chapter Overview' : chapter.name}
        </span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: chapter profile */}
        <div className="lg:col-span-3">
          <div className="bg-surface-white border border-border-subtle rounded-lg p-6 shadow-card lg:sticky lg:top-24">
            <div className="flex flex-col items-center text-center pb-6 border-b border-divider-line mb-6">
              <div className="w-20 h-20 rounded-xl bg-canvas-bg border border-border-subtle flex items-center justify-center font-poppins font-bold text-section text-text-heading mb-4">
                {chapter.initial}
              </div>
              <h1 className="font-poppins font-semibold text-card text-text-heading">{chapter.name}</h1>
              <p className="font-inter text-small text-text-muted">{chapter.institution}</p>
              <span className="mt-3">
                <Badge variant={CHAPTER_STATUS_VARIANT[chapter.status] || 'neutral'}>
                  {chapter.status}
                </Badge>
              </span>
            </div>
            <div className="space-y-4">
              <div>
                <p className="font-inter text-caption text-text-muted uppercase tracking-wider mb-1">Location</p>
                <p className="flex items-center gap-1.5 font-inter text-small text-text-heading">
                  <MapPin size={14} strokeWidth={2} className="text-text-muted" /> {chapter.location}
                </p>
              </div>
              <div>
                <p className="font-inter text-caption text-text-muted uppercase tracking-wider mb-1">Chapter Lead</p>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-canvas-bg border border-border-subtle flex items-center justify-center font-poppins font-bold text-[9px] text-text-heading">{chapter.leadInitials}</div>
                  <p className="font-inter text-small text-text-heading">{chapter.lead}</p>
                </div>
              </div>
              <div>
                <p className="font-inter text-caption text-text-muted uppercase tracking-wider mb-1">Contact</p>
                <p className="font-inter text-small text-text-heading">{chapter.contact}</p>
              </div>
              <div>
                <p className="font-inter text-caption text-text-muted uppercase tracking-wider mb-1">Founded</p>
                <p className="font-inter text-small text-text-heading">{chapter.founded}</p>
              </div>
              {chapter.description && (
                <div>
                  <p className="font-inter text-caption text-text-muted uppercase tracking-wider mb-1">Description</p>
                  <p className="font-inter text-small text-text-body leading-relaxed">{chapter.description}</p>
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
                  activeTab === tab ? 'text-text-heading font-semibold border-b-2 border-brand-black' : 'text-text-muted hover:text-text-heading'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {activeTab === 'Overview' && isNewChapter && (
            <>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatCard label="Students" value="0" icon={<Users size={16} strokeWidth={2} />} />
                <StatCard label="Startups" value="0" icon={<Rocket size={16} strokeWidth={2} />} />
                <StatCard label="Events" value="0" icon={<CalendarCheck size={16} strokeWidth={2} />} />
                <StatCard label="Chapter Status" value={chapter.status} icon={<Sparkles size={16} strokeWidth={2} />} />
              </div>
              <div className="bg-surface-white border border-border-subtle rounded-lg p-6 shadow-card flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
                <div className="w-20 h-20 rounded-xl bg-canvas-bg border border-border-subtle flex items-center justify-center shrink-0">
                  <Sparkles size={28} strokeWidth={1.5} className="text-text-muted" />
                </div>
                <div className="flex-1">
                  <h3 className="font-poppins font-semibold text-card text-text-heading mb-1">Welcome to Your Chapter</h3>
                  <p className="font-inter text-small text-text-muted">
                    This chapter has been initialized successfully. Once students begin building startups and hosting events, this dashboard will update automatically.
                  </p>
                </div>
                <ComingSoon label="Edit Chapter" position="top" inline>
                  <span className="px-5 py-2.5 border border-border-subtle rounded-lg font-poppins font-semibold text-small text-text-heading whitespace-nowrap">Edit Chapter</span>
                </ComingSoon>
              </div>
              <div className="bg-surface-white border border-border-subtle rounded-lg overflow-hidden shadow-card">
                <div className="px-6 py-4 border-b border-divider-line bg-canvas-bg/50 flex justify-between items-center">
                  <h3 className="font-poppins font-semibold text-body text-text-heading">Recent Activity</h3>
                </div>
                <div className="py-16 flex flex-col items-center text-center px-6">
                  <div className="w-14 h-14 rounded-full bg-canvas-bg border border-border-subtle flex items-center justify-center mb-4">
                    <Inbox size={22} strokeWidth={1.75} className="text-text-muted" />
                  </div>
                  <p className="font-poppins font-semibold text-small text-text-heading mb-1">No activity yet</p>
                  <p className="font-inter text-caption text-text-muted max-w-xs">
                    Student registrations, startup submissions, approvals, and chapter events will appear here automatically.
                  </p>
                </div>
              </div>
            </>
          )}

          {activeTab === 'Overview' && !isNewChapter && (
            <>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatCard label="Total Students" value="1,248" icon={<Users size={16} strokeWidth={2} />} subtext="+12%" trendDirection="up" className="col-span-2" />
                <StatCard label="Active Startups" value="42" icon={<Rocket size={16} strokeWidth={2} />} />
                <StatCard label="Mentors" value="18" icon={<GraduationCap size={16} strokeWidth={2} />} />
              </div>
              <div className="bg-brand-black text-white rounded-lg p-6 flex items-center justify-between">
                <div>
                  <p className="font-poppins font-semibold text-card">Seed Funding Stage</p>
                  <p className="font-inter text-small opacity-80">Next review cycle starts in 14 days.</p>
                </div>
                <ComingSoon label="View Queue" position="top" inline>
                  <span className="px-4 py-2 bg-white text-brand-black rounded-full font-poppins font-semibold text-small">View Queue</span>
                </ComingSoon>
              </div>
              <div className="bg-surface-white border border-border-subtle rounded-lg overflow-hidden shadow-card">
                <div className="px-6 py-4 border-b border-divider-line bg-canvas-bg/50 flex justify-between items-center">
                  <h3 className="font-poppins font-semibold text-body text-text-heading">Recent Activity</h3>
                  <ComingSoon label="View All" position="bottom" inline>
                    <span className="font-poppins font-semibold text-caption text-text-heading">View All</span>
                  </ComingSoon>
                </div>
                <div className="p-6 space-y-6">
                  {ACTIVITY.map(({ icon: Icon, text, meta, time }) => (
                    <div key={text} className="flex gap-4">
                      <div className="w-8 h-8 rounded-full bg-canvas-bg border border-border-subtle flex items-center justify-center shrink-0">
                        <Icon size={16} strokeWidth={2} className="text-text-muted" />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <p className="font-inter font-semibold text-small text-text-heading">{text}</p>
                          <span className="font-inter text-caption text-text-muted shrink-0 ml-2">{time}</span>
                        </div>
                        <p className="font-inter text-caption text-text-muted mt-0.5">{meta}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {activeTab === 'Students' && (
            <>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatCard label="Total Students" value={isNewChapter ? '0' : '1,248'} />
                <StatCard label="Active Startups" value={isNewChapter ? '0' : '42'} />
                <StatCard label="Completion Rate" value={isNewChapter ? '—' : '86%'} />
                <StatCard label="Pending Reviews" value={isNewChapter ? '0' : '12'} />
              </div>
              <DataTable columns={studentColumns} rows={students} emptyMessage="No students found." />
            </>
          )}

          {activeTab === 'Startups' && (
            <>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatCard label="Total Startups" value={isNewChapter ? '0' : '42'} subtext={isNewChapter ? undefined : '+3 this month'} trendDirection={isNewChapter ? undefined : 'up'} />
                <StatCard label="Active Startups" value={isNewChapter ? '0' : '38'} />
                <StatCard label="Incubated" value={isNewChapter ? '0' : '12'} subtext={isNewChapter ? undefined : '28% of total'} />
                <StatCard label="Launched" value={isNewChapter ? '0' : '5'} />
              </div>
              <DataTable columns={startupColumns} rows={startups} emptyMessage="No startups found." />
            </>
          )}

          {activeTab === 'Events' && (
            <>
              <div className="flex justify-between items-center">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 flex-1">
                  <StatCard label="Upcoming" value={isNewChapter ? '0' : '12'} />
                  <StatCard label="Completed" value={isNewChapter ? '0' : '48'} />
                  <StatCard label="Registrations" value={isNewChapter ? '0' : '2.4k'} />
                  <StatCard label="Attendance" value={isNewChapter ? '—' : '86%'} />
                </div>
              </div>
              <div className="flex justify-end">
                <ComingSoon label="Create Event" position="top" inline>
                  <span className="flex items-center gap-1.5 bg-action-bg text-action-text px-4 py-2 rounded-lg font-poppins font-semibold text-small">
                    <Plus size={14} strokeWidth={2} /> Create Event
                  </span>
                </ComingSoon>
              </div>
              <DataTable columns={eventColumns} rows={events} emptyMessage="No events found." />
            </>
          )}
        </div>

        {/* Right: quick actions + health */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-surface-white border border-border-subtle rounded-lg p-6 shadow-card">
            <h3 className="font-poppins font-semibold text-body text-text-heading mb-6">Quick Actions</h3>
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
                onClick={() => setActiveTab('Students')}
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
              <p className="font-inter font-semibold text-caption text-text-muted uppercase tracking-widest">Chapter Health</p>
            </div>
            <div className="p-6">
              <div className="flex items-end justify-between mb-2">
                <p className="font-poppins font-semibold text-section text-text-heading">
                  {isNewChapter ? '--' : '94%'}
                </p>
                <span className="font-inter font-semibold text-small text-text-muted">
                  {isNewChapter ? 'Initializing' : 'Excellent'}
                </span>
              </div>
              <div className="w-full h-2 bg-canvas-bg rounded-full overflow-hidden">
                <div
                  className="bg-brand-black h-full rounded-full"
                  style={{ width: isNewChapter ? '0%' : '94%' }}
                />
              </div>
              <p className="font-inter text-caption text-text-muted mt-4 leading-relaxed">
                {isNewChapter
                  ? 'This score will become available after students register and chapter activity begins.'
                  : 'Health score is based on member engagement, startup activity, and reporting consistency over the last 30 days.'}
              </p>
            </div>
          </div>

          <PlaceholderGraphic icon={Map} label="Campus View" className="h-40 rounded-lg" />
        </div>
      </div>
    </AdminShell>
  );
}
