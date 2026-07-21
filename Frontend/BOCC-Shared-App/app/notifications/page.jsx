import {
  Bell,
  Search,
  Settings,
  Megaphone,
  Users,
  Rocket,
  BellOff,
  CheckCheck,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Menu,
} from 'lucide-react';
import Link from 'next/link';
import DashboardShell from '@/components/dashboard/DashboardShell';
import ComingSoon from '@/components/ui/ComingSoon';

export const metadata = {
  title: 'Notification Centre — BOCC',
  description: 'Stay updated with your campus club activities and startup progress.',
};

const TABS = ['All', 'Unread', 'Announcements', 'Meetings', 'Startup Journey', 'Opportunities'];

export default function NotificationsPage() {
  return (
    <DashboardShell pageId="notif">

      {/* ── Page header ───────────────────────────────────────────── */}
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
          <ComingSoon label="Mark all as read" position="bottom" inline>
            <span className="flex items-center gap-2 px-4 py-2 bg-surface-white border border-border-subtle rounded-md font-inter font-medium text-caption text-text-heading">
              <CheckCheck size={18} strokeWidth={2} className="text-text-body" />
              Mark all as read
            </span>
          </ComingSoon>
          <ComingSoon label="Delete" position="bottom" inline>
            <span className="flex items-center gap-2 px-4 py-2 bg-surface-white border border-error/40 rounded-md text-error font-inter font-medium text-caption">
              <Trash2 size={18} strokeWidth={2} className="text-error" />
              Delete
            </span>
          </ComingSoon>
        </div>
      </div>

      {/* ── Search + filter tabs ──────────────────────────────────── */}
      <div className="flex flex-col md:flex-row gap-6 items-center mb-6 border-b border-divider-line pb-2">
        {/* Search */}
        <ComingSoon label="Search" position="bottom" className="relative w-full md:w-96 shrink-0 h-[44px]">
          <Search size={18} strokeWidth={2} className="text-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
          <div className="w-full h-full pl-10 pr-4 flex items-center bg-surface-white border border-border-subtle rounded-md text-text-muted font-inter font-normal text-body text-left">
            Search notifications...
          </div>
        </ComingSoon>

        {/* Filter tabs — "All" is the current view (static indicator, same
            pattern as pagination's current-page number). The other 5 have
            no real per-category data to filter against yet, so they're
            marked ComingSoon rather than pretending to switch. */}
        <div className="flex items-center gap-1 overflow-x-auto w-full pb-1">
          {TABS.map((tab) => {
            const isActive = tab === 'All';
            if (isActive) {
              return (
                <span
                  key={tab}
                  className="px-4 py-2 whitespace-nowrap border-b-2 border-brand-black text-text-heading font-semibold font-inter font-medium text-caption pb-2"
                >
                  {tab}
                </span>
              );
            }
            return (
              <ComingSoon key={tab} label={tab} position="bottom" inline>
                <span className="px-4 py-2 whitespace-nowrap border-b-2 border-transparent text-text-muted font-inter font-medium text-caption pb-2 inline-block">
                  {tab}
                </span>
              </ComingSoon>
            );
          })}
        </div>
      </div>

      {/* ── Notification cards ─────────────────────────────────────── */}
      <div className="space-y-4" id="notifications-container">

        {/* Card 1 — Unread */}
        <div className="bg-surface-white border border-border-subtle p-6 rounded-lg shadow-card flex gap-4 relative hover:border-text-muted transition-all cursor-pointer group">
          {/* Unread dot */}
          <div className="w-2 h-2 rounded-full bg-accent-neon absolute left-2 top-1/2 -translate-y-1/2" />

          {/* Icon swatch */}
          <div className="w-12 h-12 rounded-md bg-canvas-bg flex items-center justify-center shrink-0 border border-border-subtle">
            <Megaphone size={20} strokeWidth={2} className="text-text-body" />
          </div>

          <div className="flex-grow min-w-0">
            <div className="flex justify-between items-start mb-1">
              <h3 className="text-text-heading font-inter font-semibold text-body">
                New Startup Competition Launch
              </h3>
              <span className="text-text-muted font-inter font-normal text-small shrink-0 ml-4">
                2 mins ago
              </span>
            </div>
            <p className="text-text-body font-inter font-normal text-body max-w-2xl">
              The Annual Business Orbit Venture Challenge is now open for registrations.
              Submit your pitch deck by next Friday to qualify for the first round.
            </p>
            <div className="mt-4 flex gap-2">
              <ComingSoon label="View Details" position="top" inline>
                <span
                  className="px-4 py-2 bg-action-bg text-action-text rounded-md hover:bg-[#1F2937] active:scale-[0.98] transition-all font-poppins font-semibold text-small inline-block"
                >
                  View Details
                </span>
              </ComingSoon>
              <ComingSoon label="Dismiss" position="top" inline>
                <span className="px-4 py-2 bg-surface-white border border-border-subtle text-text-heading rounded-md font-poppins font-semibold text-small inline-block">
                  Dismiss
                </span>
              </ComingSoon>
            </div>
          </div>
        </div>

        {/* Card 2 — Read (70% opacity) */}
        <div className="bg-surface-white border border-border-subtle p-6 rounded-lg shadow-card flex gap-4 transition-all hover:bg-canvas-bg cursor-pointer opacity-70">
          <div className="w-12 h-12 rounded-md bg-canvas-bg flex items-center justify-center shrink-0 border border-border-subtle">
            <Users size={20} strokeWidth={2} className="text-text-body" />
          </div>
          <div className="flex-grow min-w-0">
            <div className="flex justify-between items-start mb-1">
              <h3 className="text-text-heading font-inter font-semibold text-body">
                Meeting Reminder: FinTech Club
              </h3>
              <span className="text-text-muted font-inter font-normal text-small shrink-0 ml-4">
                2 hours ago
              </span>
            </div>
            <p className="text-text-body font-inter font-normal text-body max-w-2xl">
              Your weekly sync with the FinTech Club board starts in 15 minutes in Room 402B.
              Don't forget the quarterly budget reports.
            </p>
            <div className="mt-4 flex gap-2">
              <ComingSoon label="Add to Calendar" position="top" inline>
                <span
                  className="px-4 py-2 bg-surface-white border border-border-subtle text-text-heading rounded-md hover:bg-canvas-bg active:scale-[0.98] transition-all font-poppins font-semibold text-small inline-block"
                >
                  Add to Calendar
                </span>
              </ComingSoon>
            </div>
          </div>
        </div>

        {/* Card 3 — Success */}
        <div className="bg-surface-white border border-border-subtle p-6 rounded-lg shadow-card flex gap-4 transition-all hover:bg-canvas-bg cursor-pointer">
          <div className="w-12 h-12 rounded-md bg-canvas-bg flex items-center justify-center shrink-0 border border-border-subtle">
            <Rocket size={20} strokeWidth={2} className="text-text-body" />
          </div>
          <div className="flex-grow min-w-0">
            <div className="flex justify-between items-start mb-1">
              <h3 className="text-text-heading font-inter font-semibold text-body">
                Milestone Reached!
              </h3>
              <span className="text-text-muted font-inter font-normal text-small shrink-0 ml-4">
                Yesterday
              </span>
            </div>
            <p className="text-text-body font-inter font-normal text-body max-w-2xl">
              Congratulations! Your startup "EcoOrbit" has completed Phase 2 of the incubator
              program. You are now eligible for seed funding applications.
            </p>
            <div className="mt-4 flex gap-2">
              <Link href="/build-startup/journey">
                <button
                  className="px-4 py-2 bg-action-bg text-action-text rounded-md hover:bg-[#1F2937] active:scale-[0.98] transition-all font-poppins font-semibold text-small"
                >
                  Review Progress
                </button>
              </Link>
            </div>
          </div>
        </div>

      </div>{/* /notifications-container */}

      {/* ── Pagination ─────────────────────────────────────────────── */}
      <div className="flex justify-between items-center py-4 border-t border-divider-line mt-8">
        <span className="text-text-muted font-inter font-normal text-small">
          Showing 1-10 of 48 notifications
        </span>
        <div className="flex items-center gap-1">
          <button
            className="w-10 h-10 flex items-center justify-center border border-border-subtle bg-surface-white text-text-body rounded-md hover:bg-canvas-bg disabled:opacity-50 active:scale-[0.98] transition-all"
            disabled
          >
            <ChevronLeft size={18} strokeWidth={2} />
          </button>
          <button className="w-10 h-10 flex items-center justify-center bg-action-bg text-action-text rounded-md font-poppins font-semibold text-small">1</button>
          <ComingSoon label="Page 2" position="top" inline>
            <span className="w-10 h-10 flex items-center justify-center border border-border-subtle bg-surface-white text-text-body rounded-md font-poppins font-semibold text-small">2</span>
          </ComingSoon>
          <ComingSoon label="Page 3" position="top" inline>
            <span className="w-10 h-10 flex items-center justify-center border border-border-subtle bg-surface-white text-text-body rounded-md font-poppins font-semibold text-small">3</span>
          </ComingSoon>
          <ComingSoon label="Next Page" position="top" inline>
            <span className="w-10 h-10 flex items-center justify-center border border-border-subtle bg-surface-white text-text-body rounded-md">
              <ChevronRight size={18} strokeWidth={2} />
            </span>
          </ComingSoon>
        </div>
      </div>

    </DashboardShell>
  );
}
