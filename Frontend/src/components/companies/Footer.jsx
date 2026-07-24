import { Mail, Phone, ArrowUpRight } from "lucide-react";
import {
  FaLinkedin,
  FaInstagram,
  FaFacebook,
  FaXTwitter,
} from "react-icons/fa6";

import boccLogo from "@/assets/bocc-logo.png";

const COLUMNS = [
  {
    title: "Resources",
    links: ["Startup Journey", "Success Stories", "FAQ", "Events"],
  },
  {
    title: "Programs",
    links: ["For Students", "For Mentors", "For Investors", "For Incubators"],
  },
  {
    title: "Partners",
    links: ["For Companies", "Colleges", "Startups", "Become a Mentor"],
  },
];

const SOCIALS = [
  { label: "LinkedIn", icon: FaLinkedin, href: "#" },
  { label: "Instagram", icon: FaInstagram, href: "#" },
  { label: "Facebook", icon: FaFacebook, href: "#" },
  { label: "X", icon: FaXTwitter, href: "#" },
];

export default function Footer() {
  return (
    <footer
      id="contact"
      className="border-t border-neutral-200 bg-white"
      aria-labelledby="footer-heading"
    >
      <h2 id="footer-heading" className="sr-only">
        Footer
      </h2>

      <div className="mx-auto max-w-[1440px] px-6 py-16 lg:px-10">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-4 lg:grid-cols-5">
          {/* Brand */}
          <div className="col-span-2 lg:col-span-2">
            <img
              src={boccLogo}
              alt="Business Orbit Campus Club logo"
              className="h-12 w-auto"
            />

            <p className="mt-5 max-w-xs text-sm leading-relaxed text-neutral-500">
              Business Orbit Campus Club — bridging the gap between campus and
              industry through one unified talent and innovation ecosystem.
            </p>

            <div className="mt-6 flex items-center gap-3">
              {SOCIALS.map((social) => {
                const Icon = social.icon;

                return (
                  <a
                    key={social.label}
                    href={social.href}
                    aria-label={social.label}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200 text-neutral-600 transition-colors hover:border-neutral-300 hover:bg-neutral-50 hover:text-neutral-900"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Links */}
          {COLUMNS.map((column) => (
            <div key={column.title}>
              <h3 className="text-sm font-semibold text-neutral-900">
                {column.title}
              </h3>

              <ul className="mt-4 space-y-3">
                {column.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm text-neutral-500 transition-colors hover:text-neutral-900"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Contact */}
        <div className="mt-12 grid grid-cols-1 gap-6 border-t border-neutral-100 pt-8 sm:grid-cols-2 lg:grid-cols-3">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200 text-neutral-700">
              <Mail className="h-4 w-4" />
            </span>

            <div>
              <p className="text-xs text-neutral-400">Email</p>

              <a
                href="mailto:hello@businessorbit.in"
                className="text-sm font-medium text-neutral-900 hover:text-neutral-700"
              >
                hello@businessorbit.in
              </a>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200 text-neutral-700">
              <Phone className="h-4 w-4" />
            </span>

            <div>
              <p className="text-xs text-neutral-400">Phone</p>

              <a
                href="tel:+910000000000"
                className="text-sm font-medium text-neutral-900 hover:text-neutral-700"
              >
                +91 00000 00000
              </a>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:col-span-2 lg:col-span-1">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-neutral-900 text-white">
              <ArrowUpRight className="h-4 w-4" />
            </span>

            <div>
              <p className="text-xs text-neutral-400">
                Technology Partner
              </p>

              <p className="text-sm font-medium text-neutral-900">
                Atior Technologies
              </p>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-neutral-100 pt-8 sm:flex-row">
          <p className="text-xs text-neutral-400">
            © {new Date().getFullYear()} Business Orbit Campus Club. Powered by
            Atior Technologies.
          </p>

          <div className="flex items-center gap-6">
            <a
              href="#"
              className="text-xs text-neutral-500 transition-colors hover:text-neutral-900"
            >
              Privacy Policy
            </a>

            <a
              href="#"
              className="text-xs text-neutral-500 transition-colors hover:text-neutral-900"
            >
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}