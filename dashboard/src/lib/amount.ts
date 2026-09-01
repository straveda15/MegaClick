/**
 * Keeps a money field to digits and a single decimal point.
 *
 * `<input type="number">` is not enough on its own: browsers accept `e`, `+`
 * and `-` inside it, and report the whole field as an empty string when what
 * was typed doesn't parse — so the user watches their input vanish with no
 * explanation. A text input filtered on the way in never gets into that state.
 *
 * Returns the cleaned string, capped at two decimal places. An empty field
 * stays empty, since a quotation is allowed to be left unset.
 */
export function sanitizeAmountInput(raw: string, maxDecimals = 2): string {
  // Everything that is not a digit or a dot simply never lands.
  const cleaned = raw.replace(/[^\d.]/g, '');

  const [whole, ...rest] = cleaned.split('.');
  if (rest.length === 0) return whole;

  // A second dot is dropped rather than splitting the number in two.
  const decimals = rest.join('').slice(0, maxDecimals);
  return `${whole}.${decimals}`;
}
