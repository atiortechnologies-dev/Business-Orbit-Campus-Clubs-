import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Download, Zap, Clock, CheckCircle, XCircle, Calendar, ArrowRight, Filter, RotateCcw } from 'lucide-react';
import AdminShell from '@/components/admin/AdminShell';
import DataTable from '@/components/ui/DataTable';
import Badge from '@/components/ui/Badge';
import StatCard from '@/components/ui/StatCard';
import ComingSoon from '@/components/ui/ComingSoon';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { downloadCsv } from '@/utils/csv';

const SUBMISSIONS = [
  { id: 's1', name: 'Lumina AI', founder: 'Sarah Jenkins', chapter: 'Stanford Chapter', stage: 'MVP', date: '2024-10-24', reviewer: 'Alex Rivera', priority: 'High', status: 'Pending' },
  { id: 's2', name: 'EcoFlow', founder: 'Mark Zuberi', chapter: 'MIT Tech Hub', stage: 'Traction', date: '2024-10-23', reviewer: 'Priya Sharma', priority: 'Medium', status: 'Under Review' },
  { id: 's3', name: 'BlockDocs', founder: 'Elena Rodriguez', chapter: 'UC Berkeley', stage: 'Idea', date: '2024-10-23', reviewer: 'Alex Rivera', priority: 'Low', status: 'Pending' },
  { id: 's4', name: 'StitchPoint', founder: 'James Chen', chapter: 'UT Austin', stage: 'Validation', date: '2024-10-22', reviewer: 'Jessica Wu', priority: 'High', status: 'Under Review' },
];

const PRIORITY_VARIANT = { High: 'error', Medium: 'warning', Low: 'neutral' };
const STATUS_VARIANT = { Pending: 'info', 'Under Review': 'warning' };

const STAGE_OPTIONS = ['All Stages', 'Idea', 'Validation', 'MVP', 'Traction'];
const STATUS_OPTIONS = ['All Statuses', 'Pending', 'Under Review'];
const CHAPTER_OPTIONS = ['All Chapters', ...new Set(SUBMISSIONS.map((s) => s.chapter))];

export default function ReviewQueuePage() {
  useDocumentTitle('Stage Approval Queue — BOCC Admin');
  const navigate = useNavigate();

  const [stageFilter, setStageFilter] = useState('All Stages');
  const [statusFilter, setStatusFilter] = useState('All Statuses');
  const [chapterFilter, setChapterFilter] = useState('All Chapters');
  const [dateFilter, setDateFilter] = useState('');

  const visibleSubmissions = SUBMISSIONS.filter((s) => {
    if (stageFilter !== 'All Stages' && s.stage !== stageFilter) return false;
    if (statusFilter !== 'All Statuses' && s.status !== statusFilter) return false;
    if (chapterFilter !== 'All Chapters' && s.chapter !== chapterFilter) return false;
    if (dateFilter && s.date !== dateFilter) return false;
    return true;
  });

  function handleResetFilters() {
    setStageFilter('All Stages');
    setStatusFilter('All Statuses');
    setChapterFilter('All Chapters');
    setDateFilter('');
  }

  const columns = [
    {
      key: 'name',
      label: 'Startup',
      width: '1.6fr',
      mobileLabel: false,
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-md bg-canvas-bg border border-border-subtle flex items-center justify-center font-bold text-text-heading text-xs select-none shrink-0">
            {row.name.charAt(0)}
          </div>
          <div className="min-w-0">
            <p className="font-poppins font-semibold text-small text-text-heading truncate">{row.name}</p>
            <p className="font-inter text-caption text-text-muted truncate">{row.founder}</p>
          </div>
        </div>
      ),
    },
    { key: 'chapter', label: 'Chapter', width: '1.2fr' },
    {
      key: 'stage',
      label: 'Stage',
      width: '1fr',
      render: (row) => <Badge variant="brand">{row.stage}</Badge>,
    },
    { key: 'date', label: 'Submitted', width: '1fr' },
    { key: 'reviewer', label: 'Reviewer', width: '1.1fr' },
    {
      key: 'priority',
      label: 'Priority',
      width: '0.8fr',
      render: (row) => <Badge variant={PRIORITY_VARIANT[row.priority]}>{row.priority}</Badge>,
    },
    {
      key: 'status',
      label: 'Status',
      width: '1fr',
      render: (row) => <Badge variant={STATUS_VARIANT[row.status]}>{row.status}</Badge>,
    },
    {
      key: 'actions',
      label: '',
      width: '0.8fr',
      mobileLabel: false,
      render: () => (
        <span className="flex items-center gap-1 font-inter font-semibold text-small text-text-heading">
          View <ArrowRight size={14} strokeWidth={2} />
        </span>
      ),
    },
  ];

  return (
    <AdminShell>
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="font-poppins font-semibold text-page text-text-heading">Stage Approval Queue</h1>
          <p className="font-inter text-body text-text-body mt-1">
            Review startup submissions across all stages of the BOCC Startup Journey.
          </p>
        </div>
        <div className="flex gap-2">
          <ComingSoon label="Bulk Actions" position="bottom" inline>
            <span className="flex items-center gap-1.5 bg-surface-white border border-border-subtle px-4 py-2 rounded-lg text-text-heading font-poppins font-semibold text-small">
              <Zap size={14} strokeWidth={2} /> Bulk Actions
            </span>
          </ComingSoon>
          <button
            type="button"
            onClick={() => downloadCsv('review-queue', [
              { key: 'name', label: 'Startup' },
              { key: 'founder', label: 'Founder' },
              { key: 'chapter', label: 'Chapter' },
              { key: 'stage', label: 'Stage' },
              { key: 'date', label: 'Submitted' },
              { key: 'reviewer', label: 'Reviewer' },
              { key: 'priority', label: 'Priority' },
              { key: 'status', label: 'Status' },
            ], visibleSubmissions)}
            className="flex items-center gap-1.5 bg-surface-white border border-border-subtle px-4 py-2 rounded-lg text-text-heading font-poppins font-semibold text-small hover:bg-canvas-bg transition-colors"
          >
            <Download size={14} strokeWidth={2} /> Export CSV
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard label="Pending Reviews" value="42" icon={<Clock size={18} strokeWidth={2} />} subtext="+12% from last week" trendDirection="up" />
        <StatCard label="Approved Today" value="18" icon={<CheckCircle size={18} strokeWidth={2} />} subtext="Daily target: 25" />
        <StatCard label="Rejected Today" value="04" icon={<XCircle size={18} strokeWidth={2} />} subtext="Within threshold" />
        <StatCard label="Meetings Pending" value="09" icon={<Calendar size={18} strokeWidth={2} />} subtext="Next: 14:00 PM" />
      </div>

      <div className="bg-canvas-bg border border-border-subtle rounded-lg p-4 mb-6 flex flex-wrap items-center gap-3">
        <span className="flex items-center gap-1.5 font-poppins font-semibold text-caption uppercase tracking-wider text-text-muted shrink-0">
          <Filter size={14} strokeWidth={2} /> Filters
        </span>
        <select
          value={stageFilter}
          onChange={(e) => setStageFilter(e.target.value)}
          className="bg-surface-white border border-border-subtle rounded-md text-text-body font-inter text-small py-2 px-2 focus:outline-none focus:ring-1 focus:ring-brand-black"
        >
          {STAGE_OPTIONS.map((opt) => <option key={opt}>{opt}</option>)}
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-surface-white border border-border-subtle rounded-md text-text-body font-inter text-small py-2 px-2 focus:outline-none focus:ring-1 focus:ring-brand-black"
        >
          {STATUS_OPTIONS.map((opt) => <option key={opt}>{opt}</option>)}
        </select>
        <select
          value={chapterFilter}
          onChange={(e) => setChapterFilter(e.target.value)}
          className="bg-surface-white border border-border-subtle rounded-md text-text-body font-inter text-small py-2 px-2 focus:outline-none focus:ring-1 focus:ring-brand-black"
        >
          {CHAPTER_OPTIONS.map((opt) => <option key={opt}>{opt}</option>)}
        </select>
        <input
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="bg-surface-white border border-border-subtle rounded-md text-text-body font-inter text-small py-2 px-2 focus:outline-none focus:ring-1 focus:ring-brand-black"
        />
        <button
          type="button"
          onClick={handleResetFilters}
          className="ml-auto flex items-center gap-1.5 font-inter font-medium text-small text-text-muted hover:text-text-heading transition-colors"
        >
          <RotateCcw size={14} strokeWidth={2} /> Reset
        </button>
      </div>

      <DataTable
        columns={columns}
        rows={visibleSubmissions}
        onRowClick={(row) => navigate(row.stage === 'Idea' ? '/admin/reviews/ideation' : '/admin/reviews/detail')}
        emptyMessage="No submissions match the current filters."
      />
      <div className="flex justify-between items-center mt-4">
        <span className="font-inter text-small text-text-muted">
          Showing {visibleSubmissions.length} of {SUBMISSIONS.length} submissions
        </span>
      </div>
    </AdminShell>
  );
}
