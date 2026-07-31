const STATS = [
  { value: "500+", label: "Student Startups" },
  { value: "100+", label: "Industry Mentors" },
  { value: "50+", label: "Partner Institutions" },
  { value: "15+", label: "Countries" },
];

// Fixed brand-black panel, same pattern as other dark sections across the
// app — every color inside is a fixed value, never a theme-reactive token.
export default function Stats() {
  return (
    <section
      id="stats"
      className="py-20 lg:py-28 bg-brand-black relative overflow-hidden"
    >
      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="font-inter text-caption font-semibold tracking-wider uppercase text-accent-neon">
            Partnership Benefits
          </span>
          <h2 className="font-poppins font-bold text-3xl lg:text-4xl tracking-tight text-white mt-3">
            A Network Built for Scale
          </h2>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {STATS.map((s) => (
            <div key={s.label} className="text-center">
              <div className="font-poppins font-bold text-5xl lg:text-6xl tracking-tight bg-gradient-to-b from-accent-neon to-white bg-clip-text text-transparent">
                {s.value}
              </div>
              <div className="font-inter text-small text-white/60 mt-2 font-medium">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
