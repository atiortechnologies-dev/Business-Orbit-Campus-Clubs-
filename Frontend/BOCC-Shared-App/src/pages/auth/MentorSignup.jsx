import { UserPlus } from 'lucide-react';
import RoleSignupForm from '@/components/auth/RoleSignupForm';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

const FIELDS = [
  { name: 'fullName', label: 'Full Name', placeholder: 'e.g. Sam Rivera' },
  { name: 'email', label: 'Email', type: 'email', placeholder: 'you@example.com' },
  { name: 'phone', label: 'Phone', type: 'tel', placeholder: '+1 (555) 000-0000' },
  { name: 'organization', label: 'Current Organization', placeholder: 'e.g. TechCorp' },
  { name: 'designation', label: 'Designation', placeholder: 'e.g. Senior Product Manager' },
  { name: 'experience', label: 'Experience', type: 'select', options: ['0-2 years', '3-5 years', '6-10 years', '10+ years'] },
  { name: 'expertise', label: 'Area of Expertise', placeholder: 'e.g. Product Strategy, Fundraising', colSpan: 2 },
];

export default function MentorSignupPage() {
  useDocumentTitle('Mentor Sign Up — BOCC');
  return (
    <RoleSignupForm
      roleId="mentor"
      title="Create Your Mentor Account"
      subtitle="Share your expertise and guide the next generation of founders."
      icon={<UserPlus size={22} strokeWidth={2} className="text-accent-neon" />}
      fields={FIELDS}
    />
  );
}
