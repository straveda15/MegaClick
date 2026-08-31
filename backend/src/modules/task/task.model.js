import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    type: {
      type: String,
      enum: ["order_review", "lead_followup", "return_verify", "manual", "production_stage"],
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "in_progress", "completed", "overdue", "cancelled"],
      default: "pending",
    },
    cancelledAt: {
      type: Date,
    },
    cancelledBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    // Why the task was cancelled. "assignee_inactive" is set automatically when
    // the assigned staff member is deactivated, and drives the "cancelled" alert
    // shown to the assigner and to admin/founder oversight.
    cancelReason: {
      type: String,
      enum: ["manual", "assignee_inactive"],
      default: "manual",
    },
    // For assignee_inactive cancellations: false until the assigner/oversight has
    // dealt with the alert (by reassigning or by confirming the cancellation).
    cancelAlertAck: {
      type: Boolean,
      default: false,
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    assignedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    // Reassigning a service's task hands the SAME task document to the new
    // assignee (rather than spinning up a second one) so there is only ever one
    // card for the work — this is the running log of who held it before. A
    // former holder's board still shows the task (read-only, "Transferred to
    // X") by matching on this array instead of losing it the moment assignedTo
    // changes.
    previousAssignees: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        transferredTo: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        transferredAt: { type: Date, default: Date.now },
      },
    ],
    relatedEntity: {
      entityType: {
        type: String,
        enum: ["Order", "SalesLead", "SalesReturn", "Batch", "None"],
        default: "None",
      },
      entityId: {
        type: mongoose.Schema.Types.ObjectId,
      },
    },
    // Set when the task IS a client service request (assigned from the Services
    // page or bulk-imported from a spreadsheet). Carries everything the assignee
    // needs to actually do the work — which service was requested and the full
    // contact details of the client who asked for it — so the employee never has
    // to go hunting for context outside the task.
    serviceRequest: {
      serviceTitle: { type: String, trim: true },
      serviceSlug: { type: String, trim: true },
      serviceCategory: { type: String, trim: true },
      serviceCategorySlug: { type: String, trim: true },
      clientName: { type: String, trim: true },
      clientEmail: { type: String, trim: true, lowercase: true },
      clientPhone: { type: String, trim: true },
      clientCompany: { type: String, trim: true },
      clientAddress: { type: String, trim: true },
      notes: { type: String, trim: true },
      // Back-links to the lead this service came off, so the Clients board can
      // roll several tasks up under one client, and ticking a step here can
      // push the matching lead service forward.
      leadId: { type: mongoose.Schema.Types.ObjectId, ref: "SalesLead" },
      leadServiceId: { type: mongoose.Schema.Types.ObjectId },
      // The checklist for this service, copied from its step template at
      // assignment time. Copied rather than referenced so editing a template
      // later never rewrites the history of work already assigned.
      steps: [
        {
          title: { type: String, required: true, trim: true },
          description: { type: String, trim: true },
          order: { type: Number, default: 0 },
          done: { type: Boolean, default: false },
          completedAt: { type: Date },
          completedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        },
      ],
      // Where the request sits in the government/filing pipeline. Tracked
      // separately from `status` (which is about the employee's own progress).
      stage: {
        type: String,
        enum: [
          "documents_pending",
          "documents_received",
          "application_submitted",
          "government_verification",
          "approval_received",
          "certificate_ready",
          "completed",
        ],
        default: "documents_pending",
      },
    },
    dueAt: {
      type: Date,
    },
    completedAt: {
      type: Date,
    },
    startedAt: {
      type: Date,
    },
    timeTakenMinutes: {
      type: Number,
    },
    overdueAt: {
      type: Date,
    },
    source: {
      type: String,
      enum: ["csv_upload", "system_trigger", "manual", "scraped_upload", "manual_creation", "batch_automation"],
      required: true,
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high", "urgent", "critical"],
      default: "medium",
    },
    flags: [
      {
        message: { type: String, required: true, trim: true },
        raisedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        raisedAt: { type: Date, default: Date.now },
        adminResponse: { type: String, trim: true },
        adminResponseAt: { type: Date },
        resolvedAt: { type: Date },
      },
    ],
    // Groups related copies of the same task together (set when "Assign More" is used)
    taskGroup: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
      default: null,
    },
    // Soft delete: a removed task is hidden everywhere but survives in the
    // database, so work logs and history that reference it don't dangle.
    isDeleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: {
      type: Date,
    },
    deletedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    // Employees tagged for follow-up. They are NOT assignees — they can't start
    // or complete the task, but they get visibility of it (via the "Follow Up"
    // view) and can post follow-up notes below.
    followers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    // Follow-up notes/comments left by the assignee, assigner, tagged followers
    // or admin oversight to track progress and nudge the work along.
    followUps: [
      {
        message: { type: String, required: true, trim: true },
        author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Indexes for faster querying
taskSchema.index({ assignedTo: 1, status: 1 });
taskSchema.index({ dueAt: 1, status: 1 });
taskSchema.index({ "relatedEntity.entityType": 1, "relatedEntity.entityId": 1 });
taskSchema.index({ taskGroup: 1 });
taskSchema.index({ followers: 1, status: 1 });
taskSchema.index({ "previousAssignees.user": 1 });

const Task = mongoose.model("Task", taskSchema);

export default Task;
