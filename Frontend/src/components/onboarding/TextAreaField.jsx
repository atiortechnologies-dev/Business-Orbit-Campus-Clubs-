export default function TextAreaField({ id, label, value, onChange, placeholder, rows = 4 }) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-caption font-medium text-text-heading font-inter">
        {label}
      </label>
      <textarea
        id={id}
        name={id}
        rows={rows}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full rounded-md border border-border-subtle bg-surface-white text-sm text-text-body font-inter placeholder:text-text-muted transition-all duration-150 ease-linear focus:outline-none focus:border-brand-black focus:ring-1 focus:ring-brand-black px-3 py-2.5 resize-none"
      />
    </div>
  );
}
