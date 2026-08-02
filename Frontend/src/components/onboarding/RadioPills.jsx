export default function RadioPills({ label, options, value, onChange }) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-caption font-medium text-text-heading font-inter">
        {label}
      </span>
      <div
        role="radiogroup"
        aria-label={label}
        className="flex flex-wrap gap-2"
      >
        {options.map((option) => {
          const active = value === option;
          return (
            <button
              key={option}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => onChange(option)}
              className={`font-inter text-caption font-semibold px-3 py-1.5 rounded-full border transition-all ${
                active
                  ? "bg-brand-black text-white border-brand-black"
                  : "bg-surface-white text-text-body border-border-subtle hover:border-text-muted"
              }`}
            >
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
}
