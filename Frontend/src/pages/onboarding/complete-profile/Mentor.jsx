import { useState } from 'react';
import CompleteProfileShell from '@/components/onboarding/CompleteProfileShell';
import TextAreaField from '@/components/onboarding/TextAreaField';
import TagInput from '@/components/onboarding/TagInput';
import CheckboxPills from '@/components/onboarding/CheckboxPills';
import RadioPills from '@/components/onboarding/RadioPills';
import SelectField from '@/components/onboarding/SelectField';
import Input from '@/components/ui/Input';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

const EXPERIENCE_RANGES = ['0-2 years', '3-5 years', '6-10 years', '10+ years'];
const INDUSTRIES = ['SaaS', 'FinTech', 'Sustainability', 'HealthTech', 'DeepTech', 'Web3'];
const MENTORING_MODES = ['Online', 'Offline', 'Both'];
const AVAILABILITY_OPTIONS = ['1-2 hours / week', '3-5 hours / week', '5+ hours / week', 'Occasional / As needed'];

export default function CompleteProfileMentor() {
  useDocumentTitle('Complete Your Profile — BOCC');
  const [photoPreview, setPhotoPreview] = useState(null);
  const [company, setCompany] = useState('');
  const [designation, setDesignation] = useState('');
  const [experience, setExperience] = useState('');
  const [bio, setBio] = useState('');
  const [skills, setSkills] = useState(['Product Strategy', 'Fundraising']);
  const [linkedin, setLinkedin] = useState('');
  const [portfolio, setPortfolio] = useState('');
  const [industries, setIndustries] = useState([]);
  const [mentoringMode, setMentoringMode] = useState('Both');
  const [languages, setLanguages] = useState('');
  const [availability, setAvailability] = useState('');
  const [saved, setSaved] = useState(false);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) setPhotoPreview(URL.createObjectURL(file));
  };

  const toggleIndustry = (industry) =>
    setIndustries((prev) => (prev.includes(industry) ? prev.filter((i) => i !== industry) : [...prev, industry]));

  const handleSave = () => {
    // TODO(backend): PATCH the mentor profile with { photo, company,
    // designation, experience, bio, skills, linkedin, portfolio,
    // industries, mentoringMode, languages, availability }.
    setSaved(true);
  };

  return (
    <CompleteProfileShell
      title="Complete Your Profile"
      subtitle="Finish setting up your presence in the Business Orbit ecosystem as a Mentor."
      photoPreview={photoPreview}
      onPhotoChange={handlePhotoChange}
      onSave={handleSave}
      saved={saved}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input id="company" label="Current Company" value={company} onChange={(e) => setCompany(e.target.value)} placeholder="e.g. Google, McKinsey, Stripe" />
        <Input id="designation" label="Designation" value={designation} onChange={(e) => setDesignation(e.target.value)} placeholder="e.g. Senior Product Manager" />
      </div>
      <SelectField id="experience" label="Years of Experience" value={experience} onChange={(e) => setExperience(e.target.value)} options={EXPERIENCE_RANGES} placeholder="Select range" />
      <TextAreaField
        id="bio"
        label="Short Bio"
        value={bio}
        onChange={(e) => setBio(e.target.value)}
        placeholder="Tell us about your background, career milestones, and why you want to mentor campus leaders..."
        rows={5}
      />
      <TagInput id="skills" label="Areas of Expertise" tags={skills} onChange={setSkills} placeholder="Type a skill and press enter..." />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input id="linkedin" label="LinkedIn Profile URL" type="url" value={linkedin} onChange={(e) => setLinkedin(e.target.value)} placeholder="linkedin.com/in/..." />
        <Input id="portfolio" label="Portfolio/Website (Optional)" type="url" value={portfolio} onChange={(e) => setPortfolio(e.target.value)} placeholder="https://..." />
      </div>
      <CheckboxPills label="Industries Mentored" options={INDUSTRIES} selected={industries} onToggle={toggleIndustry} />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <RadioPills label="Mentoring Mode" options={MENTORING_MODES} value={mentoringMode} onChange={setMentoringMode} />
        <Input id="languages" label="Languages Spoken" value={languages} onChange={(e) => setLanguages(e.target.value)} placeholder="e.g. English, Spanish, Mandarin" />
      </div>
      <SelectField id="availability" label="Availability" value={availability} onChange={(e) => setAvailability(e.target.value)} options={AVAILABILITY_OPTIONS} placeholder="Choose your frequency" />
    </CompleteProfileShell>
  );
}
