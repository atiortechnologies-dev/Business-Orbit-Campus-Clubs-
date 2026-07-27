import React, { useState } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function TagInput({ tags = [], onChange, placeholder, variant = 'light' }) {
  const [input, setInput] = useState('');

  const addTag = () => {
    const value = input.trim();
    if (value && !tags.includes(value)) {
      onChange([...tags, value]);
    }
    setInput('');
  };

  const removeTag = (tag) => {
    onChange(tags.filter((t) => t !== tag));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    } else if (e.key === 'Backspace' && !input && tags.length) {
      removeTag(tags[tags.length - 1]);
    }
  };

  return (
    <div
      className={cn(
        'flex min-h-[42px] w-full flex-wrap items-center gap-2 rounded-lg border border-[#E5E5E5] px-2.5 py-2',
        variant === 'light' ? 'bg-white' : 'bg-[#F9F9F9]'
      )}
    >
      {tags.map((tag) => (
        <span
          key={tag}
          className="inline-flex items-center gap-1 rounded-md bg-gray-900 px-2.5 py-1 text-xs font-medium text-white"
        >
          {tag}
          <button type="button" onClick={() => removeTag(tag)} className="text-white/70 hover:text-white">
            <X className="h-3 w-3" />
          </button>
        </span>
      ))}
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={addTag}
        placeholder={tags.length === 0 ? placeholder : ''}
        className="flex-1 bg-transparent text-sm text-black placeholder:text-gray-400 focus:outline-none"
      />
    </div>
  );
}