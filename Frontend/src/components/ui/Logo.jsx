// Natural PNG dimensions, measured via `sips -g pixelWidth -g pixelHeight`
// against the real files in /public/logos/. A previous guessed-from-Figma
// version of this table was wrong in both size and aspect ratio for all
// three variants — re-measure, don't guess, if these PNGs are ever replaced.
const DIMS = {
  mark: { w: 285, h: 305 } /* ~0.93:1 */,
  horizontal: { w: 305, h: 127 } /* ~2.40:1 */,
  stacked: { w: 112, h: 108 } /* ~1.04:1 */,
};

const FILENAME = {
  mark: "logo-mark",
  horizontal: "logo-lockup-horizontal",
  stacked: "logo-lockup-stacked",
};

// Fixed h-6 (24px) / md:h-8 (32px) per the design guide's sidebar sizing
// spec. Written as a literal class string, not computed from a number —
// Tailwind's class scanner only generates CSS for literal class text found
// in source, so a dynamic `h-[${size}px]` would never generate any styles.
const SIDEBAR_SIZE_CLASSES = "h-6 md:h-8 w-auto";

// priority: pass true only for the one above-the-fold logo per page
// (header/sidebar) — it eager-loads and competes for bandwidth with the
// rest of the page; footer/secondary copies should stay lazy (the default).
export default function Logo({
  variant = "horizontal",
  size = 32,
  sidebar = false,
  force,
  priority = false,
  className = "",
}) {
  const resolvedTheme = force ?? "light";

  const { w: nw, h: nh } = DIMS[variant] ?? DIMS.horizontal;
  const filename = FILENAME[variant] ?? FILENAME.horizontal;
  const src = `/logos/${filename}-${resolvedTheme}.png`;
  const alt = "BOCC — Business Orbit Campus Clubs";

  if (sidebar) {
    return (
      <img
        src={src}
        alt={alt}
        className={`object-contain select-none ${SIDEBAR_SIZE_CLASSES} ${className}`}
        style={{ aspectRatio: `${nw} / ${nh}` }}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
      />
    );
  }

  // Height is set via inline `style`, not the width/height HTML attributes —
  // two real bugs lived here before this. (1) An earlier version set
  // `style={{ width: 'auto', height: 'auto' }}`, which silently discarded
  // any computed size since inline style always wins over attributes —
  // every logo rendered at its raw PNG's native pixel size. (2) Removing
  // that style and relying on plain width/height attributes instead was
  // ALSO broken here: Tailwind v4's Preflight ships a global
  // `img, video { height: auto }` (see src/index.css's
  // `@import "tailwindcss"`), which beats an attribute-derived height too.
  // Inline `style` is the one thing that reliably wins over both.
  const displayWidth = Math.round((size / nh) * nw);

  return (
    <img
      src={src}
      alt={alt}
      width={displayWidth}
      height={size}
      className={`object-contain select-none ${className}`}
      style={{ height: size, aspectRatio: `${nw} / ${nh}` }}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : "auto"}
    />
  );
}
