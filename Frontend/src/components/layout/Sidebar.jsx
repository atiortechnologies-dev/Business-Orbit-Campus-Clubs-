import { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ChevronsLeft, ChevronsRight, LogOut } from "lucide-react";
import ComingSoon from "@/components/ui/ComingSoon";
import Logo from "@/components/ui/Logo";
import { useAuth } from "@/context/AuthContext";

// Shared "Dashboard Control Sidebar" (fixed 264px, brand-black canvas,
// neon-yellow active border) used by DashboardShell/IncubatorShell/
// AdminShell. Extracted into one component because the portals had
// drifted into visibly different sidebars (white vs black bg, different
// active-state styling/fonts) despite being the same conceptual piece —
// a future style tweak now only has to land here once. `navItems` stays a
// prop since each portal's link list is genuinely feature-specific.
export default function Sidebar({
  navItems,
  footerInitials,
  footerName,
  footerRole,
  children,
  isOpen = false,
  onClose = () => {},
  // Owned by the shell (not here) since the shell's own main-content
  // margin has to shrink in step with this — see any shell for the pattern.
  collapsed = false,
  onToggleCollapse = () => {},
}) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  async function handleLogout() {
    await logout();
    navigate("/login", { replace: true });
  }

  // Escape closes the drawer — only matters below `lg`, but harmless to
  // register unconditionally since `onClose` no-ops when nothing's using
  // the state at wider viewports.
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onClose]);

  // A naive per-item "pathname === href || pathname.startsWith(href + '/')"
  // check breaks the moment one nav item's href is itself a prefix of
  // another's (e.g. Incubator's "Dashboard" is /incubator, and every other
  // Incubator route lives under /incubator/...) — both items would light
  // up as active on a nested page like /incubator/applications/review.
  // Instead: find every real item whose href matches, then only the
  // *longest* (most specific) match wins.
  const activeHref = navItems
    .filter(
      ({ real, href }) =>
        real && (pathname === href || pathname.startsWith(`${href}/`)),
    )
    .reduce(
      (best, { href }) =>
        best === null || href.length > best.length ? href : best,
      null,
    );

  return (
    <>
      {/* Backdrop — mobile/tablet only (lg:hidden), dims the page behind
          the drawer and closes it on tap. z-45: above the shells' z-40
          headers (so it dims those too while the drawer's open) but below
          the sidebar's own z-50. Doesn't render at all above `lg`, where
          the sidebar is static and there's nothing to back-drop. */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 z-[45] bg-black/50"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`flex flex-col h-screen py-6 fixed left-0 top-0 z-50 border-r border-white/10 bg-brand-black
          transform transition-[transform,width] duration-200 ease-out
          lg:translate-x-0 ${isOpen ? "translate-x-0" : "-translate-x-full"}
          ${collapsed ? "lg:w-20" : "lg:w-[var(--spacing-sidebar-width)]"} w-[var(--spacing-sidebar-width)]`}
      >
        {/* IMPORTANT for anyone editing this file: this sidebar's background
          is ALWAYS brand-black, in both light and dark theme — it does not
          flip like the rest of the page does. That means every color used
          in here must be a FIXED value (white/70, white/5, brand-black,
          accent-neon, or plain white) — never one of the theme-reactive
          tokens (canvas-bg, text-heading, text-body, text-muted,
          border-subtle, surface-white, divider-line). Those tokens are
          defined to invert between light/dark (e.g. canvas-bg is near-white
          in light mode but flips to near-BLACK in dark mode), so using one
          on this permanently-black surface looks fine in light mode and
          then silently goes near-invisible in dark mode. This exact
          mistake (text-canvas-bg/70 on nav labels) shipped here once
          already — if you're about to add a new element to this file,
          reach for white/70, white/60, white/10 etc. instead.

          Wordmark below — the logo always uses its dark-bg-safe
          (force="dark") asset for the same reason, regardless of theme.
          Switches to the square "mark" variant while collapsed since the
          full lockup won't fit an 80px rail. */}
        <div className="px-6 mb-10 flex items-center justify-center lg:justify-start">
          {collapsed ? (
            <div className="hidden lg:block">
              <Logo variant="mark" size={32} force="dark" priority />
            </div>
          ) : null}
          <div className={collapsed ? "lg:hidden" : ""}>
            <Logo variant="horizontal" sidebar force="dark" priority />
          </div>
        </div>

        <nav className="flex-1 space-y-1">
          {navItems.map(({ icon: Icon, label, href, real }) => {
            const isActive = real && href === activeHref;
            const itemClasses = `flex items-center gap-3 py-3 transition-all duration-200 ${
              collapsed ? "lg:justify-center lg:px-0" : ""
            } ${
              isActive
                ? "border-l-4 border-accent-neon text-white pl-3 pr-4"
                : "text-white/70 hover:text-white hover:bg-white/5 pl-4 pr-4"
            }`;

            if (!real) {
              return (
                <ComingSoon
                  key={label}
                  label={label}
                  position="top"
                  className={itemClasses}
                >
                  <Icon size={20} strokeWidth={2} />
                  <span
                    className={`font-poppins font-medium text-body ${collapsed ? "lg:hidden" : ""}`}
                  >
                    {label}
                  </span>
                </ComingSoon>
              );
            }

            return (
              <Link
                key={label}
                to={href}
                onClick={onClose}
                title={collapsed ? label : undefined}
                className={`${itemClasses} active:scale-[0.98] cursor-pointer`}
              >
                <Icon
                  size={20}
                  strokeWidth={2}
                  className={isActive ? "text-white" : ""}
                />
                <span
                  className={`font-poppins font-medium text-body ${collapsed ? "lg:hidden" : ""}`}
                >
                  {label}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Portal-specific extra rows (e.g. Incubator's Help Center, Admin's
          New Request) — hidden while collapsed rather than made
          collapse-aware themselves, since they're arbitrary JSX passed in
          by each shell and can't be trusted to render sensibly icon-only. */}
        {children && (
          <div className={`px-4 mt-auto ${collapsed ? "lg:hidden" : ""}`}>
            {children}
          </div>
        )}

        {/* Collapse toggle — desktop only, mobile already has a full
          hide/show drawer via isOpen so there's nothing to collapse there. */}
        <button
          type="button"
          onClick={onToggleCollapse}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className={`hidden lg:flex items-center gap-2 mx-4 mb-4 py-2 rounded-lg text-white/50 hover:text-white hover:bg-white/5 transition-colors ${
            collapsed ? "justify-center px-0" : "px-3"
          } ${children ? "" : "mt-auto"}`}
        >
          {collapsed ? (
            <ChevronsRight size={18} strokeWidth={2} />
          ) : (
            <ChevronsLeft size={18} strokeWidth={2} />
          )}
          <span className={collapsed ? "lg:hidden" : ""}>
            <span className="font-inter text-caption">Collapse</span>
          </span>
        </button>

        {/* User card. TODO(backend): swap initials/name/role for the
          authenticated user's real profile data once auth/session state
          exists — the surrounding structure/classes are intentional and
          shouldn't need to change, only these three values need to become
          dynamic. Collapses to just the initials circle. */}
        <div className="px-4">
          <div
            className={`bg-white/5 rounded-xl border border-white/10 flex items-center gap-3 ${collapsed ? "lg:p-0 lg:justify-center lg:bg-transparent lg:border-none p-3" : "p-3"}`}
          >
            <div className="w-8 h-8 rounded-full overflow-hidden bg-white/10 border border-white/10 flex items-center justify-center font-bold text-white text-xs select-none shrink-0">
              {footerInitials}
            </div>
            <div
              className={`flex flex-col min-w-0 ${collapsed ? "lg:hidden" : ""}`}
            >
              <span className="font-poppins font-semibold text-small text-white truncate">
                {footerName}
              </span>
              <span className="font-inter text-caption text-white/60 truncate">
                {footerRole}
              </span>
            </div>
          </div>
        </div>

        <div className="px-4 mt-2">
          <button
            type="button"
            onClick={handleLogout}
            className={`flex items-center gap-2 w-full py-2 rounded-lg text-white/50 hover:text-white hover:bg-white/5 transition-colors ${
              collapsed ? "lg:justify-center lg:px-0" : "px-3"
            }`}
            title={collapsed ? "Log Out" : undefined}
          >
            <LogOut size={18} strokeWidth={2} />
            <span
              className={`font-inter text-caption ${collapsed ? "lg:hidden" : ""}`}
            >
              Log Out
            </span>
          </button>
        </div>
      </aside>
    </>
  );
}
