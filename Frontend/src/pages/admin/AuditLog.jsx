import { useState, useMemo } from 'react';
import { Calendar, ChevronLeft, ChevronRight, Zap, User as UserIcon, AlertTriangle, FileText, Cloud, Download } from 'lucide-react';
import AdminShell from '@/components/admin/AdminShell';
import DataTable from '@/components/ui/DataTable';
import Badge from '@/components/ui/Badge';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { downloadCsv } from '@/utils/csv';

const LOGS = [
  { id: 'l1', timestamp: '2024-10-24 14:22:01', date: '2024-10-24', initials: 'JD', user: 'j_doe_admin', module: 'Security', action: 'Updated User Permissions', target: 'ID: 8829-X-22', status: 'Success', ip: '192.168.1.104' },
  { id: 'l2', timestamp: '2024-10-24 14:18:55', date: '2024-10-24', initials: 'SM', user: 's_miller_op', module: 'Clubs', action: 'Modified Club Metadata', target: 'Central Tennis Hub', status: 'Success', ip: '216.58.214.14' },
  { id: 'l3', timestamp: '2024-10-24 13:55:12', date: '2024-10-24', initials: '??', user: 'Unknown', module: 'Auth', action: 'Failed Login Attempt', target: 'Admin Portal Login', status: 'Rejected', ip: '45.12.8.212', flagged: true },
  { id: 'l4', timestamp: '2024-10-23 13:40:02', date: '2024-10-23', initials: 'AK', user: 'a_kapoor_sys', module: 'System', action: 'Backup Execution Initiated', target: 'Global Storage Cluster', status: 'Pending', ip: '10.0.0.42' },
  { id: 'l5', timestamp: '2024-10-22 13:22:11', date: '2024-10-22', initials: 'JD', user: 'j_doe_admin', module: 'Content', action: 'Archived Report Cycle', target: 'FY23_Q3_Final', status: 'Success', ip: '192.168.1.104' },
];

const MODULES = ['All', 'Security', 'Clubs', 'Auth', 'System', 'Content'];
const USERS = ['All', 'j_doe_admin', 's_miller_op', 'a_kapoor_sys', 'Unknown'];
const STATUS_VARIANT = { Success: 'success', Rejected: 'error', Pending: 'warning' };

const TIMELINE = [
  { icon: Zap, time: 'Just now', text: <><span className="font-semibold">System</span> triggered an automated database optimization.</> },
  { icon: UserIcon, time: '12 min ago', text: <><span className="font-semibold">j_doe_admin</span> edited access levels for 12 accounts.</> },
  { icon: AlertTriangle, time: '28 min ago', flagged: true, text: <>Failed authentication attempt detected from <span className="font-medium">45.12.8.212</span>.</> },
  { icon: FileText, time: '1 hour ago', text: <><span className="font-semibold">s_miller_op</span> exported monthly club membership report.</> },
  { icon: Cloud, time: '2 hours ago', text: 'Cloud synchronization completed for all regional nodes.' },
];

const VOLUME_TREND = [40, 60, 35, 90, 55, 70, 45];

export default function AuditLogPage() {
  useDocumentTitle('Audit Log — BOCC Admin');
  const [moduleFilter, setModuleFilter] = useState('All');
  const [userFilter, setUserFilter] = useState('All');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [dateFilterOpen, setDateFilterOpen] = useState(false);

  const filteredLogs = useMemo(
    () => LOGS.filter((l) =>
      (moduleFilter === 'All' || l.module === moduleFilter) &&
      (userFilter === 'All' || l.user === userFilter) &&
      (!dateFrom || l.date >= dateFrom) &&
      (!dateTo || l.date <= dateTo)
    ),
    [moduleFilter, userFilter, dateFrom, dateTo]
  );

  const dateRangeLabel = dateFrom || dateTo ? `${dateFrom || '…'} → ${dateTo || '…'}` : 'Last 24 Hours';

  const columns = [
    { key: 'timestamp', label: 'Timestamp', width: '1.3fr' },
    {
      key: 'user',
      label: 'Admin / User',
      width: '1.3fr',
      render: (row) => (
        <div className="flex items-center gap-2">
          <div className={`w-5 h-5 rounded flex items-center justify-center text-[10px] font-bold shrink-0 ${
            row.initials === '??' ? 'border border-border-subtle text-text-muted' : 'bg-brand-black text-white'
          }`}>
            {row.initials}
          </div>
          <span className="truncate" title={row.user}>{row.user}</span>
        </div>
      ),
    },
    { key: 'module', label: 'Module', width: '0.9fr', render: (row) => <Badge variant="neutral">{row.module}</Badge> },
    {
      key: 'action',
      label: 'Action',
      width: '1.5fr',
      render: (row) => <span className={row.flagged ? 'text-error font-semibold' : ''}>{row.action}</span>,
    },
    { key: 'target', label: 'Target Entity', width: '1.4fr' },
    { key: 'status', label: 'Status', width: '0.8fr', render: (row) => <Badge variant={STATUS_VARIANT[row.status]}>{row.status}</Badge> },
    {
      key: 'ip',
      label: 'IP Address',
      width: '1fr',
      render: (row) => <span className={row.flagged ? 'text-error' : 'text-text-muted'}>{row.ip}</span>,
    },
  ];

  return (
    <AdminShell>
      <h1 className="font-poppins font-semibold text-page text-text-heading mb-6">Audit Log</h1>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <div className="xl:col-span-9 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2 relative">
              <button
                type="button"
                onClick={() => setDateFilterOpen((v) => !v)}
                className="flex items-center gap-2 px-3 py-1.5 bg-surface-white border border-border-subtle rounded-md font-inter text-small text-text-heading hover:bg-canvas-bg transition-colors"
              >
                <Calendar size={14} strokeWidth={2} /> {dateRangeLabel}
              </button>
              {dateFilterOpen && (
                <div className="absolute top-full left-0 mt-1 z-20 bg-surface-white border border-border-subtle rounded-md shadow-overlay p-4 flex flex-col gap-3 w-64">
                  <label className="flex flex-col gap-1">
                    <span className="font-inter text-caption text-text-muted">From</span>
                    <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className="px-2 py-1.5 bg-canvas-bg border border-border-subtle rounded-md font-inter text-small text-text-heading focus:outline-none focus:ring-1 focus:ring-brand-black" />
                  </label>
                  <label className="flex flex-col gap-1">
                    <span className="font-inter text-caption text-text-muted">To</span>
                    <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className="px-2 py-1.5 bg-canvas-bg border border-border-subtle rounded-md font-inter text-small text-text-heading focus:outline-none focus:ring-1 focus:ring-brand-black" />
                  </label>
                  <div className="flex justify-between">
                    <button type="button" onClick={() => { setDateFrom(''); setDateTo(''); }} className="font-inter text-caption text-text-muted hover:text-text-heading transition-colors">Clear</button>
                    <button type="button" onClick={() => setDateFilterOpen(false)} className="font-inter font-semibold text-caption text-text-heading">Apply</button>
                  </div>
                </div>
              )}
              <select
                value={moduleFilter}
                onChange={(e) => setModuleFilter(e.target.value)}
                className="px-3 py-1.5 bg-surface-white border border-border-subtle rounded-md font-inter text-small text-text-heading focus:outline-none focus:ring-1 focus:ring-brand-black"
              >
                {MODULES.map((m) => <option key={m} value={m}>{m === 'All' ? 'Module: All' : m}</option>)}
              </select>
              <select
                value={userFilter}
                onChange={(e) => setUserFilter(e.target.value)}
                className="px-3 py-1.5 bg-surface-white border border-border-subtle rounded-md font-inter text-small text-text-heading focus:outline-none focus:ring-1 focus:ring-brand-black"
              >
                {USERS.map((u) => <option key={u} value={u}>{u === 'All' ? 'User: All' : u}</option>)}
              </select>
            </div>
            <button
              type="button"
              onClick={() => downloadCsv('audit-log', [
                { key: 'timestamp', label: 'Timestamp' },
                { key: 'user', label: 'Admin / User' },
                { key: 'module', label: 'Module' },
                { key: 'action', label: 'Action' },
                { key: 'target', label: 'Target Entity' },
                { key: 'status', label: 'Status' },
                { key: 'ip', label: 'IP Address' },
              ], filteredLogs)}
              className="flex items-center gap-1.5 px-4 py-1.5 border border-border-subtle rounded-md font-inter font-semibold text-small text-text-heading hover:bg-canvas-bg transition-colors"
            >
              <Download size={14} strokeWidth={2} /> Export .CSV
            </button>
          </div>

          <DataTable columns={columns} rows={filteredLogs} emptyMessage="No log entries match these filters." />

          <div className="flex items-center justify-between">
            <span className="font-inter text-small text-text-muted">Showing {filteredLogs.length} of {LOGS.length} logs</span>
            <div className="flex items-center gap-2">
              <button type="button" disabled className="p-1.5 border border-border-subtle rounded text-text-muted disabled:opacity-50 disabled:cursor-not-allowed">
                <ChevronLeft size={16} strokeWidth={2} />
              </button>
              <span className="px-3 py-1 bg-brand-black text-white font-inter font-semibold text-small rounded">1</span>
              <button type="button" disabled className="p-1.5 border border-border-subtle rounded text-text-muted disabled:opacity-50 disabled:cursor-not-allowed">
                <ChevronRight size={16} strokeWidth={2} />
              </button>
            </div>
          </div>
        </div>

        <aside className="xl:col-span-3 bg-surface-white border border-border-subtle rounded-lg p-6 shadow-card">
          <h3 className="font-poppins font-semibold text-body text-text-heading mb-6">Activity Timeline</h3>
          <div className="relative space-y-6">
            <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-border-subtle" />
            {TIMELINE.map(({ icon: Icon, time, text, flagged }, i) => (
              <div key={i} className="relative pl-9">
                <div className={`absolute left-0 top-0.5 w-6 h-6 rounded-full bg-surface-white border-2 flex items-center justify-center z-10 ${
                  flagged ? 'border-error' : i === 0 ? 'border-brand-black' : 'border-border-subtle'
                }`}>
                  <Icon size={13} strokeWidth={2} className={flagged ? 'text-error' : 'text-text-heading'} />
                </div>
                <p className={`font-inter text-caption mb-0.5 ${flagged ? 'text-error' : 'text-text-muted'}`}>{time}</p>
                <p className="font-inter text-small text-text-body leading-relaxed">{text}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-6 border-t border-divider-line">
            <p className="font-inter font-semibold text-caption text-text-muted uppercase tracking-wider mb-3">Volume Trend (24h)</p>
            <div className="h-16 w-full flex items-end gap-1">
              {VOLUME_TREND.map((h, i) => (
                <div key={i} className={`flex-1 rounded-t-sm ${h === Math.max(...VOLUME_TREND) ? 'bg-brand-black' : 'bg-border-subtle'}`} style={{ height: `${h}%` }} />
              ))}
            </div>
          </div>
        </aside>
      </div>
    </AdminShell>
  );
}
