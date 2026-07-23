import { Briefcase } from 'lucide-react';
import RoleSignupForm from '@/components/auth/RoleSignupForm';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

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
