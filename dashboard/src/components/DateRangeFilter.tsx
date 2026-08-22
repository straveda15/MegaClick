import { useState } from 'react';
import type { DateRange } from 'react-day-picker';
import { CalendarIcon, X } from 'lucide-react';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

export type { DateRange };

interface DateRangeFilterProps {
  value: DateRange | undefined;
  onChange: (range: DateRange | undefined) => void;
  /** Tooltip on the icon — what the dates actually narrow. */
  label?: string;
  align?: 'start' | 'center' | 'end';
}

const PRESETS: Array<{ label: string; days: number }> = [
  { label: 'Today', days: 1 },
  { label: 'Last 7 days', days: 7 },
  { label: 'Last 30 days', days: 30 },
  { label: 'Last 90 days', days: 90 },
];

const startOfDay = (date: Date) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
};

const endOfDay = (date: Date) => {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d;
};

/** Trimmed-down day cells — the popup has to stay small enough for a toolbar. */
const COMPACT_CALENDAR = {
  caption_label: 'text-xs font-medium',
  head_cell: 'text-muted-foreground rounded-md w-7 font-normal text-[10px]',
  cell: 'h-7 w-7 text-center text-xs p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20',
  day: 'h-7 w-7 p-0 font-normal text-xs rounded-md hover:bg-muted aria-selected:opacity-100',
  nav_button: 'h-6 w-6 bg-transparent p-0 opacity-50 hover:opacity-100 rounded-md border border-border',
  month: 'space-y-2',
  row: 'flex w-full mt-1',
};

/**
 * Does `iso` fall inside the picked range? A range with only a start behaves as
 * "from that day onwards", which is what a half-finished pick should mean —
 * the table shouldn't empty out between the two clicks.
 */
export function isWithinRange(iso: string | null | undefined, range: DateRange | undefined) {
  if (!range?.from) return true;
  if (!iso) return false;

  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return false;
  if (date < startOfDay(range.from)) return false;
  if (range.to && date > endOfDay(range.to)) return false;
  return true;
}

/**
 * A calendar icon that opens a date range picker: quick ranges down the left,
 * the calendar itself on the right. Collapsed to just the icon until something
 * is picked, so it costs a toolbar nothing when unused.
 */
export default function DateRangeFilter({
  value,
  onChange,
  label = 'Filter by date',
  align = 'start',
}: DateRangeFilterProps) {
  const [open, setOpen] = useState(false);
  const active = Boolean(value?.from);

  const summary = value?.from
    ? value.to
      ? `${format(value.from, 'dd MMM')} – ${format(value.to, 'dd MMM')}`
      : format(value.from, 'dd MMM yyyy')
    : null;

  const applyPreset = (days: number) => {
    const to = new Date();
    const from = new Date();
    from.setDate(from.getDate() - (days - 1));
    onChange({ from: startOfDay(from), to: endOfDay(to) });
    setOpen(false);
  };

  return (
    <div className="flex items-center">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            title={label}
            aria-label={label}
            className={`flex items-center gap-1.5 h-9 rounded-md border transition-colors ${
              active
                ? 'px-2.5 rounded-r-none border-r-0 border-primary/40 bg-primary/10 text-primary'
                : 'w-9 justify-center border-border bg-card text-muted-foreground hover:bg-muted hover:text-foreground'
            }`}
          >
            <CalendarIcon className="w-4 h-4 shrink-0" />
            {summary && <span className="text-xs font-medium whitespace-nowrap">{summary}</span>}
          </button>
        </PopoverTrigger>

        <PopoverContent className="w-auto p-0" align={align}>
          <div className="flex">
            {/* Quick ranges, left */}
            <div className="flex flex-col gap-0.5 border-r border-border p-2 w-[112px] shrink-0">
              {PRESETS.map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => applyPreset(preset.days)}
                  className="h-7 px-2 rounded-md text-left text-xs font-medium text-foreground hover:bg-muted transition-colors"
                >
                  {preset.label}
                </button>
              ))}
              <button
                type="button"
                onClick={() => { onChange(undefined); setOpen(false); }}
                className="h-7 px-2 mt-1 rounded-md text-left text-xs font-medium text-muted-foreground hover:bg-muted transition-colors"
              >
                Clear
              </button>
            </div>

            {/* Calendar, right */}
            <Calendar
              mode="range"
              numberOfMonths={1}
              defaultMonth={value?.from}
              selected={value}
              onSelect={onChange}
              className="p-2 pointer-events-auto"
              classNames={COMPACT_CALENDAR}
            />
          </div>
        </PopoverContent>
      </Popover>

      {active && (
        <button
          type="button"
          onClick={() => onChange(undefined)}
          title="Clear date filter"
          aria-label="Clear date filter"
          className="h-9 w-7 flex items-center justify-center rounded-md rounded-l-none border border-primary/40 bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}

/* ── Single date ────────────────────────────────────────────────────────────── */

const SINGLE_PRESETS: Array<{ label: string; offset: number }> = [
  { label: 'Today', offset: 0 },
  { label: 'Yesterday', offset: 1 },
  { label: '2 days ago', offset: 2 },
  { label: 'A week ago', offset: 7 },
];

const toInputDate = (date: Date) => {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
};

interface SingleDateFilterProps {
  /** yyyy-MM-dd — the same string shape an `<input type="date">` produces. */
  value: string;
  onChange: (value: string) => void;
  label?: string;
  align?: 'start' | 'center' | 'end';
}

/**
 * The one-day sibling of DateRangeFilter, for boards that load a single date at
 * a time. Same icon trigger and the same quick-picks-left, calendar-right
 * layout, so the two read as one control across the app.
 */
export function SingleDateFilter({
  value,
  onChange,
  label = 'Pick a date',
  align = 'start',
}: SingleDateFilterProps) {
  const [open, setOpen] = useState(false);

  const selected = value ? new Date(`${value}T00:00:00`) : undefined;
  const valid = selected && !Number.isNaN(selected.getTime()) ? selected : undefined;
  const isToday = value === toInputDate(new Date());

  const applyPreset = (offset: number) => {
    const date = new Date();
    date.setDate(date.getDate() - offset);
    onChange(toInputDate(date));
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          title={label}
          aria-label={label}
          className="flex items-center gap-1.5 h-9 px-2.5 rounded-md border border-border bg-card text-sm text-foreground hover:bg-muted transition-colors"
        >
          <CalendarIcon className="w-4 h-4 shrink-0 text-muted-foreground" />
          <span className="text-xs font-medium whitespace-nowrap">
            {valid ? (isToday ? 'Today' : format(valid, 'dd MMM yyyy')) : label}
          </span>
        </button>
      </PopoverTrigger>

      <PopoverContent className="w-auto p-0" align={align}>
        <div className="flex">
          <div className="flex flex-col gap-0.5 border-r border-border p-2 w-[112px] shrink-0">
            {SINGLE_PRESETS.map((preset) => (
              <button
                key={preset.label}
                type="button"
                onClick={() => applyPreset(preset.offset)}
                className="h-7 px-2 rounded-md text-left text-xs font-medium text-foreground hover:bg-muted transition-colors"
              >
                {preset.label}
              </button>
            ))}
          </div>

          <Calendar
            mode="single"
            numberOfMonths={1}
            defaultMonth={valid}
            selected={valid}
            onSelect={(date) => {
              if (!date) return;
              onChange(toInputDate(date));
              setOpen(false);
            }}
            className="p-2 pointer-events-auto"
            classNames={COMPACT_CALENDAR}
          />
        </div>
      </PopoverContent>
    </Popover>
  );
}
