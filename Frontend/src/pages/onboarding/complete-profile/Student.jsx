import { useState } from 'react';
import CompleteProfileShell from '@/components/onboarding/CompleteProfileShell';
import TextAreaField from '@/components/onboarding/TextAreaField';
import TagInput from '@/components/onboarding/TagInput';
import CheckboxPills from '@/components/onboarding/CheckboxPills';
import Input from '@/components/ui/Input';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

const INTERESTS = ['SaaS', 'EdTech', 'Sustainability', 'Web3', 'HealthTech', 'FinTech'];

export default function CompleteProfileStudent() {
  useDocumentTitle('Complete Your Profile — BOCC');
  const [photoPreview, setPhotoPreview] = useState(null);
  const [bio, setBio] = useState('');
  const [skills, setSkills] = useState(['Fintech', 'Leadership']);
  const [linkedin, setLinkedin] = useState('');
  const [website, setWebsite] = useState('');
  const [interests, setInterests] = useState(['SaaS', 'FinTech']);
  const [saved, setSaved] = useState(false);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) setPhotoPreview(URL.createObjectURL(file));
  };

  const toggleInterest = (interest) =>
    setInterests((prev) => (prev.includes(interest) ? prev.filter((i) => i !== interest) : [...prev, interest]));

  const handleSave = () => {
    // TODO(backend): PATCH the student profile with { photo, bio, skills,
    // linkedin, website, interests } once an auth/profile API exists.
    setSaved(true);
  };

  return (
    <CompleteProfileShell
      title="Complete Your Profile"
      subtitle="Finish setting up your presence in the Business Orbit ecosystem."
      photoPreview={photoPreview}
      onPhotoChange={handlePhotoChange}
      onSave={handleSave}
      saved={saved}
      canSave={bio.trim().length > 0}
    >
      <TextAreaField
        id="bio"
        label="Short Bio"
        value={bio}
        onChange={(e) => setBio(e.target.value)}
        placeholder="Tell us about your background and professional goals..."
        rows={5}
      />
      <TagInput
        id="skills"
        label="Skills & Interests"
        tags={skills}
        onChange={setSkills}
        placeholder="Type a skill and press enter..."
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input id="linkedin" label="LinkedIn Profile URL" type="url" value={linkedin} onChange={(e) => setLinkedin(e.target.value)} placeholder="linkedin.com/in/..." />
        <Input id="website" label="Portfolio/Website (Optional)" type="url" value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="https://..." />
      </div>
      <CheckboxPills label="Startup Interests" options={INTERESTS} selected={interests} onToggle={toggleInterest} />
    </CompleteProfileShell>
  );
}
