import { useEffect, useState } from "react";
import { Wallet, Pencil } from "lucide-react";
import { Link } from "react-router-dom";
import InvestorShell from "@/components/investor/InvestorShell";
import ComingSoon from "@/components/ui/ComingSoon";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { getMyProfile } from "@/api/auth/profileApi";

// Read-only "what students/startups see" view — same fetch as
// Settings.jsx (getMyProfile), just rendered without inputs. Only shows
// fields Settings.jsx actually collects (Full Name, Organization/Fund,
// Investment Stage, Industry Focus); email/phone stay off this page on
// purpose — those are account details, not part of the public profile.
const ROLE = "investor";

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

export default function InvestorProfilePage() {
  useDocumentTitle("Investor Profile — BOCC");

  const [loading, setLoading] = useState(true);
  const [fullName, setFullName] = useState("");
  const [orgFund, setOrgFund] = useState("");
  const [investmentStage, setInvestmentStage] = useState("");
  const [industryFocus, setIndustryFocus] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const res = await getMyProfile(ROLE);
        const data = res?.data || res;
        if (data) {
          setFullName(data.fullName || data.full_name || "");
          setOrgFund(data.orgFund || data.organization || "");
          setInvestmentStage(data.investmentStage || "");
          setIndustryFocus(data.industryFocus || "");
        }
      } catch (err) {
        console.error("Failed to load investor profile:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <InvestorShell>
      <div className="mb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="font-poppins font-bold text-section text-text-heading mb-1">
            Investor Profile
          </h1>
          <p className="font-inter text-body text-text-muted">
            This is what students and startups see when they look you up.
          </p>
        </div>
        <Link
          to="/investor/settings"
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
              <div className="w-20 h-20 rounded-full bg-brand-black text-white overflow-hidden mb-3 flex items-center justify-center font-poppins font-semibold text-card">
                {initials(fullName || "Investor")}
              </div>
              <p className="font-poppins font-semibold text-card text-text-heading">
                {fullName || "—"}
              </p>
              {orgFund && (
                <p className="font-inter text-small text-text-muted">
                  {orgFund}
                </p>
              )}

              <ComingSoon
                label="Start Conversation"
                position="top"
                inline={false}
                className="w-full mt-5 flex items-center justify-center border border-border-subtle text-text-heading font-inter font-medium text-small px-4 py-2.5 rounded-md"
              >
                Start Conversation
              </ComingSoon>
            </div>
          </div>

          <div className="lg:col-span-8 flex flex-col gap-6">
            <section className="bg-surface-white border border-border-subtle rounded-xl shadow-card p-6">
              <h2 className="font-poppins font-semibold text-card text-text-heading mb-4">
                Investment Focus
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="font-inter text-caption font-semibold uppercase tracking-wider text-text-muted mb-1">
                    Investment Stage
                  </p>
                  <p className="font-inter text-small text-text-body">
                    {investmentStage || "Not set yet"}
                  </p>
                </div>
                <div>
                  <p className="font-inter text-caption font-semibold uppercase tracking-wider text-text-muted mb-1">
                    Industry Focus
                  </p>
                  <p className="font-inter text-small text-text-body">
                    {industryFocus || "Not set yet"}
                  </p>
                </div>
              </div>
              {!investmentStage && !industryFocus && (
                <p className="font-inter text-caption text-text-muted mt-4 flex items-center gap-1.5">
                  <Wallet size={14} strokeWidth={2} />
                  Fill these in from Settings so startups know what you're
                  looking for.
                </p>
              )}
            </section>
          </div>
        </div>
      )}
    </InvestorShell>
  );
}
