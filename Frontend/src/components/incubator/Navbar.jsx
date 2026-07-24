import { useScrollReveal } from "@/hooks/useScrollReveal";
import boccLogo from "@/assets/bocc-logo.png";

export default function Navbar() {
  const navRef = useScrollReveal("stagger");

  const links = [
    { label: "Startup Journey", href: "#lifecycle" },
    { label: "Programs", href: "#value" },
    { label: "Partners", href: "#stats" },
    { label: "Resources", href: "#faq" },
  ];

  return (
    <header
      ref={navRef}
      className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-[#EAEAEA] transition-shadow duration-300"
      id="navbar"
    >
      <nav className="max-w-7xl mx-auto px-6 lg:px-8 h-16 flex items-center justify-between">
        <a href="#" className="flex items-center gap-2.5 group">
          <img
            src={boccLogo}
            alt="BOCC Logo"
            className="h-9 w-auto"
          />

          <span className="font-heading font-semibold text-sm tracking-tight text-[#111111] hidden sm:block">
            Business Orbit Campus Club (BOCC) {" "}
            <span className="text-[#8a8a8a] font-normal">
              
            </span>
          </span>
        </a>

        <div className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm font-medium text-[#555] hover:text-[#111111] transition-colors relative group"
            >
              {link.label}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-lime-accent transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <a
            href="/login"
            className="hidden sm:inline-flex items-center text-sm font-medium text-[#111111] px-4 py-2 rounded-full hover:bg-[#FAFAFA] transition-colors"
          >
            Login
          </a>

          <a
            href="/register"
            className="inline-flex items-center text-sm font-semibold text-white bg-[#111111] px-5 py-2.5 rounded-full hover:bg-[#C6D82D] hover:text-[#111111] transition-all duration-300 shadow-sm hover:shadow-md"
          >
            Register
          </a>
        </div>
      </nav>
    </header>
  );
}