import mongoose from "mongoose";

export const BATCH_STAGES = [
  "DRAFT",
  "CREATED",
  "INVENTORY_RESERVED",
  "MIXING",
  "PROCESSING",
  "QUALITY_CHECK",
  "PACKAGING",
  "READY_FOR_DISPATCH",
  "DISPATCHED",
  "DELIVERED",
  "COMPLETED",
];

/**
 * Strict one-way transition map.
 * Each stage has exactly one allowed successor — no branching, no reversal.
 */
export const VALID_TRANSITIONS = {
  DRAFT: ["CREATED"],
  CREATED: ["INVENTORY_RESERVED"],
  INVENTORY_RESERVED: ["MIXING"],
  MIXING: ["PROCESSING"],
  PROCESSING: ["QUALITY_CHECK"],
  QUALITY_CHECK: ["PACKAGING"],
  PACKAGING: ["COMPLETED"],
  COMPLETED: [],
};

/**
 * Canonical progress percentage per stage. Shared by the Production Staff
 * batches view and the Ops Floor batches view so both render IDENTICALLY.
 *
 * Note the production flow goes PACKAGING → COMPLETED directly (the dispatch
 * stages are not part of a production batch's lifecycle), so a naive
 * index/length formula produces a jarring jump (e.g. 60% → 100%). These values
 * are hand-tuned to climb monotonically in even-ish steps with no sudden jump.
 */
export const BATCH_STAGE_PROGRESS = {
  DRAFT: 0,
  CREATED: 5,
  INVENTORY_RESERVED: 15,
  MIXING: 35,
  PROCESSING: 55,
  QUALITY_CHECK: 70,
  PACKAGING: 85,
  READY_FOR_DISPATCH: 90,
  DISPATCHED: 95,
  DELIVERED: 98,
  COMPLETED: 100,
};

/** Resolve a batch's progress percentage from its current stage. */
export const getBatchProgress = (stage) => BATCH_STAGE_PROGRESS[stage] ?? 0;

/* ── Sub-schemas ────────────────────────────────────────────────────────── */

const stageHistorySchema = new mongoose.Schema(
  {
    stage: { type: String, enum: BATCH_STAGES, required: true },
    enteredAt: { type: Date, required: true },
    exitedAt: { type: Date, default: null },
    actorId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    notes: { type: String, default: null },
  },
  { _id: false }
);

const inventoryLockSchema = new mongoose.Schema(
  {
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    sku: { type: String, default: null },
    quantityLocked: { type: Number, required: true, min: 0 },
    lockedAt: { type: Date, required: true, default: Date.now },
  },
  { _id: false }
);

const qcResultSchema = new mongoose.Schema(
  {
    outcome: { type: String, enum: ["pass", "fail"], required: true },
    inspectorId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    notes: { type: String, default: "" },
    conductedAt: { type: Date, required: true, default: Date.now },
  },
  { _id: false }
);

const shipmentDetailsSchema = new mongoose.Schema(
  {
    trackingId: { type: String, default: null },
    awbNumber: { type: String, default: null },
    providerId: { type: mongoose.Schema.Types.ObjectId, ref: "ShippingProvider", default: null },
    providerName: { type: String, default: null },
    dispatchedAt: { type: Date, default: null },
    deliveredAt: { type: Date, default: null },
    estimatedDelivery: { type: Date, default: null },
  },
  { _id: false }
);

/* ── Main schema ─────────────────────────────────────────────────────────── */

const batchSchema = new mongoose.Schema(
  {
    batchNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    productName: {
      type: String,
      required: true,
    },
    // Optional link to a sales order that triggered this batch
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SystemOrder",
      default: null,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    currentStage: {
      type: String,
      enum: BATCH_STAGES,
      default: "DRAFT",
    },
    stageHistory: [stageHistorySchema],
    qcResults: [qcResultSchema],
    inventoryLocks: [inventoryLockSchema],
    shipmentDetails: {
      type: shipmentDetailsSchema,
      default: null,
    },
    assignedEmployees: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    stageAssignments: [
      {
        stageName: { type: String, enum: BATCH_STAGES, required: true },
        assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        assignedAt: { type: Date, default: Date.now },
        _id: false,
      },
    ],
    dueDate: {
      type: Date,
      required: true,
    },
    notes: {
      type: String,
      default: "",
    },
    rawMaterialVendorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vendor",
      default: null,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    startedAt: { type: Date, default: null },
    completedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

batchSchema.index({ currentStage: 1 });
batchSchema.index({ dueDate: 1 });
batchSchema.index({ orderId: 1 });
batchSchema.index({ "shipmentDetails.trackingId": 1 }, { sparse: true });

/**
 * Validate and apply a stage transition on the document instance.
 * Does NOT save — caller must call batch.save().
 *
 * @throws {Error} if the transition is not permitted.
 */
batchSchema.methods.transitionTo = function (nextStage, actorId, notes) {
  const allowed = VALID_TRANSITIONS[this.currentStage] ?? [];

  if (!allowed.includes(nextStage)) {
    throw new Error(
      `Invalid transition: ${this.currentStage} → ${nextStage}. ` +
        `Allowed next stages: [${allowed.join(", ") || "none — terminal stage"}]`
    );
  }

  // Seal the current stage's open history entry
  const openEntry = this.stageHistory
    .slice()
    .reverse()
    .find((h) => h.stage === this.currentStage && !h.exitedAt);
  if (openEntry) {
    openEntry.exitedAt = new Date();
  }

  this.currentStage = nextStage;

  this.stageHistory.push({
    stage: nextStage,
    enteredAt: new Date(),
    actorId: actorId ?? null,
    notes: notes ?? null,
  });

  if (nextStage === "MIXING" && !this.startedAt) {
    this.startedAt = new Date();
  }
  if (nextStage === "COMPLETED") {
    this.completedAt = new Date();
  }
};

const Batch = mongoose.model("Batch", batchSchema);

export default Batch;
