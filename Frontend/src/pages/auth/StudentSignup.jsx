import { GraduationCap } from 'lucide-react';
import RoleSignupForm from '@/components/auth/RoleSignupForm';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

// Backend/utils/validators.js's studentFields expects: college (matches),
// degree, graduation_year (number). `branch` here ("Computer Science")
// maps loosely to `degree` but isn't really the same concept (a degree is
// "B.Tech", not a branch/major) — the schema has no separate major field,
// worth a product conversation before assuming this rename is correct.
// gradYear -> graduation_year is a straight rename (backend coerces the
// select's string value to a number).
const FIELDS = [
  { name: 'fullName', label: 'Full Name', placeholder: 'e.g. Alex Chen' },
  { name: 'email', label: 'Email', type: 'email', placeholder: 'you@university.edu' },
  { name: 'phone', label: 'Phone', type: 'tel', placeholder: '+1 (555) 000-0000' },
  { name: 'college', label: 'College Name', placeholder: 'e.g. State University' },
  { name: 'branch', label: 'Branch', placeholder: 'e.g. Computer Science' },
  { name: 'gradYear', label: 'Graduation Year', type: 'select', options: ['2026', '2027', '2028'] },
];

export default function StudentSignupPage() {
  useDocumentTitle('Student Sign Up — BOCC');
  return (
    <RoleSignupForm
      roleId="student"
      title="Create Your Student Account"
      subtitle="Join the BOCC network and start building your startup."
      icon={<GraduationCap size={22} strokeWidth={2} className="text-accent-neon" />}
      fields={FIELDS}
    />
  );
}
