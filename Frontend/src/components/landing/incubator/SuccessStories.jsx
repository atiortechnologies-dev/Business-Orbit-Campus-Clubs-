import { Quote, Star } from "lucide-react";

const STORIES = [
  {
    quote:
      "Partnering with BOCC helped us standardize our incubation process and significantly improve startup success rates.",
    author: "Director, University Incubator",
    role: "Partner Institution",
  },
  {
    quote:
      "The mentor network and investor access gave our student founders a head start most incubators can only dream of.",
    author: "Head of Innovation, Tech Campus",
    role: "Partner Institution",
  },
  {
    quote:
      "BOCC's analytics dashboards transformed how we track and report on startup progress to our stakeholders.",
    author: "Program Manager, Seed Hub",
    role: "Partner Institution",
  },
];

export default function SuccessStories() {
  return (
    <section
      id="stories"
      className="py-20 lg:py-28 bg-canvas-bg border-y border-border-subtle"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="font-inter text-caption font-semibold tracking-wider uppercase text-text-heading bg-accent-neon/15 px-3 py-1 rounded-full">
            Success Stories
          </span>
          <h2 className="font-poppins font-bold text-3xl lg:text-4xl tracking-tight text-text-heading mt-4">
            Trusted by Incubators Worldwide
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {STORIES.map((s) => (
            <div
              key={s.author}
              className="bg-surface-white border border-border-subtle rounded-lg p-8 hover:shadow-card hover:-translate-y-1 transition-all duration-300 flex flex-col"
            >
              <Quote
                size={32}
                strokeWidth={2}
                className="text-accent-neon mb-4"
              />
              <div className="flex gap-0.5 mb-4">
                {Array.from({ length: 5 }).map((_, j) => (
                  <Star
                    key={j}
                    size={16}
                    strokeWidth={0}
                    fill="currentColor"
                    className="text-accent-neon"
                  />
                ))}
              </div>
              <p className="font-inter text-body text-text-body leading-relaxed flex-1">
                &ldquo;{s.quote}&rdquo;
              </p>
              <div className="mt-6 pt-5 border-t border-border-subtle">
                <div className="font-poppins font-semibold text-small text-text-heading">
                  {s.author}
                </div>
                <div className="font-inter text-caption text-text-muted mt-0.5">
                  {s.role}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
