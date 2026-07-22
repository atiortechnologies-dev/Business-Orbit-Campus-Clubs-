/**
 * @component Card
 * @description
 * White surface container used for auth forms and most content sections.
 * bg-surface-white sits one step above bg-canvas-bg (the page background),
 * with a subtle border and shadow-card for elevation — same relationship
 * in both light and dark mode, the tokens just resolve to different values.
 *
 * @param {object}          props
 * @param {React.ReactNode} props.children    - Card content
 * @param {string}          [props.className] - Extra Tailwind classes
 */
export default function Card({ children, className = '' }) {
  return (
    <div
      className={`bg-surface-white rounded-lg border border-border-subtle shadow-card p-6 transition-all duration-150 ease-linear ${className}`}
    >
      {children}
    </div>
  );
}
