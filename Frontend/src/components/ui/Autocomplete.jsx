import { useState, useRef, useEffect } from "react";
import Input from "./Input";

export default function Autocomplete({
  id,
  label,
  options = [],
  value,
  onChange,
  placeholder,
  required,
  disabled,
  isLoading,
  ...rest
}) {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);

  const filteredOptions = options.filter((opt) =>
    opt.toLowerCase().includes((value || "").toLowerCase()),
  );

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [wrapperRef]);

  const handleSelect = (opt) => {
    onChange({ target: { value: opt } });
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={wrapperRef}>
      <Input
        id={id}
        label={label}
        value={value}
        onChange={(e) => {
          onChange(e);
          setIsOpen(true);
        }}
        onFocus={() => setIsOpen(true)}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        autoComplete="off"
        {...rest}
      />

      {isOpen && !disabled && (
        <ul className="absolute z-10 w-full mt-1 max-h-60 overflow-y-auto bg-surface-white border border-border-subtle rounded-md shadow-card font-inter text-sm text-text-body py-1">
          {isLoading ? (
            <li className="px-3 py-2 text-text-muted italic">Loading...</li>
          ) : filteredOptions.length > 0 ? (
            filteredOptions.map((opt) => (
              <li
                key={opt}
                className="px-3 py-2 cursor-pointer hover:bg-canvas-bg hover:text-text-heading transition-colors"
                onMouseDown={(e) => {
                  e.preventDefault();
                }}
                onClick={() => handleSelect(opt)}
              >
                {opt}
              </li>
            ))
          ) : (
            <li className="px-3 py-2 text-text-muted italic">
              No matches found
            </li>
          )}
        </ul>
      )}
    </div>
  );
}
