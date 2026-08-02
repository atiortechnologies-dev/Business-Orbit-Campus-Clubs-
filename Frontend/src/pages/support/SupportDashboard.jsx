import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Plus, Search, MoreVertical } from 'lucide-react';
import DashboardShell from '@/components/dashboard/DashboardShell';
import DataTable from '@/components/ui/DataTable';
import Badge from '@/components/ui/Badge';
import ComingSoon from '@/components/ui/ComingSoon';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

const TABS = ['Open', 'In Progress', 'Resolved', 'Closed'];

const TICKETS = [
  { id: 'TIC-9482', subject: 'Cloud Deployment sync failure', category: 'Technical', priority: 'High', created: 'Oct 24, 2023', status: 'Open', assignee: 'Alex Rivera' },
  { id: 'TIC-9475', subject: 'Missing invoice for Q3 period', category: 'Billing', priority: 'Medium', created: 'Oct 23, 2023', status: 'Open', assignee: 'Sarah Chen' },
  { id: 'TIC-9461', subject: 'Mentor session calendar not syncing', category: 'Technical', priority: 'Medium', created: 'Oct 20, 2023', status: 'In Progress', assignee: 'Jordan Smith' },
  { id: 'TIC-9450', subject: 'Unable to download acceptance letter', category: 'Technical', priority: 'Low', created: 'Oct 15, 2023', status: 'Resolved', assignee: 'Sarah Chen' },
  { id: 'TIC-9432', subject: 'Duplicate charge on subscription', category: 'Billing', priority: 'High', created: 'Oct 10, 2023', status: 'Resolved', assignee: 'Alex Rivera' },
];

const PRIORITY_DOT = { High: 'bg-brand-black', Medium: 'bg-border-subtle', Low: 'bg-border-subtle' };
const STATUS_VARIANT = { Open: 'neutral', 'In Progress': 'info', Resolved: 'success', Closed: 'neutral' };

const COLUMNS = [
  {
    key: 'id',
    label: 'Ticket ID',
    render: (t) => <Link to="/support/tickets/detail" className="font-inter text-caption text-text-heading hover:underline">#{t.id}</Link>,
  },
  {
    key: 'subject',
    label: 'Subject',
    width: '2fr',
    render: (t) => <Link to="/support/tickets/detail" className="font-inter font-semibold text-small text-text-heading hover:underline">{t.subject}</Link>,
  },
  { key: 'category', label: 'Category', render: (t) => <span className="bg-canvas-bg px-2 py-1 rounded font-inter text-caption">{t.category}</span> },
  {
    key: 'priority',
    label: 'Priority',
    render: (t) => (
      <div className="flex items-center gap-2">
        <span className={`w-2 h-2 rounded-full ${PRIORITY_DOT[t.priority]}`} />
        <span className="font-inter text-caption text-text-body">{t.priority}</span>
      </div>
    ),
  },
  { key: 'created', label: 'Created', className: 'text-text-muted' },
  { key: 'status', label: 'Status', render: (t) => <Badge variant={STATUS_VARIANT[t.status]}>{t.status}</Badge> },
  {
    key: 'assignee',
    label: 'Assigned To',
    render: (t) => (
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded-full bg-canvas-bg border border-border-subtle flex items-center justify-center font-poppins font-bold text-[10px] text-text-muted shrink-0">
          {t.assignee.split(' ').map((n) => n[0]).join('')}
        </div>
        <span className="font-inter text-caption text-text-body">{t.assignee}</span>
      </div>
    ),
  },
  {
    key: 'actions',
    label: 'Actions',
    mobileLabel: false,
    render: () => (
      <ComingSoon label="Ticket Actions" position="left" inline className="p-1 text-text-muted hover:text-text-heading transition-colors">
        <MoreVertical size={18} strokeWidth={2} />
      </ComingSoon>
    ),
  },
];

export default function SupportDashboardPage() {
  useDocumentTitle('My Support Tickets — BOCC');
  const [activeTab, setActiveTab] = useState('Open');

  const visible = TICKETS.filter((t) => t.status === activeTab);

  return (
    <DashboardShell pageId="support-dashboard">
      <nav className="mb-2 flex items-center gap-2 text-text-muted font-inter font-normal text-small">
        <Link to="/dashboard" className="hover:text-text-heading transition-colors">Dashboard</Link>
        <ChevronRight size={14} strokeWidth={2} />
        <span className="text-text-heading font-semibold">My Tickets</span>
      </nav>

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="font-poppins font-semibold text-page text-text-heading mb-2">My Support Tickets</h1>
          <p className="font-inter text-body text-text-body">
            View and manage all your technical support inquiries and service requests.
          </p>
        </div>
        <Link
          to="/support/raise-ticket"
          className="inline-flex items-center gap-2 bg-action-bg text-action-text px-6 py-3 rounded-lg font-poppins font-semibold text-small hover:opacity-90 transition-all whitespace-nowrap"
        >
          <Plus size={18} strokeWidth={2} />
          New Ticket
        </Link>
      </div>

      <div className="flex border-b border-border-subtle mb-4 overflow-x-auto">
        {TABS.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-3 font-inter text-small whitespace-nowrap border-b-2 transition-colors ${
              activeTab === tab ? 'border-brand-black font-semibold text-text-heading' : 'border-transparent text-text-muted hover:text-text-heading'
            }`}
          >
            {tab} ({TICKETS.filter((t) => t.status === tab).length})
          </button>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-3 mb-4">
        <select className="bg-surface-white border border-border-subtle rounded px-3 py-2 font-inter text-caption focus:outline-none focus:border-brand-black">
          <option>Category: All</option>
          <option>Billing</option>
          <option>Technical</option>
        </select>
        <select className="bg-surface-white border border-border-subtle rounded px-3 py-2 font-inter text-caption focus:outline-none focus:border-brand-black">
          <option>Priority: All</option>
          <option>High</option>
          <option>Medium</option>
          <option>Low</option>
        </select>
        <div className="relative ml-auto w-full md:w-auto">
          <Search size={16} strokeWidth={2} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            placeholder="Search tickets..."
            className="w-full md:w-64 pl-9 pr-4 py-2 border border-border-subtle rounded bg-surface-white font-inter text-caption focus:outline-none focus:border-brand-black"
          />
        </div>
      </div>

      <DataTable columns={COLUMNS} rows={visible} emptyMessage={`No ${activeTab.toLowerCase()} tickets.`} />

      <div className="flex items-center justify-between mt-4 font-inter text-caption text-text-muted">
        <span>Showing {visible.length} of {visible.length}</span>
        <div className="flex items-center gap-1">
          <button type="button" disabled className="w-8 h-8 flex items-center justify-center rounded-md border border-border-subtle text-text-muted disabled:opacity-40 disabled:cursor-not-allowed">
            <ChevronRight size={16} strokeWidth={2} className="rotate-180" />
          </button>
          <span className="w-8 h-8 flex items-center justify-center rounded-md bg-action-bg text-action-text font-inter text-small font-medium">1</span>
          <button type="button" disabled className="w-8 h-8 flex items-center justify-center rounded-md border border-border-subtle text-text-muted disabled:opacity-40 disabled:cursor-not-allowed">
            <ChevronRight size={16} strokeWidth={2} />
          </button>
        </div>
      </div>
    </DashboardShell>
  );
}
