import Task from "./task.model.js";
import User from "../user/user.model.js";
import SalesLead from "../sales/models/salesLead.model.js";
import Attendance from "../attendance/attendance.model.js";
import AppError from "../../shared/utils/appError.js";
import taskEventEmitter, { TASK_EVENTS } from "./events/taskEventEmitter.js";

/**
 * Reject task assignment to deactivated accounts. Inactive staff/team members
 * must not receive new work until they are reactivated.
 */
const assertAssigneesActive = async (assigneeIds) => {
  const ids = (Array.isArray(assigneeIds) ? assigneeIds : [assigneeIds]).filter(Boolean);
  if (ids.length === 0) return;

  const inactive = await User.find({ _id: { $in: ids }, isActive: false }).select("name lastName");
  if (inactive.length > 0) {
    const names = inactive
      .map((u) => [u.name, u.lastName].filter(Boolean).join(" ") || "a staff member")
      .join(", ");
    throw new AppError(
      `Cannot assign tasks to inactive staff: ${names}. Please reactivate the account first.`,
      400
    );
  }
};

/**
 * Reject task assignment to staff marked absent today — whether by a manual
 * HR override or their own attendance record. Mirrors assertAssigneesActive.
 */
const assertAssigneesNotAbsentToday = async (assigneeIds) => {
  const ids = (Array.isArray(assigneeIds) ? assigneeIds : [assigneeIds]).filter(Boolean);
  if (ids.length === 0) return;

  const date = new Date().toISOString().split("T")[0];
  const absent = await Attendance.find({ userId: { $in: ids }, date, status: "absent" })
    .populate("userId", "name lastName");
  if (absent.length > 0) {
    const names = absent
      .map((r) => [r.userId?.name, r.userId?.lastName].filter(Boolean).join(" ") || "a staff member")
      .join(", ");
    throw new AppError(
      `Cannot assign tasks to staff marked absent today: ${names}.`,
      400
    );
  }
};

export const createTask = async (data, session = null) => {
  const task = new Task(data);
  await task.save(session ? { session } : undefined);
  taskEventEmitter.emit(TASK_EVENTS.CREATED, {
    taskId: task._id,
    title: task.title,
    assignedUserId: task.assignedTo,
    assignedRole: task.assignedRole
  });
  return task;
};

export const getMyTasks = async (userId, filters = {}) => {
  const { view, status, priority, type, notType, user } = filters;

  // Production staff share one floor queue: a batch's inventory-reservation /
  // production tasks are auto-assigned to a single production user, but every
  // production staffer must be able to SEE and claim them (concurrency lock still
  // guards who acts). So for a production user, "assigned_to_me" also surfaces
  // unclaimed team production_stage tasks — not only tasks assigned to them.
  const isProduction =
    user?.role === "production_staff" ||
    user?.currentOperationalRole === "production" ||
    (Array.isArray(user?.operationalRoles) && user.operationalRoles.includes("production"));

  let query = {};

  if (view === "all") {
    // Admin view — no user filter, but only manual tasks by default
  } else if (view === "assigned_by_me") {
    // "Assign Task" view = tasks the user actively delegated through the
    // assign UI. Restrict to manual tasks so auto-generated work (e.g.
    // production_stage tasks spawned by batch automation, which also set
    // assignedBy to the operator who advanced the batch) doesn't leak in.
    query.assignedBy = userId;
    query.type = "manual";
  } else if (view === "assigned_to_me") {
    // Also surface tasks the user held before being reassigned off them — that
    // single card keeps showing on their board (read-only, "Transferred to X")
    // instead of vanishing the moment someone else takes it over.
    const everHeld = [{ assignedTo: userId }, { previousAssignees: { $elemMatch: { user: userId } } }];
    if (isProduction) {
      // My own / past tasks OR any production_stage task (the shared floor queue).
      query.$or = [...everHeld, { type: "production_stage" }];
    } else {
      query.$or = everHeld;
    }
  } else if (view === "following") {
    // "Follow Up" view = tasks where the user is tagged as a follower (not the
    // assignee). These are for tracking / nudging, not for acting on.
    query.followers = userId;
  } else {
    query.$or = [{ assignedTo: userId }, { assignedBy: userId }];
  }

  if (status && status !== "all") query.status = status;
  if (priority && priority !== "all") query.priority = priority;

  // type (equals) and notType (not-equals) must be able to coexist — building
  // them as separate $and clauses instead of both assigning to `query.type`
  // means the second no longer silently overwrites the first.
  const typeConditions = [];
  if (type && type !== "all") typeConditions.push({ type });
  if (notType) typeConditions.push({ type: { $ne: notType } });

  if (typeConditions.length === 1) {
    Object.assign(query, typeConditions[0]);
  } else if (typeConditions.length > 1) {
    query.$and = [...(query.$and || []), ...typeConditions];
  }

  // A deleted task is gone from every board, whichever view asked for it.
  query.isDeleted = { $ne: true };

  const tasks = await Task.find(query)
    .populate("assignedTo", "name lastName email isActive")
    .populate("assignedBy", "name lastName email")
    .populate("previousAssignees.user", "name lastName email")
    .populate("previousAssignees.transferredTo", "name lastName email")
    .populate("flags.raisedBy", "name lastName email")
    .populate("followers", "name lastName email")
    .populate("followUps.author", "name lastName email")
    // Newest activity first — a reassignment now updates the same task
    // document rather than creating a new one, so createdAt alone would leave
    // it stuck wherever it was originally created instead of rising to the
    // top for its new assignee.
    .sort({ updatedAt: -1 });

  // Enrich with a human-readable reference for the related entity (batch number /
  // order number) so the UI can show e.g. "BATCH #1023" instead of a raw ObjectId.
  const batchIds = [];
  const orderIds = [];
  for (const t of tasks) {
    const e = t.relatedEntity;
    if (!e?.entityId) continue;
    if (e.entityType === "Batch") batchIds.push(e.entityId);
    else if (e.entityType === "Order") orderIds.push(e.entityId);
  }

  if (batchIds.length === 0 && orderIds.length === 0) return tasks;

  const refById = new Map();
  // Full batch detail keyed by id, so the floor task card can open a detail
  // popup (quantity, stage, product, due date) without a separate role-gated
  // batch endpoint that warehouse staff can't reach.
  const batchInfoById = new Map();
  if (batchIds.length) {
    const Batch = (await import("../operations/batch/batch.model.js")).default;
    const batches = await Batch.find({ _id: { $in: batchIds } })
      .select("batchNumber quantity productName currentStage dueDate notes")
      .lean();
    batches.forEach((b) => {
      refById.set(String(b._id), b.batchNumber);
      batchInfoById.set(String(b._id), {
        batchNumber: b.batchNumber,
        quantity: b.quantity,
        productName: b.productName,
        currentStage: b.currentStage,
        dueDate: b.dueDate,
        notes: b.notes,
      });
    });
  }
  if (orderIds.length) {
    const Order = (await import("../order/order.model.js")).default;
    const orders = await Order.find({ _id: { $in: orderIds } }).select("orderNumber").lean();
    orders.forEach((o) => refById.set(String(o._id), o.orderNumber));
  }

  return tasks.map((t) => {
    const obj = t.toObject();
    const entityId = obj.relatedEntity?.entityId ? String(obj.relatedEntity.entityId) : null;
    const ref = entityId ? refById.get(entityId) : null;
    if (ref) obj.relatedRef = ref;
    if (entityId && obj.relatedEntity?.entityType === "Batch" && batchInfoById.has(entityId)) {
      obj.batchInfo = batchInfoById.get(entityId);
    }
    return obj;
  });
};

export const updateTaskStatus = async (taskId, userId, newStatus, options = {}) => {
  const task = await Task.findById(taskId);
  if (!task) {
    throw new Error("Task not found.");
  }

  const validStatuses = ["pending", "in_progress", "completed", "overdue"];
  if (!validStatuses.includes(newStatus)) {
    throw new AppError(`Invalid status "${newStatus}". Must be one of: ${validStatuses.join(", ")}`, 400);
  }

  // ── CONCURRENCY LOCK ────────────────────────────────────────────────────────
  // A workflow task in progress belongs to whoever started it. Another staff
  // member cannot take it over while the current owner is still active — only
  // once that owner is deactivated does the task free up. Admins (founders /
  // co-founders) oversee every flow and are exempt. Manual tasks keep their own
  // assigner/assignee rules and are not affected here.
  if (task.type !== "manual" && task.assignedTo && String(task.assignedTo) !== String(userId)) {
    const actor = await User.findById(userId).select("role");
    const isAdmin = actor?.role === "admin";
    if (!isAdmin) {
      const currentOwner = await User.findById(task.assignedTo).select("name lastName isActive");
      const ownerActive = currentOwner && currentOwner.isActive !== false;
      if (task.status === "in_progress" && ownerActive) {
        const ownerName = [currentOwner.name, currentOwner.lastName].filter(Boolean).join(" ") || "another staff member";
        throw new AppError(
          `This task is already in progress by ${ownerName}. You can't take it over until they go inactive.`,
          409
        );
      }
      // Free to claim (pending / overdue, or the previous owner is inactive):
      // reassign to the acting staff member so the task reflects who's doing it.
      task.assignedTo = userId;
    }
  }

  // ── PRE-SAVE AUTOMATIONS & CHECKS ───────────────────────────────────────────
  try {
    // A. Warehouse inventory check for CREATED-stage batches
    if (
      newStatus === "completed" &&
      task.type === "production_stage" &&
      task.relatedEntity?.entityType === "Batch"
    ) {
      const { getBatchById, reserveInventory } = await import("../operations/batch/batch.service.js");
      const batch = await getBatchById(task.relatedEntity.entityId);
      if (batch.currentStage === "CREATED") {
        await reserveInventory(batch._id, userId);
        return await Task.findById(taskId).populate("assignedTo").populate("assignedBy");
      }
    }

    // B. Dispatch Automation (Handoff Flow)
    if (task.type === "order_review" && task.relatedEntity?.entityType === "Order") {
      const Order = (await import("../order/order.model.js")).default;
      const orderId = task.relatedEntity.entityId;

      if (newStatus === "in_progress") {
        await Order.findByIdAndUpdate(orderId, { $set: { dispatchStatus: "in_progress" } });
        if (task.taskGroup) {
          await Task.updateMany(
            { taskGroup: task.taskGroup, _id: { $ne: task._id }, status: { $ne: "cancelled" } },
            { $set: { status: "cancelled", cancelledAt: new Date(), cancelledBy: userId } }
          );
        }
      }

      if (newStatus === "completed") {
        const { orchestrateDispatch } = await import("../dispatch/dispatch.orchestrator.js");
        const currentOrder = await Order.findById(orderId).select("selectedCourier").lean();
        await orchestrateDispatch(orderId, userId, options.courier || currentOrder?.selectedCourier);
      }
    }

    // C. Production Automation (Stage Advancement)
    if (task.type === "production_stage" && task.relatedEntity?.entityType === "Batch") {
      const { advanceStage, runQualityCheck, getBatchById } = await import("../operations/batch/batch.service.js");
      const batchId = task.relatedEntity.entityId;
      const batch = await getBatchById(batchId);
      const stage = batch.currentStage;

      if (newStatus === "in_progress" && stage === "INVENTORY_RESERVED") {
        await advanceStage(batchId, userId, "Production mixing started");
      }
      if (newStatus === "completed" && stage === "QUALITY_CHECK") {
        await runQualityCheck(batchId, { outcome: "pass", notes: "QC passed by production staff" }, userId);
      }
      if (newStatus === "completed" && stage === "PACKAGING") {
        await advanceStage(batchId, userId, "Packaging completed");
      }
    }
  } catch (err) {
    throw err;
  }

  // ── UPDATE & SAVE ──────────────────────────────────────────────────────────

  task.status = newStatus;

  if (newStatus === "in_progress" && !task.startedAt) {
    task.startedAt = new Date();
  }

  if (newStatus === "completed") {
    task.completedAt = new Date();
    if (task.startedAt) {
      task.timeTakenMinutes = Math.round((task.completedAt.getTime() - new Date(task.startedAt).getTime()) / 60000);
    }

    // A finished task has a finished checklist. Without this the Clients board —
    // which measures progress by steps ticked — would keep reading 2 of 6 on
    // work everyone else considers done.
    const steps = task.serviceRequest?.steps;
    if (steps?.length) {
      for (const step of steps) {
        if (step.done) continue;
        step.done = true;
        step.completedAt = task.completedAt;
        step.completedBy = userId;
      }
      task.serviceRequest.stage = "completed";
    }
  } else {
    task.completedAt = null;
  }

  await task.save();

  // Mirror the service's stage onto the lead, the same way ticking a single
  // step does — so the Leads and Clients boards agree with the task board.
  if (newStatus === "completed" && task.serviceRequest?.leadId && task.serviceRequest?.leadServiceId) {
    await SalesLead.updateOne(
      { _id: task.serviceRequest.leadId, "services._id": task.serviceRequest.leadServiceId },
      { $set: { "services.$.stage": task.serviceRequest.stage } }
    );
  }

  // ── WORK LOG ───────────────────────────────────────────────────────────────
  // A completed task becomes a day-wise activity log entry for whoever did it,
  // so it shows up on their Logs tab and the admin Team Logs page. Best-effort:
  // never let a logging hiccup fail the status update.
  if (newStatus === "completed") {
    try {
      const { logTaskCompletion } = await import("../worklog/worklog.service.js");
      await logTaskCompletion(task);
    } catch (err) {
      console.error("[Task Service] Failed to write work log for completed task:", err);
    }
  }

  // ── EVENTS ─────────────────────────────────────────────────────────────────

  const payload = {
    taskId: task._id,
    title: task.title,
    assignedUserId: task.assignedTo,
    assignedRole: task.assignedRole
  };

  if (newStatus === "completed") {
    taskEventEmitter.emit(TASK_EVENTS.COMPLETED, payload);
  } else if (newStatus === "in_progress") {
    taskEventEmitter.emit(TASK_EVENTS.CLAIMED, { ...payload, claimedBy: userId });
    taskEventEmitter.emit(TASK_EVENTS.TRANSITIONED, payload);
  } else {
    taskEventEmitter.emit(TASK_EVENTS.TRANSITIONED, payload);
  }

  return task;
};

export const createManualTask = async (data, actorId) => {
  const { assignedTo, followers, ...taskDetails } = data;

  if (!taskDetails.title?.trim()) {
    const err = new Error("Task title is required");
    err.statusCode = 400;
    throw err;
  }
  taskDetails.title = taskDetails.title.trim();

  // Deadline must not be in the past.
  if (taskDetails.dueAt && new Date(taskDetails.dueAt) < new Date()) {
    const err = new Error("Deadline cannot be in the past");
    err.statusCode = 400;
    throw err;
  }

  const assignees = Array.isArray(assignedTo) ? assignedTo : [assignedTo || actorId];

  // Followers are tagged for follow-up only — de-dupe and never let an assignee
  // also be a follower of their own copy.
  const followerIds = [...new Set((Array.isArray(followers) ? followers : []).filter(Boolean).map(String))];

  await assertAssigneesActive(assignees);
  await assertAssigneesActive(followerIds);
  await assertAssigneesNotAbsentToday(assignees);

  const groupId = assignees.length > 1 ? new (await import("mongoose")).default.Types.ObjectId() : null;

  const tasks = await Promise.all(assignees.map(async (userId) => {
    const task = new Task({
      ...taskDetails,
      source: "manual",
      type: "manual",
      assignedTo: userId,
      assignedBy: actorId,
      taskGroup: groupId,
      followers: followerIds.filter((f) => f !== String(userId)),
    });
    await task.save();
    return task;
  }));

  return await Task.find({ _id: { $in: tasks.map(t => t._id) } })
    .populate("assignedTo")
    .populate("assignedBy")
    .populate("followers", "name lastName email")
    .populate("followUps.author", "name lastName email");
};

export const bulkCreateTasks = async (taskDataArray, session) => {
    return await Task.insertMany(taskDataArray, { session });
};

const SERVICE_STAGES = [
  "documents_pending",
  "documents_received",
  "application_submitted",
  "government_verification",
  "approval_received",
  "certificate_ready",
  "completed",
];

const PRIORITIES = ["low", "medium", "high", "urgent", "critical"];

const normalizeName = (value) => String(value ?? "").trim().toLowerCase().replace(/\s+/g, " ");

/**
 * Bulk-create service request tasks from an imported spreadsheet (CSV/Excel).
 *
 * Each row must name the service and the client. The assignee is resolved from
 * the sheet's "Assigned To" column (matched against active staff by full name,
 * first name or email); rows that don't match fall back to `fallbackAssignedTo`.
 * Rows that can't be resolved at all are skipped and reported back rather than
 * failing the whole import, so a client can fix a few bad rows and re-import.
 */
export const importServiceTasks = async ({ rows, fallbackAssignedTo }, actorId) => {
  if (!Array.isArray(rows) || rows.length === 0) {
    throw new AppError("No rows to import.", 400);
  }
  if (rows.length > 2000) {
    throw new AppError("Too many rows — import at most 2000 at a time.", 400);
  }

  // Build a name/email → id lookup over active staff so sheet columns that carry
  // a person's name (not their database id) still resolve to a real assignee.
  const activeUsers = await User.find({ isActive: { $ne: false } }).select("name lastName email").lean();
  const byName = new Map();
  for (const u of activeUsers) {
    const id = String(u._id);
    const full = normalizeName([u.name, u.lastName].filter(Boolean).join(" "));
    if (full && !byName.has(full)) byName.set(full, id);
    const first = normalizeName(u.name);
    if (first && !byName.has(first)) byName.set(first, id);
    const email = normalizeName(u.email);
    if (email && !byName.has(email)) byName.set(email, id);
  }
  const activeIds = new Set(activeUsers.map((u) => String(u._id)));

  if (fallbackAssignedTo && !activeIds.has(String(fallbackAssignedTo))) {
    throw new AppError("The fallback assignee is not an active staff member.", 400);
  }

  const docs = [];
  const skipped = [];

  rows.forEach((row, index) => {
    // Row number as the client sees it in their spreadsheet: +2 for the header.
    const rowNumber = index + 2;

    const serviceTitle = String(row.serviceTitle ?? "").trim();
    const clientName = String(row.clientName ?? "").trim();

    if (!serviceTitle) {
      skipped.push({ row: rowNumber, reason: "Missing service name" });
      return;
    }
    if (!clientName) {
      skipped.push({ row: rowNumber, reason: `Missing client name for "${serviceTitle}"` });
      return;
    }

    const rawAssignee = String(row.assignedToName ?? "").trim();
    const assignedTo = (rawAssignee && byName.get(normalizeName(rawAssignee))) || fallbackAssignedTo;

    if (!assignedTo) {
      skipped.push({
        row: rowNumber,
        reason: rawAssignee
          ? `No active employee matches "${rawAssignee}"`
          : "No assignee given and no fallback selected",
      });
      return;
    }

    const stage = SERVICE_STAGES.includes(row.stage) ? row.stage : "documents_pending";
    const priority = PRIORITIES.includes(String(row.priority ?? "").toLowerCase())
      ? String(row.priority).toLowerCase()
      : "medium";

    let dueAt = null;
    if (row.dueAt) {
      const parsed = new Date(row.dueAt);
      if (!Number.isNaN(parsed.getTime())) dueAt = parsed;
    }

    const isDone = stage === "completed";

    docs.push({
      title: serviceTitle,
      description: [
        `Service request: ${serviceTitle}`,
        `Client: ${clientName}`,
        row.notes ? `Notes: ${String(row.notes).trim()}` : null,
      ].filter(Boolean).join("\n"),
      type: "manual",
      source: "csv_upload",
      status: isDone ? "completed" : "pending",
      completedAt: isDone ? new Date() : undefined,
      priority,
      dueAt,
      assignedTo,
      assignedBy: actorId,
      serviceRequest: {
        serviceTitle,
        serviceCategory: String(row.serviceCategory ?? "").trim() || undefined,
        clientName,
        clientEmail: String(row.clientEmail ?? "").trim() || undefined,
        clientPhone: String(row.clientPhone ?? "").trim() || undefined,
        clientCompany: String(row.clientCompany ?? "").trim() || undefined,
        clientAddress: String(row.clientAddress ?? "").trim() || undefined,
        notes: String(row.notes ?? "").trim() || undefined,
        stage,
      },
    });
  });

  if (docs.length === 0) {
    throw new AppError(
      `No valid rows found. ${skipped[0]?.reason ?? "Check the column headers against the template."}`,
      400
    );
  }

  const created = await Task.insertMany(docs);

  return { imported: created.length, skipped };
};

export const cancelTask = async (taskId, actorId, scope = "all") => {
  const task = await Task.findById(taskId);
  if (!task) throw new AppError("Task not found.", 404);
  const now = new Date();
  // "single" cancels only this assignee's copy; "all" cancels every copy in the group.
  const query =
    scope === "single" || !task.taskGroup
      ? { _id: task._id }
      : { taskGroup: task.taskGroup };
  await Task.updateMany(query, { $set: { status: "cancelled", cancelledAt: now, cancelledBy: actorId } });
  return await Task.find(query).populate("assignedTo").populate("assignedBy");
};

/**
 * Removes a task from every board.
 *
 * Soft delete rather than a hard one: work logs, follow-up notes and history
 * all point at this id, and destroying the row would leave those dangling.
 *
 * Only the person who assigned the task or an admin can remove it — an
 * assignee who could delete their own work could quietly make it disappear.
 */
export const deleteTask = async (taskId, actorId, scope = "all") => {
  const task = await Task.findById(taskId);
  if (!task) throw new AppError("Task not found.", 404);
  if (task.isDeleted) throw new AppError("This task has already been deleted.", 409);

  const actor = await User.findById(actorId).select("role");
  const isAdmin = actor?.role === "admin";
  const isAssigner = String(task.assignedBy) === String(actorId);
  if (!isAdmin && !isAssigner) {
    throw new AppError("Only the person who assigned this task, or an admin, can delete it.", 403);
  }

  // "single" removes just this copy; "all" removes every copy created when the
  // same task was assigned to several people at once.
  const query =
    scope === "single" || !task.taskGroup
      ? { _id: task._id }
      : { taskGroup: task.taskGroup };

  const result = await Task.updateMany(query, {
    $set: { isDeleted: true, deletedAt: new Date(), deletedBy: actorId },
  });

  return { deleted: result.modifiedCount ?? 0 };
};

export const autoFlagOverdueTasks = async () => {
    try {
        const now = new Date();
        const overdueTasks = await Task.find({ status: { $in: ["pending", "in_progress"] }, dueAt: { $lt: now } });
        if (overdueTasks.length > 0) {
            await Task.updateMany({ _id: { $in: overdueTasks.map(t => t._id) } }, { $set: { status: "overdue", overdueAt: now } });
        }
    } catch (error) {
        console.error("[Task Service] Error auto-flagging overdue tasks:", error);
    }
};

export const raiseIssue = async (taskId, userId, message) => {
  const task = await Task.findById(taskId);
  if (!task) throw new AppError("Task not found", 404);
  task.flags.push({ message, raisedBy: userId, raisedAt: new Date() });
  await task.save();
  return await Task.findById(taskId).populate("assignedTo").populate("assignedBy").populate("flags.raisedBy");
};

export const respondToIssue = async (taskId, flagId, actorId, response) => {
  const task = await Task.findById(taskId);
  const flag = task.flags.id(flagId);
  if (!flag) throw new AppError("Issue flag not found", 404);
  flag.adminResponse = response;
  flag.adminResponseAt = new Date();
  flag.resolvedAt = new Date();
  await task.save();
  return await Task.findById(taskId).populate("assignedTo").populate("assignedBy");
};

// Populate a task's people fields consistently for the API response.
const populateTask = (taskId) =>
  Task.findById(taskId)
    .populate("assignedTo")
    .populate("assignedBy")
    .populate("followers", "name lastName email")
    .populate("followUps.author", "name lastName email");

/**
 * Post a follow-up note on a task. Allowed for the assignee, the assigner, any
 * tagged follower, or admin/founder oversight — everyone with a stake in the task.
 */
export const addFollowUp = async (taskId, userId, message) => {
  const text = (message || "").trim();
  if (!text) throw new AppError("Follow-up note cannot be empty.", 400);

  const task = await Task.findById(taskId);
  if (!task) throw new AppError("Task not found.", 404);

  const actor = await User.findById(userId).select("role");
  const isAdmin = actor?.role === "admin";
  const isStakeholder =
    String(task.assignedTo) === String(userId) ||
    String(task.assignedBy) === String(userId) ||
    task.followers.some((f) => String(f) === String(userId));
  if (!isAdmin && !isStakeholder) {
    throw new AppError("You don't have access to post a follow-up on this task.", 403);
  }

  task.followUps.push({ message: text, author: userId, createdAt: new Date() });
  await task.save();
  return await populateTask(task._id);
};

/**
 * Ticks (or un-ticks) one step of a service request's checklist.
 *
 * The checklist is how progress on a service is actually measured, so the lead
 * this task came off is nudged along with it: finishing every step marks the
 * service complete, and the first tick moves it out of "documents pending".
 */
export const updateServiceStep = async (taskId, stepId, actorId, done) => {
  const task = await Task.findById(taskId);
  if (!task) throw new AppError("Task not found.", 404);

  const step = task.serviceRequest?.steps?.id(stepId);
  if (!step) throw new AppError("That step is not on this task.", 404);

  const actor = await User.findById(actorId).select("role");
  const isAdmin = actor?.role === "admin";
  const isStakeholder =
    String(task.assignedTo) === String(actorId) ||
    String(task.assignedBy) === String(actorId);
  if (!isAdmin && !isStakeholder) {
    throw new AppError("You don't have access to update this checklist.", 403);
  }

  step.done = Boolean(done);
  step.completedAt = step.done ? new Date() : undefined;
  step.completedBy = step.done ? actorId : undefined;

  const steps = task.serviceRequest.steps;
  const allDone = steps.length > 0 && steps.every((s) => s.done);

  if (allDone) {
    task.serviceRequest.stage = "completed";
  } else if (task.serviceRequest.stage === "completed") {
    // Re-opening a step means the service is no longer finished.
    task.serviceRequest.stage = "certificate_ready";
  } else if (steps.some((s) => s.done) && task.serviceRequest.stage === "documents_pending") {
    task.serviceRequest.stage = "documents_received";
  }

  await task.save();

  // Mirror the stage back onto the lead's service so the Leads and Clients
  // boards agree with the task board without a second write path.
  const leadId = task.serviceRequest?.leadId;
  const leadServiceId = task.serviceRequest?.leadServiceId;
  if (leadId && leadServiceId) {
    await SalesLead.updateOne(
      { _id: leadId, "services._id": leadServiceId },
      { $set: { "services.$.stage": task.serviceRequest.stage } }
    );
  }

  return await populateTask(task._id);
};

/**
 * Set the follow-up followers on a task. Managed by the assigner or admin
 * oversight. Assignees can't be followers of their own task.
 */
export const updateFollowers = async (taskId, actorId, followerIds) => {
  const task = await Task.findById(taskId);
  if (!task) throw new AppError("Task not found.", 404);

  const actor = await User.findById(actorId).select("role");
  const isAdmin = actor?.role === "admin";
  const isAssigner = String(task.assignedBy) === String(actorId);
  if (!isAdmin && !isAssigner) {
    throw new AppError("Only the assigner or an admin can change follow-up tags.", 403);
  }

  const ids = [...new Set((Array.isArray(followerIds) ? followerIds : []).filter(Boolean).map(String))]
    .filter((id) => id !== String(task.assignedTo));
  await assertAssigneesActive(ids);

  task.followers = ids;
  await task.save();
  return await populateTask(task._id);
};

export const extendDueDate = async (taskId, actorId, newDueAt) => {
  const task = await Task.findById(taskId);
  const newDate = new Date(newDueAt);
  if (newDate < new Date()) {
    const err = new Error("Deadline cannot be in the past");
    err.statusCode = 400;
    throw err;
  }
  task.dueAt = newDate;
  if (task.status === "overdue") task.status = "pending";
  await task.save();
  if (task.taskGroup) {
    await Task.updateMany({ taskGroup: task.taskGroup, _id: { $ne: task._id }, status: { $nin: ["completed", "cancelled"] } }, { $set: { dueAt: newDate } });
  }
  return await Task.findById(taskId).populate("assignedTo").populate("assignedBy");
};

/**
 * Auto-cancel every ongoing task assigned to a staff member who has just been
 * deactivated. Cancelled copies are tagged with cancelReason "assignee_inactive"
 * and an unacknowledged alert, which the assigner / admin oversight then resolves
 * by reassigning or confirming the cancellation. Returns the cancelled tasks.
 */
export const cancelTasksForInactiveUser = async (userId, actorId = null) => {
  if (!userId) return [];
  const ongoing = await Task.find({
    assignedTo: userId,
    status: { $in: ["pending", "in_progress", "overdue"] },
  }).select("_id");
  if (ongoing.length === 0) return [];

  const ids = ongoing.map((t) => t._id);
  await Task.updateMany(
    { _id: { $in: ids } },
    {
      $set: {
        status: "cancelled",
        cancelledAt: new Date(),
        cancelledBy: actorId,
        cancelReason: "assignee_inactive",
        cancelAlertAck: false,
      },
    }
  );
  return await Task.find({ _id: { $in: ids } }).populate("assignedTo").populate("assignedBy");
};

/**
 * Acknowledge an "assignee inactive" cancellation alert without reassigning —
 * i.e. the assigner / oversight confirms the task should stay cancelled. The
 * task remains cancelled; only the alert is cleared.
 */
export const acknowledgeCancelAlert = async (taskId) => {
  const task = await Task.findById(taskId);
  if (!task) throw new AppError("Task not found.", 404);
  task.cancelAlertAck = true;
  await task.save();
  return await Task.findById(task._id).populate("assignedTo").populate("assignedBy");
};

// Reset the fields that make a task "active" again, so a cancelled/completed task
// reassigned to fresh staff starts clean.
const reviveTaskFields = (task) => {
  task.status = "pending";
  task.cancelledAt = null;
  task.cancelledBy = null;
  task.cancelReason = "manual";
  task.cancelAlertAck = false;
  task.startedAt = null;
  task.completedAt = null;
  task.timeTakenMinutes = null;
  task.overdueAt = null;
};

export const reassignTask = async (taskId, actorId, newAssignee) => {
  // Accepts a single id or an array — reassigning to several people at once
  // (used by the "assignee inactive" reassign popup) revives the task for the
  // first assignee and spins up grouped copies for the rest.
  const ids = (Array.isArray(newAssignee) ? newAssignee : [newAssignee]).filter(Boolean);
  if (ids.length === 0) throw new AppError("Select at least one staff member to reassign to.", 400);
  await assertAssigneesActive(ids);
  await assertAssigneesNotAbsentToday(ids);

  const task = await Task.findById(taskId);
  if (!task) throw new AppError("Task not found.", 404);

  const [first, ...rest] = ids;
  const groupId = ids.length > 1 ? task.taskGroup || task._id : task.taskGroup;

  // Same task document handed on, not a new one — a former holder's board
  // still shows this one card (read-only, via previousAssignees) instead of
  // it just disappearing.
  const previousAssigneeId = task.assignedTo ? String(task.assignedTo) : null;
  if (previousAssigneeId && previousAssigneeId !== String(first)) {
    task.previousAssignees.push({
      user: task.assignedTo,
      transferredTo: first,
      transferredAt: new Date(),
    });
  }

  task.assignedTo = first;
  task.assignedBy = actorId;
  if (ids.length > 1) task.taskGroup = groupId;
  reviveTaskFields(task);
  await task.save();

  if (rest.length > 0) {
    await Promise.all(
      rest.map(async (userId) => {
        const copy = new Task({
          ...task.toObject(),
          _id: undefined,
          createdAt: undefined,
          updatedAt: undefined,
          assignedTo: userId,
          assignedBy: actorId,
          taskGroup: groupId,
        });
        reviveTaskFields(copy);
        await copy.save();
      })
    );
  }

  return await Task.findById(task._id).populate("assignedTo").populate("assignedBy");
};

export const assignMore = async (taskId, actorId, assigneeIds) => {
  await assertAssigneesActive(assigneeIds);
  await assertAssigneesNotAbsentToday(assigneeIds);
  const task = await Task.findById(taskId);
  if (!task.taskGroup) {
    task.taskGroup = task._id;
    await task.save();
  }
  const groupId = task.taskGroup;
  return await Promise.all(assigneeIds.map(async (userId) => {
    const newTask = new Task({ ...task.toObject(), _id: undefined, assignedTo: userId, assignedBy: actorId, taskGroup: groupId, status: "pending" });
    await newTask.save();
    return newTask;
  }));
};

export const startOverdueTaskScheduler = (intervalMs = 15 * 60 * 1000) => {
    setInterval(autoFlagOverdueTasks, intervalMs);
};
