'use client';

import Image from 'next/image';
import { useTheme } from '@/components/ui/ThemeProvider';

/**
 * @component Logo
 * @description
 * Real BOCC logo via next/image. Theme-aware — automatically switches between
 * the -light and -dark asset variants using the ThemeProvider context.
 *
 * File naming convention in /public/logos/:
 *   logo-mark-{light|dark}.png
 *   logo-lockup-horizontal-{light|dark}.png
 *   logo-lockup-stacked-{light|dark}.png
 *
 * @prop {string}  variant  'mark' | 'horizontal' | 'stacked'  (default: 'horizontal')
 * @prop {number}  size     Desired height in px (default: 32).
 *                          Width is computed from each asset's natural aspect ratio.
 * @prop {string}  force    'light' | 'dark' — override the theme-based selection.
 * @prop {boolean} priority Pass true only for the one above-the-fold instance
 *                          per page (header/sidebar). next/image's `priority`
 *                          eagerly preloads the image, competing for bandwidth
 *                          with the rest of the page — footer/secondary copies
 *                          should stay lazy (the default).
 * @prop {string}  className  Additional CSS classes.
 */

/* Per-variant natural dimensions (width × height) from the provided PNGs */
const DIMS = {
  mark:       { w: 320,  h: 320  },   /* ~1:1 */
  horizontal: { w: 614,  h: 228  },   /* ~2.69:1 */
  stacked:    { w: 419,  h: 330  },   /* ~1.27:1 */
};

/* Maps variant name → actual filename segment */
const FILENAME = {
  mark:       'logo-mark',
  horizontal: 'logo-lockup-horizontal',
  stacked:    'logo-lockup-stacked',
};

export default function Logo({
  variant   = 'horizontal',
  size      = 32,
  force,
  priority  = false,
  className = '',
}) {
  const { theme } = useTheme();
  const resolvedTheme = force ?? theme;

  const { w: nw, h: nh } = DIMS[variant] ?? DIMS.horizontal;
  /* Derive display width from desired height while preserving aspect ratio */
  const displayWidth  = Math.round((size / nh) * nw);
  const displayHeight = size;

  const filename = FILENAME[variant] ?? FILENAME.horizontal;
  const src = `/logos/${filename}-${resolvedTheme}.png`;

  return (
    <Image
      src={src}
      alt="BOCC — Business Orbit Campus Clubs"
      width={displayWidth}
      height={displayHeight}
      style={{ width: 'auto', height: 'auto' }}
      className={`object-contain select-none ${className}`}
      priority={priority}
    />
  );
}
