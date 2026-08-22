import { useRef, useState, type ReactNode } from 'react';
import { FileSpreadsheet, Loader2, Upload, X } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { downloadTemplate, parseSheetFile, type SheetColumn } from '@/lib/sheet';

export interface ImportResult {
  imported: number;
  skipped?: Array<{ row: number; reason: string }>;
  /** Rows that DID import but were missing recommended (non-blocking) fields. */
  incomplete?: Array<{ row: number; missing: string[] }>;
}

interface ImportSheetDialogProps<K extends string> {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  /** Accepted columns — drives both parsing and the on-screen column reference. */
  columns: Array<SheetColumn<never> & { key: K }>;
  templateBaseName: string;
  /** Extra controls (e.g. a fallback assignee picker) rendered above the file picker. */
  options?: ReactNode;
  /** Blocks the import button while required `options` are unset. */
  optionsIncomplete?: boolean;
  onImport: (rows: Array<Record<K, string>>) => Promise<ImportResult>;
  onImported?: () => void;
}

const PREVIEW_ROWS = 5;

/**
 * Two-step spreadsheet import: pick a file, see exactly what was parsed out of
 * it, then commit. Nothing is written until the user confirms the preview, so a
 * sheet with the wrong columns is caught before it reaches the database.
 */
export function ImportSheetDialog<K extends string>({
  open,
  onOpenChange,
  title,
  description,
  columns,
  templateBaseName,
  options,
  optionsIncomplete = false,
  onImport,
  onImported,
}: ImportSheetDialogProps<K>) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState('');
  const [rows, setRows] = useState<Array<Record<K, string>>>([]);
  const [parseError, setParseError] = useState('');
  const [importing, setImporting] = useState(false);

  const reset = () => {
    setFileName('');
    setRows([]);
    setParseError('');
    setImporting(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleFile = async (file?: File) => {
    if (!file) return;
    setParseError('');
    setRows([]);
    setFileName(file.name);

    try {
      setRows(await parseSheetFile(file, columns));
    } catch (error) {
      setParseError(error instanceof Error ? error.message : 'Could not read that file.');
    }
  };

  const handleImport = async () => {
    if (rows.length === 0) return;
    setImporting(true);

    try {
      const result = await onImport(rows);
      const skipped = result.skipped ?? [];
      const incomplete = result.incomplete ?? [];

      if (skipped.length > 0) {
        toast.warning(
          `Imported ${result.imported} of ${rows.length} rows. ${skipped.length} skipped.`,
          { description: skipped.slice(0, 3).map((s) => `Row ${s.row}: ${s.reason}`).join(' · ') }
        );
      } else {
        toast.success(`Imported ${result.imported} row${result.imported === 1 ? '' : 's'}.`);
      }

      if (incomplete.length > 0) {
        toast.warning(
          `${incomplete.length} imported row${incomplete.length === 1 ? '' : 's'} ${incomplete.length === 1 ? 'is' : 'are'} missing details — fill them in when you can.`,
          {
            description: incomplete
              .slice(0, 3)
              .map((r) => `Row ${r.row}: missing ${r.missing.join(', ')}`)
              .join(' · '),
          }
        );
      }

      onImported?.();
      onOpenChange(false);
      reset();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Import failed.');
    } finally {
      setImporting(false);
    }
  };

  const previewColumns = columns.slice(0, 5);

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        onOpenChange(next);
        if (!next) reset();
      }}
    >
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
          {/* Column reference + template download */}
          <div className="rounded-md border border-border bg-muted/30 p-3">
            <div className="flex items-start justify-between gap-3 mb-2">
              <p className="text-[11px] font-semibold uppercase tracking-[0.06em] text-muted-foreground">
                Accepted columns
              </p>
              <div className="flex gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => downloadTemplate(columns, templateBaseName, 'xlsx')}
                  className="text-[11px] font-medium text-blue-600 hover:underline"
                >
                  Excel template
                </button>
                <button
                  type="button"
                  onClick={() => downloadTemplate(columns, templateBaseName, 'csv')}
                  className="text-[11px] font-medium text-blue-600 hover:underline"
                >
                  CSV template
                </button>
              </div>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {columns.map((col) => (
                <span
                  key={col.key}
                  className={`text-[11px] px-2 py-0.5 rounded-full border ${
                    col.required
                      ? 'bg-blue-50 text-blue-700 border-blue-200 font-medium'
                      : 'bg-card text-muted-foreground border-border'
                  }`}
                >
                  {col.header}{col.required ? ' *' : ''}
                </span>
              ))}
            </div>
            <p className="text-[11px] text-muted-foreground mt-2">
              Column order doesn't matter and extra columns are ignored. Starred columns are required.
            </p>
          </div>

          {options}

          {/* File picker */}
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,.xls,.xlsx,text/csv,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            className="hidden"
            onChange={(e) => handleFile(e.target.files?.[0])}
          />

          {!fileName ? (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full rounded-lg border-2 border-dashed border-border hover:border-blue-400 hover:bg-blue-50/40 transition-colors py-10 flex flex-col items-center gap-2"
            >
              <Upload className="w-6 h-6 text-muted-foreground" />
              <span className="text-sm font-medium text-foreground">Choose a CSV or Excel file</span>
              <span className="text-xs text-muted-foreground">.csv, .xls and .xlsx are all supported</span>
            </button>
          ) : (
            <div className="rounded-lg border border-border bg-card p-3 flex items-center gap-3">
              <FileSpreadsheet className="w-5 h-5 text-blue-600 shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-foreground truncate">{fileName}</p>
                <p className="text-xs text-muted-foreground">
                  {parseError
                    ? 'Could not be read'
                    : `${rows.length} row${rows.length === 1 ? '' : 's'} ready to import`}
                </p>
              </div>
              <button
                type="button"
                onClick={reset}
                className="p-1.5 rounded-md hover:bg-muted text-muted-foreground shrink-0"
                aria-label="Remove file"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {parseError && (
            <div className="rounded-md border border-destructive/30 bg-destructive/5 p-3">
              <p className="text-sm text-destructive">{parseError}</p>
            </div>
          )}

          {/* Preview */}
          {rows.length > 0 && (
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.06em] text-muted-foreground mb-2">
                Preview — first {Math.min(PREVIEW_ROWS, rows.length)} of {rows.length}
              </p>
              <div className="border border-border rounded-md overflow-x-auto">
                <table className="w-full text-xs">
                  <thead className="bg-muted/40 border-b border-border">
                    <tr>
                      {previewColumns.map((col) => (
                        <th key={col.key} className="px-3 py-2 text-left font-semibold text-muted-foreground whitespace-nowrap">
                          {col.header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {rows.slice(0, PREVIEW_ROWS).map((row, i) => (
                      <tr key={i}>
                        {previewColumns.map((col) => (
                          <td key={col.key} className="px-3 py-2 text-foreground whitespace-nowrap max-w-[180px] truncate">
                            {row[col.key] || <span className="text-muted-foreground">—</span>}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={importing}>
            Cancel
          </Button>
          <Button onClick={handleImport} disabled={rows.length === 0 || importing || optionsIncomplete}>
            {importing && <Loader2 className="w-4 h-4 animate-spin" />}
            {importing ? 'Importing…' : `Import ${rows.length || ''} row${rows.length === 1 ? '' : 's'}`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default ImportSheetDialog;
