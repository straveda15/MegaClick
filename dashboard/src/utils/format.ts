/**
 * Formatting helpers — used across finance/analytics dashboards.
 */

export const formatINR = (n?: number | null): string => {
  if (n == null || Number.isNaN(n)) return "—";
  if (n >= 10000000) return `₹${(n / 10000000).toFixed(2)}Cr`;
  if (n >= 100000)   return `₹${(n / 100000).toFixed(2)}L`;
  if (n >= 1000)     return `₹${(n / 1000).toFixed(1)}K`;
  return `₹${Math.round(n).toLocaleString("en-IN")}`;
};

export const formatDelta = (n?: number | null): string => {
  if (n == null || Number.isNaN(n)) return "—";
  const sign = n >= 0 ? "↑" : "↓";
  return `${sign} ${Math.abs(n)}%`;
};

export const todayIso = (): string =>
  new Date().toISOString().split("T")[0];

export const isoDaysAgo = (n: number): string => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().split("T")[0];
};

export const formatDate = (iso?: string | Date | null): string => {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
};

const toIsoDate = (d: Date) => {
  // Use local-date components so timezone doesn't shift the day by ±1.
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

export const firstDayOfThisMonthIso = (): string => {
  const d = new Date();
  d.setDate(1);
  return toIsoDate(d);
};

export const firstDayOfLastMonthIso = (): string => {
  const d = new Date();
  d.setMonth(d.getMonth() - 1);
  d.setDate(1);
  return toIsoDate(d);
};

export const lastDayOfLastMonthIso = (): string => {
  const d = new Date();
  d.setDate(0);   // day 0 of current month = last day of previous month
  return toIsoDate(d);
};
