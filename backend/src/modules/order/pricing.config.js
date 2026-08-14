/**
 * Centralised order-pricing constants + Partial COD math.
 *
 * Partial COD: customer prepays online (2% of subtotal + full delivery charge)
 * and pays the remaining goods value (subtotal − 2%) as COD on delivery.
 *   grandTotal = subtotal + deliveryCharge   (the 2% is an advance, not a surcharge)
 *   prepaid    = round(2% × subtotal) + deliveryCharge
 *   codDue     = subtotal − round(2% × subtotal)
 */

export const SHIPPING_CHARGE = 49;
export const FREE_DELIVERY_THRESHOLD = 2000;
export const PARTIAL_COD_PERCENT = 0.02;

/** Delivery charge for a given goods subtotal. */
export function computeDeliveryCharge(subtotal) {
  return subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : SHIPPING_CHARGE;
}

/** The 2% advance, rounded to the nearest rupee. */
export function computePartialCodAdvance(subtotal) {
  return Math.round((subtotal || 0) * PARTIAL_COD_PERCENT);
}

/**
 * Resolve prepaid (charge online now) and codDue (collect on delivery).
 *
 * The 2% advance is on the pre-discount subtotal, but the COD balance is the
 * DISCOUNTED goods value minus that advance, so prepaid + codDue equals the
 * order's finalAmount (discounted goods + delivery).
 */
export function computePartialCodSplit(subtotal, deliveryCharge, discountAmount = 0) {
  const advance = computePartialCodAdvance(subtotal);
  const discountedGoods = (subtotal || 0) - (discountAmount || 0);
  return {
    prepaidAmount: advance + (deliveryCharge || 0),
    codDueAmount: Math.max(0, discountedGoods - advance),
  };
}
