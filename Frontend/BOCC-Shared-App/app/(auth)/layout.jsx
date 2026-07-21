'use client';

import Link from 'next/link';
import Logo from '@/components/ui/Logo';
import ThemeToggle from '@/components/ui/ThemeToggle';

/**
 * @layout AuthLayout — (auth) route group
 * @description
 * Shared shell for /login, /forgot-password, /reset-password, /role-selection.
 *
 * Route group (auth) keeps URL paths clean (/login, not /(auth)/login).
 * This layout wraps only these 4 routes — not root or future dashboard routes.
 */
export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-canvas-bg transition-all duration-150 ease-linear">
      {/* ── Header ───────────────────────────────────────── */}
      <header className="sticky top-0 z-10 bg-canvas-bg border-b border-divider-line transition-all duration-150 ease-linear">
        <div className="px-6 h-14 flex items-center justify-between">
          <Logo priority />
          <ThemeToggle size={18} />
        </div>
      </header>

      {/* ── Page content ─────────────────────────────────── */}
      <main className="flex-1 flex flex-col" id="main-content">
        {children}
      </main>

      {/* ── Footer ───────────────────────────────────────── */}
      <footer className="border-t border-divider-line bg-canvas-bg py-4 transition-all duration-150 ease-linear">
        <div className="px-6 flex items-center justify-between text-[14px] leading-[20px] text-text-muted font-inter font-normal">
          <p>© 2024 Business Orbit Campus Clubs. All rights reserved.</p>
          <nav aria-label="Footer links" className="flex gap-6">
            <Link
              href="/legal/privacy-policy"
              className="hover:text-text-heading transition-all duration-150 ease-linear"
            >
              Privacy Policy
            </Link>
            <Link
              href="/legal/privacy-policy"
              className="hover:text-text-heading transition-all duration-150 ease-linear"
            >
              Terms of Service
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
