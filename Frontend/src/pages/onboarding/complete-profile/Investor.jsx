import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CompleteProfileShell from "@/components/onboarding/CompleteProfileShell";
import TextAreaField from "@/components/onboarding/TextAreaField";
import TagInput from "@/components/onboarding/TagInput";
import CheckboxPills from "@/components/onboarding/CheckboxPills";
import SelectField from "@/components/onboarding/SelectField";
import Input from "@/components/ui/Input";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { skipProfile, createProfile } from "@/api/auth/profileApi";
import { uploadToCloudinary } from "@/api/uploadApi";

const INVESTMENT_STAGES = ["Idea", "Pre-Seed", "Seed", "Series A+"];
const INVESTOR_TYPES = ["Angel", "VC", "Corporate"];

const ROLE = "investor";

export default function CompleteProfileInvestor() {
  useDocumentTitle("Complete Your Profile — BOCC");
  const navigate = useNavigate();

  const [selectedFile, setSelectedFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [firm, setFirm] = useState("");
  const [designation, setDesignation] = useState("");
  const [investorType, setInvestorType] = useState("Angel");
  const [bio, setBio] = useState("");
  const [stages, setStages] = useState([]);
  const [industries, setIndustries] = useState(["SaaS", "FinTech"]);
  const [investmentRange, setInvestmentRange] = useState("");
  const [geoPreference, setGeoPreference] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [portfolio, setPortfolio] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPhotoPreview(URL.createObjectURL(file)); // Show local instant preview
    }
  };

  const toggleStage = (stage) =>
    setStages((prev) =>
      prev.includes(stage) ? prev.filter((s) => s !== stage) : [...prev, stage],
    );

  const handleSave = async () => {
    setError("");
    setIsSubmitting(true);

    try {
      let photoUrl = "";

      // 1. Upload photo via signed Cloudinary request if chosen
      if (selectedFile) {
        photoUrl = await uploadToCloudinary(selectedFile, "investor_profiles");
      }

      // 2. Mapped to commonProfileFields + investorCompleteFields Zod schema
      const formData = {
        organization: firm.trim(),
        designation: designation.trim(),
        bio: bio.trim(),
        skills: industries, // Satisfies commonProfileFields skills requirement
        linkedin_url: linkedin.trim(),
        portfolio_url: portfolio.trim(),
        profile_photo: photoUrl,
        attachment_url: photoUrl,
        // Role-specific fields matching investorCompleteFields
        investor_type: investorType,
        investment_sectors: industries,
        preferred_startup_stages: stages,
        investment_range: investmentRange.trim(),
        geographic_preference: geoPreference.trim(),
      };

      // 3. Persist profile via MongoDB backend
      const res = await createProfile(ROLE, formData);
      setSaved(true);

      const destination =
        res?.data?.redirect_to || res?.redirect_to || "/investor";

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
        res?.data?.redirect_to || res?.redirect_to || "/investor";

      navigate(destination, { replace: true });
    } catch (err) {
      setError(err.message || "Failed to skip profile completion.");
      setIsSubmitting(false);
    }
  };

  return (
    <CompleteProfileShell
      title="Complete Your Profile"
      subtitle="Finalize your investor credentials in the Business Orbit ecosystem."
      photoPreview={photoPreview}
      onPhotoChange={handlePhotoChange}
      onSave={handleSave}
      onSkip={handleSkip}
      saved={saved}
      isSubmitting={isSubmitting}
      canSave={
        bio.trim().length >= 10 && industries.length > 0 && !isSubmitting
      }
    >
      {error && (
        <div className="p-3 bg-error/15 border border-error/30 text-error rounded-md text-small">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          id="firm"
          label="Investment Firm / Organization"
          value={firm}
          onChange={(e) => setFirm(e.target.value)}
          placeholder="e.g. Orbit Capital"
          disabled={isSubmitting}
        />
        <Input
          id="designation"
          label="Designation"
          value={designation}
          onChange={(e) => setDesignation(e.target.value)}
          placeholder="e.g. Managing Director"
          disabled={isSubmitting}
        />
      </div>

      <SelectField
        id="investorType"
        label="Investor Type *"
        value={investorType}
        onChange={(e) => setInvestorType(e.target.value)}
        options={INVESTOR_TYPES}
        placeholder="Select investor type"
        disabled={isSubmitting}
      />

      <TextAreaField
        id="bio"
        label="Investor Bio *"
        value={bio}
        onChange={(e) => setBio(e.target.value)}
        placeholder="Briefly describe your investment thesis and what you look for in campus startups... (min 10 chars)"
        rows={5}
        disabled={isSubmitting}
      />

      <CheckboxPills
        label="Investment Stage"
        options={INVESTMENT_STAGES}
        selected={stages}
        onToggle={toggleStage}
        disabled={isSubmitting}
      />

      <TagInput
        id="industries"
        label="Industry Focus *"
        tags={industries}
        onChange={setIndustries}
        placeholder="Type an industry and press enter..."
        disabled={isSubmitting}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          id="investmentRange"
          label="Typical Investment Range"
          value={investmentRange}
          onChange={(e) => setInvestmentRange(e.target.value)}
          placeholder="$50k - $250k"
          disabled={isSubmitting}
        />
        <Input
          id="geoPreference"
          label="Geographic Preference"
          value={geoPreference}
          onChange={(e) => setGeoPreference(e.target.value)}
          placeholder="e.g. North America, Remote"
          disabled={isSubmitting}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          id="linkedin"
          label="LinkedIn Profile URL *"
          type="url"
          value={linkedin}
          onChange={(e) => setLinkedin(e.target.value)}
          placeholder="https://linkedin.com/in/..."
          disabled={isSubmitting}
        />
        <Input
          id="portfolio"
          label="Portfolio Website"
          type="url"
          value={portfolio}
          onChange={(e) => setPortfolio(e.target.value)}
          placeholder="https://..."
          disabled={isSubmitting}
        />
      </div>
    </CompleteProfileShell>
  );
}
