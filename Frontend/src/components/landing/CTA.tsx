export default function CTA() {
  return (
    <section className="bg-black text-white">
      <div className="max-w-7xl mx-auto px-5 lg:px-10 py-20 lg:py-28 text-center">
        <h2 className="text-3xl lg:text-5xl font-black">Ready to Build the Next Great Startup?</h2>
        <p className="mt-4 text-white/70 max-w-xl mx-auto">
          Join thousands of student founders, mentors and investors already building the future with BOCC.
        </p>
        <div className="mt-8 flex flex-wrap gap-3 justify-center">
          <a href="#" className="bg-brand text-brand-foreground px-6 py-3 rounded-lg text-sm font-semibold hover:brightness-95 transition-all">Register Now</a>
          <a href="#" className="border border-white/20 px-6 py-3 rounded-lg text-sm font-medium hover:bg-white/10 transition-colors">Become a Partner</a>
        </div>
      </div>
    </section>
  );
}
