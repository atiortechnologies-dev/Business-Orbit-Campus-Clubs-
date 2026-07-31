import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CompleteProfileShell from "@/components/onboarding/CompleteProfileShell";
import TextAreaField from "@/components/onboarding/TextAreaField";
import TagInput from "@/components/onboarding/TagInput";
import CheckboxPills from "@/components/onboarding/CheckboxPills";
import RadioPills from "@/components/onboarding/RadioPills";
import SelectField from "@/components/onboarding/SelectField";
import Input from "@/components/ui/Input";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { skipProfile, createProfile } from "@/api/auth/profileApi";
import { uploadToCloudinary } from "@/api/uploadApi";

const EXPERIENCE_RANGES = ["0-2 years", "3-5 years", "6-10 years", "10+ years"];
const INDUSTRIES = [
  "SaaS",
  "FinTech",
  "Sustainability",
  "HealthTech",
  "DeepTech",
  "Web3",
];
const MENTORING_MODES = ["Online", "Offline", "Both"];
const AVAILABILITY_OPTIONS = [
  "1-2 hours / week",
  "3-5 hours / week",
  "5+ hours / week",
  "Occasional / As needed",
];

const ROLE = "mentor";

export default function CompleteProfileMentor() {
  useDocumentTitle("Complete Your Profile — BOCC");
  const navigate = useNavigate();

  const [selectedFile, setSelectedFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [company, setCompany] = useState("");
  const [designation, setDesignation] = useState("");
  const [experience, setExperience] = useState("");
  const [bio, setBio] = useState("");
  const [skills, setSkills] = useState(["Product Strategy", "Fundraising"]);
  const [linkedin, setLinkedin] = useState("");
  const [portfolio, setPortfolio] = useState("");
  const [industries, setIndustries] = useState([]);
  const [mentoringMode, setMentoringMode] = useState("Both");
  const [languages, setLanguages] = useState("");
  const [availability, setAvailability] = useState("");

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

  const toggleIndustry = (industry) =>
    setIndustries((prev) =>
      prev.includes(industry)
        ? prev.filter((i) => i !== industry)
        : [...prev, industry],
    );

  const handleSave = async () => {
    setError("");
    setIsSubmitting(true);

    try {
      let photoUrl = "";

      // 1. Upload photo via signed Cloudinary request if chosen
      if (selectedFile) {
        photoUrl = await uploadToCloudinary(selectedFile, "mentor_profiles");
      }

      // 2. Format request payload matching schema
      const formData = {
        company: company.trim(),
        designation: designation.trim(),
        years_of_experience: experience,
        bio: bio.trim(),
        skills, // z.array(z.string())
        linkedin_url: linkedin.trim(),
        portfolio_url: portfolio.trim(),
        profile_photo: photoUrl,
        attachment_url: photoUrl,
        // Mentor-specific fields
        mentoring_domains: industries,
        mentoring_mode: mentoringMode,
        languages_spoken: languages.trim(),
        preferred_startup_stages: [],
        availability: availability || "",
      };

      // 3. Persist profile via MongoDB backend
      const res = await createProfile(ROLE, formData);
      setSaved(true);

      const destination =
        res?.data?.redirect_to || res?.redirect_to || "/mentor";

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
        res?.data?.redirect_to || res?.redirect_to || "/mentor";

      navigate(destination, { replace: true });
    } catch (err) {
      setError(err.message || "Failed to skip profile completion.");
      setIsSubmitting(false);
    }
  };

  return (
    <CompleteProfileShell
      title="Complete Your Profile"
      subtitle="Finish setting up your presence in the Business Orbit ecosystem as a Mentor."
      photoPreview={photoPreview}
      onPhotoChange={handlePhotoChange}
      onSave={handleSave}
      onSkip={handleSkip}
      saved={saved}
      isSubmitting={isSubmitting}
      canSave={bio.trim().length >= 10 && skills.length > 0 && !isSubmitting}
    >
      {error && (
        <div className="p-3 bg-error/15 border border-error/30 text-error rounded-md text-small">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          id="company"
          label="Current Company"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          placeholder="e.g. Google, McKinsey, Stripe"
          disabled={isSubmitting}
        />
        <Input
          id="designation"
          label="Designation"
          value={designation}
          onChange={(e) => setDesignation(e.target.value)}
          placeholder="e.g. Senior Product Manager"
          disabled={isSubmitting}
        />
      </div>

      <SelectField
        id="experience"
        label="Years of Experience"
        value={experience}
        onChange={(e) => setExperience(e.target.value)}
        options={EXPERIENCE_RANGES}
        placeholder="Select range"
        disabled={isSubmitting}
      />

      <TextAreaField
        id="bio"
        label="Short Bio *"
        value={bio}
        onChange={(e) => setBio(e.target.value)}
        placeholder="Tell us about your background, career milestones, and why you want to mentor campus leaders... (min 10 chars)"
        rows={5}
        disabled={isSubmitting}
      />

      <TagInput
        id="skills"
        label="Areas of Expertise *"
        tags={skills}
        onChange={setSkills}
        placeholder="Type a skill and press enter..."
        disabled={isSubmitting}
      />

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
          label="Portfolio/Website (Optional)"
          type="url"
          value={portfolio}
          onChange={(e) => setPortfolio(e.target.value)}
          placeholder="https://..."
          disabled={isSubmitting}
        />
      </div>

      <CheckboxPills
        label="Industries Mentored"
        options={INDUSTRIES}
        selected={industries}
        onToggle={toggleIndustry}
        disabled={isSubmitting}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <RadioPills
          label="Mentoring Mode"
          options={MENTORING_MODES}
          value={mentoringMode}
          onChange={setMentoringMode}
          disabled={isSubmitting}
        />
        <Input
          id="languages"
          label="Languages Spoken"
          value={languages}
          onChange={(e) => setLanguages(e.target.value)}
          placeholder="e.g. English, Spanish, Mandarin"
          disabled={isSubmitting}
        />
      </div>

      <SelectField
        id="availability"
        label="Availability"
        value={availability}
        onChange={(e) => setAvailability(e.target.value)}
        options={AVAILABILITY_OPTIONS}
        placeholder="Choose your frequency"
        disabled={isSubmitting}
      />
    </CompleteProfileShell>
  );
}
