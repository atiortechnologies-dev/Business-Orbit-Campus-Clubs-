import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import boccLogo from "@/assets/bocc-logo.png";


const navLinks = [
  { label: 'Startup Journey', href: '#workflow' },
  { label: 'Data', href: '#why-mentor' },
  { label: 'Mentors', href: '#impact-stories' },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 h-20 flex items-center transition-all duration-300 ${
        scrolled
          ? 'bg-white/80 backdrop-blur-md border-b border-[#EAEAEA]'
          : 'bg-[#F8F8F8]/80 backdrop-blur-md border-b border-transparent'
      }`}
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8 w-full flex items-center justify-between">
        <a href="#top" className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg overflow-hidden flex-shrink-0 ring-1 ring-[#EAEAEA]">
            <img src={boccLogo} alt="BOCC" className="h-full w-full object-cover" />
          </div>
          <span className="text-lg font-semibold tracking-tight text-black hidden sm:block">
            Business Orbit Campus Club (BOCC)
          </span>
        </a>

        <nav className="hidden md:flex items-center gap-10">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="nav-underline text-sm font-medium text-black/70 hover:text-black transition-colors"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <a
            href="#cta"
            className="text-sm font-medium text-black hover:text-black/60 transition-colors px-4 py-2"
          >
            Login
          </a>
          <a
            href="#cta"
            className="text-sm font-semibold text-black bg-[#C7D62F] px-5 py-2.5 rounded-lg hover:bg-[#b5c928] transition-colors"
          >
            Register
          </a>
        </div>

        <button
          className="md:hidden p-2 text-black"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden absolute top-20 inset-x-0 bg-white border-b border-[#EAEAEA] shadow-lg">
          <nav className="flex flex-col px-6 py-4">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="py-3 text-sm font-medium text-black border-b border-[#EAEAEA] last:border-0"
              >
                {link.label}
              </a>
            ))}
            <div className="flex gap-3 pt-4">
              <a href="#cta" className="flex-1 text-center text-sm font-medium text-black border border-[#EAEAEA] px-4 py-2.5 rounded-lg">
                Login
              </a>
              <a href="#cta" className="flex-1 text-center text-sm font-semibold text-black bg-[#C7D62F] px-4 py-2.5 rounded-lg">
                Register
              </a>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}