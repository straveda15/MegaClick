import { withTransaction } from '../../../shared/infrastructure/db.transaction.js';
import Task from '../models/task.model.js';
import TaskHistory from '../models/taskHistory.model.js';
import OutboxEvent from '../../outbox/models/outboxEvent.model.js';
import AppError from '../../../shared/utils/appError.js';
import logger from '../../../shared/infrastructure/logger.js';

export const transitionTaskState = async ({ taskId, actorId, actorRole, targetState, reason = '' }) => {
  return withTransaction(async (session) => {
    // 1. Pessimistic read / Concurrency Control
    // In Mongoose, an atomic update or finding with session helps lock logic mentally, but to avoid strictly
    // write conflicts, we just let the transaction manage it natively in MongoDB.
    const task = await Task.findById(taskId).session(session);
    
    if (!task) throw new AppError('Task not found', 404);

    if (task.assignedRole !== actorRole && actorRole !== 'admin') {
      throw new AppError('Unauthorized: You cannot transition a task assigned to another role.', 403);
    }

    if (task.assignedUserId && task.assignedUserId.toString() !== actorId.toString() && actorRole !== 'admin') {
       throw new AppError('Unauthorized: This task is assigned to someone else.', 403);
    }

    const previousStatus = task.status;
    const validTransitions = {
      'pending': ['in_progress'],
      'in_progress': ['paused', 'completed'],
      'paused': ['in_progress'],
      'completed': [],
      'overdue': ['in_progress']
    };

    if (!validTransitions[previousStatus].includes(targetState)) {
      throw new AppError(`Illegal State Transition: Cannot move from ${previousStatus} to ${targetState}`, 400);
    }

    // 2. Perform Atomic Updates
    task.status = targetState;
    if (!task.assignedUserId && targetState === 'in_progress') {
      task.assignedUserId = actorId;
    }
    await task.save({ session });

    await TaskHistory.create([{
      taskId: task._id,
      previousStatus,
      newStatus: targetState,
      changedBy: actorId,
      reason
    }], { session });

    // 3. Outbox Event instead of EventEmitter
    await OutboxEvent.create([{
      eventType: 'task.status_changed',
      payload: {
        taskId: task._id,
        previousStatus,
        newStatus: targetState,
        actorId
      }
    }], { session });

    logger.info(`Task ${task._id} transitioned to ${targetState}`);
    return task;
  });
};
