'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
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
} from 'lucide-react';
import ComingSoon from '@/components/ui/ComingSoon';
import Logo from '@/components/ui/Logo';
import ThemeToggle from '@/components/ui/ThemeToggle';

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: 'Dashboard',     href: '/incubator', real: true },
  { icon: FileText,        label: 'Applications',  href: '/incubator/applications', real: true },
  { icon: MessageSquare,   label: 'Chats',         href: '/incubator/messages', real: true },
  { icon: Rocket,          label: 'Incubators',    href: '#', real: false },
  { icon: FolderOpen,      label: 'Resources',     href: '#', real: false },
  { icon: Settings,        label: 'Settings',      href: '/incubator/settings', real: true },
];

export default function IncubatorShell({ children }) {
  const pathname = usePathname();

  return (
    <div className="bg-canvas-bg text-text-body font-inter min-h-screen transition-colors duration-150 ease-linear">
      {/* ── Sidebar ──────────────────────────────────────────────────── */}
      <aside
        className="hidden lg:flex flex-col h-screen py-6 fixed left-0 top-0 z-50 border-r border-border-subtle bg-surface-white w-[264px] transition-colors duration-150 ease-linear"
      >
        {/* Wordmark — theme-aware, stacked logo variant */}
        <div className="px-6 mb-10">
          <Logo variant="stacked" size={48} priority />
        </div>

        {/* Nav Links */}
        <nav className="flex-1 space-y-1 px-3">
          {NAV_ITEMS.map(({ icon: Icon, label, href, real }) => {
            // Active if the pathname matches or starts with the target href (excluding Root/General matches)
            const isActive = real && (pathname === href || (href !== '/incubator' && pathname.startsWith(href)));
            
            if (!real) {
              return (
                <ComingSoon
                  key={label}
                  label={label}
                  position="top"
                  inline={false}
                  className={`flex items-center gap-3 py-2 px-3 rounded-md transition-colors ${
                    isActive
                      ? 'bg-canvas-bg text-text-heading border-l-2 border-brand-black'
                      : 'text-text-muted hover:text-text-heading'
                  }`}
                >
                  <div className="flex items-center gap-3 w-full">
                    <Icon size={20} strokeWidth={2} />
                    <span className="font-poppins font-medium text-[14px] leading-[20px]">{label}</span>
                  </div>
                </ComingSoon>
              );
            }

            return (
              <Link
                key={label}
                href={href}
                className={`flex items-center gap-3 py-2 px-3 rounded-md transition-colors active:scale-[0.98] ${
                  isActive
                    ? 'bg-canvas-bg text-text-heading border-l-2 border-brand-black font-semibold'
                    : 'text-text-muted hover:text-text-heading hover:bg-canvas-bg/50'
                }`}
              >
                <Icon size={20} strokeWidth={2} className={isActive ? 'text-text-heading' : 'text-text-muted'} />
                <span className="font-poppins font-medium text-[14px] leading-[20px]">{label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="mt-auto px-3 space-y-4">
          <div className="border-t border-divider-line pt-4">
            <ComingSoon label="Help Center" position="top" inline={false} className="flex items-center gap-3 py-2 px-3 rounded-md text-text-muted hover:text-text-heading">
              <div className="flex items-center gap-3 w-full">
                <HelpCircle size={20} strokeWidth={2} />
                <span className="font-poppins font-medium text-[14px] leading-[20px]">Help Center</span>
              </div>
            </ComingSoon>
          </div>

          {/* Rep User Info Card */}
          <div className="p-3 bg-canvas-bg rounded-xl border border-border-subtle flex items-center gap-3">
            <div className="w-8 h-8 rounded-full overflow-hidden bg-surface-white border border-border-subtle flex items-center justify-center font-bold text-text-heading text-xs select-none">
              AU
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-poppins font-semibold text-[14px] leading-[20px] text-text-heading truncate">Admin User</span>
              <span className="font-inter text-[12px] leading-[16px] text-text-muted truncate">Reviewer</span>
            </div>
          </div>
        </div>
      </aside>

      {/* ── Main content wrapper ─────────────────────────────────────── */}
      <main className="lg:pl-[264px] min-h-screen flex flex-col">
        {/* Header */}
        <header
          className="sticky top-0 z-40 w-full h-[72px] bg-surface-white border-b border-divider-line flex items-center justify-between px-6 transition-colors duration-150 ease-linear"
        >
          {/* Brand/Subtitle & Search */}
          <div className="flex items-center gap-6 flex-1 min-w-0">
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
              href="/incubator/messages"
              className="p-2 rounded-full text-text-muted hover:text-text-heading hover:bg-canvas-bg transition-colors relative"
            >
              <MessageSquare size={20} strokeWidth={2} />
            </Link>

            {/* Theme toggle */}
            <ThemeToggle size={20} />

            {/* Avatar Link to Settings */}
            <Link
              href="/incubator/settings"
              className="w-8 h-8 rounded-full overflow-hidden bg-canvas-bg border border-border-subtle flex items-center justify-center font-bold text-text-heading text-[12px] select-none hover:opacity-80 transition-opacity"
            >
              AU
            </Link>
          </div>
        </header>

        {/* Page Content Canvas */}
        <div className="flex-1 p-6 md:p-8 max-w-[1440px] w-full mx-auto flex flex-col">
          {children}
        </div>

        {/* Footer */}
        <footer
          className="flex flex-col md:flex-row justify-between items-center w-full bg-canvas-bg border-t border-divider-line py-6 px-6 md:px-8 mt-auto transition-colors duration-150 ease-linear"
        >
          <div className="mb-4 md:mb-0">
            <Logo variant="mark" size={20} />
            <p className="text-text-muted font-inter font-normal text-small mt-1">
              © 2024 Business Orbit Campus Clubs. All rights reserved.
            </p>
          </div>
          <div className="flex gap-8">
            <Link href="/legal/privacy-policy" className="text-text-muted hover:text-text-heading transition-colors font-inter font-normal text-small">
              Privacy Policy
            </Link>
            <Link href="/legal/privacy-policy" className="text-text-muted hover:text-text-heading transition-colors font-inter font-normal text-small">
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
