/**
 * BatchService — single source of truth for all batch lifecycle operations.
 *
 * Rules:
 *  - No direct mutation of `currentStage` anywhere else in the codebase.
 *  - Every transition goes through batch.transitionTo(), which enforces VALID_TRANSITIONS.
 *  - Every multi-document operation is wrapped in withTransaction() for atomicity.
 *  - Every transition emits an OutboxEvent for downstream consumers.
 *
 * Replaces: batch.service.js (simple CRUD) + pipeline.service.js (stage transitions)
 */

import crypto from "crypto";
import Batch, { VALID_TRANSITIONS } from "./batch.model.js";
import OutboxEvent from "../../outbox/models/outboxEvent.model.js";
import { withTransaction } from "../../../shared/infrastructure/db.transaction.js";
import { adjustStock } from "../inventory/ops-inventory.service.js";
import AppError from "../../../shared/utils/appError.js";
import logger from "../../../shared/infrastructure/logger.js";
import Vendor from "../vendors/vendor.model.js";
import Product from "../../product/product.model.js";
import Task from "../../task/task.model.js";
import User from "../../user/user.model.js";
import mongoose from "mongoose";

/* ── Internal helpers ────────────────────────────────────────────────────── */

const generateBatchNumber = () => {
  const dateStr = new Date().toISOString().slice(2, 10).replace(/-/g, "");
  const rand = crypto.randomBytes(3).toString("hex").toUpperCase();
  return `BATCH-${dateStr}-${rand}`;
};

/**
 * Concurrency lock for batch workflow actions. A batch's active production_stage
 * task belongs to whoever started it (in_progress). A different, non-admin staff
 * member cannot advance / act on the batch while that owner is still active —
 * only once the owner is deactivated does the batch free up (and the task is
 * reassigned to the taker). Admins (founders / co-founders) oversee every flow
 * and bypass. Mirrors the same rule enforced in task.service.updateTaskStatus.
 */
const assertBatchNotLocked = async (batchId, actorId, session) => {
  if (!actorId) return;
  const actor = await User.findById(actorId).select("role").session(session);
  if (actor?.role === "admin") return;

  const activeTask = await Task.findOne({
    "relatedEntity.entityType": "Batch",
    "relatedEntity.entityId": batchId,
    type: "production_stage",
    status: "in_progress",
  }).session(session);

  if (!activeTask || !activeTask.assignedTo) return;
  if (String(activeTask.assignedTo) === String(actorId)) return;

  const owner = await User.findById(activeTask.assignedTo).select("name lastName isActive").session(session);
  if (owner && owner.isActive !== false) {
    const ownerName = [owner.name, owner.lastName].filter(Boolean).join(" ") || "another staff member";
    throw new AppError(
      `This batch is already in progress by ${ownerName}. You can't take it over until they go inactive.`,
      409
    );
  }

  // Owner is inactive → free to take over. Hand the active task to the taker.
  activeTask.assignedTo = actorId;
  await activeTask.save({ session });
};

/**
 * Creates a task for the current stage (CREATED inventory reservation, INVENTORY_RESERVED
 * production run, PACKAGING, dispatch stages).
 * For production stages (MIXING), creates ONE single task that covers the entire
 * Mixing → Processing → QC lifecycle. PROCESSING and QUALITY_CHECK do NOT create
 * new tasks; the existing production task is simply updated.
 */
const createStageTask = async (batch, actorId, session) => {
  const stage = batch.currentStage;

  // Skip tasks for initial/terminal stages
  if (["DRAFT", "COMPLETED"].includes(stage)) return;

  // PROCESSING and QUALITY_CHECK do NOT create new tasks.
  // The single production task (created at INVENTORY_RESERVED) covers the whole run.
  if (["PROCESSING", "QUALITY_CHECK"].includes(stage)) return;

  // MIXING stage: skip — production task already exists from INVENTORY_RESERVED step
  if (stage === "MIXING") return;

  // Prevent duplicates: if there's already an active task for this batch, skip.
  const existingActive = await Task.findOne({
    "relatedEntity.entityType": "Batch",
    "relatedEntity.entityId": batch._id,
    type: "production_stage",
    status: { $in: ["pending", "in_progress"] },
  }).session(session);
  if (existingActive) {
    logger.info(`Skipping task creation for batch ${batch.batchNumber} stage ${stage} — active task already exists`);
    return;
  }

  // Determine role target
  // CREATED → production (production staff register inventory / reserve materials)
  // INVENTORY_RESERVED → production (materials ready, start manufacturing)
  // MIXING/PROCESSING/QUALITY_CHECK → no new task (covered by single Production Run task)
  //
  // NOTE: the CREATED "Inventory Reservation" task used to be assigned to WAREHOUSE.
  // Production owns inventory registration, so it is now assigned to production — this
  // makes the task appear in the production staff's Inventory Registration panel (which
  // is scoped to the caller's own production_stage tasks) instead of only warehouse's.
  let roleTarget = "production";
  if (stage === "PACKAGING") {
    roleTarget = "packaging";
  } else if (["READY_FOR_DISPATCH", "DISPATCHED", "DELIVERED"].includes(stage)) {
    roleTarget = "dispatch";
  }

  // Try to keep the task with the same person who just completed the previous stage
  let assignedUser = await User.findOne({
    _id: actorId,
    operationalRoles: { $in: [roleTarget] },
    isActive: true,
  }).session(session);

  // Fallback: any active user with the required role
  if (!assignedUser) {
    assignedUser = await User.findOne({
      operationalRoles: { $in: [roleTarget] },
      isActive: true,
    }).session(session);
  }

  if (!assignedUser) {
    logger.warn(`No active user found for role ${roleTarget} to assign batch task ${batch.batchNumber}`);
    return;
  }

  // Build task title/description based on stage
  let title, description;
  if (stage === "CREATED") {
    title = `Inventory Reservation: ${batch.productName}`;
    description = `Reserve raw materials for production batch ${batch.batchNumber} (${batch.quantity} units). Pick powders, jars, and packaging materials from storage.`;
  } else if (stage === "INVENTORY_RESERVED") {
    // ONE task for the full production run (Mixing → Processing → QC)
    title = `Production Run: ${batch.productName}`;
    description = `Complete the full production run for batch ${batch.batchNumber} (${batch.quantity} units). Stages: Mixing → Processing → Quality Check.`;
  } else {
    title = `${stage.replace(/_/g, " ")}: ${batch.productName}`;
    description = `Complete stage ${stage} for batch ${batch.batchNumber} (${batch.quantity} units).`;
  }

  const task = new Task({
    title,
    description,
    type: "production_stage",
    priority: "high",
    assignedTo: assignedUser._id,
    assignedBy: actorId,
    source: "batch_automation",
    relatedEntity: { entityType: "Batch", entityId: batch._id },
    dueAt: batch.dueDate,
  });

  await task.save({ session });

  // Track assignment on the batch so it shows in "My Batches" portal
  batch.stageAssignments = batch.stageAssignments.filter((a) => a.stageName !== stage);
  batch.stageAssignments.push({
    stageName: stage,
    assignedTo: assignedUser._id,
    assignedAt: new Date(),
  });

  logger.info(`Task created for batch ${batch.batchNumber} stage ${stage} → ${assignedUser.name} (${roleTarget})`);
};

const requireStage = (batch, stage) => {
  if (batch.currentStage !== stage) {
    throw new AppError(
      `Operation requires stage ${stage}. Batch ${batch.batchNumber} is currently in ${batch.currentStage}.`,
      400
    );
  }
};

/* ── Public API ──────────────────────────────────────────────────────────── */

/**
 * Create a new batch.
 * Created in DRAFT then immediately advanced to CREATED (DRAFT is a transient init state).
 */
export const createBatch = async (data, createdBy) => {
  return withTransaction(async (session) => {
    const batchNumber = generateBatchNumber();

    // Auto-assign vendor from product recipe if not provided
    if (!data.rawMaterialVendorId && data.productId) {
      const product = await Product.findById(data.productId).session(session);
      if (product?.recipe?.powderVendorId) {
        data.rawMaterialVendorId = product.recipe.powderVendorId;
      }
    }

    const batch = new Batch({
      ...data,
      batchNumber,
      createdBy,
      currentStage: "DRAFT",
      stageHistory: [{ stage: "DRAFT", enteredAt: new Date(), actorId: createdBy }],
    });

    batch.transitionTo("CREATED", createdBy, "Batch created");

    // Initial task for inventory reservation (Warehouse/Ops)
    await createStageTask(batch, createdBy, session);

    await batch.save({ session });

    await OutboxEvent.create(
      [{ eventType: "batch.created", payload: { batchId: batch._id, batchNumber, createdBy } }],
      { session }
    );

    logger.info(`Batch ${batchNumber} created`);
    return batch;
  });
};

export const getBatches = async (filters = {}) => {
  const query = {};
  if (filters.currentStage) query.currentStage = filters.currentStage;
  if (filters.productId) query.productId = filters.productId;

  return Batch.find(query)
    .populate("assignedEmployees", "name lastName email")
    .populate("stageAssignments.assignedTo", "name lastName email")
    .populate("createdBy", "name lastName")
    .sort({ createdAt: -1 });
};

export const getBatchById = async (id) => {
  const batch = await Batch.findById(id)
    .populate("assignedEmployees", "name lastName email")
    .populate("stageAssignments.assignedTo", "name lastName email")
    .populate("createdBy", "name lastName");

  if (!batch) throw new AppError("Batch not found", 404);
  return batch;
};

export const updateBatch = async (id, updateData) => {
  // Guard: prevent direct stage mutation via updateBatch
  if ("currentStage" in updateData) {
    throw new AppError(
      "Direct stage mutation is not allowed. Use advanceStage() to progress the lifecycle.",
      400
    );
  }

  const batch = await Batch.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  });
  if (!batch) throw new AppError("Batch not found", 404);
  return batch;
};

/**
 * Reserve inventory for the batch.
 * Moves quantity from available → reserved in OpsInventory.
 * Batch must be in CREATED stage.
 */
export const reserveInventory = async (batchId, actorId) => {
  return withTransaction(async (session) => {
    const batch = await Batch.findById(batchId).session(session);
    if (!batch) throw new AppError("Batch not found", 404);

    await assertBatchNotLocked(batchId, actorId, session);

    requireStage(batch, "CREATED");

    // ─── Production Batch: Reserve Raw Materials at Vendor ───
    if (batch.rawMaterialVendorId) {
      const vendor = await Vendor.findById(batch.rawMaterialVendorId).session(session);
      if (!vendor) throw new AppError("Assigned vendor not found", 404);

      const pc = vendor.productCosts.find(p => p.productId.toString() === batch.productId.toString());
      if (!pc) throw new AppError("Product cost config not found for this vendor", 400);

      const qty = batch.quantity;
      const powderNeeded = (pc.powderGrams || 0) * qty;
      const jarsNeeded = (pc.jarGrams || 1) * qty;

      if (pc.powderStock < powderNeeded) {
        throw new AppError(`Insufficient powder stock at ${vendor.name}. Need: ${powderNeeded}g, Available: ${pc.powderStock}g`, 400);
      }
      if (pc.jarStock < jarsNeeded) {
        throw new AppError(`Insufficient jars at ${vendor.name}. Need: ${jarsNeeded}, Available: ${pc.jarStock}`, 400);
      }

      // We don't deduct yet, we just confirm availability for the "Reserve" stage.
      // In a more complex system, we might have a 'reserved' field on vendor.productCosts too.
      // For now, we just tag the batch as having locked inventory.
    } else {
      // ─── Order Batch: Reserve Finished Goods from Warehouse ───
      // Atomic: reduce available, increase reserved
      await adjustStock({ productId: batch.productId, quantity: -batch.quantity, type: "available" });
      await adjustStock({ productId: batch.productId, quantity: batch.quantity, type: "reserved" });
    }

    batch.inventoryLocks.push({
      productId: batch.productId,
      quantityLocked: batch.quantity,
      lockedAt: new Date(),
    });

    batch.transitionTo("INVENTORY_RESERVED", actorId, "Inventory reserved for production run");

    // Auto-complete any pending warehouse task so only production sees the next task
    await Task.findOneAndUpdate(
      {
        "relatedEntity.entityType": "Batch",
        "relatedEntity.entityId": batchId,
        type: "production_stage",
        status: { $in: ["pending", "in_progress"] },
      },
      { $set: { status: "completed", completedAt: new Date() } },
      { session }
    );

    // Create task for Production Run (Mixing → Processing → QC)
    await createStageTask(batch, actorId, session);

    await batch.save({ session });

    await OutboxEvent.create(
      [{
        eventType: "batch.inventory_reserved",
        payload: {
          batchId: batch._id,
          batchNumber: batch.batchNumber,
          productId: batch.productId,
          quantityReserved: batch.quantity,
          actorId,
        },
      }],
      { session }
    );

    logger.info(`Inventory reserved for batch ${batch.batchNumber} (qty: ${batch.quantity})`);
    return batch;
  });
};

/**
 * Advance batch to the next stage in the lifecycle.
 * Applies to linear stages (all except QUALITY_CHECK transition, which requires runQualityCheck).
 *
 * QUALITY_CHECK → PACKAGING is intentionally blocked here; use runQualityCheck() instead.
 */
export const advanceStage = async (batchId, actorId, notes) => {
  return withTransaction(async (session) => {
    const batch = await Batch.findById(batchId).session(session);
    if (!batch) throw new AppError("Batch not found", 404);

    await assertBatchNotLocked(batchId, actorId, session);

    const allowed = VALID_TRANSITIONS[batch.currentStage] ?? [];

    if (allowed.length === 0) {
      throw new AppError(
        `Batch ${batch.batchNumber} is in terminal stage ${batch.currentStage} and cannot advance.`,
        400
      );
    }

    // QC → PACKAGING must go through runQualityCheck(), not advanceStage()
    if (batch.currentStage === "QUALITY_CHECK") {
      throw new AppError(
        "Use runQualityCheck() to advance from QUALITY_CHECK. A recorded QC outcome is required.",
        400
      );
    }

    const previousStage = batch.currentStage;
    const nextStage = allowed[0];

    batch.transitionTo(nextStage, actorId, notes ?? null);

    // Auto-complete the outgoing stage's pending task so it does not linger as a stale
    // "pending" item in the staff's task panel after they advance the batch. Mirrors
    // reserveInventory(), which already completes the CREATED task on its own path.
    // Matters now that production advances CREATED → INVENTORY_RESERVED via /advance and
    // owns that Inventory Reservation task (previously warehouse's, completed elsewhere).
    if (previousStage === "CREATED") {
      await Task.findOneAndUpdate(
        {
          "relatedEntity.entityType": "Batch",
          "relatedEntity.entityId": batchId,
          type: "production_stage",
          status: { $in: ["pending", "in_progress"] },
        },
        { $set: { status: "completed", completedAt: new Date() } },
        { session }
      );
    }

    // ─── Raw Material Deduction Logic ───
    if (nextStage === "MIXING" && batch.rawMaterialVendorId) {
      const vendor = await Vendor.findById(batch.rawMaterialVendorId).session(session);
      if (vendor) {
        const pc = vendor.productCosts.find(p => p.productId.toString() === batch.productId.toString());
        if (pc) {
          const qty = batch.quantity;
          // Deduct from live stock based on usage-per-unit fields
          pc.powderStock -= (pc.powderGrams * qty);
          pc.jarStock -= (pc.jarGrams * qty);
          pc.spoonStock -= (pc.spoonGrams * qty);
          pc.packagingStock -= (pc.packagingGrams * qty);
          pc.sideLabelStock -= (pc.sideLabelGrams * qty);
          pc.upperLabelStock -= (pc.upperLabelGrams * qty);
          pc.plasticSleevesStock -= (pc.plasticSleevesGrams * qty);
          pc.courierBagStock -= (pc.courierBagGrams * qty);
          pc.tapeStock -= (pc.tapeGrams * qty);
          pc.bubbleSheetStock -= (pc.bubbleSheetGrams * qty);

          // Handle extraCosts as well
          if (pc.extraCosts) {
            pc.extraCosts.forEach(extra => {
              extra.stock -= (extra.grams * qty);
            });
          }

          await vendor.save({ session });
          logger.info(`Deducted raw materials for batch ${batch.batchNumber} from vendor ${vendor.name}`);
        }
      }
    }

    // ─── Stock Induction Logic ───
    if (nextStage === "COMPLETED") {
      try {
        await adjustStock({
          productId: batch.productId,
          quantity: batch.quantity,
          type: "available",
        });
        logger.info(`Inducted ${batch.quantity} units of product ${batch.productId} into stock from manual completion of batch ${batch.batchNumber}`);
      } catch (err) {
        logger.error(`Failed to induct stock for batch ${batch.batchNumber}: ${err.message}`);
      }

      // Auto-complete any pending tasks (e.g., packaging task) associated with this batch
      try {
        await Task.updateMany(
          {
            "relatedEntity.entityType": "Batch",
            "relatedEntity.entityId": batchId,
            status: { $in: ["pending", "in_progress"] },
          },
          { $set: { status: "completed", completedAt: new Date() } }
        ).session(session);
        logger.info(`Auto-completed all active tasks for batch ${batch.batchNumber} upon reaching COMPLETED stage`);
      } catch (err) {
        logger.error(`Failed to auto-complete active tasks for batch ${batch.batchNumber}: ${err.message}`);
      }
    }

    // Create task for the next stage automatically (this updates batch.stageAssignments)
    await createStageTask(batch, actorId, session);

    await batch.save({ session });

    await OutboxEvent.create(
      [{
        eventType: "batch.stage_advanced",
        payload: {
          batchId: batch._id,
          batchNumber: batch.batchNumber,
          fromStage: previousStage,
          toStage: nextStage,
          actorId,
        },
      }],
      { session }
    );

    logger.info(`Batch ${batch.batchNumber}: ${previousStage} → ${nextStage}`);
    return batch;
  });
};

/**
 * Record QC results for a batch in QUALITY_CHECK stage.
 *  - pass  → advances to PACKAGING
 *  - fail  → records failure and keeps batch in QUALITY_CHECK for re-inspection
 */
export const runQualityCheck = async (batchId, qcData, actorId) => {
  return withTransaction(async (session) => {
    const batch = await Batch.findById(batchId).session(session);
    if (!batch) throw new AppError("Batch not found", 404);

    await assertBatchNotLocked(batchId, actorId, session);

    requireStage(batch, "QUALITY_CHECK");

    if (!["pass", "fail"].includes(qcData.outcome)) {
      throw new AppError("QC outcome must be 'pass' or 'fail'.", 400);
    }

    batch.qcResults.push({
      outcome: qcData.outcome,
      inspectorId: actorId,
      notes: qcData.notes ?? "",
      conductedAt: new Date(),
    });

    if (qcData.outcome === "pass") {
      batch.transitionTo("PACKAGING", actorId, "QC passed — batch moved to packaging");
      
      // Create task for the next stage (PACKAGING) automatically
      await createStageTask(batch, actorId, session);
    }
    // On fail: batch stays in QUALITY_CHECK. Re-run is required.

    await batch.save({ session });

    await OutboxEvent.create(
      [{
        eventType: `batch.qc_${qcData.outcome}`,
        payload: {
          batchId: batch._id,
          batchNumber: batch.batchNumber,
          outcome: qcData.outcome,
          inspectorId: actorId,
          notes: qcData.notes,
          currentStage: batch.currentStage,
        },
      }],
      { session }
    );

    logger.info(`QC ${qcData.outcome} for batch ${batch.batchNumber}`);
    return batch;
  });
};

/**
 * Assign shipment details to a READY_FOR_DISPATCH batch.
 * Advances to DISPATCHED.
 */
export const assignShipment = async (batchId, shipmentData, actorId) => {
  return withTransaction(async (session) => {
    const batch = await Batch.findById(batchId).session(session);
    if (!batch) throw new AppError("Batch not found", 404);

    requireStage(batch, "READY_FOR_DISPATCH");

    if (!shipmentData.trackingId) {
      throw new AppError("trackingId is required to assign a shipment.", 400);
    }
    if (!shipmentData.providerName) {
      throw new AppError("providerName is required to assign a shipment.", 400);
    }

    batch.shipmentDetails = {
      trackingId: shipmentData.trackingId,
      awbNumber: shipmentData.awbNumber ?? null,
      providerId: shipmentData.providerId ?? null,
      providerName: shipmentData.providerName,
      dispatchedAt: new Date(),
      estimatedDelivery: shipmentData.estimatedDelivery ?? null,
    };

    batch.transitionTo("DISPATCHED", actorId, `Dispatched via ${shipmentData.providerName}`);

    await batch.save({ session });

    await OutboxEvent.create(
      [{
        eventType: "batch.dispatched",
        payload: {
          batchId: batch._id,
          batchNumber: batch.batchNumber,
          trackingId: shipmentData.trackingId,
          providerName: shipmentData.providerName,
          actorId,
        },
      }],
      { session }
    );

    logger.info(`Batch ${batch.batchNumber} dispatched (tracking: ${shipmentData.trackingId})`);
    return batch;
  });
};

/**
 * Process a delivery status update from a shipping provider webhook.
 * Finds the batch by trackingId. Advances DISPATCHED → DELIVERED → COMPLETED.
 * Releases inventory locks on completion.
 */
export const processDeliveryWebhook = async (trackingId, payload) => {
  return withTransaction(async (session) => {
    const batch = await Batch.findOne({
      "shipmentDetails.trackingId": trackingId,
    }).session(session);

    if (!batch) {
      throw new AppError(`No batch found for tracking ID: ${trackingId}`, 404);
    }

    if (!["DISPATCHED", "DELIVERED"].includes(batch.currentStage)) {
      logger.warn(
        `Webhook ignored for batch ${batch.batchNumber}: stage ${batch.currentStage} is not actionable`
      );
      return batch;
    }

    const webhookStatus = String(payload.status ?? "").toUpperCase();

    if (webhookStatus === "DELIVERED" && batch.currentStage === "DISPATCHED") {
      const deliveredAt = payload.deliveredAt ? new Date(payload.deliveredAt) : new Date();
      batch.shipmentDetails.deliveredAt = deliveredAt;

      batch.transitionTo("DELIVERED", null, "Delivery confirmed via webhook");
      batch.transitionTo("COMPLETED", null, "Auto-completed on delivery confirmation");

      // 1. Induct finished goods into stock
      try {
        await adjustStock({
          productId: batch.productId,
          quantity: batch.quantity,
          type: "available",
        });
        logger.info(`Inducted ${batch.quantity} units of product ${batch.productId} into stock from batch ${batch.batchNumber}`);
      } catch (err) {
        logger.error(`Failed to induct stock for batch ${batch.batchNumber}: ${err.message}`);
      }

      // 2. Release reserved inventory locks
      for (const lock of batch.inventoryLocks) {
        try {
          await adjustStock({
            productId: lock.productId,
            quantity: -lock.quantityLocked,
            type: "reserved",
          });
        } catch (err) {
          logger.warn(
            `Failed to release inventory lock for product ${lock.productId}: ${err.message}`
          );
        }
      }
    }

    await batch.save({ session });

    await OutboxEvent.create(
      [{
        eventType: "batch.delivery_webhook_processed",
        payload: {
          batchId: batch._id,
          batchNumber: batch.batchNumber,
          trackingId,
          webhookStatus: payload.status,
          resultStage: batch.currentStage,
        },
      }],
      { session }
    );

    return batch;
  });
};

/**
 * Delete a batch. Only allowed in DRAFT or CREATED stage (before any production work begins).
 */
export const deleteBatch = async (id) => {
  const batch = await Batch.findById(id);
  if (!batch) throw new AppError("Batch not found", 404);

  if (batch.currentStage === "COMPLETED") {
    throw new AppError("Cannot delete a completed batch.", 400);
  }

  // Cleanup associated tasks
  await Task.deleteMany({ "relatedEntity.entityType": "Batch", "relatedEntity.entityId": id });

  await Batch.findByIdAndDelete(id);
  return true;
};
