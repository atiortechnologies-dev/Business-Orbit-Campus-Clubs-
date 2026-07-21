/**
 * @component RoleCard
 * @description
 * Selectable card representing a user role. Purely presentational —
 * receives `selected` as a prop; the parent (RoleSelectionPage) owns
 * the selection state via native radio inputs.
 *
 *  – No role="button" / aria-pressed / tabIndex here — those semantics
 *    come from the native <input type="radio"> the parent wraps this in.
 *  – Selected state: border-brand-black (2px), icon/text stay on their
 *    normal tokens — only the border and the badge below signal selection.
 *  – "Selected" badge: bg-accent-neon + text-brand-black (the neon accent
 *    is reserved for exactly this kind of selection signal). Position is
 *    top-left, overlapping the card border — confirmed placement, not a
 *    default to second-guess.
 *  – transition-all duration-150 ease-linear on the card for a smooth
 *    selection transition.
 *
 * @param {object}          props
 * @param {string}          props.title        - Role name
 * @param {string}          props.description  - Short description
 * @param {React.ReactNode} props.icon         - Lucide icon element
 * @param {boolean}         [props.selected=false]
 */
export default function RoleCard({ title, description, icon, selected = false }) {
  return (
    <div className="relative">
      {/* "Selected" badge — top-left corner, overlapping border */}
      {selected && (
        <span
          className="absolute -top-2.5 -left-2.5 z-10 inline-flex items-center rounded-full bg-accent-neon px-2 py-0.5 text-[10px] font-semibold text-brand-black leading-none font-inter"
          aria-label="Selected role"
        >
          Selected
        </span>
      )}

      <div
        className={[
          'flex flex-col items-center gap-3 p-5 rounded border text-center w-full',
          'transition-all duration-150 ease-linear',
          selected
            ? 'border-brand-black border-2 bg-surface-white'
            : 'border-border-subtle bg-surface-white hover:border-text-muted',
        ].join(' ')}
      >
        {/* Icon swatch wrapper */}
        <div
          className="w-12 h-12 rounded-full bg-canvas-bg flex items-center justify-center text-text-body transition-colors duration-150"
          aria-hidden="true"
        >
          {icon}
        </div>

        <span className="font-semibold text-[14px] leading-[20px] text-text-heading leading-tight font-inter">{title}</span>
        <span className="text-[12px] leading-[16px] text-text-muted leading-snug font-inter">{description}</span>
      </div>
    </div>
  );
}
