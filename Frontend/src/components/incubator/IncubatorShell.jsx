import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  MessageSquare,
  Rocket,
  FolderOpen,
  Settings,
  HelpCircle,
  Search,
  Bell,
  Menu,
} from 'lucide-react';
import ComingSoon from '@/components/ui/ComingSoon';
import Logo from '@/components/ui/Logo';
import ThemeToggle from '@/components/ui/ThemeToggle';
import Sidebar from '@/components/layout/Sidebar';
import { useSidebarCollapsed } from '@/hooks/useSidebarCollapsed';

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: 'Dashboard',     href: '/incubator', real: true },
  { icon: FileText,        label: 'Applications',  href: '/incubator/applications', real: true },
  { icon: MessageSquare,   label: 'Chats',         href: '/incubator/messages', real: true },
  { icon: Rocket,          label: 'Incubators',    href: '#', real: false },
  { icon: FolderOpen,      label: 'Resources',     href: '#', real: false },
  { icon: Settings,        label: 'Settings',      href: '/incubator/settings', real: true },
];

export default function IncubatorShell({ children }) {
  // See DashboardShell.jsx for why this lives here rather than in Sidebar
  // itself — the header button that opens it lives in this file.
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [collapsed, onToggleCollapse] = useSidebarCollapsed();

  return (
    <div className="bg-canvas-bg text-text-body font-inter min-h-screen transition-colors duration-150 ease-linear">
      <Sidebar
        navItems={NAV_ITEMS}
        footerInitials="AU"
        footerName="Admin User"
        footerRole="Reviewer"
        isOpen={isDrawerOpen}
        onClose={() => setDrawerOpen(false)}
        collapsed={collapsed}
        onToggleCollapse={onToggleCollapse}
      >
        {/* Incubator-only extra footer row — Student's sidebar has no
            equivalent, so this is passed as children rather than baked
            into the shared Sidebar component itself. Uses white/70 (not a
            theme-reactive token) for the same reason documented at the top
            of Sidebar.jsx — this renders inside the permanently-black
            sidebar, not the theme-reactive page canvas. */}
        <div className="border-t border-white/10 pt-4 mb-4">
          <ComingSoon label="Help Center" position="top" inline={false} className="flex items-center gap-3 py-2 px-3 text-white/70 hover:text-white hover:bg-white/5 transition-all duration-200">
            <HelpCircle size={20} strokeWidth={2} />
            <span className="font-poppins font-medium text-body">Help Center</span>
          </ComingSoon>
        </div>
      </Sidebar>

      {/* ── Main content wrapper ─────────────────────────────────────── */}
      <main className={`${collapsed ? 'lg:pl-20' : 'lg:pl-[var(--spacing-sidebar-width)]'} min-h-screen flex flex-col`}>
        {/* Header */}
        <header
          className="sticky top-0 z-40 w-full h-[72px] bg-surface-white border-b border-divider-line flex items-center justify-between px-4 lg:px-10 transition-colors duration-150 ease-linear"
        >
          {/* Brand/Subtitle & Search */}
          <div className="flex items-center gap-6 flex-1 min-w-0">
            {/* Opens the Sidebar drawer below `lg` — Incubator had no
                mobile nav trigger at all before this (Dashboard at least
                had a decorative, non-functional one; this portal had
                nothing). */}
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              aria-label="Open navigation menu"
              className="lg:hidden shrink-0 text-text-muted hover:text-text-heading transition-colors -m-2 p-2 rounded-full hover:bg-canvas-bg"
            >
              <Menu size={24} strokeWidth={2} />
            </button>
            <div className="hidden md:block">
              <h2 className="font-poppins font-bold text-[18px] leading-[24px] text-text-heading whitespace-nowrap">
                BOCC Incubator
              </h2>
              <p className="font-inter text-[12px] leading-[16px] text-text-muted whitespace-nowrap">
                Incubation Management
              </p>
            </div>
            
            {/* Search Input (Coming Soon wrapper) */}
            <div className="relative w-full max-w-md">
              <ComingSoon label="Search" position="bottom" inline={false}>
                <div className="relative w-full">
                  <Search size={18} strokeWidth={2} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                  <input
                    type="text"
                    disabled
                    placeholder="Search applications..."
                    className="w-full bg-canvas-bg border border-border-subtle rounded-lg pl-10 pr-4 py-2 font-inter text-[14px] leading-[20px] focus:outline-none cursor-not-allowed"
                  />
                </div>
              </ComingSoon>
            </div>
          </div>

          {/* Header Action Items */}
          <div className="flex items-center gap-4 ml-4">
            {/* Notifications Bell */}
            <ComingSoon
              label="Notifications"
              position="bottom"
              inline
              className="p-2 rounded-full text-text-muted hover:text-text-heading hover:bg-canvas-bg transition-colors"
            >
              <Bell size={20} strokeWidth={2} />
            </ComingSoon>

            {/* Chat Bubble Icon (Real Link to Messages) */}
            <Link
              to="/incubator/messages"
              className="p-2 rounded-full text-text-muted hover:text-text-heading hover:bg-canvas-bg transition-colors relative"
            >
              <MessageSquare size={20} strokeWidth={2} />
            </Link>

            {/* Theme toggle */}
            <ThemeToggle size={20} />

            {/* Avatar Link to Settings */}
            <Link
              to="/incubator/settings"
              className="w-8 h-8 rounded-full overflow-hidden bg-canvas-bg border border-border-subtle flex items-center justify-center font-bold text-text-heading text-[12px] select-none hover:opacity-80 transition-opacity"
            >
              AU
            </Link>
          </div>
        </header>

        {/* Page Content Canvas */}
        <div className="flex-1 p-6 md:p-8 max-w-[var(--spacing-container-max)] w-full mx-auto flex flex-col">
          {children}
        </div>

        {/* Footer */}
        <footer
          className="flex flex-col md:flex-row justify-between items-center w-full bg-canvas-bg border-t border-divider-line py-6 px-4 lg:px-10 mt-auto transition-colors duration-150 ease-linear"
        >
          <div className="mb-4 md:mb-0">
            <Logo variant="mark" size={20} />
            <p className="text-text-muted font-inter font-normal text-small mt-1">
              © 2024 Business Orbit Campus Clubs. All rights reserved.
            </p>
          </div>
          <div className="flex gap-8">
            <Link to="/legal/privacy-policy" className="text-text-muted hover:text-text-heading transition-colors font-inter font-normal text-small">
              Privacy Policy
            </Link>
            <Link to="/legal/privacy-policy" className="text-text-muted hover:text-text-heading transition-colors font-inter font-normal text-small">
              Terms of Service
            </Link>
            <ComingSoon label="Contact Support" position="top" inline>
              <span className="text-text-muted transition-colors font-inter font-normal text-small cursor-pointer">
                Contact Support
              </span>
            </ComingSoon>
          </div>
        </footer>
      </main>
    </div>
  );
}
