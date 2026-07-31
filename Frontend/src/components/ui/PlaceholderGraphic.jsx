// Stand-in for marketing imagery (product screenshots, partner photos,
// testimonial headshots) that doesn't exist yet — these are real photos
// waiting on real content, not an app state we can illustrate our way out
// of, so faking a photo here would be dishonest rather than a placeholder.
// Uses the same dashed-border + icon + caption convention the rest of the
// app already relies on for "this area is intentional, just empty for now"
// (see the upload dropzones), instead of inventing a second visual style.
export default function PlaceholderGraphic({
  icon: Icon,
  label,
  iconSize = 28,
  className = "",
  children,
}) {
  return (
    <div
      className={`relative border-2 border-dashed border-border-subtle bg-canvas-bg flex flex-col items-center justify-center gap-2 ${className}`}
    >
      <Icon size={iconSize} strokeWidth={1.5} className="text-text-muted" />
      {label && (
        <span className="font-inter text-caption font-medium text-text-muted text-center px-4">
          {label}
        </span>
      )}
      {children}
    </div>
  );
}
