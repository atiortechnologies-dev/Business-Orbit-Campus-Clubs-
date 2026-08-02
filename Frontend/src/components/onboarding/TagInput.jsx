import { useState } from 'react';
import { X } from 'lucide-react';

// Real add/remove on already-loaded local state (not a stub) — press
// Enter to add, click the x to remove, same convention used for
// client-side-only operations throughout this codebase.
export default function TagInput({ id, label, tags, onChange, placeholder }) {
  const [draft, setDraft] = useState('');

  const addTag = (e) => {
    if (e.key !== 'Enter') return;
    e.preventDefault();
    const next = draft.trim();
    if (next && !tags.includes(next)) onChange([...tags, next]);
    setDraft('');
  };

  const removeTag = (tag) => onChange(tags.filter((t) => t !== tag));

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-caption font-medium text-text-heading font-inter">
        {label}
      </label>
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-inter font-semibold text-caption bg-border-subtle/60 text-text-heading"
            >
              {tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                aria-label={`Remove ${tag}`}
                className="text-text-muted hover:text-error transition-colors"
              >
                <X size={12} strokeWidth={2.5} />
              </button>
            </span>
          ))}
        </div>
      )}
      <input
        id={id}
        type="text"
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={addTag}
        placeholder={placeholder}
        className="w-full rounded-md border border-border-subtle bg-surface-white text-sm text-text-body font-inter placeholder:text-text-muted transition-all duration-150 ease-linear focus:outline-none focus:border-brand-black focus:ring-1 focus:ring-brand-black min-h-[44px] px-3"
      />
    </div>
  );
}
