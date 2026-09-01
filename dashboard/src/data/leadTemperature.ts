import type { LeadTemperature } from '@/hooks/useLeads';

/**
 * How warm a request is. Tracked per service (a client can be desperate for one
 * filing and lukewarm about another) and rolled up to the lead as the hottest
 * of them for the Status column on the Leads board.
 */

export const TEMPERATURE_LABELS: Record<LeadTemperature, string> = {
  HOT: 'Hot', WARM: 'Warm', COLD: 'Cold',
};

export const TEMPERATURE_STYLES: Record<LeadTemperature, { bg: string; text: string; ring: string }> = {
  HOT:  { bg: 'bg-red-100',   text: 'text-red-700',   ring: 'ring-red-300'   },
  WARM: { bg: 'bg-amber-100', text: 'text-amber-700', ring: 'ring-amber-300' },
  COLD: { bg: 'bg-sky-100',   text: 'text-sky-700',   ring: 'ring-sky-300'   },
};
