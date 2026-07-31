export default function CheckboxPills({ label, options, selected, onToggle }) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-caption font-medium text-text-heading font-inter">
        {label}
      </span>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const active = selected.includes(option);
          return (
            <button
              key={option}
              type="button"
              onClick={() => onToggle(option)}
              aria-pressed={active}
              className={`font-inter text-caption font-semibold px-3 py-1.5 rounded-full border transition-all ${
                active
                  ? "bg-brand-black text-white border-brand-black dark:bg-white dark:text-brand-black dark:border-white"
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
