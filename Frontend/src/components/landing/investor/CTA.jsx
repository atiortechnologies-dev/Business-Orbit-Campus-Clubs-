import { Link } from 'react-router-dom';
import ComingSoon from '@/components/ui/ComingSoon';

export default function CTA() {
  return (
    <section className="relative mx-auto max-w-7xl px-6 py-24">
      <div className="relative mx-auto max-w-3xl text-center">
        <h2 className="font-poppins font-bold text-3xl md:text-5xl tracking-tight text-text-heading">
          Ready to Fuel the Next Wave of Innovation?
        </h2>
        <p className="mx-auto mt-5 max-w-xl font-inter text-small text-text-muted">
          Join BOCC&apos;s trusted investor network and gain exclusive access
          to promising student-led startups backed by mentorship, validation,
          and university partnerships.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link to="/signup/investor" className="rounded-md bg-action-bg px-5 py-3 font-inter text-small font-semibold text-action-text hover:opacity-90 transition-all">
            Join as an Investor
          </Link>
          <ComingSoon label="Contact Investment Team" position="top" inline className="rounded-md border border-border-subtle bg-surface-white px-5 py-3 font-inter text-small font-medium text-text-heading">
            Contact Investment Team
          </ComingSoon>
        </div>
        <p className="mt-6 font-inter text-[11px] text-text-muted">
          * All investment opportunities are subject to verification and
          regulatory compliance.
        </p>
      </div>
    </section>
  );
}
