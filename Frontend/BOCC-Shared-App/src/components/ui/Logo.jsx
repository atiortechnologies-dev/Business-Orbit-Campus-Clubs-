import { useTheme } from '@/components/ui/ThemeProvider';

/**
 * @component Logo
 * @description
 * Real BOCC logo. Theme-aware — automatically switches between
 * the -light and -dark asset variants using the ThemeProvider context.
 *
 * File naming convention in /public/logos/:
 *   logo-mark-{light|dark}.png
 *   logo-lockup-horizontal-{light|dark}.png
 *   logo-lockup-stacked-{light|dark}.png
 *
 * @prop {string}  variant   'mark' | 'horizontal' | 'stacked'  (default: 'horizontal')
 * @prop {number}  size      Desired height in px (default: 32). Ignored when
 *                           `sidebar` is true. Width is derived from the
 *                           asset's real aspect ratio.
 * @prop {boolean} sidebar   Design guide "Logo Usage — Sizing" spec for main
 *                           menus/sidebars: fixed 32px on desktop, 24px on
 *                           mobile. Renders responsive height instead of a
 *                           fixed `size`; overrides `size` when true.
 * @prop {string}  force     'light' | 'dark' — override the theme-based selection.
 * @prop {boolean} priority  Pass true only for the one above-the-fold instance
 *                           per page (header/sidebar) — eagerly loads/preloads
 *                           the image, competing for bandwidth with the rest of
 *                           the page — footer/secondary copies should stay lazy
 *                           (the default).
 * @prop {string}  className  Additional CSS classes.
 */

/* Per-variant natural dimensions (width × height), measured directly from
 * the real PNGs in /public/logos/ via `sips -g pixelWidth -g pixelHeight`.
 * A previous version of this table (mark 320x320, horizontal 614x228,
 * stacked 419x330) was wrong in both absolute size AND aspect ratio for
 * all three variants — if you ever regenerate/replace these PNGs, re-measure
 * and update this table, don't guess from a Figma export.
 */
const DIMS = {
  mark:       { w: 285, h: 305 },   /* ~0.93:1 */
  horizontal: { w: 305, h: 127 },   /* ~2.40:1 */
  stacked:    { w: 112, h: 108 },   /* ~1.04:1 */
};

/* Maps variant name → actual filename segment */
const FILENAME = {
  mark:       'logo-mark',
  horizontal: 'logo-lockup-horizontal',
  stacked:    'logo-lockup-stacked',
};

/* Design guide — Logo Usage, Sizing:
 *   Desktop: fixed at 32px height for main menus and sidebars.
 *   Mobile:  fixed at 24px height for compact mobile navigation.
 * Written as a literal Tailwind class string (h-6 = 24px, h-8 = 32px)
 * instead of computed from a number — Tailwind's class scanner only
 * generates CSS for classes that appear as literal text somewhere in the
 * source, it doesn't execute JS. A dynamically interpolated class like
 * `h-[${size}px]` would never actually produce any styles, since the exact
 * substring never appears in the file. Width is left to `w-auto` + the
 * `aspectRatio` style below (from the real measured ratio) instead of a
 * fixed pixel width, so the browser can still reserve the correct box at
 * either breakpoint's height without us hand-computing two widths.
 */
const SIDEBAR_SIZE_CLASSES = 'h-6 md:h-8 w-auto';

export default function Logo({
  variant   = 'horizontal',
  size      = 32,
  sidebar   = false,
  force,
  priority  = false,
  className = '',
}) {
  const { theme } = useTheme();
  const resolvedTheme = force ?? theme;

  const { w: nw, h: nh } = DIMS[variant] ?? DIMS.horizontal;
  const filename = FILENAME[variant] ?? FILENAME.horizontal;
  const src = `/logos/${filename}-${resolvedTheme}.png`;
  const alt = 'BOCC — Business Orbit Campus Clubs';

  if (sidebar) {
    return (
      <img
        src={src}
        alt={alt}
        className={`object-contain select-none ${SIDEBAR_SIZE_CLASSES} ${className}`}
        style={{ aspectRatio: `${nw} / ${nh}` }}
        loading={priority ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : 'auto'}
      />
    );
  }

  /* Derive display width from desired height while preserving aspect
   * ratio, and set the box via an inline `style` (height + aspectRatio),
   * NOT the width/height HTML attributes.
   *
   * Two separate bugs used to live here, both worth knowing about:
   *  1. A previous version set `style={{ width: 'auto', height: 'auto' }}`
   *     — inline style always wins over HTML attributes, so it silently
   *     discarded any computed size and every logo rendered at its raw
   *     PNG's native pixel size. That was the original "sizing is
   *     inconsistent everywhere" bug.
   *  2. Simply removing that style and relying on plain width/height
   *     attributes (the first fix attempt) turned out to be ALSO broken
   *     in this codebase specifically: Tailwind v4's Preflight reset
   *     ships `img, video { height: auto }` globally (see src/index.css's
   *     `@import "tailwindcss"`) — a real stylesheet rule beats an
   *     attribute-derived height too, so every fixed-size logo still
   *     rendered at the wrong (aspect-ratio-derived-from-width) height.
   *     Setting height via inline `style` sidesteps this the same way the
   *     `sidebar` path above already does — inline style is the one thing
   *     that reliably wins over both attributes AND Preflight.
   */
  const displayWidth = Math.round((size / nh) * nw);

  return (
    <img
      src={src}
      alt={alt}
      width={displayWidth}
      height={size}
      className={`object-contain select-none ${className}`}
      style={{ height: size, aspectRatio: `${nw} / ${nh}` }}
      loading={priority ? 'eager' : 'lazy'}
      fetchPriority={priority ? 'high' : 'auto'}
    />
  );
}
