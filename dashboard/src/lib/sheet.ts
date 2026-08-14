import * as XLSX from 'xlsx';

/**
 * Shared CSV/Excel import + export helpers.
 *
 * Both directions run entirely in the browser: exports are built from the rows
 * already on screen, and imports are parsed here and POSTed as JSON, so the
 * Services and Leads pages share one column-mapping story and can show the user
 * a preview before anything is written to the database.
 */

export type SheetFormat = 'csv' | 'xlsx';

/** A column in an exported sheet / an accepted column on import. */
export interface SheetColumn<T> {
  /** Header text written to the file and matched (case/spacing-insensitively) on import. */
  header: string;
  /** Pulls the cell value out of a row when exporting. */
  value: (row: T) => string | number | null | undefined;
  /** Extra header spellings accepted when importing. */
  aliases?: string[];
  /** Shown in the import dialog's column reference. */
  required?: boolean;
}

/**
 * Collapses header spellings so "Client Name", "client_name" and "CLIENT NAME"
 * all resolve to the same column.
 */
const normalizeHeader = (header: unknown) =>
  String(header ?? '').toLowerCase().replace(/[^a-z0-9]/g, '');

const timestamp = () => {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

const triggerDownload = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/** Builds the array-of-arrays (header row + data rows) an export writes out. */
const toGrid = <T>(rows: T[], columns: SheetColumn<T>[]) => [
  columns.map((c) => c.header),
  ...rows.map((row) => columns.map((c) => {
    const value = c.value(row);
    return value === null || value === undefined ? '' : value;
  })),
];

/**
 * Downloads `rows` as a .csv or .xlsx file. Both formats are written from the
 * same grid, so the two exports always carry identical columns and values.
 */
export function exportSheet<T>(
  rows: T[],
  columns: SheetColumn<T>[],
  baseName: string,
  format: SheetFormat
) {
  const sheet = XLSX.utils.aoa_to_sheet(toGrid(rows, columns));
  const filename = `${baseName}-${timestamp()}.${format}`;

  if (format === 'csv') {
    const csv = XLSX.utils.sheet_to_csv(sheet);
    // The BOM makes Excel open UTF-8 CSVs with accents/₹ intact.
    triggerDownload(new Blob([`﻿${csv}`], { type: 'text/csv;charset=utf-8;' }), filename);
    return;
  }

  const book = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(book, sheet, 'Data');
  const buffer = XLSX.write(book, { bookType: 'xlsx', type: 'array' }) as ArrayBuffer;
  triggerDownload(
    new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }),
    filename
  );
}

/** Downloads an empty sheet containing just the header row, as a starting point. */
export function downloadTemplate<T>(columns: SheetColumn<T>[], baseName: string, format: SheetFormat) {
  exportSheet<T>([], columns, `${baseName}-template`, format);
}

/**
 * Reads a user-picked .csv/.xls/.xlsx file into canonical row objects keyed by
 * the `key` of each matched column.
 *
 * Unrecognized columns are ignored and fully blank rows are dropped, so a sheet
 * carrying extra bookkeeping columns still imports cleanly.
 */
export async function parseSheetFile<K extends string>(
  file: File,
  columns: Array<{ key: K; header: string; aliases?: string[] }>
): Promise<Array<Record<K, string>>> {
  const buffer = await file.arrayBuffer();

  // `cellDates` keeps real date cells as Date objects instead of Excel serials.
  const book = XLSX.read(buffer, { type: 'array', cellDates: true });
  const firstSheet = book.SheetNames[0];
  if (!firstSheet) throw new Error('That file has no sheets in it.');

  const grid = XLSX.utils.sheet_to_json<unknown[]>(book.Sheets[firstSheet], {
    header: 1,
    blankrows: false,
    defval: '',
  });
  if (grid.length === 0) throw new Error('That file is empty.');

  // header spelling → canonical key
  const lookup = new Map<string, K>();
  for (const col of columns) {
    lookup.set(normalizeHeader(col.header), col.key);
    for (const alias of col.aliases ?? []) lookup.set(normalizeHeader(alias), col.key);
  }

  // Hand-made sheets often carry a title or blank rows above the real headers,
  // so use the first row that contains at least one column we recognize.
  const headerIndex = grid.findIndex((row) =>
    (row ?? []).some((cell) => lookup.has(normalizeHeader(cell)))
  );
  if (headerIndex === -1) {
    throw new Error(
      `No recognizable column headers found. Expected at least one of: ${columns.map((c) => c.header).join(', ')}.`
    );
  }

  const headerRow = grid[headerIndex] ?? [];
  const rows: Array<Record<K, string>> = [];

  for (const raw of grid.slice(headerIndex + 1)) {
    const cells = raw ?? [];
    const record = {} as Record<K, string>;
    let hasValue = false;

    headerRow.forEach((headerCell, colIndex) => {
      const key = lookup.get(normalizeHeader(headerCell));
      if (!key) return;

      const cell = cells[colIndex];
      // Dates round-trip as ISO yyyy-mm-dd so the server parses them the same
      // way whether they came from a real date cell or a plain text one.
      const value =
        cell instanceof Date
          ? cell.toISOString().slice(0, 10)
          : String(cell ?? '').trim();

      if (value) hasValue = true;
      record[key] = value;
    });

    if (hasValue) rows.push(record);
  }

  if (rows.length === 0) throw new Error('No data rows found below the header row.');
  return rows;
}
