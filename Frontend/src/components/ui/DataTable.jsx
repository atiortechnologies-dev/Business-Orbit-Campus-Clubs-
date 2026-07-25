/**
 * @component DataTable
 * @description
 * Generic data table for the Admin portal's queue/log screens. Desktop
 * renders a real column grid (header row + divided rows); below `md` it
 * collapses to one column per row with an inline field label per cell
 * (per the design guide's "Tabular Table Data Stacking" rule — a 6+ column
 * table can't meaningfully shrink to a 375px screen, so mobile gets a
 * stacked card instead of a squeezed table).
 *
 * The column-width grid is driven by a CSS custom property (`--cols`) that
 * both the header and every row reference via `md:grid-cols-[var(--cols)]`
 * — this works because Tailwind's class scanner only needs to see that
 * literal class text in source, the actual column widths are resolved by
 * the browser from the CSS variable at runtime. Don't try to interpolate
 * the widths directly into a Tailwind class string (e.g.
 * `grid-cols-[${widths}]`) — same gotcha as Logo.jsx's sidebar sizing,
 * Tailwind won't generate CSS for a class that doesn't appear as literal
 * text anywhere in this file.
 *
 * @prop {Array<{key, label, width?, render?: (row) => ReactNode, className?, mobileLabel?: boolean}>} columns
 *   `width` is a CSS grid-track value (e.g. '80px', '1.5fr') — defaults to '1fr'.
 *   `render` gets the whole row; omit to just print `row[key]`.
 *   `mobileLabel: false` suppresses the inline "Label:" prefix on mobile
 *   (useful for a column that's already self-explanatory, like an avatar).
 * @prop {Array<object>} rows          Each row needs a stable `id`.
 * @prop {function} [onRowClick]       (row) => void — renders rows as real
 *                                      buttons (keyboard/AT accessible)
 *                                      instead of static divs when passed.
 * @prop {string} [emptyMessage]
 */
export default function DataTable({ columns, rows, onRowClick, emptyMessage = 'No results.' }) {
  // Every track wrapped in minmax(0, ...): a bare `Nfr` track has an implicit
  // min-width of its content's min-content, so unbreakable cell content (a
  // Badge, an IP address, a long id) blows the grid past its container
  // instead of shrinking. minmax(0, Nfr) lets the track actually shrink to
  // the allotted fraction and wrap/truncate its content instead. Bit us on
  // the 7-column Audit Log table — a 5-6 column table stays under the
  // threshold where it's visible, so it slipped through on those.
  const gridStyle = { '--cols': columns.map((c) => `minmax(0, ${c.width || '1fr'})`).join(' ') };

  if (rows.length === 0) {
    return (
      <div className="bg-surface-white border border-border-subtle rounded-xl shadow-card p-10 text-center">
        <p className="font-inter text-small text-text-muted">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="bg-surface-white border border-border-subtle rounded-xl shadow-card overflow-hidden" style={gridStyle}>
      {/* Header — desktop only, mobile rows carry their own inline labels */}
      <div className="hidden md:grid md:grid-cols-[var(--cols)] gap-4 px-6 py-4 border-b border-border-subtle bg-canvas-bg/50">
        {columns.map((col) => (
          <div key={col.key} className="font-poppins font-semibold text-caption text-text-muted uppercase tracking-wider truncate">
            {col.label}
          </div>
        ))}
      </div>

      <div className="divide-y divide-border-subtle">
        {rows.map((row) => {
          const cells = columns.map((col) => (
            <div key={col.key} className={col.className || ''}>
              {col.mobileLabel !== false && (
                <span className="md:hidden font-poppins font-semibold text-caption text-text-muted uppercase tracking-wider mr-2">
                  {col.label}:
                </span>
              )}
              {col.render ? col.render(row) : row[col.key]}
            </div>
          ));

          const rowClasses = `grid grid-cols-1 md:grid-cols-[var(--cols)] gap-2 md:gap-4 items-center px-6 py-4 md:py-5 w-full text-left transition-colors ${
            onRowClick ? 'hover:bg-canvas-bg/40 cursor-pointer' : ''
          }`;

          return onRowClick ? (
            <button key={row.id} type="button" onClick={() => onRowClick(row)} className={rowClasses}>
              {cells}
            </button>
          ) : (
            <div key={row.id} className={rowClasses}>
              {cells}
            </div>
          );
        })}
      </div>
    </div>
  );
}
