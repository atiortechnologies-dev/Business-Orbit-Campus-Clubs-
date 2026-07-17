import { Twitter, Linkedin, Instagram, Github } from "lucide-react";

const columns = [
  {
    title: "For Students",
    links: ["For Mentors", "For Founders", "For Investors", "For Universities"],
  },
  {
    title: "Resources",
    links: ["Startup guide", "Investor deck", "FAQ", "Events"],
  },
];

const socials = [Twitter, Linkedin, Instagram, Github];

export default function Footer() {
  return (
    <footer className="bg-white border-t border-neutral-200">
      <div className="mx-auto max-w-7xl px-6 lg:px-10 py-16 md:py-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-12">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2">
              {/* Fallback inline logo SVG used when ../../assets/black_logo.png is unavailable */}
              <svg
                width="48"
                height="48"
                viewBox="0 0 48 48"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-auto"
                aria-label="BOCC Logo"
              >
                <rect width="48" height="48" rx="8" fill="#000" />
                <text x="50%" y="55%" textAnchor="middle" fill="#fff" fontSize="12" fontFamily="Arial, sans-serif" fontWeight="700">
                  BOCC
                </text>
              </svg>
            </div>
            <p className="mt-4 text-sm text-neutral-900 font-semibold">Business Orbit Campus Club</p>
            <p className="mt-1 text-sm text-neutral-500 leading-relaxed max-w-xs">
              The campus club where student founders turn ideas into venture-backed startups.
            </p>
            <div className="mt-6 flex items-center gap-3">
              {socials.map((Icon, idx) => (
                <a
                  key={idx}
                  href="#"
                  className="w-9 h-9 flex items-center justify-center rounded-sm border border-neutral-200 text-neutral-500 hover:text-neutral-900 hover:border-[#C8D400] hover:bg-[#C8D400]/10 transition-colors"
                  aria-label="social link"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="text-sm font-semibold text-neutral-900">{col.title}</h4>
              <ul className="mt-4 space-y-3">
                {col.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm text-neutral-500 hover:text-neutral-900 transition-colors"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h4 className="text-sm font-semibold text-neutral-900">Contact Us</h4>
            <ul className="mt-4 space-y-3 text-sm text-neutral-500">
              <li>
                <a href="mailto:hello@bocc.io" className="hover:text-neutral-900 transition-colors">
                  hello@bocc.io
                </a>
              </li>
              <li>
                <a href="tel:+10000000000" className="hover:text-neutral-900 transition-colors">
                  +1 (000) 000-0000
                </a>
              </li>
              <li className="leading-relaxed">
                100 Campus Drive
                <br />
                Innovation Hall, Suite 200
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 pt-8 border-t border-neutral-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-neutral-400">
            © {new Date().getFullYear()} Business Orbit Campus Club (BOCC). All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-xs text-neutral-400 hover:text-neutral-900 transition-colors">
              Privacy
            </a>
            <a href="#" className="text-xs text-neutral-400 hover:text-neutral-900 transition-colors">
              Terms
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}