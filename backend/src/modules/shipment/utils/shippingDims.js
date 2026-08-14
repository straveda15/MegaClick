/**
 * Parses a shipping dimension value that may be stored as a string with a unit
 * suffix (e.g. "220gm", "90.2mm", "29cm") or as a plain number.
 *
 * Returns the leading numeric portion as a JavaScript number, or null if the
 * value is absent or non-numeric.
 *
 * Examples:
 *   parseDim("220gm")  → 220
 *   parseDim("90.2mm") → 90.2
 *   parseDim("29cm")   → 29
 *   parseDim(220)      → 220   (plain numbers pass through unchanged)
 *   parseDim(null)     → null
 */
export function parseDim(value) {
  if (value === null || value === undefined) return null;
  if (typeof value === 'number') return Number.isFinite(value) ? value : null;
  const num = parseFloat(String(value));
  return Number.isFinite(num) ? num : null;
}

/**
 * Parses a linear dimension string and normalizes the result to centimetres.
 * Shipping providers (Shiprocket, Shipmozo) expect length/breadth/height in cm.
 *
 * Conversion rules:
 *   mm → cm  (divide by 10)
 *   m  → cm  (multiply by 100)
 *   cm → cm  (pass through)
 *   no unit / unrecognized unit → treated as cm
 *
 * Examples:
 *   parseDimToCm("90.2mm") → 9.02
 *   parseDimToCm("29cm")   → 29
 *   parseDimToCm("0.3m")   → 30
 *   parseDimToCm(29)       → 29   (plain numbers assumed to be cm)
 *   parseDimToCm(null)     → null
 */
export function parseDimToCm(value) {
  if (value === null || value === undefined) return null;
  if (typeof value === 'number') return Number.isFinite(value) ? value : null;
  const str = String(value).trim();
  const match = str.match(/^([\d.]+)\s*([a-z]*)/i);
  if (!match) return null;
  const num = parseFloat(match[1]);
  if (!Number.isFinite(num)) return null;
  const unit = (match[2] || '').toLowerCase();
  if (unit === 'mm') return +(num / 10).toFixed(4);
  if (unit === 'm')  return +(num * 100).toFixed(4);
  return num; // "cm" or no unit → already in cm
}
