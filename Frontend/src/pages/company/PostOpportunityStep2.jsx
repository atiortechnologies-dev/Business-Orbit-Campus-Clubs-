import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { X, Plus, Info, AlertCircle } from "lucide-react";
import CompanyShell from "@/components/company/CompanyShell";
import PostOpportunityStepper from "@/components/company/PostOpportunityStepper";
import Button from "@/components/ui/Button";
import ComingSoon from "@/components/ui/ComingSoon";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { postOpportunityDraft, updateDraft } from "./postOpportunityDraft";
import api from "@/api/axiosInstance";

const EDUCATION_OPTIONS = [
  "Bachelor's Degree",
  "Master's Degree",
  "PhD",
  "High School",
];
const EXPERIENCE_OPTIONS = [
  "0-1 Years (Entry)",
  "1-3 Years",
  "3-5 Years",
  "5+ Years (Senior)",
];
const STARTUP_EXP_OPTIONS = ["Preferred", "Mandatory", "Not Required"];
const PASSING_YEARS = ["2023", "2024", "2025"];
const BRANCHES = [
  "Computer Science",
  "Information Technology",
  "Software Engineering",
];

export default function PostOpportunityStep2Page() {
  useDocumentTitle("Post Opportunity — Requirements — BOCC");
  const navigate = useNavigate();

  const [skills, setSkills] = useState(
    postOpportunityDraft.skills.length
      ? postOpportunityDraft.skills
      : ["React.js", "TypeScript", "Tailwind CSS"],
  );
  const [skillInput, setSkillInput] = useState("");
  const [education, setEducation] = useState(EDUCATION_OPTIONS[0]);
  const [cgpa, setCgpa] = useState("");
  const [passingYears, setPassingYears] = useState(["2023", "2024"]);
  const [experience, setExperience] = useState(EXPERIENCE_OPTIONS[0]);
  const [startupExp, setStartupExp] = useState(STARTUP_EXP_OPTIONS[0]);
  const [languages, setLanguages] = useState("");

  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const addSkill = (e) => {
    if (e.key !== "Enter" || !skillInput.trim()) return;
    e.preventDefault();
    setSkills((prev) => [...prev, skillInput.trim()]);
    setSkillInput("");
  };
  const removeSkill = (skill) =>
    setSkills((prev) => prev.filter((s) => s !== skill));
  const togglePassingYear = (year) =>
    setPassingYears((prev) =>
      prev.includes(year) ? prev.filter((y) => y !== year) : [...prev, year],
    );

  const canProceed = skills.length > 0;

  const handleNext = () => {
    if (!canProceed) return;
    updateDraft({ skills });
    navigate("/company/post-opportunity/step-3");
  };

  const handleSaveDraft = async () => {
    try {
      setErrorMsg("");
      setSuccessMsg("");
      await api.post("/opportunities/drafts", {
        ...postOpportunityDraft,
        skills,
        education,
        cgpa,
        passingYears,
        experience,
        startupExp,
        languages,
      });
      setSuccessMsg("Draft saved successfully.");
    } catch (err) {
      console.error("Failed to save draft:", err);
      setErrorMsg(
        err?.response?.data?.message || err?.message || "Failed to save draft.",
      );
    }
  };

  return (
    <CompanyShell>
      <div className="mb-2">
        <h1 className="font-poppins font-semibold text-page text-text-heading">
          Post New Opportunity
        </h1>
      </div>

      <PostOpportunityStepper current={2} />

      {errorMsg && (
        <div className="mt-4 p-3 bg-error/15 border border-error/30 text-error rounded-md text-small flex items-center gap-2">
          <AlertCircle size={16} className="shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}
      {successMsg && (
        <div className="mt-4 p-3 bg-success/15 border border-success/30 text-success rounded-md text-small flex items-center gap-2">
          <AlertCircle size={16} className="shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      <div className="bg-surface-white border border-border-subtle rounded-lg overflow-hidden mt-4">
        <div className="p-6 border-b border-divider-line">
          <h3 className="font-poppins font-semibold text-body text-text-heading">
            Candidate Eligibility
          </h3>
          <p className="font-inter text-small text-text-muted mt-1">
            Define the minimum criteria for this role to filter high-quality
            applicants.
          </p>
        </div>
        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
          <div className="md:col-span-2 flex flex-col gap-1">
            <label className="text-caption font-medium text-text-heading font-inter">
              Required Skills <span className="text-error">*</span>
            </label>
            <div className="flex flex-wrap gap-2 p-3 border border-border-subtle rounded-lg bg-surface-white focus-within:border-brand-black transition-all">
              {skills.map((s) => (
                <span
                  key={s}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-canvas-bg rounded-full font-inter text-small text-text-heading"
                >
                  {s}
                  <button
                    type="button"
                    onClick={() => removeSkill(s)}
                    className="hover:text-error transition-colors"
                  >
                    <X size={14} strokeWidth={2} />
                  </button>
                </span>
              ))}
              <input
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={addSkill}
                type="text"
                placeholder="Type a skill and press Enter..."
                className="flex-1 min-w-[180px] border-none focus:ring-0 p-0 font-inter text-small bg-transparent outline-none"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-caption font-medium text-text-heading font-inter">
              Minimum Education <span className="text-error">*</span>
            </label>
            <select
              value={education}
              onChange={(e) => setEducation(e.target.value)}
              className="w-full rounded-md border border-border-subtle bg-surface-white text-sm text-text-body font-inter min-h-[44px] px-3 focus:outline-none focus:border-brand-black focus:ring-1 focus:ring-brand-black transition-all"
            >
              {EDUCATION_OPTIONS.map((o) => (
                <option key={o}>{o}</option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-caption font-medium text-text-heading font-inter">
              Minimum CGPA (Scale of 10)
            </label>
            <input
              value={cgpa}
              onChange={(e) => setCgpa(e.target.value)}
              type="number"
              step="0.1"
              placeholder="e.g. 7.5"
              className="w-full rounded-md border border-border-subtle bg-surface-white text-sm text-text-body font-inter min-h-[44px] px-3 focus:outline-none focus:border-brand-black focus:ring-1 focus:ring-brand-black transition-all"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-caption font-medium text-text-heading font-inter">
              Eligible Passing Years
            </label>
            <div className="flex flex-wrap gap-2">
              {PASSING_YEARS.map((y) => (
                <button
                  key={y}
                  type="button"
                  onClick={() => togglePassingYear(y)}
                  className={`px-4 py-2 border rounded-lg font-inter text-small transition-all ${passingYears.includes(y) ? "bg-brand-black text-white border-brand-black" : "border-border-subtle text-text-body"}`}
                >
                  {y}
                </button>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-caption font-medium text-text-heading font-inter">
              Experience Required (Years)
            </label>
            <select
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              className="w-full rounded-md border border-border-subtle bg-surface-white text-sm text-text-body font-inter min-h-[44px] px-3 focus:outline-none focus:border-brand-black focus:ring-1 focus:ring-brand-black transition-all"
            >
              {EXPERIENCE_OPTIONS.map((o) => (
                <option key={o}>{o}</option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2 flex flex-col gap-1">
            <label className="text-caption font-medium text-text-heading font-inter">
              Eligible Branches
            </label>
            <div className="flex flex-wrap gap-2 p-3 border border-border-subtle rounded-lg bg-surface-white">
              {BRANCHES.map((b) => (
                <span
                  key={b}
                  className="px-3 py-1 bg-canvas-bg rounded-full font-inter text-small text-text-heading"
                >
                  {b}
                </span>
              ))}
              <ComingSoon label="Add Branch" position="top" inline>
                <span className="inline-flex items-center gap-1 px-3 py-1 border border-dashed border-border-subtle rounded-full font-inter text-small text-text-muted">
                  <Plus size={14} strokeWidth={2} /> Add Branch
                </span>
              </ComingSoon>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-caption font-medium text-text-heading font-inter">
              Previous Startup Experience
            </label>
            <select
              value={startupExp}
              onChange={(e) => setStartupExp(e.target.value)}
              className="w-full rounded-md border border-border-subtle bg-surface-white text-sm text-text-body font-inter min-h-[44px] px-3 focus:outline-none focus:border-brand-black focus:ring-1 focus:ring-brand-black transition-all"
            >
              {STARTUP_EXP_OPTIONS.map((o) => (
                <option key={o}>{o}</option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-caption font-medium text-text-heading font-inter">
              Languages
            </label>
            <input
              value={languages}
              onChange={(e) => setLanguages(e.target.value)}
              type="text"
              placeholder="e.g. English, Spanish, Hindi"
              className="w-full rounded-md border border-border-subtle bg-surface-white text-sm text-text-body font-inter min-h-[44px] px-3 focus:outline-none focus:border-brand-black focus:ring-1 focus:ring-brand-black transition-all"
            />
          </div>
        </div>

        <div className="p-6 border-t border-divider-line flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate("/company/post-opportunity/step-1")}
            className="px-6 py-2.5 font-inter font-semibold text-small text-text-muted hover:text-text-heading transition-colors"
          >
            Previous
          </button>
          <div className="flex gap-3">
            <Button variant="outline" onClick={handleSaveDraft}>
              Save Draft
            </Button>
            <Button onClick={handleNext} disabled={!canProceed}>
              Next Step
            </Button>
          </div>
        </div>
      </div>

      <div className="mt-6 flex gap-4 p-4 bg-canvas-bg border border-border-subtle rounded-lg">
        <Info
          size={18}
          strokeWidth={2}
          className="text-text-muted shrink-0 mt-0.5"
        />
        <div>
          <h4 className="font-poppins font-semibold text-small text-text-heading">
            Pro Tip
          </h4>
          <p className="font-inter text-small text-text-muted mt-0.5">
            Defining clear eligibility criteria can reduce manual screening time
            by up to 60%.
          </p>
        </div>
      </div>
    </CompanyShell>
  );
}
