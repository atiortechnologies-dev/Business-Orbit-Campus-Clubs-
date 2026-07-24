import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const logo = new URL("../../assets/bocc-logo.png", import.meta.url).href;
const navLinks = ["Study", "Mentors", "Login", "Sign Up"];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={cn(
        "fixed top-0 inset-x-0 z-50 transition-colors duration-300",
        scrolled
          ? "bg-white/80 backdrop-blur-md border-b border-neutral-200"
          : "bg-transparent"
      )}
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="flex items-center justify-between h-16 md:h-20">

          <a href="/" className="flex items-center gap-3">
            <img
              src={logo}
              alt="BOCC Logo"
              className="h-12 w-12 object-contain"
            />

            <span className="hidden sm:block text-sm font-bold tracking-tight text-neutral-900 leading-tight">
              Business Orbit
              <br />
              Campus Club
            </span>

            <span className="hidden lg:inline-flex items-center text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#C8D400] text-neutral-900">
              BOCC
            </span>
          </a>

          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link}
                href="#"
                className={cn(
                  "text-sm font-medium tracking-tight transition-colors",
                  link === "Sign Up"
                    ? "px-4 py-2 bg-[#C8D400] text-neutral-900 font-semibold rounded-sm hover:bg-[#b5be00]"
                    : "text-neutral-600 hover:text-neutral-900"
                )}
              >
                {link}
              </a>
            ))}
          </nav>

          <button
            onClick={() => setOpen(!open)}
            className="md:hidden p-2 -mr-2 text-neutral-900"
            aria-label="Toggle menu"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>

        </div>
      </div>

      {open && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden bg-white border-t border-neutral-200"
        >
          <div className="px-6 py-4 flex flex-col gap-4">
            {navLinks.map((link) => (
              <a
                key={link}
                href="#"
                className="text-sm font-medium text-neutral-700"
              >
                {link}
              </a>
            ))}
          </div>
        </motion.div>
      )}
    </motion.header>
  );
}