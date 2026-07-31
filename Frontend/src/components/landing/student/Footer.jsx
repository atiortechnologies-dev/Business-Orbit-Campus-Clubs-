import { Link } from "react-router-dom";
import { Share2 } from "lucide-react";
import Logo from "@/components/ui/Logo";
import ComingSoon from "@/components/ui/ComingSoon";

// Real cross-links to the other role landing pages — every one of these
// has an actual /landing/<role> destination now, so there's no reason for
// them to be stubs. ("For Founders"/"For Universities" in the original
// copy were redundant with this page and an unclear mapping respectively;
// renamed to the roles that actually exist.)
const ROLE_LINKS = [
  { label: "Mentors", href: "/landing/mentor" },
  { label: "Investors", href: "/landing/investor" },
  { label: "Companies", href: "/landing/companies" },
  { label: "Incubators", href: "/landing/incubator" },
];

export default function Footer() {
  return (
    <footer className="bg-surface-white border-t border-border-subtle">
      <div className="mx-auto max-w-7xl px-6 lg:px-10 py-16 md:py-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-12">
          <div className="col-span-2 md:col-span-1">
            <Logo variant="horizontal" size={32} />
            <p className="mt-4 font-inter text-small text-text-muted leading-relaxed max-w-xs">
              The campus club where student founders turn ideas into
              venture-backed startups.
            </p>
            <div className="mt-6">
              <ComingSoon
                label="Follow us"
                position="top"
                inline
                className="inline-flex items-center gap-2 border border-border-subtle text-text-body px-3 py-1.5 rounded-full font-inter text-caption"
              >
                <Share2 size={14} strokeWidth={2} />
                Follow us
              </ComingSoon>
            </div>
          </div>

          <div>
            <h4 className="font-poppins font-semibold text-small text-text-heading">
              Explore by Role
            </h4>
            <ul className="mt-4 space-y-3">
              {ROLE_LINKS.map((l) => (
                <li key={l.label}>
                  <Link
                    to={l.href}
                    className="font-inter text-small text-text-muted hover:text-text-heading transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-poppins font-semibold text-small text-text-heading">
              Resources
            </h4>
            <ul className="mt-4 space-y-3">
              <li>
                <a
                  href="#faq"
                  className="font-inter text-small text-text-muted hover:text-text-heading transition-colors"
                >
                  FAQ
                </a>
              </li>
              <li>
                <ComingSoon label="Startup Guide" position="top" inline>
                  <span className="font-inter text-small text-text-muted">
                    Startup Guide
                  </span>
                </ComingSoon>
              </li>
              <li>
                <ComingSoon label="Investor Deck" position="top" inline>
                  <span className="font-inter text-small text-text-muted">
                    Investor Deck
                  </span>
                </ComingSoon>
              </li>
              <li>
                <ComingSoon label="Events" position="top" inline>
                  <span className="font-inter text-small text-text-muted">
                    Events
                  </span>
                </ComingSoon>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-poppins font-semibold text-small text-text-heading">
              Contact Us
            </h4>
            <ul className="mt-4 space-y-3 font-inter text-small text-text-muted">
              <li>
                <a
                  href="mailto:hello@bocc.co"
                  className="hover:text-text-heading transition-colors"
                >
                  hello@bocc.co
                </a>
              </li>
              <li className="leading-relaxed">
                Innovation Hub, Global Campus Nexus
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 pt-8 border-t border-border-subtle flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-inter text-caption text-text-muted">
            © 2024 Business Orbit Campus Clubs (BOCC). All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link
              to="/legal/privacy-policy"
              className="font-inter text-caption text-text-muted hover:text-text-heading transition-colors"
            >
              Privacy
            </Link>
            <Link
              to="/legal/privacy-policy"
              className="font-inter text-caption text-text-muted hover:text-text-heading transition-colors"
            >
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
