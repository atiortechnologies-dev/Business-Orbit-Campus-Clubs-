import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Link } from "react-router-dom";
import {
  LayoutDashboard,
  Plus,
  FolderOpen,
  Users,
  UserCircle,
  Settings,
  Search,
  Bell,
  Menu,
} from "lucide-react";
import ComingSoon from "@/components/ui/ComingSoon";
import Logo from "@/components/ui/Logo";
import ThemeToggle from "@/components/ui/ThemeToggle";
import Sidebar from "@/components/layout/Sidebar";
import { useSidebarCollapsed } from "@/hooks/useSidebarCollapsed";

const NAV_ITEMS = [
  {
    icon: LayoutDashboard,
    label: "Dashboard",
    href: "/company/dashboard",
    real: true,
  },
  {
    icon: Plus,
    label: "Post Opportunity",
    href: "/company/post-opportunity/step-1",
    real: true,
  },
  {
    icon: FolderOpen,
    label: "My Opportunities",
    href: "/company/my-opportunities",
    real: true,
  },
  { icon: Users, label: "Applicants", href: "/company/applicants", real: true },
  { icon: UserCircle, label: "Profile", href: "#", real: false },
  { icon: Settings, label: "Settings", href: "#", real: false },
];

// Same three-piece pattern as DashboardShell/IncubatorShell/AdminShell/
// InvestorShell/MentorShell — the fifth instance of one pattern, not a
// new one. Replaces the old layouts/CompanyDashboardShell.jsx, which
// wrapped the Student portal's DashboardShell directly; that shell
// hardcodes Student-specific nav items internally rather than accepting
// a navItems prop, so the wrapper would have shown "Build Startup" /
// "Mentors" / a Student Settings link to Company users — this dedicated
// shell (matching every other portal) is the actual fix, not a style
// preference.
export default function CompanyShell({ children }) {
  const { user } = useAuth();
  const initials = user?.full_name ? user.full_name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : user?.first_name ? (user.first_name[0] + (user.last_name ? user.last_name[0] : '')).toUpperCase() : user?.name ? user.name.substring(0,2).toUpperCase() : '??';
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [collapsed, onToggleCollapse] = useSidebarCollapsed();

  return (
    <div className="bg-canvas-bg text-text-body font-inter min-h-screen transition-colors duration-150 ease-linear">
      <Sidebar
        navItems={NAV_ITEMS}
        isOpen={isDrawerOpen}
        onClose={() => setDrawerOpen(false)}
        collapsed={collapsed}
        onToggleCollapse={onToggleCollapse}
      />

      <main
        className={`${collapsed ? "lg:pl-20" : "lg:pl-[var(--spacing-sidebar-width)]"} min-h-screen flex flex-col`}
      >
        <header className="sticky top-0 z-40 w-full h-[72px] bg-surface-white border-b border-divider-line flex items-center justify-between px-4 lg:px-10 transition-colors duration-150 ease-linear">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              aria-label="Open navigation menu"
              className="lg:hidden shrink-0 text-text-muted hover:text-text-heading transition-colors -m-2 p-2 rounded-full hover:bg-canvas-bg"
            >
              <Menu size={24} strokeWidth={2} />
            </button>
            <div>
              <p className="font-poppins font-semibold text-section text-text-heading whitespace-nowrap">
                BOCC Company
              </p>
              <p className="font-inter text-caption text-text-muted whitespace-nowrap hidden md:block">
                Enterprise Console
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
                Search candidates, jobs...
              </span>
            </ComingSoon>
            <div className="flex items-center gap-4">
              <ComingSoon label="Notifications" position="bottom" inline>
                <span className="block text-text-muted cursor-pointer hover:bg-canvas-bg p-2 rounded-full transition-colors">
                  <Bell size={20} strokeWidth={2} />
                </span>
              </ComingSoon>
              <ThemeToggle size={20} className="block" />
              <ComingSoon label="Profile" position="bottom" inline>
                <div className="w-8 h-8 rounded-full overflow-hidden bg-gradient-to-br from-gray-700 to-brand-black text-white flex items-center justify-center font-poppins font-semibold text-caption select-none">
                  {initials}
                </div>
              </ComingSoon>
            </div>
          </div>
        </header>

        <div className="flex-1 p-6 md:p-8 max-w-[var(--spacing-container-max)] w-full mx-auto flex flex-col">
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
