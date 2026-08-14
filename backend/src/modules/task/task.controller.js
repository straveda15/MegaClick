import * as taskService from "./task.service.js";

export const getMyTasks = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { status, priority, type, view, notType } = req.query;

    // When admin requests view=all with no other type filter, restrict to manual
    // tasks only, so that production_stage / dispatch system tasks don't pollute
    // the admin "All Tasks" board (TasksPage.tsx). Skip this default when the
    // caller already sent an explicit notType (e.g. the Floor Tasks panels ask
    // for view=all&notType=manual to get every *non*-manual workflow task) —
    // otherwise the fallback directly contradicts what was asked for.
    const resolvedType = view === "all" && !notType ? (type || "manual") : type;

    const tasks = await taskService.getMyTasks(userId, { status, priority, type: resolvedType, view, notType, user: req.user });

    res.status(200).json({
      success: true,
      message: "Tasks retrieved successfully",
      data: tasks,
    });
  } catch (error) {
    next(error);
  }
};

export const updateTaskStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, courier } = req.body;
    const userId = req.user._id;

    if (!status) {
        return res.status(400).json({ success: false, message: "Status is required." });
    }

    // Role check logic will happen inside service, but we ensure admin bypass here
    const task = await taskService.updateTaskStatus(id, userId, status, { courier });

    res.status(200).json({
      success: true,
      message: "Task status updated successfully",
      data: task,
    });
  } catch (error) {
    next(error);
  }
};

export const getTaskById = async (req, res, next) => {
  try {
    const { default: Task } = await import('./task.model.js');
    const task = await Task.findById(req.params.id).lean();
    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });
    res.status(200).json({ success: true, data: task });
  } catch (error) {
    next(error);
  }
};

export const createManualTask = async (req, res, next) => {
  try {
    const actorId = req.user._id;
    const taskData = req.body;

    const task = await taskService.createManualTask(taskData, actorId);

    res.status(201).json({
      success: true,
      message: "Manual task created successfully",
      data: task,
    });
  } catch (error) {
    next(error);
  }
};

export const importServiceTasks = async (req, res, next) => {
  try {
    const { rows, fallbackAssignedTo } = req.body;

    const result = await taskService.importServiceTasks(
      { rows, fallbackAssignedTo },
      req.user._id
    );

    res.status(201).json({
      success: true,
      message: `Imported ${result.imported} service${result.imported === 1 ? "" : "s"}`,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const cancelTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { scope } = req.body; // "all" (whole group) | "single" (this assignee only)
    const actorId = req.user._id;
    const task = await taskService.cancelTask(id, actorId, scope);
    res.status(200).json({ success: true, message: "Task cancelled", data: task });
  } catch (error) {
    next(error);
  }
};

export const raiseIssue = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { message } = req.body;
    const userId = req.user._id;
    const task = await taskService.raiseIssue(id, userId, message);
    res.status(200).json({ success: true, message: "Issue raised successfully", data: task });
  } catch (error) {
    next(error);
  }
};

export const respondToIssue = async (req, res, next) => {
  try {
    const { id, flagId } = req.params;
    const { response } = req.body;
    const actorId = req.user._id;
    const task = await taskService.respondToIssue(id, flagId, actorId, response);
    res.status(200).json({ success: true, message: "Response sent", data: task });
  } catch (error) {
    next(error);
  }
};

export const addFollowUp = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { message } = req.body;
    const userId = req.user._id;
    const task = await taskService.addFollowUp(id, userId, message);
    res.status(201).json({ success: true, message: "Follow-up added", data: task });
  } catch (error) {
    next(error);
  }
};

export const updateFollowers = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { followerIds } = req.body;
    const actorId = req.user._id;
    const task = await taskService.updateFollowers(id, actorId, followerIds);
    res.status(200).json({ success: true, message: "Follow-up tags updated", data: task });
  } catch (error) {
    next(error);
  }
};

export const extendDueDate = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { dueAt } = req.body;
    const actorId = req.user._id;
    const task = await taskService.extendDueDate(id, actorId, dueAt);
    res.status(200).json({ success: true, message: "Due date extended", data: task });
  } catch (error) {
    next(error);
  }
};

export const reassignTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    // Accept a single assignee (assignedTo) or many (assigneeIds) — the
    // "assignee inactive" reassign popup sends one or more people.
    const { assignedTo, assigneeIds } = req.body;
    const actorId = req.user._id;
    const task = await taskService.reassignTask(id, actorId, assigneeIds ?? assignedTo);
    res.status(200).json({ success: true, message: "Task reassigned", data: task });
  } catch (error) {
    next(error);
  }
};

export const acknowledgeCancelAlert = async (req, res, next) => {
  try {
    const { id } = req.params;
    const task = await taskService.acknowledgeCancelAlert(id);
    res.status(200).json({ success: true, message: "Cancellation acknowledged", data: task });
  } catch (error) {
    next(error);
  }
};

export const assignMore = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { assigneeIds } = req.body;
    const actorId = req.user._id;
    const tasks = await taskService.assignMore(id, actorId, assigneeIds);
    res.status(201).json({ success: true, message: "Task assigned to more staff", data: tasks });
  } catch (error) {
    next(error);
  }
};
