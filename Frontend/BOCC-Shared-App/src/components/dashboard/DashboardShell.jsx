
import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Rocket,
  GraduationCap,
  Wallet,
  Building2,
  Briefcase,
  User,
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
  { icon: LayoutDashboard, label: 'Dashboard',     href: '/dashboard', real: true },
  { icon: Rocket,          label: 'Build Startup',  href: '/build-startup/journey', real: true },
  { icon: GraduationCap,   label: 'Mentors',        href: '#', real: false },
  { icon: Wallet,          label: 'Investors',      href: '#', real: false },
  { icon: Building2,       label: 'Incubators',     href: '#', real: false },
  { icon: Briefcase,       label: 'Freelancing',    href: '#', real: false },
  { icon: User,            label: 'Profile',        href: '#', real: false },
  { icon: HelpCircle,      label: 'Help',           href: '#', real: false },
];

export default function DashboardShell({ pageId = 'pg', children }) {
  // Drawer state for the sidebar below `lg` — see Sidebar.jsx's isOpen/
  // onClose doc comment. Owned here (not inside Sidebar) because the
  // header's Menu button that opens it lives in this file, not there.
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [collapsed, onToggleCollapse] = useSidebarCollapsed();

  return (
    <div className="bg-canvas-bg text-text-body font-inter min-h-screen">

      {/* Scoped responsive offsets — margin-left tracks the sidebar's own
          collapsed/expanded width so the main canvas never leaves a gap or
          gets covered. */}
      <style>{`
        @media (min-width: 1024px) {
          #${pageId}-main    { margin-left: ${collapsed ? '80px' : '264px'}; }
          #${pageId}-header  { padding-left: var(--spacing-margin-desktop); padding-right: var(--spacing-margin-desktop); }
          #${pageId}-content { padding-left: var(--spacing-margin-desktop); padding-right: var(--spacing-margin-desktop); }
          #${pageId}-footer  { padding-left: var(--spacing-margin-desktop); padding-right: var(--spacing-margin-desktop); }
        }
      `}</style>

      <Sidebar
        navItems={NAV_ITEMS}
        footerInitials="A"
        footerName="Alex"
        footerRole="Student"
        isOpen={isDrawerOpen}
        onClose={() => setDrawerOpen(false)}
        collapsed={collapsed}
        onToggleCollapse={onToggleCollapse}
      />

      {/* ── Main canvas ──────────────────────────────────────────────── */}
      <main id={`${pageId}-main`} className="flex flex-col min-h-screen">

        {/* Top header */}
        <header
          id={`${pageId}-header`}
          className="flex justify-between items-center w-full sticky top-0 h-[72px] bg-surface-white border-b border-divider-line z-40"
          style={{ paddingLeft: 'var(--spacing-margin-mobile)', paddingRight: 'var(--spacing-margin-mobile)' }}
        >
          {/* Left */}
          <div className="flex items-center gap-4">
            {/* Opens the Sidebar drawer below `lg` — previously rendered
                with no onClick at all, i.e. it did nothing when tapped. */}
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              aria-label="Open navigation menu"
              className="lg:hidden text-text-muted hover:text-text-heading transition-colors -m-2 p-2 rounded-full hover:bg-canvas-bg"
            >
              <Menu size={24} strokeWidth={2} />
            </button>
            <p className="font-poppins font-semibold text-section text-text-heading">
              BOCC Campus Clubs
            </p>
          </div>

          {/* Right */}
          <div className="flex items-center gap-6">
            <ComingSoon
              label="Search"
              position="bottom"
              className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full border border-border-subtle bg-canvas-bg"
            >
              <Search size={18} strokeWidth={2} className="text-text-muted" />
              <span className="text-text-muted font-inter font-normal text-body">
                Search...
              </span>
            </ComingSoon>
            <div className="flex items-center gap-4">
              <Link to="/notifications">
                <span className="block text-text-muted cursor-pointer hover:bg-canvas-bg p-2 rounded-full transition-colors">
                  <Bell size={20} strokeWidth={2} />
                </span>
              </Link>
              <ComingSoon label="Settings" position="bottom" inline>
                <span className="block p-2 rounded-full transition-colors hover:bg-canvas-bg">
                  <Settings size={20} strokeWidth={2} />
                </span>
              </ComingSoon>
              {/* Theme toggle */}
              <ThemeToggle size={20} className="block" />
              <ComingSoon label="User" position="bottom" inline>
                <div className="w-8 h-8 placeholder-box rounded-full" />
              </ComingSoon>
            </div>
          </div>
        </header>

        {/* Page content slot */}
        <div
          id={`${pageId}-content`}
          className="flex-1 py-8 w-full mx-auto"
          style={{
            maxWidth: 'var(--spacing-container-max)',
            paddingLeft: 'var(--spacing-margin-mobile)',
            paddingRight: 'var(--spacing-margin-mobile)',
          }}
        >
          {children}
        </div>

        {/* Footer */}
        <footer
          id={`${pageId}-footer`}
          className="flex flex-col md:flex-row justify-between items-center w-full bg-canvas-bg border-t border-divider-line py-6 mt-auto"
          style={{ paddingLeft: 'var(--spacing-margin-mobile)', paddingRight: 'var(--spacing-margin-mobile)' }}
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
