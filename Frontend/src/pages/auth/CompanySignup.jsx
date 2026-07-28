import { Building2 } from 'lucide-react';
import RoleSignupForm from '@/components/auth/RoleSignupForm';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

// Backend/utils/validators.js's companyFields expects: company_name
// (companyName here is a rename), industry (matches), company_size
// (companySize here is a rename), website (matches, but required on the
// backend — this form already requires it too, good). contact_person is
// also required and isn't collected here — note it's distinct from the
// base fullName field (the registering user vs. the company's named
// point of contact could be different people), so this needs its own
// field, not a reuse of fullName.
const FIELDS = [
  { name: 'fullName', label: 'Full Name', placeholder: 'e.g. Jordan Lee' },
  { name: 'email', label: 'Official Email', type: 'email', placeholder: 'you@company.com' },
  { name: 'phone', label: 'Phone', type: 'tel', placeholder: '+1 (555) 000-0000' },
  { name: 'companyName', label: 'Company Name', placeholder: 'e.g. Acme Corp' },
  { name: 'website', label: 'Website', type: 'url', placeholder: 'https://...' },
  { name: 'industry', label: 'Industry', type: 'select', options: ['Technology', 'Finance', 'Healthcare', 'Retail', 'Education', 'Other'] },
  { name: 'companySize', label: 'Company Size', type: 'select', options: ['1-10', '11-50', '51-200', '201-500', '500+'] },
];

export default function CompanySignupPage() {
  useDocumentTitle('Company Sign Up — BOCC');
  return (
    <RoleSignupForm
      roleId="company"
      title="Create Your Company Account"
      subtitle="Partner with campus clubs for talent and collaboration."
      icon={<Building2 size={22} strokeWidth={2} className="text-accent-neon" />}
      fields={FIELDS}
    />
  );
}
