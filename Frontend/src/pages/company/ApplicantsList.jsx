import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Filter, ArrowUpDown, Share2, FileText, CheckCircle2, Circle } from 'lucide-react';
import CompanyShell from '@/components/company/CompanyShell';
import DataTable from '@/components/ui/DataTable';
import Badge from '@/components/ui/Badge';
import ComingSoon from '@/components/ui/ComingSoon';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

const APPLICANTS = [
  { id: 'ap1', name: 'Alex Rivera', email: 'alex.r@example.com', college: 'Stanford University', degree: 'BS CS, 2023', skills: ['React', 'Node.js', '+3'], startupExp: true, applied: 'Oct 12, 2023', status: 'New' },
  { id: 'ap2', name: 'Sarah Chen', email: 's.chen@mit.edu', college: 'MIT', degree: 'MS CS, 2022', skills: ['TypeScript', 'GraphQL'], startupExp: false, applied: 'Oct 10, 2023', status: 'Under Review' },
  { id: 'ap3', name: 'Jordan Smith', email: 'jsmith@berkeley.edu', college: 'UC Berkeley', degree: 'BS EECS, 2023', skills: ['Next.js', 'Tailwind'], startupExp: true, applied: 'Oct 08, 2023', status: 'Shortlisted' },
];

const STATUS_VARIANT = { New: 'neutral', 'Under Review': 'info', Shortlisted: 'brand' };
const FILTER_OPTIONS = {
  status: ['All Statuses', 'New', 'Under Review', 'Shortlisted'],
  college: ['All Colleges', 'Stanford', 'MIT', 'UC Berkeley'],
  skill: ['All Skills', 'React', 'TypeScript', 'Tailwind'],
  gradYear: ['Grad Year', '2024', '2023', '2022'],
};

const COLUMNS = [
  {
    key: 'name',
    label: 'Applicant',
    width: '1.6fr',
    render: (a) => (
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-canvas-bg border border-border-subtle flex items-center justify-center font-poppins font-bold text-small text-text-muted shrink-0">
          {a.name.split(' ').map((n) => n[0]).join('')}
        </div>
        <div>
          <p className="font-inter font-bold text-small text-text-heading">{a.name}</p>
          <p className="font-inter text-caption text-text-muted">{a.email}</p>
        </div>
      </div>
    ),
  },
  { key: 'college', label: 'College', className: 'text-text-body' },
  { key: 'degree', label: 'Degree & Grad', className: 'text-text-body' },
  {
    key: 'skills',
    label: 'Skills',
    render: (a) => (
      <div className="flex flex-wrap gap-1">
        {a.skills.map((s) => <span key={s} className="px-2 py-0.5 bg-canvas-bg rounded font-inter text-[11px] font-bold text-text-heading">{s}</span>)}
      </div>
    ),
  },
  {
    key: 'startupExp',
    label: 'Startup Exp',
    render: (a) => a.startupExp
      ? <CheckCircle2 size={18} strokeWidth={2} className="text-brand-black" />
      : <Circle size={18} strokeWidth={2} className="text-text-muted" />,
  },
  { key: 'applied', label: 'Applied Date', className: 'text-text-body' },
  { key: 'status', label: 'Status', render: (a) => <Badge variant={STATUS_VARIANT[a.status]}>{a.status}</Badge> },
  {
    key: 'actions',
    label: 'Actions',
    mobileLabel: false,
    render: (a) => (
      <div className="flex items-center justify-end gap-3">
        <ComingSoon label={`${a.name}'s resume`} position="left" inline>
          <span className="text-text-muted"><FileText size={16} strokeWidth={2} /></span>
        </ComingSoon>
        <Link to="/company/applicants/detail" className="font-inter font-bold text-small text-text-heading hover:underline">View Profile</Link>
      </div>
    ),
  },
];

export default function ApplicantsListPage() {
  useDocumentTitle('Applicants — BOCC Company Portal');
  const [status, setStatus] = useState(FILTER_OPTIONS.status[0]);
  const [college, setCollege] = useState(FILTER_OPTIONS.college[0]);
  const [skill, setSkill] = useState(FILTER_OPTIONS.skill[0]);
  const [gradYear, setGradYear] = useState(FILTER_OPTIONS.gradYear[0]);

  return (
    <CompanyShell>
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
        <div>
          <h1 className="font-poppins font-semibold text-page text-text-heading">Applicants</h1>
          <p className="font-inter text-body text-text-body mt-1">Review applications, compare candidates, and manage the hiring pipeline.</p>
        </div>
        <div className="flex gap-3">
          <ComingSoon label="Filter" position="top" inline className="flex items-center gap-2 px-4 py-2 border border-border-subtle rounded-lg font-inter font-semibold text-small text-text-heading">
            <Filter size={18} strokeWidth={2} /> Filter
          </ComingSoon>
          <ComingSoon label="Sort" position="top" inline className="flex items-center gap-2 px-4 py-2 border border-border-subtle rounded-lg font-inter font-semibold text-small text-text-heading">
            <ArrowUpDown size={18} strokeWidth={2} /> Sort
          </ComingSoon>
          <ComingSoon label="Export" position="top" inline className="flex items-center gap-2 px-4 py-2 border border-border-subtle rounded-lg font-inter font-semibold text-small text-text-heading">
            <Share2 size={18} strokeWidth={2} /> Export
          </ComingSoon>
        </div>
      </div>

      <div className="bg-surface-white border border-border-subtle rounded-lg p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-6 shadow-card mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-6">
          <div className="sm:border-r sm:border-divider-line sm:pr-6">
            <h3 className="font-poppins font-semibold text-body text-text-heading">Senior Systems Architect</h3>
            <div className="flex flex-wrap gap-3 mt-1 font-inter text-caption text-text-muted">
              <span>Engineering</span> · <span>Full-time</span> · <span>Deadline: Oct 31, 2023</span>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-center"><p className="font-poppins font-bold text-card text-text-heading">48</p><p className="font-inter text-caption text-text-muted">Applicants</p></div>
            <div className="text-center"><p className="font-poppins font-bold text-card text-text-heading">12</p><p className="font-inter text-caption text-text-muted">New</p></div>
            <Badge variant="success">Active</Badge>
          </div>
        </div>
        <div className="flex gap-3 shrink-0">
          <ComingSoon label="Edit Opportunity" position="top" inline className="px-4 py-2 border border-border-subtle rounded-lg font-inter font-bold text-small text-text-heading">
            Edit Opportunity
          </ComingSoon>
          <ComingSoon label="Close Opportunity" position="top" inline className="px-4 py-2 border border-error/40 text-error rounded-lg font-inter font-bold text-small">
            Close Opportunity
          </ComingSoon>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 items-center p-4 bg-canvas-bg border border-border-subtle rounded-lg mb-6">
        <span className="font-inter text-caption font-bold text-text-muted uppercase">Filters:</span>
        {[
          [status, setStatus, FILTER_OPTIONS.status],
          [college, setCollege, FILTER_OPTIONS.college],
          [skill, setSkill, FILTER_OPTIONS.skill],
          [gradYear, setGradYear, FILTER_OPTIONS.gradYear],
        ].map(([value, setValue, options], i) => (
          <select key={i} value={value} onChange={(e) => setValue(e.target.value)} className="min-w-[150px] bg-surface-white border border-border-subtle rounded-lg font-inter text-small py-2 px-3 focus:outline-none focus:ring-1 focus:ring-brand-black">
            {options.map((o) => <option key={o}>{o}</option>)}
          </select>
        ))}
        <button
          type="button"
          onClick={() => { setStatus(FILTER_OPTIONS.status[0]); setCollege(FILTER_OPTIONS.college[0]); setSkill(FILTER_OPTIONS.skill[0]); setGradYear(FILTER_OPTIONS.gradYear[0]); }}
          className="ml-auto font-inter font-bold text-caption text-text-heading hover:underline"
        >
          Clear all filters
        </button>
      </div>

      <DataTable columns={COLUMNS} rows={APPLICANTS} />
    </CompanyShell>
  );
}
