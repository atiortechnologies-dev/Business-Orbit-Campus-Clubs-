import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Archive, FileEdit, Eye, Edit, Zap, Info } from 'lucide-react';
import AdminShell from '@/components/admin/AdminShell';
import DataTable from '@/components/ui/DataTable';
import Badge from '@/components/ui/Badge';
import StatCard from '@/components/ui/StatCard';
import ComingSoon from '@/components/ui/ComingSoon';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

const ANNOUNCEMENTS = [
  {
    id: 'a1',
    title: 'System Maintenance Window',
    summary: 'Expect intermittent outages on the core dashboard during the scheduled update...',
    author: 'Alex Rivett',
    date: 'Oct 24, 2023',
    audience: ['Students', 'Mentors'],
    priority: 'Critical',
    status: 'Published',
    views: '1.2k',
  },
  {
    id: 'a2',
    title: 'New Mentor Registration Open',
    summary: 'Applications for the Spring 2024 cohort are now officially open for review...',
    author: 'Sarah Chen',
    date: 'Oct 25, 2023',
    audience: ['Mentors'],
    priority: 'Normal',
    status: 'Scheduled',
    views: null,
  },
  {
    id: 'a3',
    title: 'Revised Privacy Policy 2024',
    summary: 'Initial draft for the updated data handling policies following the new regional compliance...',
    author: 'Legal Team',
    date: 'Oct 26, 2023',
    audience: ['All Users'],
    priority: 'High',
    status: 'Draft',
    views: null,
  },
];

const STATUS_VARIANT = { Published: 'success', Scheduled: 'info', Draft: 'neutral' };
const PRIORITY_VARIANT = { Critical: 'error', High: 'warning', Normal: 'neutral' };

const STATUS_OPTIONS = ['All Status', 'Published', 'Scheduled', 'Draft'];
const AUDIENCE_OPTIONS = ['All Audience', 'Students', 'Mentors', 'All Users'];
const PRIORITY_OPTIONS = ['All Priority', 'Critical', 'High', 'Normal'];

export default function AnnouncementsDashboardPage() {
  useDocumentTitle('Announcements — BOCC Admin');

  const [statusFilter, setStatusFilter] = useState('All Status');
  const [audienceFilter, setAudienceFilter] = useState('All Audience');
  const [priorityFilter, setPriorityFilter] = useState('All Priority');

  const visible = ANNOUNCEMENTS.filter((a) => {
    if (statusFilter !== 'All Status' && a.status !== statusFilter) return false;
    if (audienceFilter !== 'All Audience' && !a.audience.includes(audienceFilter)) return false;
    if (priorityFilter !== 'All Priority' && a.priority !== priorityFilter) return false;
    return true;
  });

  const publishedCount = ANNOUNCEMENTS.filter((a) => a.status === 'Published').length;
  const scheduledCount = ANNOUNCEMENTS.filter((a) => a.status === 'Scheduled').length;
  const draftCount = ANNOUNCEMENTS.filter((a) => a.status === 'Draft').length;

  const columns = [
    {
      key: 'title',
      label: 'Title & Meta',
      width: '2.2fr',
      render: (row) => (
        <div>
          <p className="font-poppins font-semibold text-small text-text-heading">{row.title}</p>
          <p className="font-inter text-caption text-text-muted mt-0.5 line-clamp-1">{row.summary}</p>
          <p className="font-inter text-caption text-text-muted mt-1">{row.author} · {row.date}</p>
        </div>
      ),
    },
    {
      key: 'audience',
      label: 'Audience',
      width: '1.3fr',
      render: (row) => (
        <div className="flex flex-wrap gap-1">
          {row.audience.map((a) => (
            <span key={a} className="px-2 py-0.5 rounded bg-canvas-bg text-text-muted font-inter text-[10px] font-semibold uppercase">{a}</span>
          ))}
        </div>
      ),
    },
    {
      key: 'priority',
      label: 'Priority',
      width: '0.9fr',
      render: (row) => <Badge variant={PRIORITY_VARIANT[row.priority]}>{row.priority}</Badge>,
    },
    {
      key: 'status',
      label: 'Status',
      width: '0.9fr',
      render: (row) => <Badge variant={STATUS_VARIANT[row.status]}>{row.status}</Badge>,
    },
    {
      key: 'views',
      label: 'Engagement',
      width: '0.9fr',
      render: (row) => (
        <span className="flex items-center gap-1.5 font-inter text-small text-text-heading">
          <Eye size={14} strokeWidth={2} className="text-text-muted" />
          {row.views ?? <span className="text-text-muted italic">Pending</span>}
        </span>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      width: '1fr',
      mobileLabel: false,
      render: () => (
        <div className="flex items-center gap-1">
          <ComingSoon label="Edit" position="top" inline className="p-1.5 rounded-md text-text-muted hover:text-text-heading hover:bg-canvas-bg transition-colors">
            <Edit size={16} strokeWidth={2} />
          </ComingSoon>
          <ComingSoon label="Preview" position="top" inline className="p-1.5 rounded-md text-text-muted hover:text-text-heading hover:bg-canvas-bg transition-colors">
            <Eye size={16} strokeWidth={2} />
          </ComingSoon>
          <ComingSoon label="Archive" position="top" inline className="p-1.5 rounded-md text-text-muted hover:text-text-heading hover:bg-canvas-bg transition-colors">
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
          <h1 className="font-poppins font-semibold text-page text-text-heading">Announcements</h1>
          <p className="font-inter text-body text-text-body mt-1">
            Manage announcements visible across the BOCC platform.
          </p>
        </div>
        <div className="flex gap-2">
          <ComingSoon label="Archived" position="bottom" inline>
            <span className="flex items-center gap-1.5 bg-surface-white border border-border-subtle px-4 py-2 rounded-lg text-text-heading font-poppins font-semibold text-small">
              <Archive size={14} strokeWidth={2} /> Archived
            </span>
          </ComingSoon>
          <ComingSoon label="Drafts" position="bottom" inline>
            <span className="flex items-center gap-1.5 bg-surface-white border border-border-subtle px-4 py-2 rounded-lg text-text-heading font-poppins font-semibold text-small">
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

      {/* Filters — real, client-side, same pattern as VerificationQueue.jsx */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-surface-white border border-border-subtle rounded-lg p-4 shadow-card space-y-1">
          <label className="font-poppins font-semibold text-caption text-text-muted uppercase tracking-wider">Status</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full bg-canvas-bg border border-border-subtle rounded-md text-text-body font-inter text-small py-2 px-2 focus:outline-none focus:ring-1 focus:ring-brand-black"
          >
            {STATUS_OPTIONS.map((opt) => <option key={opt}>{opt}</option>)}
          </select>
        </div>
        <div className="bg-surface-white border border-border-subtle rounded-lg p-4 shadow-card space-y-1">
          <label className="font-poppins font-semibold text-caption text-text-muted uppercase tracking-wider">Audience</label>
          <select
            value={audienceFilter}
            onChange={(e) => setAudienceFilter(e.target.value)}
            className="w-full bg-canvas-bg border border-border-subtle rounded-md text-text-body font-inter text-small py-2 px-2 focus:outline-none focus:ring-1 focus:ring-brand-black"
          >
            {AUDIENCE_OPTIONS.map((opt) => <option key={opt}>{opt}</option>)}
          </select>
        </div>
        <div className="bg-surface-white border border-border-subtle rounded-lg p-4 shadow-card space-y-1">
          <label className="font-poppins font-semibold text-caption text-text-muted uppercase tracking-wider">Priority</label>
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="w-full bg-canvas-bg border border-border-subtle rounded-md text-text-body font-inter text-small py-2 px-2 focus:outline-none focus:ring-1 focus:ring-brand-black"
          >
            {PRIORITY_OPTIONS.map((opt) => <option key={opt}>{opt}</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-9">
          <DataTable columns={columns} rows={visible} emptyMessage="No announcements match the current filters." />
          <p className="font-inter text-small text-text-muted mt-4">
            Showing {visible.length} of {ANNOUNCEMENTS.length} announcements
          </p>
        </div>

        <div className="lg:col-span-3 space-y-6">
          <StatCard label="Total Views Today" value="12.4k" icon={<Eye size={16} strokeWidth={2} />} />
          <div className="bg-surface-white border border-border-subtle rounded-lg p-6 shadow-card space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-inter text-small text-text-body">Published Today</span>
              <span className="font-poppins font-semibold text-body text-text-heading">{publishedCount}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-inter text-small text-text-body">Scheduled</span>
              <span className="font-poppins font-semibold text-body text-text-heading">{scheduledCount}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-inter text-small text-text-body">Drafts</span>
              <span className="font-poppins font-semibold text-body text-text-heading">{draftCount}</span>
            </div>
          </div>
          <div className="bg-surface-white border border-border-subtle rounded-lg p-6 shadow-card">
            <div className="flex items-center gap-2 text-text-muted mb-3">
              <Zap size={16} strokeWidth={2} />
              <p className="font-inter font-medium text-caption uppercase tracking-wider">System Logs</p>
            </div>
            <ul className="space-y-3">
              <li>
                <p className="font-inter text-small text-text-heading">Announcement #492 published by Alex R.</p>
                <p className="font-inter text-caption text-text-muted">2 mins ago</p>
              </li>
              <li>
                <p className="font-inter text-small text-text-heading">User Sarah C. archived "Spring Welcome".</p>
                <p className="font-inter text-caption text-text-muted">1 hour ago</p>
              </li>
              <li>
                <p className="font-inter text-small text-text-heading">Draft "New UI Update" created.</p>
                <p className="font-inter text-caption text-text-muted">4 hours ago</p>
              </li>
            </ul>
            <Link to="/admin/audit-log" className="block text-center mt-4 pt-3 border-t border-border-subtle font-inter font-semibold text-caption text-text-heading hover:text-brand-black transition-colors">
              View Full Audit Log
            </Link>
          </div>
          <div className="bg-surface-white border border-dashed border-border-subtle rounded-lg p-6 flex flex-col items-center text-center gap-2">
            <Info size={24} strokeWidth={2} className="text-text-muted" />
            <p className="font-inter text-caption text-text-muted">
              Need help with targeted audiences? Read the Guide.
            </p>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
