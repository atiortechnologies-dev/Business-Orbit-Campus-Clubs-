import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  GraduationCap,
  UserPlus,
  Briefcase,
  Rocket,
  Building2,
  ArrowRight,
} from 'lucide-react';
import Button from '@/components/ui/Button';
import RoleCard from '@/components/auth/RoleCard';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

const ROLES = [
  {
    id: 'student',
    title: 'Student',
    description: 'Join campus clubs and accelerate your...',
    icon: <GraduationCap size={26} strokeWidth={2} />,
  },
  {
    id: 'mentor',
    title: 'Mentor',
    description: 'Share your expertise and guide the next...',
    icon: <UserPlus size={26} strokeWidth={2} />,
  },
  {
    id: 'investor',
    title: 'Investor',
    description: 'Discover high-potential...',
    icon: <Briefcase size={26} strokeWidth={2} />,
  },
  {
    id: 'incubator',
    title: 'Incubator',
    description: 'Manage campus ecosystems and...',
    icon: <Rocket size={26} strokeWidth={2} />,
  },
  {
    id: 'company',
    title: 'Company',
    description: 'Partner with campus clubs for talent and...',
    icon: <Building2 size={26} strokeWidth={2} />,
  },
];

export default function RoleSelectionPage() {
  useDocumentTitle('Choose Your Role — BOCC');
  const navigate = useNavigate();
  const [selected, setSelected] = useState(null);

  function handleContinue() {
    if (selected) navigate(`/signup/${selected}`);
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 py-12 bg-canvas-bg">
      <div className="w-full max-w-4xl flex flex-col items-center gap-8">

        <div className="flex flex-col items-center gap-2.5">
          <div className="flex items-center gap-1.5" aria-hidden="true">
            {Array.from({ length: 5 }, (_, i) => (
              <span key={i} className="block w-6 h-0.5 bg-border-subtle" />
            ))}
          </div>
          <nav aria-label="Registration progress">
            <p className="text-caption font-medium uppercase tracking-widest text-text-muted font-inter">
              Step 1 of 4 — Select Your Role
            </p>
          </nav>
        </div>

        <div className="flex flex-col items-center gap-3 text-center">
          <h1 className="text-section font-semibold text-text-heading font-poppins">Choose Your Role</h1>
          <p className="text-body font-normal text-text-body max-w-lg leading-relaxed font-inter">
            Select the persona that best describes your participation in the
            Business Orbit Campus Clubs network.
          </p>
        </div>

        {/* Role card grid — native radio group for full keyboard operability */}
        <fieldset className="w-full">
          <legend className="sr-only">Select a role</legend>
          {/* grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 — this used to be a
              flat grid-cols-5 with no responsive fallback at all, so all 5
              role cards (icon + title + description each) got squeezed
              into 5 slivers on any screen under ~1024px, including every
              phone width. This is part of the signup funnel, so it's worth
              getting right. */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {ROLES.map((role) => (
              <label
                key={role.id}
                className={[
                  'relative block cursor-pointer rounded-md',
                  'focus-within:outline focus-within:outline-2 focus-within:outline-brand-black focus-within:outline-offset-2',
                ].join(' ')}
              >
                <input
                  type="radio"
                  name="role"
                  value={role.id}
                  checked={selected === role.id}
                  onChange={() => setSelected(role.id)}
                  className="sr-only"
                />
                <RoleCard
                  title={role.title}
                  description={role.description}
                  icon={role.icon}
                  selected={selected === role.id}
                />
              </label>
            ))}
          </div>
        </fieldset>

        <div className="flex flex-col items-center gap-3">
          <Button
            variant="ghost"
            type="button"
            disabled={!selected}
            onClick={handleContinue}
            aria-label={selected ? `Continue as ${selected}` : 'Select a role to continue'}
          >
            Continue
            <ArrowRight size={14} strokeWidth={2} aria-hidden="true" />
          </Button>
        </div>

        <p className="text-small font-normal text-text-muted text-center font-inter">
          Already have an account?{' '}
          <Link
            to="/login"
            className="text-text-body underline underline-offset-2 hover:text-text-heading transition-all duration-150 ease-linear"
          >
            Login
          </Link>
          {' '}·{' '}
          <Link
            to="/login"
            className="text-text-body hover:text-text-heading transition-all duration-150 ease-linear"
          >
            Back to Home
          </Link>
        </p>

      </div>
    </div>
  );
}
