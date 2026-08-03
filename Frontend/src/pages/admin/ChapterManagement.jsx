import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Building2, Users, Rocket, CalendarCheck, Edit, Archive, Download } from 'lucide-react';
import AdminShell from '@/components/admin/AdminShell';
import DataTable from '@/components/ui/DataTable';
import Badge from '@/components/ui/Badge';
import StatCard from '@/components/ui/StatCard';
import ComingSoon from '@/components/ui/ComingSoon';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

const CHAPTERS = [
  { id: 'c1', name: 'Stanford Alpha', initial: 'S', institution: 'Stanford University', lead: 'Marcus Chen', students: 1240, startups: 32, status: 'Active' },
  { id: 'c2', name: 'MIT Beta', initial: 'M', institution: 'MIT', lead: 'Elena Rodriguez', students: 980, startups: 28, status: 'Active' },
  { id: 'c3', name: 'Harvard Delta', initial: 'H', institution: 'Harvard University', lead: 'Jameson Blake', students: 754, startups: 14, status: 'Pending' },
  { id: 'c4', name: 'UCB Gamma', initial: 'U', institution: 'UC Berkeley', lead: 'Sarah Jenkins', students: 1102, startups: 41, status: 'Active' },
  { id: 'c5', name: 'CMU Sigma', initial: 'C', institution: 'Carnegie Mellon', lead: 'David Wu', students: 540, startups: 19, status: 'Probation' },
];

const STATUS_VARIANT = { Active: 'success', Pending: 'warning', Probation: 'neutral' };
const STATE_OPTIONS = ['All States', 'California', 'Massachusetts'];
const STATUS_OPTIONS = ['Status: All', 'Active', 'Pending', 'Probation'];

const GROWTH = [24, 38, 52, 68, 44, 21];
const GROWTH_MONTHS = ['Jan', 'Mar', 'May', 'Jul', 'Sep', 'Nov'];

export default function ChapterManagementPage() {
  useDocumentTitle('Chapter Management — BOCC Admin');

  const [stateFilter, setStateFilter] = useState('All States');
  const [statusFilter, setStatusFilter] = useState('Status: All');

  const visible = CHAPTERS.filter((c) => {
    if (statusFilter !== 'Status: All' && c.status !== statusFilter) return false;
    if (stateFilter === 'California' && !['Stanford University', 'UC Berkeley'].includes(c.institution)) return false;
    if (stateFilter === 'Massachusetts' && !['MIT', 'Harvard University'].includes(c.institution)) return false;
    return true;
  });

  const columns = [
    {
      key: 'name',
      label: 'Chapter Name',
      width: '1.6fr',
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-md bg-canvas-bg border border-border-subtle flex items-center justify-center font-poppins font-bold text-text-heading text-small shrink-0 select-none">
            {row.initial}
          </div>
          <span className="font-poppins font-semibold text-small text-text-heading">{row.name}</span>
        </div>
      ),
    },
    { key: 'institution', label: 'Institution', width: '1.4fr', className: 'text-text-body' },
    { key: 'lead', label: 'Chapter Lead', width: '1.2fr', className: 'text-text-body' },
    { key: 'students', label: 'Students', width: '0.8fr', render: (row) => row.students.toLocaleString() },
    { key: 'startups', label: 'Startups', width: '0.7fr' },
    {
      key: 'status',
      label: 'Status',
      width: '0.8fr',
      render: (row) => <Badge variant={STATUS_VARIANT[row.status]}>{row.status}</Badge>,
    },
    {
      key: 'actions',
      label: 'Actions',
      width: '1fr',
      mobileLabel: false,
      render: (row) => (
        <div className="flex items-center gap-1">
          <Link to="/admin/chapters/detail" className="p-1.5 rounded-md text-text-muted hover:text-text-heading hover:bg-canvas-bg transition-colors" title="View">
            <Users size={16} strokeWidth={2} />
          </Link>
          <ComingSoon label="Edit" position="top" inline className="p-1.5 rounded-md text-text-muted hover:text-text-heading hover:bg-canvas-bg transition-colors">
            <Edit size={16} strokeWidth={2} />
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
          <h1 className="font-poppins font-semibold text-page text-text-heading">Chapter Management</h1>
          <p className="font-inter text-body text-text-body mt-1">
            Oversee and regulate centralized BOCC campus operations across all institutions.
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
        <StatCard label="Total Chapters" value="124" icon={<Building2 size={16} strokeWidth={2} />} subtext="+4% YoY" trendDirection="up" />
        <StatCard label="Active Students" value="12,482" icon={<Users size={16} strokeWidth={2} />} subtext="Live data" />
        <StatCard label="Active Startups" value="318" icon={<Rocket size={16} strokeWidth={2} />} subtext="42 pending" />
        <StatCard label="Upcoming Events" value="18" icon={<CalendarCheck size={16} strokeWidth={2} />} subtext="This month" />
      </div>

      <div className="flex flex-wrap items-center gap-4 bg-surface-white border border-border-subtle rounded-lg p-4 mb-6 shadow-card">
        <div className="flex items-center gap-2">
          <label className="font-poppins font-semibold text-caption text-text-muted uppercase tracking-wider">Filter by</label>
          <select
            value={stateFilter}
            onChange={(e) => setStateFilter(e.target.value)}
            className="bg-canvas-bg border border-border-subtle rounded-md text-text-body font-inter text-small py-1.5 px-2 focus:outline-none focus:ring-1 focus:ring-brand-black"
          >
            {STATE_OPTIONS.map((opt) => <option key={opt}>{opt}</option>)}
          </select>
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-canvas-bg border border-border-subtle rounded-md text-text-body font-inter text-small py-1.5 px-2 focus:outline-none focus:ring-1 focus:ring-brand-black"
        >
          {STATUS_OPTIONS.map((opt) => <option key={opt}>{opt}</option>)}
        </select>
        <ComingSoon label="Export" position="bottom" inline className="ml-auto p-2 border border-border-subtle rounded-md text-text-muted hover:bg-canvas-bg transition-colors">
          <Download size={18} strokeWidth={2} />
        </ComingSoon>
      </div>

      <DataTable columns={columns} rows={visible} emptyMessage="No chapters match the current filters." />
      <p className="font-inter text-small text-text-muted mt-4 mb-8">
        Showing {visible.length} of {CHAPTERS.length} entries
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 bg-surface-white border border-border-subtle rounded-lg p-6 shadow-card">
          <h3 className="font-poppins font-semibold text-body text-text-heading mb-6">Chapter Growth Distribution</h3>
          <div className="flex items-end gap-3 h-32">
            {GROWTH.map((value, i) => (
              <div key={i} className="flex-1 bg-canvas-bg rounded-t-sm hover:bg-brand-black transition-colors" style={{ height: `${value}%` }} title={`${value}%`} />
            ))}
          </div>
          <div className="flex justify-between mt-2 pt-2 border-t border-divider-line font-inter text-caption text-text-muted uppercase">
            {GROWTH_MONTHS.map((m) => <span key={m}>{m}</span>)}
          </div>
        </div>
        <div className="lg:col-span-4 bg-surface-white border border-border-subtle rounded-lg p-6 shadow-card flex flex-col justify-between">
          <div>
            <h3 className="font-poppins font-semibold text-body text-text-heading mb-2">Regional Spotlight</h3>
            <p className="font-inter text-small text-text-muted">Pacific Region leads in startup registrations for Q4.</p>
          </div>
          <div className="flex justify-center py-4">
            <div className="w-20 h-20 rounded-full border-4 border-canvas-bg flex items-center justify-center relative">
              <div className="absolute inset-0 rounded-full border-4 border-brand-black" style={{ clipPath: 'inset(0 0 25% 0)' }} />
              <span className="font-poppins font-semibold text-body text-text-heading">75%</span>
            </div>
          </div>
          <ComingSoon label="Generate Report" position="top" inline>
            <span className="block text-center font-poppins font-semibold text-small text-text-heading underline decoration-2 underline-offset-4">
              Generate Report
            </span>
          </ComingSoon>
        </div>
      </div>
    </AdminShell>
  );
}
