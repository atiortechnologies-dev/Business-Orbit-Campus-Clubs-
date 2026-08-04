import { Link } from "react-router-dom";
import Logo from "@/components/ui/Logo";
import ComingSoon from "@/components/ui/ComingSoon";

const COLUMNS = [
  { title: "Company", items: ["About Us", "Careers", "Press", "Contact"] },
  { title: "Resources", items: ["Events", "Stories", "Blog", "Support"] },
];

export default function Footer() {
  return (
    <footer className="bg-surface-white border-t border-border-subtle">
      <div className="max-w-7xl mx-auto px-5 lg:px-10 py-14 grid gap-10 lg:grid-cols-4">
        <div>
          <Logo variant="horizontal" size={28} />
          <p className="mt-3 font-inter text-small text-text-muted max-w-xs">
            Building the world's largest network for campus-born startups.
          </p>
        </div>

        {COLUMNS.map((col) => (
          <div key={col.title}>
            <h3 className="font-poppins font-semibold text-small text-text-heading">
              {col.title}
            </h3>
            <ul className="mt-4 space-y-2 font-inter text-small text-text-muted">
              {col.items.map((item) => (
                <li key={item}>
                  <ComingSoon label={item} position="top" inline>
                    <span className="hover:text-text-heading transition-colors">
                      {item}
                    </span>
                  </ComingSoon>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div>
          <h3 className="font-poppins font-semibold text-small text-text-heading">
            Legal
          </h3>
          <ul className="mt-4 space-y-2 font-inter text-small text-text-muted">
            <li>
              <Link
                to="/legal/privacy-policy"
                className="hover:text-text-heading transition-colors"
              >
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link
                to="/legal/privacy-policy"
                className="hover:text-text-heading transition-colors"
              >
                Terms of Service
              </Link>
            </li>
            <li>
              <ComingSoon label="Cookie Policy" position="top" inline>
                <span className="hover:text-text-heading transition-colors">
                  Cookie Policy
                </span>
              </ComingSoon>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border-subtle">
        <div className="max-w-7xl mx-auto px-5 lg:px-10 py-6 flex flex-wrap items-center justify-between gap-4 font-inter text-caption text-text-muted">
          <span>© 2026 Business Orbit Campus Clubs. All rights reserved.</span>
        </div>
      </div>
    </footer>
  );
}
