/**
 * Single source of truth for "how does this order's payment map onto a shipment?"
 *
 * This exists because the answer was previously derived independently in three
 * places — dispatch.orchestrator.js, shipment.dto.js, and shipment.service.js —
 * and they disagreed. Partial COD (paymentStatus: "PARTIAL") fell through the
 * cracks of every one of them:
 *
 *   - dispatch.orchestrator.js keyed off `paymentStatus === 'PENDING'`, so a
 *     PARTIAL order shipped as PREPAID and the courier collected ₹0.
 *   - shipment.dto.js keyed off `paymentStatus === 'SUCCESS'`, so it shipped as
 *     COD but with the FULL order value — double-charging the online advance.
 *
 * Any new shipping code path must call this rather than re-deriving the rules.
 */

/**
 * @param {Object} order - Mongoose Order document (or lean object).
 * @returns {{
 *   paymentMethod: string|undefined,
 *   paymentStatus: string|undefined,
 *   isPartialCOD: boolean,
 *   isPrepaid: boolean,
 *   paymentMode: "PREPAID"|"COD",
 *   prepaidAmount: number,
 *   codAmount: number,
 *   orderTotal: number,
 * }}
 */
export function resolveShipmentPayment(order) {
  const paymentMethod = order?.payment?.paymentMethod;
  const paymentStatus = order?.payment?.paymentStatus;

  const orderTotal = order?.pricing?.finalAmount ?? 0;

  // Partial COD: the online advance is already settled, but a balance is still
  // collected on delivery — so the courier ships it COD, for the balance only.
  const isPartialCOD = paymentMethod === "partial_cod";

  // Fully settled online. PARTIAL is deliberately NOT prepaid, and the
  // isPartialCOD guard comes first so a partial order can never land here.
  const isPrepaid = !isPartialCOD && paymentStatus === "SUCCESS";

  const prepaidAmount = isPartialCOD
    ? (order?.pricing?.prepaidAmount ?? 0)
    : (isPrepaid ? orderTotal : 0);

  // What the courier actually collects at the door.
  let codAmount;
  if (isPrepaid) {
    codAmount = 0;
  } else if (isPartialCOD) {
    codAmount = order?.pricing?.codDueAmount ?? 0;
  } else {
    codAmount = orderTotal; // plain COD — collect the lot
  }

  return {
    paymentMethod,
    paymentStatus,
    isPartialCOD,
    isPrepaid,
    // Providers only understand PREPAID | COD (see ShippingProvider.supportedMethods),
    // so partial COD is presented to them as COD — with a reduced collectible.
    paymentMode: isPrepaid ? "PREPAID" : "COD",
    prepaidAmount,
    codAmount,
    orderTotal,
  };
}
