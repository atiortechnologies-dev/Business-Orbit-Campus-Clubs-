import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Link } from "react-router-dom";
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
} from "lucide-react";
import ComingSoon from "@/components/ui/ComingSoon";
import Logo from "@/components/ui/Logo";
import ThemeToggle from "@/components/ui/ThemeToggle";
import Sidebar from "@/components/layout/Sidebar";
import { useSidebarCollapsed } from "@/hooks/useSidebarCollapsed";

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard", real: true },
  {
    icon: Rocket,
    label: "Build Startup",
    href: "/build-startup/journey",
    real: true,
  },
  { icon: GraduationCap, label: "Mentors", href: "/mentors", real: true },
  { icon: Wallet, label: "Investors", href: "/investors", real: true },
  { icon: Building2, label: "Incubators", href: "/incubators", real: true },
  { icon: Briefcase, label: "Freelancing", href: "/freelancing", real: true },
  { icon: User, label: "Profile", href: "/settings", real: true },
  { icon: HelpCircle, label: "Help", href: "/support", real: true },
];

export default function DashboardShell({ pageId = "pg", children }) {
  const { user } = useAuth();
  const initials = user?.full_name ? user.full_name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : user?.first_name ? (user.first_name[0] + (user.last_name ? user.last_name[0] : '')).toUpperCase() : user?.name ? user.name.substring(0,2).toUpperCase() : '??';
  // Drawer state for the sidebar below `lg` — owned here (not inside
  // Sidebar) because the header's Menu button that opens it lives in this
  // file, not there.
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [collapsed, onToggleCollapse] = useSidebarCollapsed();

  return (
    <div className="bg-canvas-bg text-text-body font-inter min-h-screen">
      {/* Scoped responsive offsets — margin-left tracks the sidebar's own
          collapsed/expanded width so the main canvas never leaves a gap or
          gets covered. */}
      <style>{`
        @media (min-width: 1024px) {
          #${pageId}-main    { margin-left: ${collapsed ? "80px" : "var(--spacing-sidebar-width)"}; }
          #${pageId}-header  { padding-left: var(--spacing-margin-desktop); padding-right: var(--spacing-margin-desktop); }
          #${pageId}-content { padding-left: var(--spacing-margin-desktop); padding-right: var(--spacing-margin-desktop); }
          #${pageId}-footer  { padding-left: var(--spacing-margin-desktop); padding-right: var(--spacing-margin-desktop); }
        }
      `}</style>

      <Sidebar
        navItems={NAV_ITEMS}
        isOpen={isDrawerOpen}
        onClose={() => setDrawerOpen(false)}
        collapsed={collapsed}
        onToggleCollapse={onToggleCollapse}
      />

      <main id={`${pageId}-main`} className="flex flex-col min-h-screen">
        <header
          id={`${pageId}-header`}
          className="flex justify-between items-center w-full sticky top-0 h-[72px] bg-surface-white border-b border-divider-line z-40"
          style={{
            paddingLeft: "var(--spacing-margin-mobile)",
            paddingRight: "var(--spacing-margin-mobile)",
          }}
        >
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
            <div className="hidden md:block">
              <p className="font-poppins font-semibold text-section text-text-heading whitespace-nowrap">
                BOCC Student
              </p>
              <p className="font-inter text-caption text-text-muted whitespace-nowrap">
                Founder Workspace
              </p>
            </div>
          </div>

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
              <Link
                to="/settings"
                className="block p-2 rounded-full transition-colors hover:bg-canvas-bg text-text-muted hover:text-text-heading"
              >
                <Settings size={20} strokeWidth={2} />
              </Link>
              <ThemeToggle size={20} className="block" />
              <Link
                to="/settings"
                className="w-8 h-8 rounded-full overflow-hidden bg-canvas-bg border border-border-subtle flex items-center justify-center font-bold text-text-heading text-caption select-none hover:opacity-80 transition-opacity"
              >
                {initials}
              </Link>
            </div>
          </div>
        </header>

        <div
          id={`${pageId}-content`}
          className="flex-1 py-8 w-full mx-auto"
          style={{
            maxWidth: "var(--spacing-container-max)",
            paddingLeft: "var(--spacing-margin-mobile)",
            paddingRight: "var(--spacing-margin-mobile)",
          }}
        >
          {children}
        </div>

        <footer
          id={`${pageId}-footer`}
          className="flex flex-col md:flex-row justify-between items-center w-full bg-canvas-bg border-t border-divider-line py-6 mt-auto"
          style={{
            paddingLeft: "var(--spacing-margin-mobile)",
            paddingRight: "var(--spacing-margin-mobile)",
          }}
        >
          <div className="mb-4 md:mb-0">
            <Logo variant="mark" size={20} />
            <p className="text-text-muted font-inter font-normal text-small mt-1">
              © 2024 Business Orbit Campus Clubs. All rights reserved.
            </p>
          </div>
          <div className="flex gap-8">
            <Link
              to="/legal/privacy-policy"
              className="text-text-muted hover:text-text-heading transition-colors font-inter font-normal text-small"
            >
              Privacy Policy
            </Link>
            <Link
              to="/legal/privacy-policy"
              className="text-text-muted hover:text-text-heading transition-colors font-inter font-normal text-small"
            >
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
