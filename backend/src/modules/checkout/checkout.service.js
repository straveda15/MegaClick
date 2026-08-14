import PendingCheckout from "./pendingCheckout.model.js";
import { prepareOrderPayload } from "../order/order.service.js";
import * as paymentService from "../payment/payment.service.js";
import AppError from "../../shared/utils/appError.js";

/**
 * Start an online checkout (card / UPI / netbanking / partial COD).
 *
 * Deliberately does NOT create an Order — see pendingCheckout.model.js for why.
 * We stash a draft, hand PayU its id in udf1, and only build the real Order once
 * the success callback has verified the payment hash.
 */
export const initiateCheckout = async (userId, data, customer) => {
  // Same server-authoritative pricing the COD path uses — the two flows must not
  // drift on what gets charged.
  const prepared = await prepareOrderPayload(data);

  if (prepared.paymentMethod === "cod") {
    throw new AppError("COD orders are placed directly and must not go through PayU checkout", 400);
  }

  // Partial COD only charges the prepaid leg (2% + delivery) online; the balance
  // is collected on delivery. Everything else charges the full final amount.
  const amount = prepared.paymentMethod === "partial_cod"
    ? prepared.pricing.prepaidAmount
    : prepared.pricing.finalAmount;

  if (!amount || amount <= 0) {
    throw new AppError("Checkout has no payable amount", 400);
  }

  const draft = await PendingCheckout.create({
    userId,
    items: prepared.items,
    shippingAddress: prepared.shippingAddress,
    pricing: prepared.pricing,
    paymentMethod: prepared.paymentMethod,
    notes: prepared.notes,
    source: prepared.source,
  });

  const backendUrl = process.env.BACKEND_URL || `http://localhost:${process.env.PORT || 5000}`;

  const params = await paymentService.createPayUPaymentParams({
    orderId: String(draft._id),
    amount,
    // No order number exists yet — it is only assigned once payment succeeds —
    // so the transaction is described by its txnid instead.
    productinfo: "Everlive Order",
    firstname: customer.firstname,
    email: customer.email,
    phone: customer.phone,
    successUrl: `${backendUrl}/api/v1/payments/payu/success`,
    failureUrl: `${backendUrl}/api/v1/payments/payu/failure`,
    // The callbacks resolve the draft from this.
    udf1: String(draft._id),
  });

  // createPayUPaymentParams mints the txnid — record it so the success callback
  // can guard against PayU replaying the same payment into a duplicate order.
  draft.payuTxnid = params.txnid;
  await draft.save();

  return params;
};

export const findDraftById = (draftId) => PendingCheckout.findById(draftId).lean();

export const deleteDraft = (draftId) => PendingCheckout.findByIdAndDelete(draftId);
