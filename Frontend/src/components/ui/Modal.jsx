import { useEffect } from 'react';
import { X } from 'lucide-react';

/**
 * @component Modal
 * @description
 * Centered dialog — backdrop, Escape-to-close, click-backdrop-to-close.
 * Same mechanics as Sidebar.jsx's mobile drawer backdrop, generalized into
 * a reusable component since the Admin portal's verification-decision
 * screen needs three of these (Approve / Reject / Request-more-docs).
 *
 * @prop {boolean} isOpen
 * @prop {function} onClose
 * @prop {string} [title]
 * @prop {ReactNode} children
 */
export default function Modal({ isOpen, onClose, title, children }) {
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} aria-hidden="true" />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="relative bg-surface-white rounded-xl border border-border-subtle shadow-overlay w-full max-w-md p-6 animate-slide-in"
      >
        <div className="flex items-start justify-between gap-4 mb-4">
          {title && <h3 className="font-poppins font-semibold text-card text-text-heading">{title}</h3>}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="text-text-muted hover:text-text-heading transition-colors -m-1 p-1 rounded-full hover:bg-canvas-bg shrink-0"
          >
            <X size={18} strokeWidth={2} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
