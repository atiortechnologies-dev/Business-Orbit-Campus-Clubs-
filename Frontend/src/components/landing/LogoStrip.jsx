// Generic placeholder logo slots, not named real institutions — the
// original version listed specific real universities/VCs (Stanford, MIT,
// Y Combinator, Sequoia...) as if they were confirmed partners, which is a
// factual claim this project has no basis for, not just unfinished copy.
const SLOTS = Array.from({ length: 6 });

export default function LogoStrip({ title = 'Trusted by leading institutions' }) {
  return (
    <section className="bg-surface-white py-12 border-y border-border-subtle">
      <div className="max-w-7xl mx-auto px-5 lg:px-10">
        <p className="text-center font-inter text-caption uppercase tracking-widest text-text-muted mb-8">{title}</p>
        <div className="flex flex-wrap items-center justify-around gap-x-10 gap-y-6">
          {SLOTS.map((_, i) => (
            <div key={i} className="w-24 h-8 placeholder-box rounded-md" />
          ))}
        </div>
      </div>
    </section>
  );
}
