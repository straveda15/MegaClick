import { useState } from 'react';
import { ChevronDown, Download, FileSpreadsheet, FileText } from 'lucide-react';
import { toast } from 'sonner';
import { exportSheet, type SheetColumn, type SheetFormat } from '@/lib/sheet';

interface ExportMenuProps<T> {
  rows: T[];
  columns: SheetColumn<T>[];
  /** File name stem — the date and extension are appended automatically. */
  baseName: string;
  label?: string;
  className?: string;
}

/**
 * Export button offering the same data as either CSV or Excel. Exports whatever
 * rows are passed in, so on-screen search/filters carry through to the file.
 */
export function ExportMenu<T>({ rows, columns, baseName, label = 'Export', className = '' }: ExportMenuProps<T>) {
  const [open, setOpen] = useState(false);

  const handleExport = (format: SheetFormat) => {
    setOpen(false);

    if (rows.length === 0) {
      toast.error('Nothing to export.');
      return;
    }

    try {
      exportSheet(rows, columns, baseName, format);
      toast.success(`Exported ${rows.length} row${rows.length === 1 ? '' : 's'} to ${format.toUpperCase()}.`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Export failed.');
    }
  };

  return (
    <div className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 h-9 px-4 rounded-md border border-border bg-card text-sm font-medium text-foreground hover:bg-muted transition-colors"
      >
        <Download className="w-4 h-4" />
        {label}
        <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-1 w-48 bg-card border border-border rounded-lg shadow-md z-20 py-1">
            <button
              type="button"
              onClick={() => handleExport('xlsx')}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-muted transition-colors"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
              Excel (.xlsx)
            </button>
            <button
              type="button"
              onClick={() => handleExport('csv')}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-muted transition-colors"
            >
              <FileText className="w-4 h-4 text-blue-600" />
              CSV (.csv)
            </button>
            <p className="px-3 pt-1.5 pb-1 text-[11px] text-muted-foreground border-t border-border mt-1">
              Exports the {rows.length} row{rows.length === 1 ? '' : 's'} currently shown.
            </p>
          </div>
        </>
      )}
    </div>
  );
}

export default ExportMenu;
