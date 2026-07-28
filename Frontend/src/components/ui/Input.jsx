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
      <label htmlFor={id} className={`text-caption font-medium text-text-heading font-inter ${labelClassName}`}>
        {label}
        {required && (
          <span className="text-error ml-0.5" aria-hidden="true">*</span>
        )}
      </label>

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
            // bg-surface-white matches the surrounding Card, so the field
            // reads as recessed rather than a separate surface.
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

      {helperText && !hasError && (
        <p id={`${id}-hint`} className="text-xs text-text-muted font-inter">
          {helperText}
        </p>
      )}
    </div>
  );
}
