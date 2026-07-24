// Client-side CSV export — used by every Admin/Incubator table's "Export
// CSV" action. No backend call needed since the data is already loaded on
// the page; this just serializes what's currently in state/rows.

function escapeCell(value) {
  const str = String(value ?? '');
  return /[",\n]/.test(str) ? `"${str.replace(/"/g, '""')}"` : str;
}

/**
 * @param {string} filename    Without extension — ".csv" is appended.
 * @param {Array<{key: string, label: string}>} columns
 * @param {Array<Object>} rows
 */
export function downloadCsv(filename, columns, rows) {
  const header = columns.map((c) => escapeCell(c.label)).join(',');
  const lines = rows.map((row) => columns.map((c) => escapeCell(row[c.key])).join(','));
  const csv = [header, ...lines].join('\r\n');

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${filename}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}
