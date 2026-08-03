// Desktop renders a real column grid; below `md` it collapses to one
// column per row with an inline field label per cell — per the design
// guide's "Tabular Table Data Stacking" rule (a 6+ column table can't
// meaningfully shrink to a 375px screen).
export default function DataTable({
  columns,
  rows,
  onRowClick,
  emptyMessage = "No results.",
}) {
  // Every track wrapped in minmax(0, ...): a bare `Nfr` track has an implicit
  // min-width of its content's min-content, so unbreakable cell content (a
  // Badge, an IP address, a long id) blows the grid past its container
  // instead of shrinking. minmax(0, Nfr) lets the track actually shrink to
  // the allotted fraction and wrap/truncate its content instead. Bit us on
  // the 7-column Audit Log table — a 5-6 column table stays under the
  // threshold where it's visible, so it slipped through on those.
  // Column widths flow through a CSS custom property (`--cols`), read by
  // both the header and every row via the literal class
  // `md:grid-cols-[var(--cols)]` — Tailwind's class scanner only needs to
  // see that literal text in source, so don't interpolate widths directly
  // into a class string (e.g. `grid-cols-[${widths}]`); same gotcha as
  // Logo.jsx's sidebar sizing.
  const gridStyle = {
    "--cols": columns.map((c) => `minmax(0, ${c.width || "1fr"})`).join(" "),
  };

  if (rows.length === 0) {
    return (
      <div className="bg-surface-white border border-border-subtle rounded-xl shadow-card p-10 text-center">
        <p className="font-inter text-small text-text-muted">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div
      className="bg-surface-white border border-border-subtle rounded-xl shadow-card overflow-hidden"
      style={gridStyle}
    >
      {/* Header — desktop only, mobile rows carry their own inline labels */}
      <div className="hidden md:grid md:grid-cols-(--cols) gap-4 px-6 py-4 border-b border-border-subtle bg-canvas-bg/50">
        {columns.map((col) => (
          <div
            key={col.key}
            className="font-poppins font-semibold text-caption text-text-muted uppercase tracking-wider truncate"
          >
            {col.label}
          </div>
        ))}
      </div>

      <div className="divide-y divide-border-subtle">
        {rows.map((row) => {
          const cells = columns.map((col) => (
            <div key={col.key} className={col.className || ""}>
              {/* mobileLabel: false suppresses this inline label — useful
                  when the column is already self-explanatory, e.g. an avatar. */}
              {col.mobileLabel !== false && (
                <span className="md:hidden font-poppins font-semibold text-caption text-text-muted uppercase tracking-wider mr-2">
                  {col.label}:
                </span>
              )}
              {col.render ? col.render(row) : row[col.key]}
            </div>
          ));

          const rowClasses = `grid grid-cols-1 md:grid-cols-[var(--cols)] gap-2 md:gap-4 items-center px-6 py-4 md:py-5 w-full text-left transition-colors ${
            onRowClick ? "hover:bg-canvas-bg/40 cursor-pointer" : ""
          }`;

          return onRowClick ? (
            <button
              key={row.id}
              type="button"
              onClick={() => onRowClick(row)}
              className={rowClasses}
            >
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
