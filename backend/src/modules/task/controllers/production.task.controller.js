import * as productionTaskService from '../services/production.task.service.js';

// Maps a primary user role to its equivalent task assignedRole bucket
const PRIMARY_ROLE_TO_TASK_ROLE = {
  production_staff: 'production',
  packaging_staff: 'packaging',
  dispatch_staff: 'dispatch',
};

function deriveEffectiveRoles(user) {
  const roles = new Set(user.operationalRoles || []);
  if (user.currentOperationalRole) roles.add(user.currentOperationalRole);
  const mapped = PRIMARY_ROLE_TO_TASK_ROLE[user.role];
  if (mapped) roles.add(mapped);
  return Array.from(roles);
}

export const getMyProductionTasks = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const operationalRoles = deriveEffectiveRoles(req.user);
    const { status, priority, entityType } = req.query;

    const tasks = await productionTaskService.getMyProductionTasks(
      userId,
      operationalRoles,
      { status, priority, entityType }
    );

    res.status(200).json({
      success: true,
      message: 'Tasks retrieved successfully',
      data: tasks,
    });
  } catch (err) {
    next(err);
  }
};

export const getAllProductionTasks = async (req, res, next) => {
  try {
    const { status, priority, assignedRole, entityType, assignedUserId } = req.query;

    const tasks = await productionTaskService.getAllProductionTasks({
      status,
      priority,
      assignedRole,
      entityType,
      assignedUserId,
    });

    res.status(200).json({
      success: true,
      message: 'All production tasks retrieved successfully',
      data: tasks,
    });
  } catch (err) {
    next(err);
  }
};

export const createProductionTask = async (req, res, next) => {
  try {
    const task = await productionTaskService.createProductionTask(req.body, req.user._id);

    res.status(201).json({
      success: true,
      message: 'Production task created successfully',
      data: task,
    });
  } catch (err) {
    next(err);
  }
};

export const claimProductionTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    const operationalRoles = deriveEffectiveRoles(req.user);

    const task = await productionTaskService.claimProductionTask(id, userId, operationalRoles);

    res.status(200).json({
      success: true,
      message: 'Task claimed successfully',
      data: task,
    });
  } catch (err) {
    next(err);
  }
};

export const transitionProductionTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { targetState, reason } = req.body;
    const actorId = req.user._id;
    // Use currentOperationalRole if set, else fall back to first operationalRole
    const effectiveRoles = deriveEffectiveRoles(req.user);
    const actorRole = effectiveRoles[0] || req.user.role; // admin fallback

    if (!targetState) {
      return res.status(400).json({ success: false, message: 'targetState is required' });
    }

    const task = await productionTaskService.transitionProductionTask({
      taskId: id,
      actorId,
      actorRole,
      targetState,
      reason,
    });

    res.status(200).json({
      success: true,
      message: `Task transitioned to ${targetState}`,
      data: task,
    });
  } catch (err) {
    next(err);
  }
};
