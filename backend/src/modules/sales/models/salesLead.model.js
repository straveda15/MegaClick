import mongoose from "mongoose";

/**
 * How a payment reached us. "online" predates the split into named methods and
 * is kept so historic entries stay valid.
 */
export const PAYMENT_METHODS = ["cash", "upi", "bank_transfer", "card", "online"];

export const SERVICE_STAGE_VALUES = [
  "documents_pending",
  "documents_received",
  "application_submitted",
  "government_verification",
  "approval_received",
  "certificate_ready",
  "completed",
];

/**
 * One service the client asked for. A lead can carry several of these, and each
 * is assigned to an employee independently — so the same client can have their
 * GST filing with one person and their trademark with another.
 */
const leadServiceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, trim: true },
    category: { type: String, trim: true },
    categorySlug: { type: String, trim: true },
    // Where this particular service sits in the filing pipeline.
    stage: {
      type: String,
      enum: SERVICE_STAGE_VALUES,
      default: "documents_pending",
    },
    // How warm this particular request is. A client can be desperate for their
    // marriage registration and lukewarm about a trademark, so temperature is
    // tracked per service rather than only on the lead as a whole.
    temperature: {
      type: String,
      enum: ["HOT", "WARM", "COLD"],
      default: "WARM",
    },
    // When work on this service is meant to begin. Captured up front, before
    // anyone is assigned — `assignedAt` records when it actually started.
    startAt: { type: Date },
    // Set once this service has been handed to an employee.
    taskId: { type: mongoose.Schema.Types.ObjectId, ref: "Task" },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    assignedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    assignedAt: { type: Date },
    dueAt: { type: Date },
    notes: { type: String, trim: true },
    // The line items agreed with the client for this service — the "fields"
    // captured in the Confirm dialog on the Leads board. Their sum is the
    // final quotation below, and they become the invoice particulars.
    quotationItems: {
      type: [
        new mongoose.Schema(
          {
            name: { type: String, required: true, trim: true },
            amount: { type: Number, default: 0, min: 0 },
          },
          { _id: true, timestamps: false }
        ),
      ],
      default: [],
    },
    quotation: { type: Number, min: 0 },
    // The figure quoted when the lead (or client) was first captured, before
    // anyone sat down and itemised it. Kept untouched by later confirmations so
    // the Accounts page can show what the client was originally told.
    initialQuotation: { type: Number, min: 0 },
    // True only after the salesperson explicitly clicks "Confirm" in the
    // Confirm dialog. Having a quotation amount does NOT mean it is confirmed
    // — confirmation is a deliberate act.
    quotationConfirmed: { type: Boolean, default: false },
    /**
     * LEGACY. Payments used to be recorded per service; they now live on the
     * lead as `payments`. Nothing writes here any more, but existing entries
     * are still read into the account's history so no receipt is lost.
     */
    ledger: {
      type: [
        new mongoose.Schema(
          {
            amount: { type: Number, required: true, min: 0 },
            // How the money reached us. "online" is retained for entries
            // recorded before the methods were broken out.
            mode: { type: String, enum: PAYMENT_METHODS, default: "cash" },
            note: { type: String, trim: true },
            paidAt: { type: Date, default: Date.now },
            // "direct" is money that arrived for this service. "credit" is the
            // customer's unallocated advance being applied to it — the money
            // was already received, so it must not be counted as revenue twice.
            source: { type: String, enum: ["direct", "credit"], default: "direct" },
            recordedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
          },
          { _id: true, timestamps: false }
        ),
      ],
      default: [],
    },
  },
  { _id: true, timestamps: false }
);

const salesLeadSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SalesCustomer",
      required: true,
    },
    // Optional: a lead captured on the Leads page starts with nobody on it, and
    // stays that way until someone is picked via "Assign to". Leads flowing in
    // from the website/CSV pipelines still get an owner immediately.
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    status: {
      type: String,
      enum: ["NEW", "CONTACTED", "FOLLOW_UP", "CONVERTED", "DROPPED"],
      default: "NEW",
    },
    statusHistory: [
      {
        status: String,
        changedAt: { type: Date, default: Date.now },
        changedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        note: String,
      },
    ],
    source: {
      type: String,
      enum: ["website_cart", "website_order", "telephony", "website_contact", "csv", "excel", "manual", "scraped", "offline_orders"],
      default: "telephony",
    },
    // Title of the service / product the lead is interested in.
    productInterest: {
      type: String,
    },
    // The service this lead wants, picked from the website catalog. The title
    // lives in productInterest above; these carry the catalog identity so an
    // assigned task can be stamped with the same service.
    serviceSlug: {
      type: String,
      trim: true,
    },
    serviceCategory: {
      type: String,
      trim: true,
    },
    // Where the request sits in the filing pipeline. Tracked on the lead so the
    // Leads board shows progress before and after a task is assigned.
    // Legacy single-service mirror of services[0] — kept so older leads, the CSV
    // pipelines and anything still reading the flat fields keep working.
    serviceStage: {
      type: String,
      enum: SERVICE_STAGE_VALUES,
      default: "documents_pending",
    },
    // Every service the client opted for. Each entry is assigned separately.
    services: {
      type: [leadServiceSchema],
      default: [],
    },
    // How warm the lead is. Distinct from `status`, which tracks the sales
    // pipeline — this is the at-a-glance signal shown on the Leads board.
    temperature: {
      type: String,
      enum: ["HOT", "WARM", "COLD"],
      default: "WARM",
    },
    priority: {
      type: String,
      enum: ["LOW", "MEDIUM", "HIGH", "URGENT"],
      default: "MEDIUM",
    },
    // Raw message text submitted via the website contact form.
    // Also echoed into statusHistory[0].note for the timeline view.
    message: {
      type: String,
    },
    estimatedValue: {
      type: Number,
      min: 0,
    },
    /**
     * Every payment received from this client, oldest first.
     *
     * Money arrives against the account, not against a line item: a client
     * paying 5,000 off a 30,000 engagement is not paying for one particular
     * service, so nothing here is allocated to one. What is still owed is
     * simply the total quoted minus everything received.
     */
    payments: {
      type: [
        new mongoose.Schema(
          {
            amount: { type: Number, required: true, min: 0 },
            mode: { type: String, enum: PAYMENT_METHODS, default: "cash" },
            note: { type: String, trim: true },
            paidAt: { type: Date, default: Date.now },
            recordedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
          },
          { _id: true, timestamps: false }
        ),
      ],
      default: [],
    },
    // One advance payment covering the whole engagement, captured alongside the
    // quotations in the Confirm dialog. It is common to every service rather
    // than tied to one, so it lives on the lead. Counted as received revenue.
    advancePayment: {
      amount: { type: Number, min: 0, default: 0 },
      mode: { type: String, enum: PAYMENT_METHODS, default: "cash" },
      note: { type: String, trim: true },
      recordedAt: { type: Date },
      recordedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    },
    followUpAt: {
      type: Date,
    },
    followUpNote: {
      type: String,
    },
    // One entry per logged follow-up: what happened, when it was logged, and
    // the next date it was pushed to. The timeline on the Follow-ups page and
    // in the lead/client popups is read straight off this.
    followUpHistory: [
      {
        note: String,
        outcome: {
          type: String,
          enum: ["contacted", "no_answer", "rescheduled", "meeting_set", "note"],
          default: "note",
        },
        // The next follow-up this entry scheduled.
        followUpAt: { type: Date },
        createdAt: { type: Date, default: Date.now },
        createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      },
    ],
    lastContactedAt: {
      type: Date,
    },
    convertedAt: {
      type: Date,
    },
    droppedAt: {
      type: Date,
    },
    droppedReason: {
      type: String,
    },
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order", // Linked when converted
    },
    taskId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task", // Currently active task for this lead
    },
    notificationFlags: {
      cartAbandonmentSent: { type: Boolean, default: false },
      inquiryInactiveSent: { type: Boolean, default: false },
    },
    // True while the lead is sitting in the distribution pool waiting to be
    // spread across the roster by the auto-distribute job. New leads start
    // pooled; leads freed from an inactive/on-leave member are re-pooled. Once
    // the job (or a manual assignment) gives the lead to an available member it
    // is set false and is never touched by the periodic reshuffle again.
    pool: {
      type: Boolean,
      default: false,
    },

    // The Gmail inbox that received the contact-form notification email.
    // Set only for website_contact leads. Used for auditing and tracking
    // which account handled which inquiry.
    assignedEmail: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

salesLeadSchema.index({ assignedTo: 1, status: 1 });
salesLeadSchema.index({ pool: 1, status: 1 });
salesLeadSchema.index({ followUpAt: 1 });
salesLeadSchema.index({ status: 1, followUpAt: 1 });
salesLeadSchema.index({ customer: 1 });
salesLeadSchema.index({ "services.assignedTo": 1 });

const SalesLead = mongoose.model("SalesLead", salesLeadSchema);

export default SalesLead;
