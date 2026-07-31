const STORIES = [
  {
    quote:
      "BOCC took me from a dorm-room idea to a seed round in under four months. The mentorship was the difference.",
    author: "Aisha K.",
    meta: "Founder, Lumen · 2025",
  },
  {
    quote:
      "The investor intros were real and warm. We closed our pre-seed with three partners from the network.",
    author: "Marcus T.",
    meta: "Founder, Cadence · 2024",
  },
  {
    quote:
      "The 5-stage journey kept us honest. We validated before we built, and it saved us months.",
    author: "Priya R.",
    meta: "Founder, Strata · 2025",
  },
];

export default function SuccessStories() {
  return (
    <section className="py-20 md:py-28 bg-canvas-bg border-y border-border-subtle">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="max-w-2xl">
          <span className="font-inter text-caption font-semibold uppercase tracking-wider text-text-muted">
            Success Stories
          </span>
          <h2 className="mt-3 font-poppins font-bold text-3xl md:text-4xl lg:text-5xl tracking-tight text-text-heading">
            Founder Success Stories
          </h2>
          <p className="mt-4 font-inter text-body md:text-card text-text-body leading-relaxed">
            Students who walked the path — and what they built along the way.
          </p>
        </div>

        <div className="mt-14 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {STORIES.map((s) => {
            const initials = s.author
              .split(" ")
              .map((n) => n[0])
              .join("")
              .slice(0, 2)
              .toUpperCase();
            return (
              <div
                key={s.author}
                className="bg-surface-white border border-border-subtle rounded-md overflow-hidden flex flex-col p-6 md:p-7"
              >
                <div className="w-12 h-12 rounded-full bg-canvas-bg border border-border-subtle flex items-center justify-center font-poppins font-bold text-text-heading text-small select-none shrink-0 mb-5">
                  {initials}
                </div>
                <p className="font-inter text-small md:text-body text-text-body leading-relaxed flex-1">
                  &ldquo;{s.quote}&rdquo;
                </p>
                <div className="mt-6 pt-5 border-t border-border-subtle">
                  <div className="font-poppins font-semibold text-small text-text-heading">
                    {s.author}
                  </div>
                  <div className="font-inter text-caption text-text-muted mt-0.5">
                    {s.meta}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
