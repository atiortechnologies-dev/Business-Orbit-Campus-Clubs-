import { Rocket } from 'lucide-react';
import RoleSignupForm from '@/components/auth/RoleSignupForm';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

const FIELDS = [
  { name: 'fullName', label: 'Full Name', placeholder: 'e.g. Sarah Jenkins' },
  { name: 'email', label: 'Email', type: 'email', placeholder: 'you@incubator.com' },
  { name: 'phone', label: 'Phone', type: 'tel', placeholder: '+1 (555) 000-0000' },
  { name: 'companyName', label: 'Company Name', placeholder: 'e.g. BOCC Incubator' },
  { name: 'campus', label: 'Campus / Location', placeholder: 'e.g. San Francisco, CA' },
  { name: 'website', label: 'Website', type: 'url', placeholder: 'https://...', colSpan: 2 },
];

export default function IncubatorSignupPage() {
  useDocumentTitle('Incubator Sign Up — BOCC');
  return (
    <RoleSignupForm
      roleId="incubator"
      title="Create Your Incubator Account"
      subtitle="Manage campus ecosystems and support founders end-to-end."
      icon={<Rocket size={22} strokeWidth={2} className="text-accent-neon" />}
      fields={FIELDS}
    />
  );
}
