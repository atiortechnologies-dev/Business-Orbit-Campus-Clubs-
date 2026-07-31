// Purely presentational — receives `selected` as a prop; the parent
// (RoleSelectionPage) owns the selection state via native radio inputs, so
// this renders no role="button"/aria-pressed/tabIndex of its own.
export default function RoleCard({
  title,
  description,
  icon,
  selected = false,
}) {
  return (
    <div className="relative">
      {/* accent-neon is reserved for exactly this kind of selection signal —
          don't reach for it elsewhere in the design system. */}
      {selected && (
        <span
          className="absolute -top-2.5 -left-2.5 z-10 inline-flex items-center rounded-full bg-accent-neon px-2 py-0.5 text-[10px] font-semibold text-brand-black leading-none font-inter"
          aria-label="Selected role"
        >
          Selected
        </span>
      )}

      <div
        className={[
          "flex flex-col items-center gap-3 p-5 rounded border text-center w-full",
          "transition-all duration-150 ease-linear",
          selected
            ? "border-brand-black border-2 bg-surface-white"
            : "border-border-subtle bg-surface-white hover:border-text-muted",
        ].join(" ")}
      >
        <div
          className="w-12 h-12 rounded-full bg-canvas-bg flex items-center justify-center text-text-body transition-colors duration-150"
          aria-hidden="true"
        >
          {icon}
        </div>

        <span className="font-semibold text-small text-text-heading font-inter">
          {title}
        </span>
        <span className="text-caption text-text-muted font-inter">
          {description}
        </span>
      </div>
    </div>
  );
}
