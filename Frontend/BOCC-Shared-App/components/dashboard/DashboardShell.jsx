
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
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
  const pathname = usePathname();

  return (
    <div className="bg-canvas-bg text-text-body font-inter min-h-screen">

      {/* Scoped responsive offsets */}
      <style>{`
        @media (min-width: 1024px) {
          #${pageId}-main    { margin-left: 264px; }
          #${pageId}-header  { padding-left: var(--spacing-margin-desktop); padding-right: var(--spacing-margin-desktop); }
          #${pageId}-content { padding-left: var(--spacing-margin-desktop); padding-right: var(--spacing-margin-desktop); }
          #${pageId}-footer  { padding-left: var(--spacing-margin-desktop); padding-right: var(--spacing-margin-desktop); }
        }
      `}</style>

      {/* ── Sidebar ──────────────────────────────────────────────────── */}
      <aside
        className="hidden lg:flex flex-col h-screen py-6 fixed left-0 top-0 z-50 border-r border-border-subtle bg-brand-black w-[264px]"
      >
        {/* Wordmark — real logo, stacked variant, forced light (sidebar is always brand-black bg) */}
        <div className="px-6 mb-10">
          <Logo variant="stacked" size={48} force="dark" priority />
        </div>

        {/* Nav links */}
        <nav className="flex-1 space-y-1">
          {NAV_ITEMS.map(({ icon: Icon, label, href, real }) => {
            const isActive = real && (pathname === href || pathname.startsWith(href));
            
            if (!real) {
              return (
                <ComingSoon
                  key={label}
                  label={label}
                  position="top"
                  className={`flex items-center gap-3 py-3 pl-4 pr-4 transition-all duration-200 ${
                    isActive
                      ? 'border-l-4 border-accent-neon text-white pl-3'
                      : 'text-canvas-bg/70 hover:text-white/80'
                  }`}
                >
                  <Icon size={20} strokeWidth={2} />
                  <span className="font-inter font-medium text-body">{label}</span>
                </ComingSoon>
              );
            }

            return (
              <Link
                key={label}
                href={href}
                className={`flex items-center gap-3 py-3 transition-all duration-200 active:scale-[0.98] ${
                  isActive
                    ? 'border-l-4 border-accent-neon text-white pl-3 pr-4'
                    : 'text-canvas-bg/70 hover:text-canvas-bg hover:bg-white/5 pl-4 pr-4 cursor-pointer'
                }`}
              >
                <Icon size={20} strokeWidth={2} className={isActive ? 'text-white' : ''} />
                <span className="font-inter font-medium text-body">{label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Avatar */}
        <div className="px-6 mt-auto">
          <ComingSoon label="Profile" position="top">
            <div className="w-10 h-10 placeholder-box rounded-full mb-2 border border-white/10" />
            <p className="text-white font-inter font-semibold text-small text-left">
              User Profile
            </p>
          </ComingSoon>
        </div>
      </aside>

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
            <Menu size={24} strokeWidth={2} className="lg:hidden text-text-muted cursor-pointer" />
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
              <Link href="/notifications">
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
            <Link href="/legal/privacy-policy" className="text-text-muted hover:text-brand-black transition-colors font-inter font-normal text-small">
              Privacy Policy
            </Link>
            <Link href="/legal/privacy-policy" className="text-text-muted hover:text-brand-black transition-colors font-inter font-normal text-small">
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
