export default function Card({ children, className = "" }) {
  return (
    <div
      className={`bg-surface-white rounded-lg border border-border-subtle shadow-card p-6 transition-all duration-150 ease-linear ${className}`}
    >
      {children}
    </div>
  );
}
