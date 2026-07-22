import { TrendingUp, TrendingDown } from 'lucide-react';

/**
 * @component StatCard
 * @description
 * Metric tile — label, large value, optional icon and trend/subtext.
 * Introduced for the Admin portal's KPI rows (e.g. "Pending Reviews 42,
 * +12% from last week") but generic enough for any dashboard stat.
 *
 * @prop {string} label
 * @prop {string|number} value
 * @prop {ReactNode} [icon]           Small icon shown top-right of the label row.
 * @prop {string} [subtext]           Caption below the value (e.g. "Daily Target: 25").
 * @prop {'up'|'down'} [trendDirection]  Tints subtext + adds a matching arrow icon.
 * @prop {string} [className]
 */
const TREND_ICON = { up: TrendingUp, down: TrendingDown };
const TREND_COLOR = { up: 'text-success', down: 'text-error' };

export default function StatCard({ label, value, icon, subtext, trendDirection, className = '' }) {
  const TrendIcon = trendDirection ? TREND_ICON[trendDirection] : null;

  return (
    <div className={`bg-surface-white border border-border-subtle rounded-lg p-6 shadow-card ${className}`}>
      <div className="flex items-center justify-between mb-2">
        <p className="font-inter font-medium text-caption uppercase tracking-wider text-text-muted">
          {label}
        </p>
        {icon && <span className="text-text-muted" aria-hidden="true">{icon}</span>}
      </div>
      <p className="font-poppins font-semibold text-section text-text-heading">{value}</p>
      {subtext && (
        <p className={`mt-1 flex items-center gap-1 font-inter text-small ${trendDirection ? TREND_COLOR[trendDirection] : 'text-text-muted'}`}>
          {TrendIcon && <TrendIcon size={14} strokeWidth={2} aria-hidden="true" />}
          {subtext}
        </p>
      )}
    </div>
  );
}
