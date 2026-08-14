import mongoose from "mongoose";

/**
 * WorkLog — a day-wise activity log for staff/employees. It aims to capture
 * *everything* a person does: tasks they complete, leads they work/convert,
 * returns they close, production/warehouse/dispatch workflow steps, plus
 * anything they log by hand.
 *
 * Entries come from two places:
 *   • source "auto"   — written automatically when an action happens (a task is
 *                        completed, a lead status changes, a return is closed…).
 *   • source "manual" — added by the person themselves from their Logs tab.
 *
 * Timing: `startedAt`/`endedAt` capture when the work began and finished (a task
 * carries its real start/complete times; a manual entry carries what the person
 * enters). `loggedAt` is the single timestamp used for day-wise grouping and
 * sorting — it mirrors `endedAt` for spans and "now" for instantaneous actions.
 */
const CATEGORIES = [
  "task",
  "lead",
  "production",
  "dispatch",
  "warehouse",
  "packaging",
  "order",
  "return",
  "manual",
  "other",
];

const workLogSchema = new mongoose.Schema(
  {
    // Who did the work (the doer).
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // What was done — a short description of the activity.
    activity: {
      type: String,
      required: true,
      trim: true,
    },
    // Coarse bucket so the UI can label/colour the entry and admins can scan
    // "what kind of work" at a glance.
    category: {
      type: String,
      enum: CATEGORIES,
      default: "other",
    },
    // When the work started / finished, when known.
    startedAt: { type: Date },
    endedAt: { type: Date },
    // Grouping + sort key. = endedAt for spans, = now for point events.
    loggedAt: {
      type: Date,
      required: true,
      default: Date.now,
    },
    // Duration in minutes (derived from start/end, or copied from a task).
    timeSpentMinutes: {
      type: Number,
    },
    // Optional extra note.
    note: {
      type: String,
      trim: true,
    },
    source: {
      type: String,
      enum: ["auto", "manual"],
      default: "manual",
    },
    // Generic link back to whatever the activity is about, for de-duping auto
    // entries and (later) deep-linking.
    refType: {
      type: String,
      enum: ["Task", "SalesLead", "SalesReturn", "Order", "Batch", null],
      default: null,
    },
    refId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// A person's own logs, newest first (personal Logs tab).
workLogSchema.index({ user: 1, loggedAt: -1 });
// Every person's logs, newest first (admin Team Logs page).
workLogSchema.index({ loggedAt: -1 });
// Guards against duplicate auto-entries for the same underlying action.
workLogSchema.index({ refType: 1, refId: 1, source: 1 });

export const WORK_LOG_CATEGORIES = CATEGORIES;

const WorkLog = mongoose.model("WorkLog", workLogSchema);

export default WorkLog;
