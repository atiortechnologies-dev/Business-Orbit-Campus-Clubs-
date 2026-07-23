import {
  Scale,
  Shield,
  Cookie,
  ListChecks,
  Database,
  LifeBuoy,
  Download,
  ChevronRight,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import ComingSoon from '@/components/ui/ComingSoon';
import Logo from '@/components/ui/Logo';
import PublicNav from '@/components/layout/PublicNav';

const LEFT_NAV = [
  { icon: Scale,      label: 'Terms of Service', href: '#introduction', active: true  },
  { icon: Shield,     label: 'Privacy Policy',   href: '#data-collection', active: false },
  { icon: Cookie,     label: 'Cookie Policy',    href: '#cookies',    active: false },
  { icon: ListChecks, label: 'Acceptable Use',   href: '#user-responsibilities',   active: false },
  { icon: Database,   label: 'Data Processing',  href: '#data-security',  active: false },
  { icon: LifeBuoy,   label: 'Contact Support',  href: '#',  active: false, divider: true, comingSoon: true },
];

const SECTIONS = [
  {
    id: 'introduction', num: 1, title: 'Introduction',
    content: 'Welcome to Business Orbit Campus Clubs (BOCC). These Terms of Service govern your access to and use of our website, mobile application, and campus management tools. By accessing our platform, you agree to be bound by these terms in their entirety.',
  },
  {
    id: 'user-responsibilities', num: 2, title: 'User Responsibilities',
    content: 'As a registered member of the BOCC community, you are expected to maintain professional conduct and adhere to local campus regulations.',
    list: [
      'Provide accurate information during the registration process.',
      'Refrain from sharing unauthorized promotional materials.',
      'Respect the intellectual property of other campus clubs.',
      'Report any security vulnerabilities or suspicious activity.',
    ],
  },
  {
    id: 'account-usage', num: 3, title: 'Account Usage',
    content: 'You are solely responsible for the activity that occurs on your account. You must keep your account password secure and notify BOCC immediately of any breach of security or unauthorized use of your account.',
  },
  {
    id: 'data-collection', num: 4, title: 'Data Collection',
    content: 'We collect information you provide directly to us, such as when you create an account, participate in a club event, or communicate with our support team. This may include your name, email address, campus ID, and professional interests.',
  },
  {
    id: 'data-security', num: 5, title: 'Data Security',
    content: 'We implement industry-standard encryption and organizational measures to protect your personal information. However, no method of transmission over the internet is 100% secure.',
  },
  {
    id: 'cookies', num: 6, title: 'Cookies',
    content: 'We use cookies and similar technologies to track your preferences and improve the user experience. You can manage your cookie preferences through your browser settings.',
  },
  {
    id: 'intellectual-property', num: 7, title: 'Intellectual Property',
    content: 'All content on the BOCC platform, including text, graphics, logos, and software, is the property of Business Orbit Campus Clubs or its content suppliers and is protected by international copyright laws.',
  },
  {
    id: 'limitation-of-liability', num: 8, title: 'Limitation of Liability',
    content: 'BOCC shall not be liable for any indirect, incidental, special, or consequential damages resulting from the use or inability to use the services provided on our platform.',
  },
  {
    id: 'contact-information', num: 9, title: 'Contact Information',
    contentJsx: true,
  },
];

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-canvas-bg text-text-body font-inter min-h-screen flex flex-col">

      <PublicNav />

      {/* ── Hero band ──────────────────────────────────────────────── */}
      <header className="bg-canvas-bg border-b border-divider-line">
        {/* px-4 lg:px-10 = the same 16px mobile / 40px desktop values as
            --spacing-margin-mobile/desktop, as real responsive Tailwind
            classes instead of an unconditional inline style — the inline
            version was always 40px, even on a 375px phone. */}
        <div
          className="mx-auto py-8 px-4 lg:px-10"
          style={{ maxWidth: 'var(--spacing-container-max)' }}
        >
          <h1 className="text-text-heading font-poppins font-semibold text-page mb-2">Terms of Service &amp; Privacy Policy</h1>
          <p className="text-text-body font-inter font-normal text-body max-w-2xl">
            Please read our terms, privacy practices, and policies before using the BOCC platform.
          </p>
        </div>
      </header>

      {/* ── Main 2-column layout ───────────────────────────────────── */}
      <main
        className="flex-grow mx-auto w-full py-8 px-4 lg:px-10"
        style={{ maxWidth: 'var(--spacing-container-max)' }}
      >
        <div className="grid grid-cols-12" style={{ gap: 'var(--spacing-gutter)' }}>

          {/* ── Left sticky sub-nav ──────────────────────────────── */}
          <aside className="col-span-12 md:col-span-3">
            <div className="flex flex-col gap-4 py-6 sticky top-24">
              {/* Header */}
              <div className="px-4 pb-4 border-b border-divider-line">
                <div className="text-text-heading font-inter font-medium text-caption uppercase tracking-wider mb-1">Legal Center</div>
                <div className="text-text-muted font-inter font-normal text-small">Last updated Oct 2023</div>
              </div>
              {/* Nav links */}
              <nav className="flex flex-col gap-2">
                {LEFT_NAV.map(({ icon: Icon, label, href, active, divider, comingSoon }) => {
                  if (comingSoon) {
                    return (
                      <div
                        key={label}
                        className={`${divider ? 'mt-4 border-t border-divider-line pt-4' : ''}`}
                      >
                        <ComingSoon label={label} position="top" inline>
                          <span className="flex items-center gap-3 py-2 pl-4 text-text-muted cursor-not-allowed">
                            <Icon size={20} strokeWidth={2} />
                            <span className="font-inter font-medium text-small">{label}</span>
                          </span>
                        </ComingSoon>
                      </div>
                    );
                  }

                  return (
                    <a
                      key={label}
                      href={href}
                      className={`flex items-center gap-3 py-2 transition-all ${
                        active
                          ? 'text-text-heading font-semibold border-l-2 border-brand-black pl-3'
                          : 'text-text-muted pl-4 hover:text-text-heading hover:bg-canvas-bg rounded-md'
                      } ${divider ? 'mt-4 border-t border-divider-line pt-4' : ''}`}
                    >
                      <Icon size={20} strokeWidth={2} />
                      <span className="font-inter font-medium text-small">{label}</span>
                    </a>
                  );
                })}
              </nav>
            </div>
          </aside>

          {/* ── Right content card ───────────────────────────────── */}
          <div className="col-span-12 md:col-span-9">
            <article className="bg-surface-white border border-border-subtle rounded-lg p-6 shadow-card">

              {/* Effective date row */}
              <div className="flex justify-between items-center mb-8 border-b border-divider-line pb-2">
                <span className="text-text-muted font-inter font-medium text-caption uppercase tracking-wider">
                  Effective October 24, 2023
                </span>
                <div className="flex gap-2 items-center">
                  <span className="w-2 h-2 rounded-full bg-brand-black" />
                  <span className="text-text-heading font-semibold font-inter text-small">Standard Agreement</span>
                </div>
              </div>

              {/* Legal sections */}
              <div className="space-y-8">
                {SECTIONS.map((s) => (
                  <section key={s.id} id={s.id}>
                    <h2 className="text-text-heading font-poppins font-semibold text-card mb-2">
                      {s.num}. {s.title}
                    </h2>
                    {s.contentJsx ? (
                      <p className="text-text-body font-inter font-normal text-body">
                        If you have any questions regarding these Terms or our Privacy Policy,
                        please reach out to our legal department at{' '}
                        <a href="mailto:legal@bocc.edu" className="font-bold underline text-text-body hover:text-text-heading">legal@bocc.edu</a>.
                      </p>
                    ) : (
                      <>
                        <p className="text-text-body font-inter font-normal text-body">{s.content}</p>
                        {s.list && (
                          <ul className="list-disc ml-5 space-y-2 mt-2 text-text-body font-inter font-normal text-body">
                            {s.list.map((item) => <li key={item}>{item}</li>)}
                          </ul>
                        )}
                      </>
                    )}
                  </section>
                ))}
              </div>

              {/* Action bar */}
              <div className="mt-8 pt-8 border-t border-divider-line flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex gap-4">
                  <Link to="/login">
                    <button
                      className="bg-action-bg text-action-text px-6 py-3 rounded-md hover:opacity-90 transition-all active:scale-[0.98] font-inter font-medium text-small"
                    >
                      Accept &amp; Continue
                    </button>
                  </Link>
                  <ComingSoon label="Download PDF" position="top" inline>
                    <span
                      className="bg-surface-white border border-border-subtle text-text-heading px-6 py-3 rounded-md hover:bg-canvas-bg transition-all flex items-center gap-2 active:scale-[0.98] font-inter font-medium text-small inline-block"
                    >
                      <Download size={18} strokeWidth={2} />
                      Download PDF
                    </span>
                  </ComingSoon>
                </div>
                <a href="#contact-information" className="text-text-body hover:underline font-inter font-normal text-small">
                  Still have questions? <span className="underline">Contact Support</span>
                </a>
              </div>

            </article>
          </div>

        </div>
      </main>

      {/* ── Footer ────────────────────────────────────────────────── */}
      <footer className="w-full mt-auto bg-canvas-bg border-t border-divider-line">
        <div
          className="grid grid-cols-1 md:grid-cols-4 mx-auto py-8 px-4 lg:px-10"
          style={{
            maxWidth: 'var(--spacing-container-max)',
            gap: 'var(--spacing-gutter)',
          }}
        >
          {/* BOCC blurb */}
          <div className="flex flex-col gap-2">
            <Logo variant="mark" size={20} />
            <p className="text-text-body font-inter font-normal text-small">
              Bridging the gap between academic life and the professional business orbit.
            </p>
          </div>
          {/* Company */}
          <div className="flex flex-col gap-2">
            <h4 className="text-text-heading font-inter font-semibold text-small mb-2">Company</h4>
            <nav className="flex flex-col gap-2">
              {['About Us', 'Our Team', 'Careers'].map((l) => (
                <ComingSoon key={l} label={l} position="top" inline>
                  <span className="text-text-muted hover:text-text-heading transition-colors font-inter font-normal text-small">
                    {l}
                  </span>
                </ComingSoon>
              ))}
            </nav>
          </div>
          {/* Resources */}
          <div className="flex flex-col gap-2">
            <h4 className="text-text-heading font-inter font-semibold text-small mb-2">Resources</h4>
            <nav className="flex flex-col gap-2">
              {['Documentation', 'Club Handbook', 'Partner Perks'].map((l) => (
                <ComingSoon key={l} label={l} position="top" inline>
                  <span className="text-text-muted hover:text-text-heading transition-colors font-inter font-normal text-small">
                    {l}
                  </span>
                </ComingSoon>
              ))}
            </nav>
          </div>
          {/* Legal */}
          <div className="flex flex-col gap-2">
            <h4 className="text-text-heading font-inter font-semibold text-small mb-2">Legal</h4>
            <nav className="flex flex-col gap-2">
              <Link to="/legal/privacy-policy" className="text-text-heading font-semibold font-inter text-small">
                Privacy Policy
              </Link>
              <Link to="/legal/privacy-policy" className="text-text-muted hover:text-text-heading transition-colors font-inter font-normal text-small">
                Terms of Service
              </Link>
              <ComingSoon label="Cookie Settings" position="top" inline>
                <span className="text-text-muted hover:text-text-heading transition-colors font-inter font-normal text-small">
                  Cookie Settings
                </span>
              </ComingSoon>
            </nav>
          </div>
        </div>
        {/* Copyright bar */}
        <div
          className="mx-auto py-4 border-t border-divider-line text-center px-4 lg:px-10"
          style={{ maxWidth: 'var(--spacing-container-max)' }}
        >
          <p className="text-text-muted font-inter font-normal text-small">
            © 2024 Business Orbit Campus Clubs. All rights reserved.
          </p>
        </div>
      </footer>

    </div>
  );
}
