/**
 * @component Button
 * @description
 * Reusable button with three visual variants and two sizes.
 *
 *  – primary: bg-action-bg/text-action-text — these are theme-aware tokens
 *    (dark canvas → light fill), not the fixed brand-black, so the button
 *    stays visible in both light and dark mode.
 *  – outline: subtle border, hover fills lightly.
 *  – focus-visible ring: ring-brand-black (all variants).
 *  – active:scale-[.98] for tactile press feedback.
 *
 * @param {object}   props
 * @param {React.ReactNode} props.children
 * @param {'primary'|'outline'|'ghost'} [props.variant='primary']
 * @param {'md'|'sm'}  [props.size='md']
 * @param {string}     [props.className]
 * @param {string}     [props.type='button']
 * @param {boolean}    [props.fullWidth=false]
 * @param {boolean}    [props.disabled=false]
 * @param {function}   [props.onClick]
 */
export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  type = 'button',
  fullWidth = false,
  disabled = false,
  onClick,
  ...rest
}) {
  const base = [
    'inline-flex items-center justify-center gap-2 font-semibold rounded-md font-poppins',
    'transition-all duration-150 ease-linear',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-brand-black',
    'active:scale-[.98]',
    'disabled:cursor-not-allowed disabled:active:scale-100',
    'cursor-pointer',
  ].join(' ');

  const variants = {
    primary:
      'bg-action-bg text-action-text hover:bg-[#1F2937] disabled:bg-[#F3F4F6] disabled:text-[#9CA3AF]',
    outline:
      'border border-border-subtle text-text-heading bg-surface-white hover:bg-[#F9FAFB] disabled:bg-[#F3F4F6] disabled:text-[#9CA3AF] disabled:border-border-subtle',
    ghost:
      'text-text-body bg-transparent hover:bg-canvas-bg',
  };

  const sizes = {
    md: 'px-5 py-2.5 text-sm min-h-[44px]',
    sm: 'px-4 py-2 text-xs min-h-[36px]',
  };

  return (
    <button
      type={type}
      disabled={disabled}
      className={[
        base,
        variants[variant],
        sizes[size],
        fullWidth ? 'w-full' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      onClick={onClick}
      {...rest}
    >
      {children}
    </button>
  );
}
