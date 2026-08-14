/**
 * Socket.IO server
 *
 * Bridges in-process eventBus events to connected dashboard clients over WebSocket.
 * All clients must authenticate with a valid JWT on connection handshake.
 *
 * Room model:
 *   - Every authenticated user joins their user-specific room: `user:<userId>`
 *   - Role-based broadcast rooms: 'dispatch_staff', 'admin', 'all_staff'
 *
 * Events broadcast to clients:
 *   order:dispatching      — dispatch lock claimed, shipment in progress
 *   order:dispatched       — dispatch complete (tracking number included)
 *   order:dispatch_failed  — dispatch failed (reason included)
 *   task:created           — new task assigned
 *   task:updated           — task status changed
 *   order:packed           — order moved to packed state
 *
 * Frontend usage (React):
 *   const socket = io('/staff', { auth: { token: localStorage.opsos_access_token } })
 *   socket.on('order:dispatched', (data) => queryClient.invalidateQueries(['orders']))
 */

import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import eventBus, { EVENTS } from '../events/eventBus.js';
import logger from '../infrastructure/logger.js';

let _io = null;

// ─── Auth middleware ──────────────────────────────────────────────────────────

function socketAuthMiddleware(socket, next) {
  const token = socket.handshake.auth?.token
    || socket.handshake.headers?.authorization?.replace('Bearer ', '');

  if (!token) {
    return next(new Error('Authentication required'));
  }

  try {
    const secret = process.env.ACCESS_TOKEN_SECRET || process.env.JWT_SECRET;
    const decoded = jwt.verify(token, secret);
    socket.user = decoded; // attach decoded payload to socket
    next();
  } catch {
    next(new Error('Invalid or expired token'));
  }
}

// ─── Room assignment ──────────────────────────────────────────────────────────

function joinRooms(socket) {
  // generateAccessToken puts the id in `userId` instead of `_id`
  const { _id, id, userId: tokenUserId, role, currentOperationalRole } = socket.user;
  const userId = _id || id || tokenUserId;

  // Personal room — targeted events for this user
  socket.join(`user:${userId}`);

  // Role-based broadcast rooms
  socket.join('all_staff');

  const opRole = currentOperationalRole || role;
  if (opRole) socket.join(opRole);

  if (['admin'].includes(role)) socket.join('admin');

  logger.info('Socket connected', {
    socketId: socket.id,
    userId,
    role,
    opRole,
  });
}

// ─── eventBus → Socket.IO bridge ─────────────────────────────────────────────

function bridgeEvents(io) {
  // Order events — broadcast to dispatch staff and admins
  eventBus.on(EVENTS.ORDER.DISPATCHING, (data) => {
    io.to('dispatch_staff').to('admin').emit('order:dispatching', data);
  });

  eventBus.on(EVENTS.ORDER.DISPATCHED, (data) => {
    // Broadcast to all staff so every dashboard refreshes
    io.to('all_staff').emit('order:dispatched', data);
  });

  eventBus.on(EVENTS.ORDER.DISPATCH_FAILED, (data) => {
    io.to('dispatch_staff').to('admin').emit('order:dispatch_failed', data);
  });

  eventBus.on(EVENTS.ORDER.PACKED, (data) => {
    io.to('dispatch_staff').to('admin').emit('order:packed', data);
  });

  eventBus.on(EVENTS.ORDER.CONFIRMED, (data) => {
    io.to('all_staff').emit('order:confirmed', data);
  });

  // Task events — targeted to the assignee + admins
  eventBus.on(EVENTS.TASK.CREATED, (data) => {
    const { assignedTo } = data;
    if (assignedTo) {
      io.to(`user:${assignedTo}`).emit('task:created', data);
    }
    io.to('admin').emit('task:created', data);
  });

  eventBus.on(EVENTS.TASK.STATUS_CHANGED, (data) => {
    const { assignedTo } = data;
    if (assignedTo) {
      io.to(`user:${assignedTo}`).emit('task:updated', data);
    }
    io.to('admin').emit('task:updated', data);
  });

  eventBus.on(EVENTS.TASK.OVERDUE, (data) => {
    const { assignedTo } = data;
    if (assignedTo) {
      io.to(`user:${assignedTo}`).emit('task:overdue', data);
    }
    io.to('admin').emit('task:overdue', data);
  });
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Attach Socket.IO to an existing HTTP server.
 * Call this from server.js before httpServer.listen().
 *
 * @param {import('http').Server} httpServer
 * @returns {import('socket.io').Server}
 */
export function initSocketServer(httpServer) {
  const allowedOrigins = [
    process.env.ADMIN_URL,
    process.env.FRONTEND_URL,
    'http://localhost:8080',
    'http://localhost:5173',
  ].filter(Boolean);

  _io = new Server(httpServer, {
    cors: {
      origin: allowedOrigins,
      methods: ['GET', 'POST'],
      credentials: true,
    },
    // Namespace for dashboard staff — keeps it separate from any future customer WS
    path: '/socket.io',
  });

  const staffNS = _io.of('/staff');
  staffNS.use(socketAuthMiddleware);

  staffNS.on('connection', (socket) => {
    joinRooms(socket);

    socket.on('disconnect', (reason) => {
      logger.info('Socket disconnected', { socketId: socket.id, reason });
    });

    // Health ping — client can check connection is alive
    socket.on('ping', (cb) => {
      if (typeof cb === 'function') cb({ pong: true, ts: Date.now() });
    });
  });

  // Wire eventBus → Socket.IO after namespace is ready
  bridgeEvents(staffNS);

  logger.info('Socket.IO server initialized on /staff namespace');
  return _io;
}

/**
 * Return the initialised Socket.IO server instance.
 * Returns null if initSocketServer() has not been called yet.
 */
export function getSocketServer() {
  return _io;
}
