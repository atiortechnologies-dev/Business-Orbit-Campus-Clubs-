import { useState } from "react";
import { Menu, X } from "lucide-react";
import { motion } from "framer-motion";
import logo from "../../assets/bocc-logo.png";
// Logo image was causing module resolution errors in some environments.
// Use a simple text fallback to avoid build errors when the asset isn't available.

const links = ["About", "Startup Stories", "Community", "Investor Access", "FAQ", "Contact"];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 bg-[#f5f4f0]/80 backdrop-blur-md border-b border-black/5">
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-5 lg:px-10 h-16">
        <a href="#" className="flex items-center gap-2">
          <img src={logo} alt="BOCC Logo" className="h-9 w-auto" />
        </a>
        <ul className="hidden lg:flex items-center gap-8 text-sm text-neutral-700">
          {links.map((l) => (
            <li key={l}>
              <a href="#" className="hover:text-black transition-colors">{l}</a>
            </li>
          ))}
        </ul>
        <div className="hidden lg:flex items-center gap-3">
          <a href="#" className="text-sm text-neutral-700 hover:text-black">Login</a>
          <a href="#" className="text-sm bg-brand text-brand-foreground px-4 py-2 rounded-md font-semibold hover:brightness-95 transition-all">Explore</a>
        </div>
        <button className="lg:hidden" onClick={() => setOpen(!open)} aria-label="Menu">
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>
      {open && (
        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} className="lg:hidden border-t border-black/5 bg-[#f5f4f0]">
          <ul className="flex flex-col px-5 py-4 gap-3 text-sm">
            {links.map((l) => (
              <li key={l}><a href="#" className="block py-1">{l}</a></li>
            ))}
            <li className="pt-2 flex gap-3">
              <a href="#" className="text-sm">Login</a>
              <a href="#" className="text-sm bg-black text-white px-4 py-2 rounded-md">Explore</a>
            </li>
          </ul>
        </motion.div>
      )}
    </header>
  );
}