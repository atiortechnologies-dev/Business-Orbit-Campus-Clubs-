import { useState, useMemo } from 'react';
import { Calendar, ChevronLeft, ChevronRight, Zap, User as UserIcon, AlertTriangle, FileText, Cloud } from 'lucide-react';
import AdminShell from '@/components/admin/AdminShell';
import DataTable from '@/components/ui/DataTable';
import Badge from '@/components/ui/Badge';
import ComingSoon from '@/components/ui/ComingSoon';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

const LOGS = [
  { id: 'l1', timestamp: '2024-10-24 14:22:01', initials: 'JD', user: 'j_doe_admin', module: 'Security', action: 'Updated User Permissions', target: 'ID: 8829-X-22', status: 'Success', ip: '192.168.1.104' },
  { id: 'l2', timestamp: '2024-10-24 14:18:55', initials: 'SM', user: 's_miller_op', module: 'Clubs', action: 'Modified Club Metadata', target: 'Central Tennis Hub', status: 'Success', ip: '216.58.214.14' },
  { id: 'l3', timestamp: '2024-10-24 13:55:12', initials: '??', user: 'Unknown', module: 'Auth', action: 'Failed Login Attempt', target: 'Admin Portal Login', status: 'Rejected', ip: '45.12.8.212', flagged: true },
  { id: 'l4', timestamp: '2024-10-24 13:40:02', initials: 'AK', user: 'a_kapoor_sys', module: 'System', action: 'Backup Execution Initiated', target: 'Global Storage Cluster', status: 'Pending', ip: '10.0.0.42' },
  { id: 'l5', timestamp: '2024-10-24 13:22:11', initials: 'JD', user: 'j_doe_admin', module: 'Content', action: 'Archived Report Cycle', target: 'FY23_Q3_Final', status: 'Success', ip: '192.168.1.104' },
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

  const filteredLogs = useMemo(
    () => LOGS.filter((l) => (moduleFilter === 'All' || l.module === moduleFilter) && (userFilter === 'All' || l.user === userFilter)),
    [moduleFilter, userFilter]
  );

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
            <div className="flex flex-wrap items-center gap-2">
              <ComingSoon label="Date range filter" position="bottom" inline>
                <span className="flex items-center gap-2 px-3 py-1.5 bg-surface-white border border-border-subtle rounded-md font-inter text-small text-text-heading">
                  <Calendar size={14} strokeWidth={2} /> Last 24 Hours
                </span>
              </ComingSoon>
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
            <ComingSoon label="Export .CSV" position="bottom" inline>
              <span className="flex items-center gap-1.5 px-4 py-1.5 border border-border-subtle rounded-md font-inter font-semibold text-small text-text-heading">
                Export .CSV
              </span>
            </ComingSoon>
          </div>

          <DataTable columns={columns} rows={filteredLogs} emptyMessage="No log entries match these filters." />

          <div className="flex items-center justify-between">
            <span className="font-inter text-small text-text-muted">Showing 1-{filteredLogs.length} of 12,482 logs</span>
            <div className="flex items-center gap-2">
              <ComingSoon label="Previous page" position="top" inline>
                <span className="p-1.5 border border-border-subtle rounded text-text-muted"><ChevronLeft size={16} strokeWidth={2} /></span>
              </ComingSoon>
              <span className="px-3 py-1 bg-brand-black text-white font-inter font-semibold text-small rounded">1</span>
              <ComingSoon label="Next page" position="top" inline>
                <span className="p-1.5 border border-border-subtle rounded text-text-muted"><ChevronRight size={16} strokeWidth={2} /></span>
              </ComingSoon>
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
