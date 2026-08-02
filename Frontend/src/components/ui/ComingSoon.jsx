import { useState } from 'react';

// Marks a not-yet-built feature. Shows a "Coming Soon" tooltip on hover or
// keyboard focus; never navigates or fires an action (aria-disabled, no
// onClick). The wrapper is always a <div>, not a real <button> — several
// callers pass block-level children (e.g. a whole card), and a <button> can
// only legally contain inline content. Using div + role="button" keeps it
// keyboard-focusable and screen-reader-announced as a button without that
// HTML restriction, so any children are safe here.
export default function ComingSoon({
  children,
  label,
  position = 'top', // 'top' or 'bottom'
  className = '',
  inline = false,
}) {
  const [show, setShow] = useState(false);

  return (
    <div className={`relative ${inline ? 'inline-flex' : 'flex w-full'} items-center`}>
      <div
        role="button"
        tabIndex={0}
        aria-disabled="true"
        aria-label={`${label} — Coming Soon`}
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        onFocus={() => setShow(true)}
        onBlur={() => setShow(false)}
        className={`text-text-muted cursor-not-allowed select-none outline-none focus:outline-none ${inline ? '' : 'w-full'} ${className}`}
      >
        {children}
      </div>
      {show && (
        <div
          className="absolute left-1/2 -translate-x-1/2 z-50 px-2 py-1 text-[11px] font-inter font-medium text-white bg-brand-black rounded shadow-md pointer-events-none whitespace-nowrap"
          style={{
            bottom: position === 'top' ? '120%' : 'auto',
            top: position === 'bottom' ? '120%' : 'auto',
          }}
        >
          Coming Soon
        </div>
      )}
    </div>
  );
}