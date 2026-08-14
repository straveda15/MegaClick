import taskEventEmitter, { TASK_EVENTS } from './taskEventEmitter.js';
import { getSocketServer } from '../../../shared/websocket/socketServer.js';
import logger from '../../../shared/infrastructure/logger.js';

function log(event, payload) {
  logger.info({ event, timestamp: new Date().toISOString(), payload });
}

export function registerTaskNotificationHandlers() {
  taskEventEmitter.on(TASK_EVENTS.CREATED, (payload) => {
    log(TASK_EVENTS.CREATED, payload);
    const io = getSocketServer();
    if (!io) return;
    const staffNS = io.of('/staff');
    // Notify the specific role + admin
    if (payload.assignedRole) staffNS.to(payload.assignedRole).emit('task:created', payload);
    staffNS.to('admin').emit('task:created', payload);
  });

  taskEventEmitter.on(TASK_EVENTS.CLAIMED, (payload) => {
    log(TASK_EVENTS.CLAIMED, payload);
    const io = getSocketServer();
    if (!io) return;
    const staffNS = io.of('/staff');
    if (payload.claimedBy) staffNS.to(`user:${payload.claimedBy}`).emit('task:claimed', payload);
    staffNS.to('admin').emit('task:claimed', payload);
  });

  taskEventEmitter.on(TASK_EVENTS.TRANSITIONED, (payload) => {
    log(TASK_EVENTS.TRANSITIONED, payload);
    const io = getSocketServer();
    if (!io) return;
    io.of('/staff').to('admin').emit('task:transitioned', payload);
  });

  taskEventEmitter.on(TASK_EVENTS.OVERDUE, (payload) => {
    log(TASK_EVENTS.OVERDUE, payload);
    const io = getSocketServer();
    if (!io) return;
    const staffNS = io.of('/staff');
    if (payload.assignedUserId) staffNS.to(`user:${payload.assignedUserId}`).emit('task:overdue', payload);
    staffNS.to('admin').emit('task:overdue', payload);
  });

  taskEventEmitter.on(TASK_EVENTS.COMPLETED, (payload) => {
    log(TASK_EVENTS.COMPLETED, payload);
    const io = getSocketServer();
    if (!io) return;
    io.of('/staff').to('admin').emit('task:completed', payload);
  });
}
