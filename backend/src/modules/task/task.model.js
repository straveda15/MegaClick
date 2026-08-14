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

const Task = mongoose.model("Task", taskSchema);

export default Task;
