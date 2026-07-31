export default function SelectField({
  id,
  label,
  value,
  onChange,
  options,
  placeholder = "Select an option",
}) {
  return (
    <div className="flex flex-col gap-1">
      <label
        htmlFor={id}
        className="text-caption font-medium text-text-heading font-inter"
      >
        {label}
      </label>
      <select
        id={id}
        name={id}
        value={value}
        onChange={onChange}
        className="w-full rounded-md border border-border-subtle bg-surface-white text-sm text-text-body font-inter transition-all duration-150 ease-linear focus:outline-none focus:border-brand-black focus:ring-1 focus:ring-brand-black min-h-[44px] px-3"
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}
