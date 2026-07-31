import { useState } from "react";
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
import { useAuth } from "@/context/AuthContext";

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

// Helper: Extract initials safely from full_name, name, or email
function getUserInitials(user) {
  if (!user) return "GU";
  const name = user.full_name || user.email || "";
  if (!name) return "US";

  const cleanName = name.split("@")[0].trim();
  const parts = cleanName.split(" ").filter(Boolean);

  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return cleanName.slice(0, 2).toUpperCase();
}

export default function DashboardShell({ pageId = "pg", children }) {
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [collapsed, onToggleCollapse] = useSidebarCollapsed();
  const { user } = useAuth();

  const initials = getUserInitials(user);

  return (
    <div className="bg-canvas-bg text-text-body font-inter min-h-screen">
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
        footerInitials={initials}
        footerName={user?.full_name || user?.email?.split("@")[0] || "User"}
        footerRole={user?.role ? user.role.toUpperCase() : "STUDENT"}
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
                BOCC Campus Clubs
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

              {/* CLEAN SIMPLE INITIALS AVATAR */}
              <Link
                to="/settings"
                title={user?.full_name || "Profile"}
                className="w-9 h-9 rounded-md bg-canvas-bg border border-border-subtle flex items-center justify-center font-poppins font-bold text-caption text-text-heading hover:opacity-80 transition-opacity select-none"
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
