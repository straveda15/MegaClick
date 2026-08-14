import mongoose from "mongoose";

const salesLeadSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SalesCustomer",
      required: true,
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
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
    productInterest: {
      type: String,
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
    followUpAt: {
      type: Date,
    },
    followUpNote: {
      type: String,
    },
    followUpHistory: [
      {
        note: String,
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

const SalesLead = mongoose.model("SalesLead", salesLeadSchema);

export default SalesLead;
