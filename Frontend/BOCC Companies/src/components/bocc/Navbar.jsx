import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

import boccLogo from "@/assets/bocc-logo.png";

const NAV_LINKS = [
  { label: 'Startup Journey', href: '#startup-journey' },
  { label: 'Roles', href: '#roles' },
  { label: 'Partners', href: '#partners' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? 'border-b border-neutral-200/80 bg-white/80 backdrop-blur-xl'
          : 'border-b border-transparent bg-white/60 backdrop-blur-md'
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-6 lg:px-10">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 lime-focus rounded-lg" aria-label="Business Orbit Campus Club home">
          <img src={boccLogo} alt="Business Orbit Campus Club logo" className="h-10 w-auto" />
          <span className="hidden text-[15px] font-semibold tracking-tight text-neutral-900 sm:block">
            Business Orbit Campus Club <span className="text-neutral-400">(BOCC)</span>
          </span>
        </Link>

        {/* Center nav */}
        <div className="hidden items-center gap-9 md:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm font-medium text-neutral-600 transition-colors hover:text-neutral-900 lime-focus rounded-md"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Right actions */}
        <div className="hidden items-center gap-3 md:flex">
          <a
            href="#login"
            className="inline-flex h-10 items-center rounded-full px-5 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-100 lime-focus"
          >
            Login
          </a>
          <a
            href="#register"
            className="inline-flex h-10 items-center rounded-full bg-neutral-900 px-5 text-sm font-medium text-white transition-all hover:bg-neutral-800 lime-focus"
          >
            Register
          </a>
        </div>

        {/* Mobile toggle */}
        <button
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-neutral-700 hover:bg-neutral-100 md:hidden lime-focus"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle navigation menu"
          aria-expanded={open}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="border-t border-neutral-200 bg-white md:hidden">
          <div className="flex flex-col gap-1 px-6 py-4">
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-neutral-700 hover:bg-neutral-100"
              >
                {link.label}
              </a>
            ))}
            <div className="mt-2 flex flex-col gap-2 border-t border-neutral-100 pt-3">
              <a href="#login" onClick={() => setOpen(false)} className="rounded-full border border-neutral-200 px-5 py-2.5 text-center text-sm font-medium text-neutral-700">
                Login
              </a>
              <a href="#register" onClick={() => setOpen(false)} className="rounded-full bg-neutral-900 px-5 py-2.5 text-center text-sm font-medium text-white">
                Register
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}