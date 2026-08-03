import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Pencil, Link2, GraduationCap } from "lucide-react";
import DashboardShell from "@/components/dashboard/DashboardShell";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { getStudentProfile } from "@/api/dashboardApi";

// Read-only "what mentors/investors/incubators see" view — same fetch as
// Settings.jsx (getStudentProfile), rendered without inputs. Email/phone
// stay off this page on purpose, same reasoning as every other role's
// Profile page in this batch.
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

export default function StudentProfilePage() {
  useDocumentTitle("Profile — BOCC");

  const [loading, setLoading] = useState(true);
  const [fullName, setFullName] = useState("");
  const [college, setCollege] = useState("");
  const [branch, setBranch] = useState("");
  const [gradYear, setGradYear] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [portfolio, setPortfolio] = useState("");
  const [skills, setSkills] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await getStudentProfile();
        const data = res?.data || res;
        const userObj = data?.user || {};
        const profileObj = data?.profile || {};

        setFullName(userObj?.full_name || "");
        setCollege(profileObj?.college || profileObj?.college_name || "");
        setBranch(profileObj?.degree || profileObj?.branch || "");
        setGradYear(profileObj?.graduation_year || "");
        setLinkedin(profileObj?.linkedin_url || "");
        setPortfolio(profileObj?.portfolio_url || "");
        setSkills(profileObj?.skills || []);
      } catch (err) {
        console.error("Failed to load student profile:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <DashboardShell>
      <div className="mb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="font-poppins font-bold text-section text-text-heading mb-1">
            Profile
          </h1>
          <p className="font-inter text-body text-text-muted">
            This is what mentors, investors and incubators see when they
            look you up.
          </p>
        </div>
        <Link
          to="/settings"
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
              <div className="w-20 h-20 rounded-full bg-canvas-bg border border-border-subtle overflow-hidden mb-3 flex items-center justify-center font-poppins font-bold text-text-heading text-card">
                {initials(fullName || "Student")}
              </div>
              <p className="font-poppins font-semibold text-card text-text-heading">
                {fullName || "—"}
              </p>
              {college && (
                <p className="font-inter text-small text-text-muted">
                  {college}
                </p>
              )}

              <div className="w-full mt-5 flex flex-col gap-2">
                {linkedin && (
                  <a
                    href={linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 font-inter text-caption text-text-heading hover:underline"
                  >
                    <Link2 size={14} strokeWidth={2} />
                    LinkedIn
                  </a>
                )}
                {portfolio && (
                  <a
                    href={portfolio}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 font-inter text-caption text-text-heading hover:underline"
                  >
                    <Link2 size={14} strokeWidth={2} />
                    Portfolio
                  </a>
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-8 flex flex-col gap-6">
            <section className="bg-surface-white border border-border-subtle rounded-xl shadow-card p-6">
              <h2 className="font-poppins font-semibold text-card text-text-heading mb-4">
                Education
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="font-inter text-caption font-semibold uppercase tracking-wider text-text-muted mb-1">
                    Branch / Degree
                  </p>
                  <p className="font-inter text-small text-text-body">
                    {branch || "Not set yet"}
                  </p>
                </div>
                <div>
                  <p className="font-inter text-caption font-semibold uppercase tracking-wider text-text-muted mb-1">
                    Graduation Year
                  </p>
                  <p className="font-inter text-small text-text-body">
                    {gradYear || "Not set yet"}
                  </p>
                </div>
              </div>
            </section>

            <section className="bg-surface-white border border-border-subtle rounded-xl shadow-card p-6">
              <h2 className="font-poppins font-semibold text-card text-text-heading mb-4">
                Skills
              </h2>
              {skills.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {skills.map((item) => (
                    <span
                      key={item}
                      className="font-inter text-caption bg-accent-neon/15 text-text-heading px-2.5 py-1 rounded-full"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="font-inter text-caption text-text-muted flex items-center gap-1.5">
                  <GraduationCap size={14} strokeWidth={2} />
                  Add skills from Settings so mentors know what you bring.
                </p>
              )}
            </section>
          </div>
        </div>
      )}
    </DashboardShell>
  );
}
