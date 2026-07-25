import { Link } from 'react-router-dom';
import ComingSoon from '@/components/ui/ComingSoon';
import Logo from '@/components/ui/Logo';
import ThemeToggle from '@/components/ui/ThemeToggle';

// 'href' only set where a real destination exists — 'About' is the one
// genuine match among the four (the general landing page's own intro
// content); 'Clubs'/'Events'/'Partners' have no matching page yet and stay
// ComingSoon rather than being forced onto an unrelated landing page.
const NAV_LINKS = [
  { label: 'Clubs' },
  { label: 'Events' },
  { label: 'Partners' },
  { label: 'About', href: '/landing' },
];

/**
 * PublicNav — the "Global Top Navbar" from the design guide: fixed 72px
 * height, solid white surface, border-subtle bottom line.
 *
 * Shared by every unauthenticated route: the 4 auth pages (via AuthLayout)
 * and the standalone Privacy Policy page. Pulled into one component instead
 * of copy-pasting this JSX into both places because the design guide
 * explicitly forbids per-layout styling variations of the same pattern
 * ("Component Usage Limitations") — one source of truth here means a future
 * link/spacing/logo change only has to happen once, and the two call sites
 * can never silently drift apart again.
 *
 * Intentionally takes no props — every current consumer needs the exact
 * same links/actions. Add an explicit prop later only if a real future page
 * needs to differ; don't pre-build flexibility nobody's asked for yet.
 */
export default function PublicNav() {
  return (
    <nav className="w-full top-0 sticky bg-surface-white border-b border-divider-line z-50">
      <div
        className="flex justify-between items-center h-[72px] mx-auto px-4 lg:px-10"
        style={{ maxWidth: 'var(--spacing-container-max)' }}
      >
        <div className="flex items-center gap-6">
          <Logo variant="horizontal" size={28} priority />
          <div className="hidden md:flex items-center" style={{ gap: 'var(--spacing-gutter)' }}>
            {NAV_LINKS.map((item) =>
              item.href ? (
                <Link
                  key={item.label}
                  to={item.href}
                  className="text-text-body hover:text-text-heading transition-colors font-inter font-medium text-small"
                >
                  {item.label}
                </Link>
              ) : (
                <ComingSoon key={item.label} label={item.label} position="bottom" inline>
                  <span className="text-text-body hover:text-text-heading transition-colors font-inter font-medium text-small">
                    {item.label}
                  </span>
                </ComingSoon>
              )
            )}
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/login" className="text-text-body hover:underline cursor-pointer font-inter font-medium text-small">
            Login
          </Link>
          <Link to="/role-selection">
            {/* hover:opacity-90, not a hardcoded hover color — action-bg
                inverts between themes, a fixed hex hover only reads
                correctly in one of them. See Button.jsx for the full
                explanation. */}
            <button className="bg-action-bg text-action-text px-5 py-2 rounded-md hover:opacity-90 active:scale-[0.98] transition-all font-inter font-medium text-small">
              Register
            </button>
          </Link>
          {/* Kept from AuthLayout's previous header even though the older
              Privacy Policy nav this was extracted from didn't have one —
              every authenticated shell (Dashboard/Incubator) exposes a
              theme toggle too, so dropping it here would be a regression,
              not a fix for consistency. */}
          <ThemeToggle size={18} />
        </div>
      </div>
    </nav>
  );
}
