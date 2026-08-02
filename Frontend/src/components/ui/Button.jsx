export default function Button({
  children,
  variant = "primary",
  size = "md",
  className = "",
  type = "button",
  fullWidth = false,
  disabled = false,
  onClick,
  ...rest
}) {
  const base = [
    "inline-flex items-center justify-center gap-2 font-semibold rounded-md font-poppins",
    "transition-all duration-150 ease-linear",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-brand-black",
    "active:scale-[.98]",
    "disabled:cursor-not-allowed disabled:active:scale-100",
    "cursor-pointer",
  ].join(" ");

  const variants = {
    // `hover:opacity-90` rather than a hardcoded hover color — dims
    // whatever action-bg/action-text already are, matching the pattern
    // used elsewhere in the app (e.g. incubator/Settings.jsx's Save
    // Changes button).
    primary:
      "bg-action-bg text-action-text hover:opacity-90 disabled:bg-canvas-bg disabled:text-text-muted",
    outline:
      "border border-border-subtle text-text-heading bg-surface-white hover:bg-canvas-bg disabled:bg-canvas-bg disabled:text-text-muted disabled:border-border-subtle",
    ghost: "text-text-body bg-transparent hover:bg-canvas-bg",
  };

  const sizes = {
    md: "px-5 py-2.5 text-sm min-h-[44px]",
    sm: "px-4 py-2 text-xs min-h-[36px]",
  };

  return (
    <button
      type={type}
      disabled={disabled}
      className={[
        base,
        variants[variant],
        sizes[size],
        fullWidth ? "w-full" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      onClick={onClick}
      {...rest}
    >
      {children}
    </button>
  );
}
