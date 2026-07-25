import { Link } from 'react-router-dom';
import { User, GraduationCap, TrendingUp, Building2, Briefcase } from 'lucide-react';

// Real navigation to the app's actual signup flows — every role here maps
// 1:1 to an existing /signup/<role> page, so there's no reason for these
// to be stubs. ("Organisation" in the original copy is this app's
// "Company" role — renamed to match rather than inventing a 6th role.)
const ROLES = [
  { icon: User, title: 'Student', desc: 'Launch your idea with mentors, tools and community.', cta: 'Apply as Student', href: '/signup/student' },
  { icon: GraduationCap, title: 'Mentor', desc: 'Guide the next generation of student founders.', cta: 'Apply as Mentor', href: '/signup/mentor' },
  { icon: TrendingUp, title: 'Investor', desc: 'Discover high-potential campus startups early.', cta: 'Register Interest', href: '/signup/investor' },
  { icon: Building2, title: 'Incubator', desc: 'Offer resources, perks or programs to the ecosystem.', cta: 'Partner with Us', href: '/signup/incubator' },
  { icon: Briefcase, title: 'Company', desc: 'Join events, workshops and founder circles.', cta: 'Join as Company', href: '/signup/company' },
];

export default function Roles() {
  return (
    <section className="py-20 lg:py-28 bg-surface-white">
      <div className="max-w-7xl mx-auto px-5 lg:px-10">
        <h2 className="font-poppins font-bold text-3xl lg:text-4xl text-text-heading text-center">Choose Your Role</h2>
        <div className="mt-12 grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {ROLES.map(({ icon: Icon, title, desc, cta, href }) => (
            <div key={title} className="bg-canvas-bg rounded-lg p-6 text-center flex flex-col items-center border border-border-subtle">
              <div className="w-12 h-12 rounded-full bg-surface-white flex items-center justify-center">
                <Icon size={20} strokeWidth={2} className="text-text-body" />
              </div>
              <h3 className="mt-4 font-poppins font-bold text-body text-text-heading">{title}</h3>
              <p className="mt-2 font-inter text-small text-text-muted flex-1">{desc}</p>
              <Link
                to={href}
                className="mt-5 font-poppins font-semibold text-caption border border-border-subtle text-text-heading px-4 py-2 rounded-md hover:bg-surface-white transition-colors"
              >
                {cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
