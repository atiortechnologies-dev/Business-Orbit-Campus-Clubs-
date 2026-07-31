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

const ORG_TYPES = [
  "University Affiliated",
  "Independent / Private",
  "Government Backed",
  "Corporate",
  "Non-Profit",
];
const SUPPORT_SERVICES = [
  "Mentorship",
  "Legal Aid",
  "Office Space",
  "Cloud Credits",
  "R&D Labs",
  "Demo Days",
];

const ROLE = "incubator";

export default function CompleteProfileIncubator() {
  useDocumentTitle("Complete Your Profile — BOCC");
  const navigate = useNavigate();

  const [logoPreview, setLogoPreview] = useState(null);
  const [incubatorName, setIncubatorName] = useState("");
  const [orgType, setOrgType] = useState("Independent / Private");
  const [contactPerson, setContactPerson] = useState("");
  const [bio, setBio] = useState("");
  const [domains, setDomains] = useState(["SaaS", "FinTech"]);
  const [services, setServices] = useState(["Office Space"]);
  const [website, setWebsite] = useState("");
  const [linkedin, setLinkedin] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) setLogoPreview(URL.createObjectURL(file));
  };

  const toggleService = (service) =>
    setServices((prev) =>
      prev.includes(service)
        ? prev.filter((s) => s !== service)
        : [...prev, service],
    );

  const handleSave = async () => {
    setError("");
    setIsSubmitting(true);

    // Mapped to commonProfileFields + incubatorCompleteFields Zod schema
    const formData = {
      bio: bio.trim(),
      skills: domains, // Satisfies commonProfileFields skills array requirement
      linkedin_url: linkedin.trim(),
      portfolio_url: website.trim(),
      profile_photo: "",
      // Role-specific fields matching incubatorCompleteFields
      organization_type: orgType,
      supported_startup_domains: domains,
      services_offered: services,
      contact_person: contactPerson.trim() || "Primary Contact",
    };

    try {
      const res = await createProfile(ROLE, formData);
      setSaved(true);

      const destination =
        res?.data?.redirect_to || res?.redirect_to || "/incubator";

      setTimeout(() => {
        navigate(destination, { replace: true });
      }, 800);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to save profile. Please try again.",
      );
      setIsSubmitting(false);
    }
  };

  const handleSkip = async () => {
    setError("");
    setIsSubmitting(true);

    try {
      const res = await skipProfile(ROLE);
      const destination =
        res?.data?.redirect_to || res?.redirect_to || "/incubator";

      navigate(destination, { replace: true });
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to skip profile completion.",
      );
      setIsSubmitting(false);
    }
  };

  return (
    <CompleteProfileShell
      title="Complete Your Profile"
      subtitle="Finish setting up your incubator's presence in the Business Orbit ecosystem."
      photoLabel="Organization Logo"
      photoIcon={Building2}
      photoPreview={logoPreview}
      onPhotoChange={handleLogoChange}
      onSave={handleSave}
      onSkip={handleSkip}
      saved={saved}
      isSubmitting={isSubmitting}
      canSave={
        bio.trim().length >= 10 &&
        domains.length > 0 &&
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
          id="incubatorName"
          label="Incubator Name"
          value={incubatorName}
          onChange={(e) => setIncubatorName(e.target.value)}
          placeholder="Orbit Tech Labs"
          disabled={isSubmitting}
        />
        <SelectField
          id="orgType"
          label="Organization Type *"
          value={orgType}
          onChange={(e) => setOrgType(e.target.value)}
          options={ORG_TYPES}
          placeholder="Select type"
          disabled={isSubmitting}
        />
      </div>

      <Input
        id="contactPerson"
        label="Primary Contact Person *"
        value={contactPerson}
        onChange={(e) => setContactPerson(e.target.value)}
        placeholder="e.g. Sarah Jenkins"
        disabled={isSubmitting}
      />

      <TextAreaField
        id="bio"
        label="Mission Statement / Bio *"
        value={bio}
        onChange={(e) => setBio(e.target.value)}
        placeholder="Tell us about your incubator's goals, history, and the types of founders you support... (min 10 chars)"
        rows={5}
        disabled={isSubmitting}
      />

      <TagInput
        id="domains"
        label="Supported Startup Domains *"
        tags={domains}
        onChange={setDomains}
        placeholder="Type a domain and press enter..."
        disabled={isSubmitting}
      />

      <CheckboxPills
        label="Support Services"
        options={SUPPORT_SERVICES}
        selected={services}
        onToggle={toggleService}
        disabled={isSubmitting}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          id="linkedin"
          label="LinkedIn Profile URL *"
          type="url"
          value={linkedin}
          onChange={(e) => setLinkedin(e.target.value)}
          placeholder="https://linkedin.com/company/..."
          disabled={isSubmitting}
        />
        <Input
          id="website"
          label="Website URL"
          type="url"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
          placeholder="https://..."
          disabled={isSubmitting}
        />
      </div>
    </CompleteProfileShell>
  );
}
