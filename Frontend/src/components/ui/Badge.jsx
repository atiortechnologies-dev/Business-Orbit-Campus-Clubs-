/**
 * @component Badge
 * @description
 * Small status pill — tinted background + matching text color, using the
 * semantic status tokens (never a raw hex). Introduced for the Admin
 * portal's tables/detail views (statuses, priorities, verification flags)
 * but generic enough for any status label.
 *
 * Deliberately renders whatever case `children` is passed in rather than
 * forcing uppercase — the design guide asks for Title Case status text
 * ("Under Review", not "UNDER REVIEW"). Older screens built before this
 * component existed use their own inline uppercase badge markup; this
 * isn't a mandate to go back and change those, just the standard for new
 * screens from here on.
 *
 * @prop {'success'|'warning'|'error'|'info'|'neutral'|'brand'} [variant='neutral']
 * @prop {ReactNode} children
 * @prop {string} [className]
 */
const VARIANTS = {
  success: 'bg-success/15 text-success',
  warning: 'bg-warning/15 text-warning',
  error: 'bg-error/15 text-error',
  info: 'bg-info/15 text-info',
  neutral: 'bg-border-subtle/60 text-text-muted',
  brand: 'bg-brand-black text-white',
};

export default function Badge({ variant = 'neutral', children, className = '' }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-inter font-semibold text-caption whitespace-nowrap ${VARIANTS[variant] ?? VARIANTS.neutral} ${className}`}
    >
      {children}
    </span>
  );
}
