import { useState } from 'react';
import CompleteProfileShell from '@/components/onboarding/CompleteProfileShell';
import TextAreaField from '@/components/onboarding/TextAreaField';
import TagInput from '@/components/onboarding/TagInput';
import CheckboxPills from '@/components/onboarding/CheckboxPills';
import SelectField from '@/components/onboarding/SelectField';
import Input from '@/components/ui/Input';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

const INDUSTRIES = ['Technology', 'Finance', 'Healthcare', 'Retail / E-commerce', 'Education', 'Manufacturing', 'Other'];
const COMPANY_SIZES = ['1-10 employees', '11-50 employees', '51-200 employees', '201-1000 employees', '1000+ employees'];
const OPPORTUNITY_TYPES = ['Internships', 'Freelancing', 'Part-time Roles', 'Full-time Graduate Roles', 'Project Based'];

export default function CompleteProfileCompany() {
  useDocumentTitle('Complete Your Profile — BOCC');
  const [logoPreview, setLogoPreview] = useState(null);
  const [companyName, setCompanyName] = useState('');
  const [industry, setIndustry] = useState('');
  const [companySize, setCompanySize] = useState('');
  const [website, setWebsite] = useState('');
  const [bio, setBio] = useState('');
  const [hiringCategories, setHiringCategories] = useState(['Software Engineering', 'Product Marketing']);
  const [studentSkills, setStudentSkills] = useState(['Leadership', 'Agile Project Management']);
  const [opportunityTypes, setOpportunityTypes] = useState([]);
  const [saved, setSaved] = useState(false);

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) setLogoPreview(URL.createObjectURL(file));
  };

  const toggleOpportunity = (type) =>
    setOpportunityTypes((prev) => (prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]));

  const handleSave = () => {
    // TODO(backend): PATCH the company profile with { logo, companyName,
    // industry, companySize, website, bio, hiringCategories,
    // studentSkills, opportunityTypes }.
    setSaved(true);
  };

  return (
    <CompleteProfileShell
      title="Complete Company Profile"
      subtitle="Finish setting up your company presence in the Business Orbit ecosystem."
      photoLabel="Company Logo"
      photoPreview={logoPreview}
      onPhotoChange={handleLogoChange}
      onSave={handleSave}
      saved={saved}
      canSave={bio.trim().length > 0}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input id="companyName" label="Company Name" value={companyName} onChange={(e) => setCompanyName(e.target.value)} placeholder="e.g. Orbit Tech Solutions" />
        <SelectField id="industry" label="Industry" value={industry} onChange={(e) => setIndustry(e.target.value)} options={INDUSTRIES} placeholder="Select industry" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <SelectField id="companySize" label="Company Size" value={companySize} onChange={(e) => setCompanySize(e.target.value)} options={COMPANY_SIZES} placeholder="Number of employees" />
        <Input id="website" label="Company Website" type="url" value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="https://..." />
      </div>
      <TextAreaField
        id="bio"
        label="Company Mission & Bio"
        value={bio}
        onChange={(e) => setBio(e.target.value)}
        placeholder="Tell us about your company values, background and what you look for in campus leaders..."
        rows={5}
      />
      <TagInput id="hiringCategories" label="Hiring Categories" tags={hiringCategories} onChange={setHiringCategories} placeholder="Type a category and press enter..." />
      <TagInput id="studentSkills" label="Preferred Student Skills" tags={studentSkills} onChange={setStudentSkills} placeholder="Type a skill (e.g. Python, Strategy) and press enter..." />
      <CheckboxPills label="Types of Opportunities Offered" options={OPPORTUNITY_TYPES} selected={opportunityTypes} onToggle={toggleOpportunity} />
    </CompleteProfileShell>
  );
}
