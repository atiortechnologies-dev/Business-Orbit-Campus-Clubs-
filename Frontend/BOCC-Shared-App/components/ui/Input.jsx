/**
 * @component Input
 * @description
 * Accessible form input with label, optional icon slots, validation error,
 * and optional helper text. Renders an associated <label> + <input> pair.
 *
 *  – `error` prop: string — displayed below in red with a fade+slide-in
 *    animation. When set, border and focus ring switch to the error color
 *    and aria-invalid is set.
 *  – `rightSlot` is NOT pointer-events-none — it can contain an interactive
 *    element (e.g. the password eye-toggle button), which manages its own
 *    focus/click styling independently of this input.
 *  – Focus ring uses --color-brand-black.
 *  – Input background is bg-surface-white (same token the surrounding Card
 *    uses), so it reads as a slightly recessed field inside the card rather
 *    than a separate surface.
 *
 * @param {object}          props
 * @param {string}          props.id                - Unique id (required for label association)
 * @param {string}          props.label             - Visible label text
 * @param {string}          [props.labelClassName]  - Extra classes on <label>
 * @param {string}          [props.type='text']     - HTML input type
 * @param {string}          [props.placeholder]     - Placeholder text
 * @param {string}          [props.autoComplete]    - autocomplete attribute
 * @param {string}          [props.error]           - Validation error message
 * @param {string}          [props.helperText]      - Hint text (shown only when no error)
 * @param {React.ReactNode} [props.leftSlot]        - Decorative icon on the left
 * @param {React.ReactNode} [props.rightSlot]       - Icon or interactive button on the right
 * @param {string}          [props.className]       - Extra classes on the wrapper div
 * @param {boolean}         [props.required]        - Whether the field is required
 */
export default function Input({
  id,
  label,
  labelClassName = '',
  type = 'text',
  placeholder = '',
  autoComplete,
  error,
  helperText,
  leftSlot,
  rightSlot,
  className = '',
  required = false,
  ...rest
}) {
  const hasError = Boolean(error);

  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {/* Label */}
      <label htmlFor={id} className={`text-[12px] font-medium leading-[16px] text-text-heading font-inter ${labelClassName}`}>
        {label}
        {required && (
          <span className="text-error ml-0.5" aria-hidden="true">*</span>
        )}
      </label>

      {/* Input row */}
      <div className="relative flex items-center">
        {leftSlot && (
          <span
            className="absolute left-3 flex items-center text-text-muted pointer-events-none select-none"
            aria-hidden="true"
          >
            {leftSlot}
          </span>
        )}

        <input
          id={id}
          name={id}
          type={type}
          placeholder={placeholder}
          autoComplete={autoComplete}
          required={required}
          aria-invalid={hasError || undefined}
          aria-describedby={
            hasError
              ? `${id}-error`
              : helperText
              ? `${id}-hint`
              : undefined
          }
          className={[
            'w-full rounded-md border bg-surface-white text-sm text-text-body font-inter',
            'placeholder:text-text-muted',
            'transition-all duration-150 ease-linear',
            'focus:outline-none focus:border-brand-black focus:ring-1 focus:ring-brand-black',
            'min-h-[44px] py-2.5',
            leftSlot ? 'pl-9' : 'pl-3',
            rightSlot ? 'pr-9' : 'pr-3',
            hasError
              ? 'border-error focus:border-error focus:ring-error'
              : 'border-border-subtle focus:border-brand-black',
          ]
            .filter(Boolean)
            .join(' ')}
          {...rest}
        />

        {/* rightSlot has NO pointer-events-none — it may contain an
            interactive button (eye-toggle). The button inside manages
            its own focus/click styles. */}
        {rightSlot && (
          <span className="absolute right-3 flex items-center text-text-muted">
            {rightSlot}
          </span>
        )}
      </div>

      {/* Validation error — fades and slides in, deliberately no shake */}
      {hasError && (
        <p
          id={`${id}-error`}
          role="alert"
          className="text-xs text-error font-inter animate-slide-in"
        >
          {error}
        </p>
      )}

      {/* Helper text — only shown when no error */}
      {helperText && !hasError && (
        <p id={`${id}-hint`} className="text-xs text-text-muted font-inter">
          {helperText}
        </p>
      )}
    </div>
  );
}
