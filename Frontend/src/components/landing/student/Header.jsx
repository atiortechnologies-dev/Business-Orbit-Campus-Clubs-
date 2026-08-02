import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import Logo from "@/components/ui/Logo";

const NAV_LINKS = ["Study", "Mentors"];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

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
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="flex items-center justify-between h-16 md:h-20">
          <Link to="/landing" className="flex items-center gap-3">
            <Logo variant="horizontal" size={32} priority />
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <a
                key={link}
                href="#journey"
                className="font-inter text-small font-medium text-text-body hover:text-text-heading transition-colors"
              >
                {link}
              </a>
            ))}
            <Link
              to="/login"
              className="font-inter text-small font-medium text-text-body hover:text-text-heading transition-colors"
            >
              Login
            </Link>
            <Link
              to="/signup/student"
              className="px-4 py-2 bg-action-bg text-action-text font-poppins font-semibold text-small rounded-md hover:opacity-90 transition-all"
            >
              Sign Up
            </Link>
          </nav>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="md:hidden p-2 -mr-2 text-text-heading"
            aria-label="Toggle menu"
          >
            {open ? (
              <X size={22} strokeWidth={2} />
            ) : (
              <Menu size={22} strokeWidth={2} />
            )}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden bg-canvas-bg border-t border-border-subtle">
          <div className="px-6 py-4 flex flex-col gap-4">
            {NAV_LINKS.map((link) => (
              <a
                key={link}
                href="#journey"
                onClick={() => setOpen(false)}
                className="font-inter text-small font-medium text-text-body"
              >
                {link}
              </a>
            ))}
            <Link
              to="/login"
              className="font-inter text-small font-medium text-text-body"
            >
              Login
            </Link>
            <Link
              to="/signup/student"
              className="w-fit px-4 py-2 bg-action-bg text-action-text font-poppins font-semibold text-small rounded-md"
            >
              Sign Up
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
