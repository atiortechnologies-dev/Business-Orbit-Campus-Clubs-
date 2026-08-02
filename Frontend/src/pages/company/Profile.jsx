import { useEffect, useState } from "react";
import { Building2, Pencil, Globe } from "lucide-react";
import { Link } from "react-router-dom";
import CompanyShell from "@/components/company/CompanyShell";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { getMyProfile } from "@/api/auth/profileApi";

// Read-only "what applicants see" view — same fetch as Settings.jsx
// (getMyProfile), rendered without inputs. Headlines with the company
// name, not the account holder's name — applicants are evaluating the
// company, not the person who filled the form in. Email/phone stay off
// this page on purpose, same reasoning as Investor's Profile page.
const ROLE = "company";

function initials(name) {
  return (
    name
      .trim()
      .split(/\s+/)
      .map((p) => p[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() || "?"
  );
}

export default function CompanyProfilePage() {
  useDocumentTitle("Company Profile — BOCC");

  const [loading, setLoading] = useState(true);
  const [companyName, setCompanyName] = useState("");
  const [industry, setIndustry] = useState("");
  const [size, setSize] = useState("");
  const [website, setWebsite] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const res = await getMyProfile(ROLE);
        const data = res?.data || res;
        if (data) {
          setCompanyName(data.companyName || data.company_name || "");
          setIndustry(data.industry || "");
          setSize(data.size || data.companySize || "");
          setWebsite(data.website || "");
        }
      } catch (err) {
        console.error("Failed to load company profile:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <CompanyShell>
      <div className="mb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="font-poppins font-bold text-section text-text-heading mb-1">
            Company Profile
          </h1>
          <p className="font-inter text-body text-text-muted">
            This is what applicants see when they look up your company.
          </p>
        </div>
        <Link
          to="/company/settings"
          className="inline-flex items-center gap-2 border border-border-subtle text-text-heading font-inter font-medium text-small px-4 py-2.5 rounded-md hover:bg-canvas-bg transition-colors shrink-0"
        >
          <Pencil size={16} strokeWidth={2} />
          Edit Settings
        </Link>
      </div>

      {loading ? (
        <div className="bg-surface-white border border-border-subtle rounded-xl shadow-card p-6 font-inter text-small text-text-muted">
          Loading profile...
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-4 bg-surface-white border border-border-subtle rounded-xl shadow-card p-6 h-fit">
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-gray-700 to-brand-black text-white overflow-hidden mb-3 flex items-center justify-center font-poppins font-semibold text-card">
                {initials(companyName || "Company")}
              </div>
              <p className="font-poppins font-semibold text-card text-text-heading">
                {companyName || "—"}
              </p>
              {industry && (
                <p className="font-inter text-small text-text-muted">
                  {industry}
                </p>
              )}
              {website && (
                <a
                  href={
                    website.startsWith("http") ? website : `https://${website}`
                  }
                  target="_blank"
                  rel="noreferrer"
                  className="mt-3 inline-flex items-center gap-1.5 font-inter text-caption text-text-heading hover:underline"
                >
                  <Globe size={14} strokeWidth={2} />
                  {website}
                </a>
              )}
            </div>
          </div>

          <div className="lg:col-span-8 flex flex-col gap-6">
            <section className="bg-surface-white border border-border-subtle rounded-xl shadow-card p-6">
              <h2 className="font-poppins font-semibold text-card text-text-heading mb-4">
                Company Overview
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="font-inter text-caption font-semibold uppercase tracking-wider text-text-muted mb-1">
                    Industry
                  </p>
                  <p className="font-inter text-small text-text-body">
                    {industry || "Not set yet"}
                  </p>
                </div>
                <div>
                  <p className="font-inter text-caption font-semibold uppercase tracking-wider text-text-muted mb-1">
                    Size of Organization
                  </p>
                  <p className="font-inter text-small text-text-body">
                    {size || "Not set yet"}
                  </p>
                </div>
              </div>
              {!industry && !size && (
                <p className="font-inter text-caption text-text-muted mt-4 flex items-center gap-1.5">
                  <Building2 size={14} strokeWidth={2} />
                  Fill these in from Settings so applicants know who they'd
                  be working with.
                </p>
              )}
            </section>
          </div>
        </div>
      )}
    </CompanyShell>
  );
}
