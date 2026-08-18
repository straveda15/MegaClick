/**
 * Where a lead came from, as the team thinks about it.
 *
 * The database records the exact channel (`website_contact`, `excel`, `csv`,
 * `telephony`…), but on the board only one distinction matters: did the client
 * come to us through the website, or did someone here put them in? A
 * spreadsheet import is still someone here putting them in, so it reads as
 * Manual alongside a typed-in lead.
 */

export type LeadSourceLabel = 'Website' | 'Manual';

export const sourceLabel = (source?: string): LeadSourceLabel =>
  String(source ?? '').toLowerCase().startsWith('website') ? 'Website' : 'Manual';

export const SOURCE_STYLES: Record<LeadSourceLabel, { bg: string; text: string }> = {
  Website: { bg: 'bg-violet-100', text: 'text-violet-700' },
  Manual:  { bg: 'bg-slate-100',  text: 'text-slate-600'  },
};
