import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import Logo from "@/components/ui/Logo";
import ThemeToggle from "@/components/ui/ThemeToggle";

// In-page anchor links, not site-wide navigation — this is a single long
// scroll page, unlike PublicNav's site-section links (Clubs/Events/etc.),
// which is why this isn't just a reuse of that component. Every
// /landing/<role> page shares this Navbar but has its own section ids, so
// the links are a prop (defaulting to Home's) rather than hardcoded —
// hardcoding them here would silently 404-anchor on every other page.
const HOME_LINKS = [
  { label: "About", href: "#about" },
  { label: "Startup Stories", href: "#stories" },
  { label: "Community", href: "#ecosystem" },
  { label: "FAQ", href: "#faq" },
  { label: "Contact", href: "#contact" },
];

// Fixed + scroll-reactive (transparent at the top of the page, glass once
// scrolled) — matches Student's bespoke Header.jsx, so every landing page
// behaves the same way rather than Student being the odd one out. Being
// `fixed` (not `sticky`) is what lets the hero show through while
// transparent; each page's Hero component carries its own top padding to
// clear this header's height, the same way Student's Hero already does.
export default function Navbar({ links = HOME_LINKS }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-colors duration-300 ${
        scrolled
          ? "bg-canvas-bg/80 backdrop-blur-md border-b border-border-subtle"
          : "bg-transparent"
      }`}
    >
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-5 lg:px-10 h-16">
        <Link to="/landing">
          <Logo variant="horizontal" size={26} priority />
        </Link>

        <ul className="hidden lg:flex items-center gap-8 font-inter text-small text-text-body">
          {links.map((l) => (
            <li key={l.label}>
              <a
                href={l.href}
                className="hover:text-text-heading transition-colors"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden lg:flex items-center gap-4">
          <Link
            to="/login"
            className="font-inter text-small text-text-body hover:text-text-heading transition-colors"
          >
            Login
          </Link>
          <Link
            to="/role-selection"
            className="bg-action-bg text-action-text px-4 py-2 rounded-md font-inter font-semibold text-small hover:opacity-90 active:scale-[0.98] transition-all"
          >
            Explore
          </Link>
          <ThemeToggle size={18} />
        </div>

        <button
          type="button"
          className="lg:hidden text-text-heading"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? (
            <X size={22} strokeWidth={2} />
          ) : (
            <Menu size={22} strokeWidth={2} />
          )}
        </button>
      </nav>

      {open && (
        <div className="lg:hidden border-t border-border-subtle bg-canvas-bg">
          <ul className="flex flex-col px-5 py-4 gap-3 font-inter text-small">
            {links.map((l) => (
              <li key={l.label}>
                <a
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="block py-1 text-text-body"
                >
                  {l.label}
                </a>
              </li>
            ))}
            <li className="pt-2 flex items-center gap-4">
              <Link to="/login" className="text-text-body">
                Login
              </Link>
              <Link
                to="/role-selection"
                className="bg-action-bg text-action-text px-4 py-2 rounded-md font-semibold text-small"
              >
                Explore
              </Link>
              <ThemeToggle size={18} />
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
