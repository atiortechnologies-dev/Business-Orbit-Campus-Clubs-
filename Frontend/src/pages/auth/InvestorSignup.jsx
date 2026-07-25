import { Briefcase } from 'lucide-react';
import RoleSignupForm from '@/components/auth/RoleSignupForm';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

// Backend/utils/validators.js's investorFields expects: organization
// (orgName here is a straight rename), investment_focus, investment_stage
// (both required — profile_url is the only optional one). This form is
// currently missing investment_focus and investment_stage entirely; the
// backend can't register an investor from what this form collects today
// without those two fields being added.
const FIELDS = [
  { name: 'fullName', label: 'Full Name', placeholder: 'e.g. Morgan Wells' },
  { name: 'email', label: 'Email', type: 'email', placeholder: 'you@fund.com' },
  { name: 'phone', label: 'Phone', type: 'tel', placeholder: '+1 (555) 000-0000' },
  { name: 'orgName', label: 'Organization / Fund Name', placeholder: 'e.g. Wells Ventures', colSpan: 2 },
];

export default function InvestorSignupPage() {
  useDocumentTitle('Investor Sign Up — BOCC');
  return (
    <RoleSignupForm
      roleId="investor"
      title="Create Your Investor Account"
      subtitle="Discover high-potential student startups early."
      icon={<Briefcase size={22} strokeWidth={2} className="text-accent-neon" />}
      fields={FIELDS}
    />
  );
}
