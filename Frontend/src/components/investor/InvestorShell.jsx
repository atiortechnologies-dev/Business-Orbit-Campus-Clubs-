import { useState } from "react";
import { Link } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  Rocket,
  MessageSquare,
  Eye,
  Bell,
  Settings,
  Menu,
} from "lucide-react";
import ComingSoon from "@/components/ui/ComingSoon";
import Logo from "@/components/ui/Logo";
import Sidebar from "@/components/layout/Sidebar";
import { useSidebarCollapsed } from "@/hooks/useSidebarCollapsed";

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/investor", real: true },
  {
    icon: FileText,
    label: "Pitch Decks",
    href: "/investor/pitch-decks",
    real: true,
  },
  { icon: Rocket, label: "Startups", href: "#", real: false },
  { icon: MessageSquare, label: "Conversations", href: "#", real: false },
  { icon: Eye, label: "Watchlist", href: "#", real: false },
];

// Same three-piece pattern as DashboardShell/IncubatorShell/AdminShell —
// the fourth instance of one pattern, not a new one.
export default function InvestorShell({ children }) {
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [collapsed, onToggleCollapse] = useSidebarCollapsed();

  return (
    <div className="bg-canvas-bg text-text-body font-inter min-h-screen transition-colors duration-150 ease-linear">
      <Sidebar
        navItems={NAV_ITEMS}
        footerInitials="MW"
        footerName="Marcus Webb"
        footerRole="Principal Investor"
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
                BOCC Investor
              </p>
              <p className="font-inter text-caption text-text-muted whitespace-nowrap hidden md:block">
                Deal Flow &amp; Portfolio
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <ComingSoon
              label="Search"
              position="bottom"
              className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full border border-border-subtle bg-canvas-bg"
            >
              <FileText size={18} strokeWidth={2} className="text-text-muted" />
              <span className="text-text-muted font-inter font-normal text-body">
                Search startups, pitch decks...
              </span>
            </ComingSoon>
            <div className="flex items-center gap-4">
              <ComingSoon label="Notifications" position="bottom" inline>
                <span className="block text-text-muted cursor-pointer hover:bg-canvas-bg p-2 rounded-full transition-colors">
                  <Bell size={20} strokeWidth={2} />
                </span>
              </ComingSoon>
              <Link
                to="/investor/settings"
                className="block p-2 rounded-full transition-colors hover:bg-canvas-bg text-text-muted hover:text-text-heading"
              >
                <Settings size={20} strokeWidth={2} />
              </Link>
              <Link
                to="/investor/settings"
                className="w-8 h-8 rounded-full overflow-hidden bg-brand-black text-white flex items-center justify-center font-poppins font-semibold text-caption select-none hover:opacity-80 transition-opacity"
              >
                MW
              </Link>
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
