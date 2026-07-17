import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { LogoLockup } from "./Logo";

const nav = [
  { label: "Startup Journey", href: "#journey" },
  { label: "Investors", href: "#investors" },
  { label: "Resources", href: "#resources" },
  { label: "Partners", href: "#partners" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={`sticky top-0 z-50 w-full border-b transition-all ${
        scrolled ? "bg-background/85 backdrop-blur-md shadow-[0_1px_0_rgba(0,0,0,0.04)]" : "bg-background border-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <LogoLockup compact />
        <nav className="hidden items-center gap-8 md:flex">
          {nav.map((n) => (
            <a key={n.label} href={n.href} className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              {n.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <a href="#login" className="hidden text-sm text-muted-foreground hover:text-foreground md:inline-block px-3 py-2">Login</a>
          <a href="#register" className="rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background transition-colors hover:bg-accent hover:text-accent-foreground">
            Register
          </a>
        </div>
      </div>
    </motion.header>
  );
}