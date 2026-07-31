import { Link } from "react-router-dom";

export default function CTA() {
  return (
    <section className="bg-brand-black text-white">
      <div className="max-w-7xl mx-auto px-5 lg:px-10 py-20 lg:py-28 text-center">
        <h2 className="font-poppins font-bold text-3xl lg:text-5xl">
          Ready to Build the Next Great Startup?
        </h2>
        <p className="mt-4 font-inter text-body text-white/70 max-w-xl mx-auto">
          Join thousands of student founders, mentors and investors already
          building the future with BOCC.
        </p>
        <div className="mt-8 flex flex-wrap gap-3 justify-center">
          <Link
            to="/role-selection"
            className="bg-white text-brand-black px-6 py-3 rounded-md font-poppins font-semibold text-small hover:opacity-90 active:scale-[0.98] transition-all"
          >
            Register Now
          </Link>
          <Link
            to="/signup/incubator"
            className="border border-white/20 text-white px-6 py-3 rounded-md font-poppins font-medium text-small hover:bg-white/10 transition-colors"
          >
            Become a Partner
          </Link>
        </div>
      </div>
    </section>
  );
}
