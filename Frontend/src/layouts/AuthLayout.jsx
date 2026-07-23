import { Link, Outlet } from 'react-router-dom';
import PublicNav from '@/components/layout/PublicNav';

/**
 * @layout AuthLayout
 * @description
 * Shared shell for /login, /forgot-password, /reset-password, /role-selection.
 */
export default function AuthLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-canvas-bg transition-all duration-150 ease-linear">
      <PublicNav />

      {/* ── Page content ─────────────────────────────────── */}
      <main className="flex-1 flex flex-col" id="main-content">
        <Outlet />
      </main>

      {/* ── Footer ───────────────────────────────────────── */}
      <footer className="border-t border-divider-line bg-canvas-bg py-4 transition-all duration-150 ease-linear">
        <div className="px-6 flex items-center justify-between text-[14px] leading-[20px] text-text-muted font-inter font-normal">
          <p>© 2024 Business Orbit Campus Clubs. All rights reserved.</p>
          <nav aria-label="Footer links" className="flex gap-6">
            <Link
              to="/legal/privacy-policy"
              className="hover:text-text-heading transition-all duration-150 ease-linear"
            >
              Privacy Policy
            </Link>
            <Link
              to="/legal/privacy-policy"
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
