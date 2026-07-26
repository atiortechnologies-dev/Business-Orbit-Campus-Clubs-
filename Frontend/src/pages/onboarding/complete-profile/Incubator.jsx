import { useState } from 'react';
import { Building2 } from 'lucide-react';
import CompleteProfileShell from '@/components/onboarding/CompleteProfileShell';
import TextAreaField from '@/components/onboarding/TextAreaField';
import TagInput from '@/components/onboarding/TagInput';
import CheckboxPills from '@/components/onboarding/CheckboxPills';
import SelectField from '@/components/onboarding/SelectField';
import Input from '@/components/ui/Input';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

const ORG_TYPES = ['University Affiliated', 'Independent / Private', 'Government Backed', 'Corporate', 'Non-Profit'];
const SUPPORT_SERVICES = ['Mentorship', 'Legal Aid', 'Office Space', 'Cloud Credits', 'R&D Labs', 'Demo Days'];

export default function CompleteProfileIncubator() {
  useDocumentTitle('Complete Your Profile — BOCC');
  const [logoPreview, setLogoPreview] = useState(null);
  const [incubatorName, setIncubatorName] = useState('');
  const [orgType, setOrgType] = useState('');
  const [location, setLocation] = useState('');
  const [startupsSupported, setStartupsSupported] = useState('');
  const [bio, setBio] = useState('');
  const [programs, setPrograms] = useState(['Seed Acceleration', 'Venture Building']);
  const [services, setServices] = useState(['Office Space']);
  const [website, setWebsite] = useState('');
  const [industries, setIndustries] = useState('');
  const [saved, setSaved] = useState(false);

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) setLogoPreview(URL.createObjectURL(file));
  };

  const toggleService = (service) =>
    setServices((prev) => (prev.includes(service) ? prev.filter((s) => s !== service) : [...prev, service]));

  const handleSave = () => {
    // TODO(backend): PATCH the incubator profile with { logo,
    // incubatorName, orgType, location, startupsSupported, bio, programs,
    // services, website, industries }.
    setSaved(true);
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
      saved={saved}
      canSave={bio.trim().length > 0}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input id="incubatorName" label="Incubator Name" value={incubatorName} onChange={(e) => setIncubatorName(e.target.value)} placeholder="Orbit Tech Labs" />
        <SelectField id="orgType" label="Organization Type" value={orgType} onChange={(e) => setOrgType(e.target.value)} options={ORG_TYPES} placeholder="Select type" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input id="location" label="Location" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="San Francisco, CA" />
        <Input id="startupsSupported" label="Startups Supported" value={startupsSupported} onChange={(e) => setStartupsSupported(e.target.value)} placeholder="50+" />
      </div>
      <TextAreaField
        id="bio"
        label="Mission Statement / Bio"
        value={bio}
        onChange={(e) => setBio(e.target.value)}
        placeholder="Tell us about your incubator's goals, history, and the types of founders you support..."
        rows={5}
      />
      <TagInput id="programs" label="Startup Programs Offered" tags={programs} onChange={setPrograms} placeholder="Type a program and press enter..." />
      <CheckboxPills label="Support Services" options={SUPPORT_SERVICES} selected={services} onToggle={toggleService} />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input id="website" label="Website" type="url" value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="https://..." />
        <Input id="industries" label="Industries Supported" value={industries} onChange={(e) => setIndustries(e.target.value)} placeholder="SaaS, FinTech, AI" />
      </div>
    </CompleteProfileShell>
  );
}
