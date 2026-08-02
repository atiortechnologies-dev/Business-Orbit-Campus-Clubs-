const LEVEL_LABELS = ['WAITING...', 'WEAK', 'FAIR', 'GOOD', 'STRONG'];

const LABEL_COLORS = [
  'text-text-muted',
  'text-error',
  'text-warning',
  'text-info',
  'text-success',
];

const BAR_COLORS = [
  '',                   // 0 — unused (segments use bg-border-subtle when empty)
  'bg-error',
  'bg-warning',
  'bg-info',
  'bg-success',
];

export default function PasswordStrengthMeter({ strength = 0 }) {
  const s = Math.min(Math.max(Math.floor(strength), 0), 4);
  const label = LEVEL_LABELS[s];
  const labelColor = LABEL_COLORS[s];
  const barColor = BAR_COLORS[s] || '';

  return (
    <div className="flex flex-col gap-1" aria-live="polite" aria-atomic="true">
      <div className="flex items-center justify-between">
        <span className="text-caption font-medium uppercase tracking-wider text-text-heading font-inter">
          SECURITY STRENGTH
        </span>
        <span
          className={`text-caption font-medium uppercase tracking-wider transition-colors duration-200 font-inter ${labelColor}`}
        >
          {label}
        </span>
      </div>

      <div
        className="flex gap-px"
        role="img"
        aria-label={`Password strength: ${label}`}
      >
        {Array.from({ length: 4 }, (_, i) => (
          <div
            key={i}
            className={[
              'flex-1 h-1 rounded-sm',
              'transition-colors duration-200 ease-out',
              i < s ? barColor : 'bg-border-subtle',
            ].join(' ')}
          />
        ))}
      </div>
    </div>
  );
}
