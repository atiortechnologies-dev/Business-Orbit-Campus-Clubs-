import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CompleteProfileShell from "@/components/onboarding/CompleteProfileShell";
import TextAreaField from "@/components/onboarding/TextAreaField";
import TagInput from "@/components/onboarding/TagInput";
import CheckboxPills from "@/components/onboarding/CheckboxPills";
import Input from "@/components/ui/Input";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { skipProfile, createProfile } from "@/api/auth/profileApi";

const INTERESTS = [
  "SaaS",
  "EdTech",
  "Sustainability",
  "Web3",
  "HealthTech",
  "FinTech",
];

const ROLE = "student"; // Explicitly defined role string

export default function CompleteProfileStudent() {
  useDocumentTitle("Complete Your Profile — BOCC");
  const navigate = useNavigate();

  const [photoPreview, setPhotoPreview] = useState(null);
  const [bio, setBio] = useState("");
  const [skills, setSkills] = useState(["Fintech", "Leadership"]);
  const [linkedin, setLinkedin] = useState("");
  const [website, setWebsite] = useState("");
  const [interests, setInterests] = useState(["SaaS", "FinTech"]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) setPhotoPreview(URL.createObjectURL(file));
  };

  const toggleInterest = (interest) =>
    setInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : [...prev, interest],
    );

  const handleSave = async () => {
    setError("");
    setIsSubmitting(true);

    const formData = {
      bio: bio.trim(),
      skills,
      linkedin_url: linkedin.trim(),
      portfolio_url: website.trim(),
      profile_photo: "", // Can be extended for image uploads
      startup_interests: interests,
    };

    try {
      // Use updateProfile or createProfile based on backend controller mapping
      const res = await createProfile(ROLE, formData);

      setSaved(true);

      const destination =
        res?.data?.redirect_to || res?.redirect_to || `/${ROLE}-dashboard`;

      // Redirect directly or keep submitting true so form is locked
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
      const destination = res?.data?.redirect_to || res?.redirect_to;

      navigate(destination, { replace: true });
    } catch (err) {
      setError(err.message || "Failed to skip profile completion.");
      setIsSubmitting(false);
    }
  };

  return (
    <CompleteProfileShell
      title="Complete Your Profile"
      subtitle="Finish setting up your presence in the Business Orbit ecosystem."
      photoPreview={photoPreview}
      onPhotoChange={handlePhotoChange}
      onSave={handleSave}
      onSkip={handleSkip}
      saved={saved}
      isSubmitting={isSubmitting}
      canSave={bio.trim().length > 0 && !isSubmitting}
    >
      {error && (
        <div className="p-3 bg-error/15 border border-error/30 text-error rounded-md text-small">
          {error}
        </div>
      )}

      <TextAreaField
        id="bio"
        label="Short Bio *"
        value={bio}
        onChange={(e) => setBio(e.target.value)}
        placeholder="Tell us about your background and professional goals..."
        rows={5}
        disabled={isSubmitting}
      />
      <TagInput
        id="skills"
        label="Skills & Interests"
        tags={skills}
        onChange={setSkills}
        placeholder="Type a skill and press enter..."
        disabled={isSubmitting}
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          id="linkedin"
          label="LinkedIn Profile URL"
          type="url"
          value={linkedin}
          onChange={(e) => setLinkedin(e.target.value)}
          placeholder="linkedin.com/in/..."
          disabled={isSubmitting}
        />
        <Input
          id="website"
          label="Portfolio/Website (Optional)"
          type="url"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
          placeholder="https://..."
          disabled={isSubmitting}
        />
      </div>
      <CheckboxPills
        label="Startup Interests"
        options={INTERESTS}
        selected={interests}
        onToggle={toggleInterest}
        disabled={isSubmitting}
      />
    </CompleteProfileShell>
  );
}
