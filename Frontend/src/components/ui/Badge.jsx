const VARIANTS = {
  success: 'bg-success/15 text-success',
  warning: 'bg-warning/15 text-warning',
  error: 'bg-error/15 text-error',
  info: 'bg-info/15 text-info',
  neutral: 'bg-border-subtle/60 text-text-muted',
  brand: 'bg-brand-black text-white',
};

// Renders whatever case `children` is passed in rather than forcing
// uppercase — design guide wants Title Case ("Under Review", not "UNDER
// REVIEW"). Pre-existing screens with their own inline uppercase badges
// don't need retrofitting; this is just the standard going forward.
export default function Badge({ variant = 'neutral', children, className = '' }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-inter font-semibold text-caption whitespace-nowrap ${VARIANTS[variant] ?? VARIANTS.neutral} ${className}`}
    >
      {children}
    </span>
  );
}
