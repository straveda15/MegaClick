import Order from "./order.model.js";
import { adjustStock } from "../operations/inventory/ops-inventory.service.js";
import { logAudit } from "../audit/audit.service.js";
import InventoryMovement from "../operations/inventory/inventory-movement.model.js";
import { withTransaction } from "../../shared/infrastructure/db.transaction.js";

const BLOCKED_ORDER_STATUSES = new Set(["SHIPPED", "DELIVERED", "CANCELLED", "REFUNDED", "FAILED"]);

// ── Editability ───────────────────────────────────────────────────────────────

export function getEditability(order) {
  if (BLOCKED_ORDER_STATUSES.has(order.orderStatus)) {
    return {
      canEdit: false,
      reason: `Order is ${order.orderStatus.toLowerCase()} and cannot be edited.`,
    };
  }
  if (order.dispatchStatus === "dispatched" || order.trackingNumber) {
    return {
      canEdit: false,
      reason: "Shipment is already dispatched with an AWB. Cancel the shipment before editing.",
    };
  }

  let warning = null;
  if (order.dispatchStatus === "dispatching" || order.dispatchStatus === "in_progress") {
    warning = "A shipping label has already been generated. This edit will void the label and reset dispatch.";
  } else if (order.packagingStatus === "packed") {
    warning = "This order is already packed. Editing will reset packing status.";
  } else if (order.packagingStatus === "in_progress") {
    warning = "This order is currently being packed.";
  }

  return { canEdit: true, warning };
}

// ── Permission check ──────────────────────────────────────────────────────────

export function canUserEditOrder(user) {
  if (!user) return false;
  if (user.role === "admin" || user.role === "dispatch_staff") return true;
  if (user.role === "employee") {
    const ops = user.operationalRoles ?? [];
    // Mirror requireDispatchStaff: operationalRoles array OR currentOperationalRole field
    if (
      ops.includes("dispatch") ||
      ops.includes("ops_staff") ||
      user.currentOperationalRole === "ops_staff" ||
      user.currentOperationalRole === "dispatch"
    ) return true;
    // departmentRole-based access (mirrors requireHR / requireManager patterns)
    if (user.departmentRole === "sales" || user.departmentRole === "dispatch") return true;
  }
  return false;
}

// ── Item diff ─────────────────────────────────────────────────────────────────

function diffItems(oldItems, newItems) {
  const map = new Map();

  for (const item of oldItems) {
    const key = item.productId.toString();
    map.set(key, {
      productId: item.productId,
      productName: item.productName,
      oldQty: item.quantity,
      newQty: 0,
    });
  }
  for (const item of newItems) {
    const key = item.productId.toString();
    const existing = map.get(key);
    if (existing) {
      existing.newQty = item.quantity;
    } else {
      map.set(key, {
        productId: item.productId,
        productName: item.productName,
        oldQty: 0,
        newQty: item.quantity,
      });
    }
  }

  return [...map.values()]
    .map(e => ({ ...e, delta: e.newQty - e.oldQty }))
    .filter(e => e.delta !== 0);
}

// ── Main edit function ────────────────────────────────────────────────────────

export async function editOrder(orderId, changes, actorId, ipAddress) {
  return withTransaction(async (session) => {
    const order = await Order.findById(orderId).session(session);
    if (!order) throw new Error("Order not found");

    const editability = getEditability(order);
    if (!editability.canEdit) throw new Error(editability.reason);

    const before = {
      items: order.items.map(i => ({
        productId: i.productId,
        productName: i.productName,
        quantity: i.quantity,
        priceAtPurchase: i.priceAtPurchase,
      })),
      shippingAddress: order.shippingAddress.toObject?.() ?? { ...order.shippingAddress },
      pricing: { ...order.pricing.toObject?.() ?? order.pricing },
      notes: order.notes,
    };

    // ── 1. Inventory diff and adjustment ──────────────────────────────────────
    if (changes.items !== undefined) {
      const diffs = diffItems(order.items, changes.items);

      for (const diff of diffs) {
        // delta > 0 → need more → reduce available; delta < 0 → release → increase available
        // adjustStock with -delta handles both: positive delta → negative quantity (reduce),
        // negative delta → positive quantity (increase). adjustStock throws if available < 0.
        await adjustStock(
          { productId: diff.productId, quantity: -diff.delta, type: "available" },
          session
        );

        await InventoryMovement.create(
          [
            {
              orderId: order._id,
              orderNumber: order.orderNumber,
              productId: diff.productId,
              productName: diff.productName,
              movementType: diff.delta > 0 ? "RESERVE" : "RELEASE",
              quantity: Math.abs(diff.delta),
              reason: "order_edit",
              performedBy: actorId,
            },
          ],
          { session }
        );
      }

      order.items = changes.items;

      // Reset packing and dispatch state when items change
      if (diffs.length > 0) {
        order.packagingStatus = "pending";
        order.assignedPackager = null;
        if (["in_progress", "dispatching"].includes(order.dispatchStatus)) {
          order.dispatchStatus = "pending";
          order.dispatchLockedAt = null;
        }
      }
    }

    // ── 2. Shipping address ───────────────────────────────────────────────────
    if (changes.shippingAddress) {
      Object.assign(order.shippingAddress, changes.shippingAddress);
    }

    // ── 3. Notes ──────────────────────────────────────────────────────────────
    if (changes.notes !== undefined) {
      order.notes = changes.notes;
    }

    // ── 4. Pricing recalculation ──────────────────────────────────────────────
    const pricingPatch = changes.pricing ?? {};
    const subtotal = order.items.reduce((sum, i) => sum + i.priceAtPurchase * i.quantity, 0);
    const discountAmount = pricingPatch.discountAmount ?? order.pricing.discountAmount ?? 0;
    const couponCode = "couponCode" in pricingPatch ? pricingPatch.couponCode : order.pricing.couponCode;
    const deliveryCharge = pricingPatch.deliveryCharge ?? order.pricing.deliveryCharge ?? 0;

    order.pricing.subtotal = subtotal;
    order.pricing.discountAmount = discountAmount;
    order.pricing.couponCode = couponCode ?? null;
    order.pricing.deliveryCharge = deliveryCharge;
    order.pricing.finalAmount = Math.max(0, subtotal - discountAmount + deliveryCharge);

    await order.save({ session });

    // ── 5. Audit log ──────────────────────────────────────────────────────────
    const after = {
      items: order.items.map(i => ({
        productId: i.productId,
        productName: i.productName,
        quantity: i.quantity,
        priceAtPurchase: i.priceAtPurchase,
      })),
      shippingAddress: order.shippingAddress,
      pricing: order.pricing,
      notes: order.notes,
    };

    await logAudit({
      actorId,
      action: "ORDER_EDITED",
      entity: "Order",
      entityId: order._id,
      oldMetrics: before,
      newMetrics: after,
      ipAddress,
    });

    return order;
  });
}
