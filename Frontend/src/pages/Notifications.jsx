import { useState, useMemo } from 'react';
import {
  Search,
  Megaphone,
  Users,
  Rocket,
  BellOff,
  CheckCheck,
  Trash2,
  X,
  CalendarPlus,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import DashboardShell from '@/components/dashboard/DashboardShell';
import Modal from '@/components/ui/Modal';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

const TABS = ['All', 'Unread', 'Announcements', 'Meetings', 'Startup Journey', 'Opportunities'];

const ICONS = { Megaphone, Users, Rocket };

const INITIAL_NOTIFICATIONS = [
  {
    id: 1,
    icon: 'Megaphone',
    category: 'Announcements',
    unread: true,
    title: 'New Startup Competition Launch',
    time: '2 mins ago',
    body: 'The Annual Business Orbit Venture Challenge is now open for registrations. Submit your pitch deck by next Friday to qualify for the first round.',
  },
  {
    id: 2,
    icon: 'Users',
    category: 'Meetings',
    unread: false,
    title: 'Meeting Reminder: FinTech Club',
    time: '2 hours ago',
    body: "Your weekly sync with the FinTech Club board starts in 15 minutes in Room 402B. Don't forget the quarterly budget reports.",
    meeting: { start: '20260115T150000Z', end: '20260115T153000Z', location: 'Room 402B' },
  },
  {
    id: 3,
    icon: 'Rocket',
    category: 'Startup Journey',
    unread: false,
    title: 'Milestone Reached!',
    time: 'Yesterday',
    body: 'Congratulations! Your startup "EcoOrbit" has completed Phase 2 of the incubator program. You are now eligible for seed funding applications.',
  },
];

// Builds a minimal .ics file client-side and triggers a download — no backend or calendar-API integration needed for a single manual event.
function downloadIcs(notification) {
  const { title, body, meeting } = notification;
  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//BOCC//Notifications//EN',
    'BEGIN:VEVENT',
    `UID:notification-${notification.id}@bocc`,
    `DTSTART:${meeting.start}`,
    `DTEND:${meeting.end}`,
    `SUMMARY:${title}`,
    `DESCRIPTION:${body.replace(/\n/g, '\\n')}`,
    `LOCATION:${meeting.location}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');

  const blob = new Blob([ics], { type: 'text/calendar' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${title.replace(/[^a-z0-9]+/gi, '-').toLowerCase()}.ics`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function NotificationsPage() {
  useDocumentTitle('Notification Centre — BOCC');

  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const [activeTab, setActiveTab] = useState('All');
  const [query, setQuery] = useState('');
  const [detailId, setDetailId] = useState(null);

  const filtered = useMemo(() => {
    let list = notifications;
    if (activeTab === 'Unread') list = list.filter((n) => n.unread);
    else if (activeTab !== 'All') list = list.filter((n) => n.category === activeTab);

    const q = query.trim().toLowerCase();
    if (q) list = list.filter((n) => n.title.toLowerCase().includes(q) || n.body.toLowerCase().includes(q));

    return list;
  }, [notifications, activeTab, query]);

  const markAllRead = () => setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  const clearAll = () => setNotifications([]);
  const dismiss = (id) => setNotifications((prev) => prev.filter((n) => n.id !== id));

  const detail = notifications.find((n) => n.id === detailId) ?? null;

  return (
    <DashboardShell pageId="notif">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-text-heading font-poppins font-semibold text-page">
            Notifications
          </h1>
          <p className="text-text-body mt-1 font-inter font-normal text-body">
            Stay updated with your campus club activities and startup progress.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={markAllRead}
            disabled={notifications.every((n) => !n.unread)}
            className="flex items-center gap-2 px-4 py-2 bg-surface-white border border-border-subtle rounded-md font-inter font-medium text-caption text-text-heading hover:bg-canvas-bg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <CheckCheck size={18} strokeWidth={2} className="text-text-body" />
            Mark all as read
          </button>
          <button
            type="button"
            onClick={clearAll}
            disabled={notifications.length === 0}
            className="flex items-center gap-2 px-4 py-2 bg-surface-white border border-error/40 rounded-md text-error font-inter font-medium text-caption hover:bg-error/5 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Trash2 size={18} strokeWidth={2} className="text-error" />
            Clear All
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6 items-center mb-6 border-b border-divider-line pb-2">
        <div className="relative w-full md:w-96 shrink-0 h-[44px]">
          <Search size={18} strokeWidth={2} className="text-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search notifications..."
            className="w-full h-full pl-10 pr-4 bg-surface-white border border-border-subtle rounded-md text-text-body font-inter text-body focus:outline-none focus:ring-1 focus:ring-brand-black"
          />
        </div>

        <div className="flex items-center gap-1 overflow-x-auto w-full pb-1">
          {TABS.map((tab) => {
            const isActive = tab === activeTab;
            return (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 whitespace-nowrap border-b-2 font-inter font-medium text-caption pb-2 transition-colors ${
                  isActive
                    ? 'border-brand-black text-text-heading font-semibold'
                    : 'border-transparent text-text-muted hover:text-text-heading'
                }`}
              >
                {tab}
              </button>
            );
          })}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="bg-surface-white border border-border-subtle rounded-lg shadow-card p-10 text-center flex flex-col items-center gap-3">
          <BellOff size={28} strokeWidth={2} className="text-text-muted" />
          <p className="font-inter text-body text-text-muted">
            {notifications.length === 0 ? 'No notifications.' : 'No notifications match this filter.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4" id="notifications-container">
          {filtered.map((n) => {
            const Icon = ICONS[n.icon];
            return (
              <div
                key={n.id}
                className={`bg-surface-white border border-border-subtle p-6 rounded-lg shadow-card flex gap-4 relative transition-all group ${
                  n.unread ? 'hover:border-text-muted' : 'opacity-70 hover:bg-canvas-bg hover:opacity-100'
                }`}
              >
                {n.unread && (
                  <div className="w-2 h-2 rounded-full bg-accent-neon absolute left-2 top-1/2 -translate-y-1/2" />
                )}

                <div className="w-12 h-12 rounded-md bg-canvas-bg flex items-center justify-center shrink-0 border border-border-subtle">
                  <Icon size={20} strokeWidth={2} className="text-text-body" />
                </div>

                <div className="flex-grow min-w-0">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="text-text-heading font-poppins font-semibold text-body">
                      {n.title}
                    </h3>
                    <div className="flex items-center gap-3 shrink-0 ml-4">
                      <span className="text-text-muted font-inter font-normal text-small">
                        {n.time}
                      </span>
                      <button
                        type="button"
                        onClick={() => dismiss(n.id)}
                        aria-label="Dismiss notification"
                        className="text-text-muted hover:text-text-heading opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X size={16} strokeWidth={2} />
                      </button>
                    </div>
                  </div>
                  <p className="text-text-body font-inter font-normal text-body max-w-2xl">
                    {n.body}
                  </p>
                  <div className="mt-4 flex gap-2">
                    {n.category === 'Announcements' && (
                      <button
                        type="button"
                        onClick={() => setDetailId(n.id)}
                        className="px-4 py-2 bg-action-bg text-action-text rounded-md hover:opacity-90 active:scale-[0.98] transition-all font-poppins font-semibold text-small"
                      >
                        View Details
                      </button>
                    )}
                    {n.meeting && (
                      <button
                        type="button"
                        onClick={() => downloadIcs(n)}
                        className="flex items-center gap-2 px-4 py-2 bg-surface-white border border-border-subtle text-text-heading rounded-md hover:bg-canvas-bg active:scale-[0.98] transition-all font-poppins font-semibold text-small"
                      >
                        <CalendarPlus size={16} strokeWidth={2} />
                        Add to Calendar
                      </button>
                    )}
                    {n.category === 'Startup Journey' && (
                      <Link to="/build-startup/journey">
                        <button
                          type="button"
                          className="px-4 py-2 bg-action-bg text-action-text rounded-md hover:opacity-90 active:scale-[0.98] transition-all font-poppins font-semibold text-small"
                        >
                          Review Progress
                        </button>
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {notifications.length > 0 && (
        <div className="flex justify-between items-center py-4 border-t border-divider-line mt-8">
          <span className="text-text-muted font-inter font-normal text-small">
            Showing {filtered.length} of {notifications.length} notification{notifications.length === 1 ? '' : 's'}
          </span>
        </div>
      )}

      <Modal isOpen={detail !== null} onClose={() => setDetailId(null)} title={detail?.title}>
        <p className="font-inter text-body text-text-body">{detail?.body}</p>
      </Modal>

    </DashboardShell>
  );
}
