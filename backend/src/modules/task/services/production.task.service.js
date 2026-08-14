import ProductionTask from '../models/task.model.js';
import { transitionTaskState } from './task.state.service.js';
import AppError from '../../../shared/utils/appError.js';

const VALID_ENTITY_TYPES = ['Batch', 'Order', 'Stock'];
const VALID_ASSIGNED_ROLES = ['production', 'packaging', 'dispatch', 'warehouse', 'ops_staff'];

/**
 * Fetch tasks visible to a production_staff user.
 *
 * A task is visible if:
 *  a) It is directly assigned to the user (assignedUserId === userId), OR
 *  b) It belongs to one of the user's operational roles AND is unclaimed (assignedUserId == null)
 *
 * @param {string}   userId           - ObjectId of the requesting user
 * @param {string[]} operationalRoles - User's operational role array from the JWT/User doc
 * @param {object}   filters          - Optional: { status, priority, entityType }
 */
export const getMyProductionTasks = async (userId, operationalRoles = [], filters = {}) => {
  const query = {
    $or: [
      { assignedUserId: userId },
      ...(operationalRoles.length
        ? [{ assignedRole: { $in: operationalRoles }, assignedUserId: null }]
        : []),
    ],
  };

  if (filters.status) query.status = filters.status;
  if (filters.priority) query.priority = filters.priority;
  if (filters.entityType) query.entityType = filters.entityType;

  return ProductionTask.find(query)
    .sort({ dueDate: 1, createdAt: -1 })
    .populate('assignedUserId', 'name lastName');
};

/**
 * Claim a role-bucket task (sets assignedUserId to the requesting user).
 * Only allowed when the task is not yet claimed and the user's roles include the task's assignedRole.
 */
export const claimProductionTask = async (taskId, userId, operationalRoles = []) => {
  const task = await ProductionTask.findById(taskId);
  if (!task) throw new AppError('Task not found', 404);

  if (task.assignedUserId) {
    throw new AppError('Task is already claimed by another worker', 409);
  }

  if (!operationalRoles.includes(task.assignedRole)) {
    throw new AppError('You do not have the required role to claim this task', 403);
  }

  task.assignedUserId = userId;
  await task.save();
  return task;
};

/**
 * FSM-based status transition. Delegates to task.state.service which handles
 * history recording and outbox events inside a transaction.
 */
export const transitionProductionTask = async ({ taskId, actorId, actorRole, targetState, reason }) => {
  return transitionTaskState({ taskId, actorId, actorRole, targetState, reason });
};

/**
 * Create a production task. Called by admin or manager.
 *
 * @param {object} data - { title, description, assignedRole, assignedUserId?,
 *                          priority?, dueDate, entityType?, entityId? }
 * @param {string} createdBy - ObjectId of the creating user
 */
export const createProductionTask = async (data, createdBy) => {
  const {
    title,
    description,
    assignedRole,
    assignedUserId,
    priority = 'medium',
    dueDate,
    entityType,
    entityId,
  } = data;

  if (!title) throw new AppError('Title is required', 400);
  if (!assignedRole) throw new AppError('assignedRole is required', 400);
  if (!VALID_ASSIGNED_ROLES.includes(assignedRole)) {
    throw new AppError(`Invalid assignedRole. Must be one of: ${VALID_ASSIGNED_ROLES.join(', ')}`, 400);
  }
  if (!dueDate) throw new AppError('dueDate is required', 400);
  if (entityType && !VALID_ENTITY_TYPES.includes(entityType)) {
    throw new AppError(`Invalid entityType. Must be one of: ${VALID_ENTITY_TYPES.join(', ')}`, 400);
  }

  const task = await ProductionTask.create({
    title,
    description,
    assignedRole,
    assignedUserId: assignedUserId || null,
    priority,
    dueDate,
    entityType: entityType || null,
    entityId: entityId || null,
    status: 'pending',
  });

  return task;
};

/**
 * Admin-only: list all production tasks with optional filters.
 */
export const getAllProductionTasks = async (filters = {}) => {
  const query = {};

  if (filters.status) query.status = filters.status;
  if (filters.priority) query.priority = filters.priority;
  if (filters.assignedRole) query.assignedRole = filters.assignedRole;
  if (filters.entityType) query.entityType = filters.entityType;
  if (filters.assignedUserId) query.assignedUserId = filters.assignedUserId;

  return ProductionTask.find(query)
    .sort({ dueDate: 1, createdAt: -1 })
    .populate('assignedUserId', 'name lastName');
};

/**
 * Interval-based sweep to flag overdue production tasks.
 * Called on server startup.
 */
export const autoFlagOverdueProductionTasks = async () => {
  try {
    const now = new Date();
    const result = await ProductionTask.updateMany(
      {
        status: { $in: ['pending', 'in_progress', 'paused'] },
        dueDate: { $lt: now },
      },
      { $set: { status: 'overdue' } }
    );
    if (result.modifiedCount > 0) {
      console.log(`[ProductionTask] Auto-flagged ${result.modifiedCount} tasks as overdue.`);
    }
  } catch (err) {
    console.error('[ProductionTask] Error auto-flagging overdue tasks:', err);
  }
};

export const startProductionOverdueScheduler = (intervalMs = 15 * 60 * 1000) => {
  console.log('[ProductionTask] Starting overdue scheduler');
  autoFlagOverdueProductionTasks();
  setInterval(autoFlagOverdueProductionTasks, intervalMs);
};
