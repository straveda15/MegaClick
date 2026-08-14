import WorkLog from "./worklog.model.js";
import AppError from "../../shared/utils/appError.js";

/**
 * Build the { $gte, $lte } loggedAt filter from optional ISO date strings.
 * `end` is pushed to the end of its day so an inclusive date range works.
 */
const buildDateRange = (start, end) => {
  const range = {};
  if (start) {
    const s = new Date(start);
    if (!isNaN(s.getTime())) range.$gte = s;
  }
  if (end) {
    const e = new Date(end);
    if (!isNaN(e.getTime())) {
      // If only a date (no time) was passed, extend to the end of that day.
      if (String(end).length <= 10) e.setHours(23, 59, 59, 999);
      range.$lte = e;
    }
  }
  return Object.keys(range).length ? range : null;
};

// Minutes between two dates, rounded, or undefined when we can't compute it.
const minutesBetween = (start, end) => {
  if (!start || !end) return undefined;
  const ms = new Date(end).getTime() - new Date(start).getTime();
  if (isNaN(ms) || ms < 0) return undefined;
  return Math.round(ms / 60000);
};

// Map a Task's type to a WorkLog category.
const TASK_TYPE_CATEGORY = {
  production_stage: "production",
  order_review: "order",
  lead_followup: "lead",
  return_verify: "return",
  manual: "task",
};

/**
 * Add a manual work-log entry for a user. Accepts an explicit start/end window
 * (both optional); when both are given the duration is computed from them.
 */
export const createManualLog = async (userId, { activity, startedAt, endedAt, note }) => {
  const text = (activity || "").trim();
  if (!text) throw new AppError("Log entry (activity) is required.", 400);

  const start = startedAt ? new Date(startedAt) : null;
  const end = endedAt ? new Date(endedAt) : null;
  if (start && isNaN(start.getTime())) throw new AppError("Invalid start date/time.", 400);
  if (end && isNaN(end.getTime())) throw new AppError("Invalid end date/time.", 400);
  if (start && end && end.getTime() < start.getTime()) {
    throw new AppError("End time can't be before start time.", 400);
  }

  // Group under the end time when known, else the start time, else now.
  const loggedAt = end || start || new Date();

  const log = await WorkLog.create({
    user: userId,
    activity: text,
    category: "manual",
    startedAt: start || undefined,
    endedAt: end || undefined,
    loggedAt,
    timeSpentMinutes: minutesBetween(start, end),
    note: (note || "").trim() || undefined,
    source: "manual",
  });
  return log;
};

/**
 * Record a completed task as an auto work-log entry for whoever completed it,
 * carrying the task's real start → complete window. Idempotent: re-completing
 * the same task updates its existing auto entry instead of duplicating.
 */
export const logTaskCompletion = async (task) => {
  if (!task?.assignedTo) return null;
  const start = task.startedAt || null;
  const end = task.completedAt || new Date();
  return await WorkLog.findOneAndUpdate(
    { refType: "Task", refId: task._id, source: "auto" },
    {
      $set: {
        user: task.assignedTo,
        activity: task.title,
        category: TASK_TYPE_CATEGORY[task.type] || "task",
        startedAt: start || undefined,
        endedAt: end,
        loggedAt: end,
        timeSpentMinutes:
          task.timeTakenMinutes != null ? task.timeTakenMinutes : minutesBetween(start, end),
        source: "auto",
        refType: "Task",
        refId: task._id,
      },
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
};

/**
 * Record a point-in-time action (a lead worked, a return closed, etc.) as an
 * auto work-log entry. These have no natural span, so start/end are left unset
 * and the entry is stamped at "now". Best-effort: never throws to its caller.
 */
export const logActivity = async ({ user, activity, category = "other", note, refType, refId }) => {
  try {
    if (!user || !activity) return null;
    return await WorkLog.create({
      user,
      activity,
      category,
      loggedAt: new Date(),
      note: (note || "").trim() || undefined,
      source: "auto",
      refType: refType || null,
      refId: refId || null,
    });
  } catch (err) {
    console.error("[WorkLog] Failed to record activity:", err?.message || err);
    return null;
  }
};

/**
 * A single user's logs (their own Logs tab), newest first.
 */
export const getMyLogs = async (userId, { start, end } = {}) => {
  const query = { user: userId };
  const range = buildDateRange(start, end);
  if (range) query.loggedAt = range;
  return await WorkLog.find(query).sort({ loggedAt: -1 });
};

/**
 * Every user's logs (admin Team Logs page), newest first. Optionally scoped to
 * one user or a date range.
 */
export const getTeamLogs = async ({ start, end, userId } = {}) => {
  const query = {};
  if (userId) query.user = userId;
  const range = buildDateRange(start, end);
  if (range) query.loggedAt = range;
  return await WorkLog.find(query)
    .populate("user", "name lastName email role")
    .sort({ loggedAt: -1 });
};
