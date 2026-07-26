import { useState } from 'react';
import CompleteProfileShell from '@/components/onboarding/CompleteProfileShell';
import TextAreaField from '@/components/onboarding/TextAreaField';
import TagInput from '@/components/onboarding/TagInput';
import CheckboxPills from '@/components/onboarding/CheckboxPills';
import Input from '@/components/ui/Input';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

const INVESTMENT_STAGES = ['Idea', 'Pre-Seed', 'Seed', 'Series A+'];

export default function CompleteProfileInvestor() {
  useDocumentTitle('Complete Your Profile — BOCC');
  const [photoPreview, setPhotoPreview] = useState(null);
  const [firm, setFirm] = useState('');
  const [designation, setDesignation] = useState('');
  const [bio, setBio] = useState('');
  const [stages, setStages] = useState([]);
  const [industries, setIndustries] = useState(['SaaS', 'FinTech']);
  const [investmentRange, setInvestmentRange] = useState('');
  const [geoPreference, setGeoPreference] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [portfolio, setPortfolio] = useState('');
  const [saved, setSaved] = useState(false);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) setPhotoPreview(URL.createObjectURL(file));
  };

  const toggleStage = (stage) =>
    setStages((prev) => (prev.includes(stage) ? prev.filter((s) => s !== stage) : [...prev, stage]));

  const handleSave = () => {
    // TODO(backend): PATCH the investor profile with { photo, firm,
    // designation, bio, stages, industries, investmentRange,
    // geoPreference, linkedin, portfolio }.
    setSaved(true);
  };

  return (
    <CompleteProfileShell
      title="Complete Your Profile"
      subtitle="Finalize your investor credentials in the Business Orbit ecosystem."
      photoPreview={photoPreview}
      onPhotoChange={handlePhotoChange}
      onSave={handleSave}
      saved={saved}
      canSave={bio.trim().length > 0}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input id="firm" label="Investment Firm / Organization" value={firm} onChange={(e) => setFirm(e.target.value)} placeholder="e.g. Orbit Capital" />
        <Input id="designation" label="Designation" value={designation} onChange={(e) => setDesignation(e.target.value)} placeholder="e.g. Managing Director" />
      </div>
      <TextAreaField
        id="bio"
        label="Investor Bio"
        value={bio}
        onChange={(e) => setBio(e.target.value)}
        placeholder="Briefly describe your investment thesis and what you look for in campus startups..."
        rows={5}
      />
      <CheckboxPills label="Investment Stage" options={INVESTMENT_STAGES} selected={stages} onToggle={toggleStage} />
      <TagInput id="industries" label="Industry Focus" tags={industries} onChange={setIndustries} placeholder="Type an industry and press enter..." />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input id="investmentRange" label="Typical Investment Range" value={investmentRange} onChange={(e) => setInvestmentRange(e.target.value)} placeholder="$50k - $250k" />
        <Input id="geoPreference" label="Geographic Preference" value={geoPreference} onChange={(e) => setGeoPreference(e.target.value)} placeholder="e.g. North America, Remote" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input id="linkedin" label="LinkedIn Profile URL" type="url" value={linkedin} onChange={(e) => setLinkedin(e.target.value)} placeholder="linkedin.com/in/..." />
        <Input id="portfolio" label="Portfolio Website" type="url" value={portfolio} onChange={(e) => setPortfolio(e.target.value)} placeholder="https://..." />
      </div>
    </CompleteProfileShell>
  );
}
