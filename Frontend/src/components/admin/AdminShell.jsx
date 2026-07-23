import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  LayoutDashboard,
  ShieldCheck,
  Rocket,
  BarChart3,
  History,
  Plus,
  HelpCircle,
  Search,
  Bell,
  Settings,
  Menu,
} from 'lucide-react';
import ComingSoon from '@/components/ui/ComingSoon';
import Logo from '@/components/ui/Logo';
import ThemeToggle from '@/components/ui/ThemeToggle';
import Sidebar from '@/components/layout/Sidebar';
import { useSidebarCollapsed } from '@/hooks/useSidebarCollapsed';

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: 'Dashboard',         href: '/admin', real: true },
  { icon: ShieldCheck,     label: 'User Verification', href: '/admin/verification', real: true },
  { icon: Rocket,          label: 'Startup Reviews',   href: '/admin/reviews', real: true },
  { icon: BarChart3,       label: 'Analytics',         href: '#', real: false },
  { icon: History,         label: 'Audit Log',         href: '/admin/audit-log', real: true },
];

/**
 * AdminShell — the Admin portal's page wrapper, same three-piece pattern as
 * DashboardShell/IncubatorShell: header + content slot + footer, with the
 * shared <Sidebar> for navigation. See those two files' own comments for
 * the reasoning behind the pattern — this is deliberately not a fourth
 * divergent implementation, just the third instance of the same one.
 */
export default function AdminShell({ children }) {
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [collapsed, onToggleCollapse] = useSidebarCollapsed();

  return (
    <div className="bg-canvas-bg text-text-body font-inter min-h-screen transition-colors duration-150 ease-linear">
      <Sidebar
        navItems={NAV_ITEMS}
        footerInitials="AR"
        footerName="Alex Rivera"
        footerRole="Super Admin"
        isOpen={isDrawerOpen}
        onClose={() => setDrawerOpen(false)}
        collapsed={collapsed}
        onToggleCollapse={onToggleCollapse}
      >
        {/* Admin-only extra rows — every source wireframe showed a "New
            Request" shortcut and a Help Center link that don't exist for
            Student/Incubator, so these stay local to this shell rather
            than baked into the shared Sidebar. Same white/70 treatment as
            Incubator's Help Center row, for the same reason (this renders
            inside the permanently-black sidebar). */}
        <div className="border-t border-white/10 pt-4 mb-4 space-y-1">
          <ComingSoon label="New Request" position="top" inline={false} className="flex items-center gap-3 py-2 px-3 text-white/70 hover:text-white hover:bg-white/5 transition-all duration-200">
            <Plus size={20} strokeWidth={2} />
            <span className="font-poppins font-medium text-body">New Request</span>
          </ComingSoon>
          <ComingSoon label="Help Center" position="top" inline={false} className="flex items-center gap-3 py-2 px-3 text-white/70 hover:text-white hover:bg-white/5 transition-all duration-200">
            <HelpCircle size={20} strokeWidth={2} />
            <span className="font-poppins font-medium text-body">Help Center</span>
          </ComingSoon>
        </div>
      </Sidebar>

      {/* ── Main content wrapper ─────────────────────────────────────── */}
      <main className={`${collapsed ? 'lg:pl-20' : 'lg:pl-[264px]'} min-h-screen flex flex-col`}>
        <header className="sticky top-0 z-40 w-full h-[72px] bg-surface-white border-b border-divider-line flex items-center justify-between px-4 lg:px-10 transition-colors duration-150 ease-linear">
          <div className="flex items-center gap-4">
            {/* Opens the Sidebar drawer below `lg`. */}
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              aria-label="Open navigation menu"
              className="lg:hidden shrink-0 text-text-muted hover:text-text-heading transition-colors -m-2 p-2 rounded-full hover:bg-canvas-bg"
            >
              <Menu size={24} strokeWidth={2} />
            </button>
            <p className="font-poppins font-semibold text-section text-text-heading whitespace-nowrap">
              BOCC Admin
            </p>
          </div>

          <div className="flex items-center gap-6">
            <ComingSoon
              label="Search"
              position="bottom"
              className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full border border-border-subtle bg-canvas-bg"
            >
              <Search size={18} strokeWidth={2} className="text-text-muted" />
              <span className="text-text-muted font-inter font-normal text-body">
                Search across Command Center...
              </span>
            </ComingSoon>
            <div className="flex items-center gap-4">
              <ComingSoon label="Notifications" position="bottom" inline>
                <span className="block text-text-muted cursor-pointer hover:bg-canvas-bg p-2 rounded-full transition-colors">
                  <Bell size={20} strokeWidth={2} />
                </span>
              </ComingSoon>
              <ComingSoon label="Settings" position="bottom" inline>
                <span className="block p-2 rounded-full transition-colors hover:bg-canvas-bg">
                  <Settings size={20} strokeWidth={2} />
                </span>
              </ComingSoon>
              <ThemeToggle size={20} className="block" />
              <ComingSoon label="User" position="bottom" inline>
                <div className="w-8 h-8 rounded-full overflow-hidden bg-brand-black text-white flex items-center justify-center font-poppins font-semibold text-xs select-none">
                  AR
                </div>
              </ComingSoon>
            </div>
          </div>
        </header>

        <div className="flex-1 p-6 md:p-8 max-w-[1440px] w-full mx-auto flex flex-col">
          {children}
        </div>

        <footer className="flex flex-col md:flex-row justify-between items-center w-full bg-canvas-bg border-t border-divider-line py-6 px-4 lg:px-10 mt-auto transition-colors duration-150 ease-linear">
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
              <span className="text-text-muted transition-colors font-inter font-normal text-small">
                Contact Support
              </span>
            </ComingSoon>
          </div>
        </footer>
      </main>
    </div>
  );
}
