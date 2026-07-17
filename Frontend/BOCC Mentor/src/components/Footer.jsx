import {
  Mail,
  Phone,
  MapPin,
  Twitter,
  Linkedin,
  Instagram,
  Github,
} from "lucide-react";

const columns = [
  {
    title: "Company",
    links: [
      { label: "For Mentors", href: "#cta" },
      { label: "For Learners", href: "#why-mentor" },
      { label: "For Investors", href: "#impact-stories" },
      { label: "For Incubators", href: "#workflow" },
      { label: "For Companies", href: "#commitments" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Startup Journey", href: "#workflow" },
      { label: "Success Stories", href: "#impact-stories" },
      { label: "FAQ", href: "#faq" },
      { label: "Events", href: "#cta" },
    ],
  },
];

const socials = [
  {
    icon: Twitter,
    href: "https://twitter.com",
    label: "Twitter",
  },
  {
    icon: Linkedin,
    href: "https://linkedin.com",
    label: "LinkedIn",
  },
  {
    icon: Instagram,
    href: "https://instagram.com",
    label: "Instagram",
  },
  {
    icon: Github,
    href: "https://github.com",
    label: "GitHub",
  },
];

export default function Footer() {
  return (
    <footer className="bg-black text-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Company */}
          <div className="lg:col-span-1">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-lg bg-white">
                {/* Inline fallback logo to avoid missing `logo` import */}
                <div className="flex h-10 w-10 items-center justify-center text-black font-semibold">AT</div>
              </div>

              <span className="text-lg font-semibold">
                Atior Technologies
              </span>
            </div>

            <p className="text-sm leading-relaxed text-white/60">
              Empowering startups, entrepreneurs, and students through
              mentorship, innovation, and technology-driven solutions.
            </p>
          </div>

          {/* Footer Links */}
          {columns.map((column) => (
            <div key={column.title}>
              <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider">
                {column.title}
              </h4>

              <ul className="space-y-3">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-white/60 transition-colors hover:text-[#C7D62F]"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact */}
          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider">
              Contact Us
            </h4>

            <ul className="space-y-3">
              <li>
                <a
                  href="mailto:hello@atiortechnologies.com"
                  className="flex items-center gap-3 text-sm text-white/60 transition-colors hover:text-[#C7D62F]"
                >
                  <Mail size={16} />
                  hello@atiortechnologies.com
                </a>
              </li>

              <li>
                <a
                  href="tel:+919999999999"
                  className="flex items-center gap-3 text-sm text-white/60 transition-colors hover:text-[#C7D62F]"
                >
                  <Phone size={16} />
                  +91 99999 99999
                </a>
              </li>

              <li className="flex items-start gap-3 text-sm text-white/60">
                <MapPin size={16} className="mt-0.5 flex-shrink-0" />

                <span>
                  Mumbai,
                  <br />
                  Maharashtra, India
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Social Icons */}
        <div className="mt-12 flex items-center gap-4 border-t border-white/10 pt-8">
          {socials.map((social) => {
            const Icon = social.icon;

            return (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 text-white/60 transition-all hover:border-[#C7D62F] hover:bg-[#C7D62F] hover:text-black"
              >
                <Icon size={18} />
              </a>
            );
          })}
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-6 lg:px-8 md:flex-row">
          <p className="text-xs text-white/40">
            © {new Date().getFullYear()} Atior Technologies. All rights
            reserved.
          </p>

          <div className="flex items-center gap-6">
            <a
              href="#"
              className="text-xs text-white/40 transition-colors hover:text-[#C7D62F]"
            >
              Privacy Policy
            </a>

            <a
              href="#"
              className="text-xs text-white/40 transition-colors hover:text-[#C7D62F]"
            >
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}