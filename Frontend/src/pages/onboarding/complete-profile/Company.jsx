import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Building2 } from "lucide-react";
import CompleteProfileShell from "@/components/onboarding/CompleteProfileShell";
import TextAreaField from "@/components/onboarding/TextAreaField";
import TagInput from "@/components/onboarding/TagInput";
import CheckboxPills from "@/components/onboarding/CheckboxPills";
import SelectField from "@/components/onboarding/SelectField";
import Input from "@/components/ui/Input";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { createProfile, skipProfile } from "@/api/auth/profileApi";

const INDUSTRIES = [
  "Technology",
  "Finance",
  "Healthcare",
  "Retail / E-commerce",
  "Education",
  "Manufacturing",
  "Other",
];
const COMPANY_SIZES = [
  "1-10 employees",
  "11-50 employees",
  "51-200 employees",
  "201-1000 employees",
  "1000+ employees",
];
const OPPORTUNITY_TYPES = [
  "Internships",
  "Freelancing",
  "Part-time Roles",
  "Full-time Graduate Roles",
  "Project Based",
];

const ROLE = "company";

export default function CompleteProfileCompany() {
  useDocumentTitle("Complete Your Profile — BOCC");
  const navigate = useNavigate();

  const [logoPreview, setLogoPreview] = useState(null);
  const [companyName, setCompanyName] = useState("");
  const [industry, setIndustry] = useState("");
  const [companySize, setCompanySize] = useState("");
  const [website, setWebsite] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [bio, setBio] = useState("");
  const [hiringCategories, setHiringCategories] = useState([
    "Software Engineering",
    "Product Marketing",
  ]);
  const [studentSkills, setStudentSkills] = useState([
    "Leadership",
    "Agile Project Management",
  ]);
  const [opportunityTypes, setOpportunityTypes] = useState([]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) setLogoPreview(URL.createObjectURL(file));
  };

  const toggleOpportunity = (type) =>
    setOpportunityTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type],
    );

  const handleSave = async () => {
    setError("");
    setIsSubmitting(true);

    // Formats body to match commonProfileFields + companyCompleteFields Zod schema
    const formData = {
      bio: bio.trim(),
      skills: studentSkills, // Satisfies commonProfileFields skills requirement
      linkedin_url: linkedin.trim(),
      portfolio_url: website.trim(),
      profile_photo: "",
      // Role-specific field matching companyCompleteFields
      hiring_domains: hiringCategories,
    };

    try {
      const res = await createProfile(ROLE, formData);
      setSaved(true);

      const destination =
        res?.data?.redirect_to || res?.redirect_to || "/company/dashboard";

      setTimeout(() => {
        navigate(destination, { replace: true });
      }, 800);
    } catch (err) {
      setError(err.message || "Failed to save profile. Please try again.");
      setIsSubmitting(false);
    }
  };

  const handleSkip = async () => {
    setError("");
    setIsSubmitting(true);

    try {
      const res = await skipProfile(ROLE);
      const destination =
        res?.data?.redirect_to || res?.redirect_to || "/company/dashboard";

      navigate(destination, { replace: true });
    } catch (err) {
      setError(err.message || "Failed to skip profile completion.");
      setIsSubmitting(false);
    }
  };

  return (
    <CompleteProfileShell
      title="Complete Company Profile"
      subtitle="Finish setting up your company presence in the Business Orbit ecosystem."
      photoLabel="Company Logo"
      photoIcon={Building2}
      photoPreview={logoPreview}
      onPhotoChange={handleLogoChange}
      onSave={handleSave}
      onSkip={handleSkip}
      saved={saved}
      isSubmitting={isSubmitting}
      canSave={
        bio.trim().length >= 10 &&
        hiringCategories.length > 0 &&
        studentSkills.length > 0 &&
        linkedin.includes("linkedin.com") &&
        !isSubmitting
      }
    >
      {error && (
        <div className="p-3 bg-error/15 border border-error/30 text-error rounded-md text-small">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          id="companyName"
          label="Company Name"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          placeholder="e.g. Orbit Tech Solutions"
          disabled={isSubmitting}
        />
        <SelectField
          id="industry"
          label="Industry"
          value={industry}
          onChange={(e) => setIndustry(e.target.value)}
          options={INDUSTRIES}
          placeholder="Select industry"
          disabled={isSubmitting}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <SelectField
          id="companySize"
          label="Company Size"
          value={companySize}
          onChange={(e) => setCompanySize(e.target.value)}
          options={COMPANY_SIZES}
          placeholder="Number of employees"
          disabled={isSubmitting}
        />
        <Input
          id="website"
          label="Company Website URL"
          type="url"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
          placeholder="https://..."
          disabled={isSubmitting}
        />
      </div>

      <TextAreaField
        id="bio"
        label="Company Mission & Bio *"
        value={bio}
        onChange={(e) => setBio(e.target.value)}
        placeholder="Tell us about your company values, background and what you look for in campus leaders... (min 10 chars)"
        rows={5}
        disabled={isSubmitting}
      />

      <TagInput
        id="hiringCategories"
        label="Hiring Categories / Domains *"
        tags={hiringCategories}
        onChange={setHiringCategories}
        placeholder="Type a category and press enter..."
        disabled={isSubmitting}
      />

      <TagInput
        id="studentSkills"
        label="Preferred Student Skills *"
        tags={studentSkills}
        onChange={setStudentSkills}
        placeholder="Type a skill (e.g. Python, Strategy) and press enter..."
        disabled={isSubmitting}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          id="linkedin"
          label="LinkedIn Company URL *"
          type="url"
          value={linkedin}
          onChange={(e) => setLinkedin(e.target.value)}
          placeholder="https://linkedin.com/company/..."
          disabled={isSubmitting}
        />
        <CheckboxPills
          label="Types of Opportunities Offered"
          options={OPPORTUNITY_TYPES}
          selected={opportunityTypes}
          onToggle={toggleOpportunity}
          disabled={isSubmitting}
        />
      </div>
    </CompleteProfileShell>
  );
}
