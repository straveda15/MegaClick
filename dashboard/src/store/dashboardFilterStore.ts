import { create } from 'zustand';
import type { DateRange } from '@/components/DateRangeFilter';

interface DashboardFilterState {
  /** The calendar range narrowing the dashboard's cards; undefined means "all time". */
  dateRange: DateRange | undefined;
  setDateRange: (range: DateRange | undefined) => void;
}

/**
 * The dashboard's date filter lives in the top bar, beside the user menu, while
 * the cards it narrows are down in the page — two separate parts of the layout,
 * so the value is shared here rather than passed between them.
 */
export const useDashboardFilterStore = create<DashboardFilterState>((set) => ({
  dateRange: undefined,
  setDateRange: (dateRange) => set({ dateRange }),
}));
