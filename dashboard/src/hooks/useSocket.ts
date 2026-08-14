/**
 * useSocket — Socket.IO connection for real-time dashboard updates
 *
 * Connects to the backend /staff namespace with JWT auth.
 * Listens for server events and invalidates the relevant TanStack Query caches,
 * so all pages that use useOrders / useTasks / useShipments refresh automatically
 * without polling.
 *
 * IMPORTANT: Frontend must NEVER assume state from socket events alone.
 * On every event, we invalidate the cache and let React Query re-fetch from
 * the authoritative backend source.
 *
 * Usage:
 *   Place <SocketProvider> inside your authenticated layout (below AuthContext).
 *   No other setup needed — query invalidation happens automatically.
 *
 * Example (optional per-event callback):
 *   const { on } = useSocket()
 *   useEffect(() => on('order:dispatched', (data) => toast(`Dispatched: ${data.orderNumber}`)), [on])
 */

import { useEffect, useCallback, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { io, Socket } from 'socket.io-client';
import { toast } from 'sonner';
import { getAccessToken, refreshAccessToken } from '../lib/auth-tokens';

const BACKEND_URL = import.meta.env.VITE_API_URL || '';
const SOCKET_PATH = '/socket.io';
const NAMESPACE = '/staff';

// ─── Singleton socket (one connection per tab) ────────────────────────────────

let _socket: Socket | null = null;

function getSocket(token: string): Socket {
  if (_socket?.connected) return _socket;

  _socket = io(`${BACKEND_URL}${NAMESPACE}`, {
    path: SOCKET_PATH,
    auth: { token },
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 2000,
    // Polling first, then silently upgrade to WebSocket once connected.
    // Opening a raw WSS socket as the FIRST transport hard-fails behind any
    // proxy that doesn't forward the Upgrade header, with no fallback — which
    // is what produced the repeating "websocket error" loop in production.
    transports: ['polling', 'websocket'],
  });

  return _socket;
}

function disconnectSocket() {
  if (_socket) {
    _socket.disconnect();
    _socket = null;
  }
}

// ─── Query key maps — which queries to invalidate per event ──────────────────

const EVENT_INVALIDATIONS: Record<string, string[][]> = {
  'order:dispatching':    [['dispatch-queue'], ['dispatch-queue-count'], ['dispatch-dashboard']],
  'order:dispatched':     [['dispatch-queue'], ['dispatch-queue-count'], ['dispatch-dashboard'], ['orders'], ['shipments']],
  'order:dispatch_failed':[['dispatch-queue'], ['dispatch-queue-count'], ['dispatch-dashboard']],
  'order:packed':         [['dispatch-queue'], ['dispatch-queue-count'], ['dispatch-dashboard']],
  'order:confirmed':      [['orders'], ['packaging-queue'], ['packaging', 'dashboard']],
  'task:created':         [['tasks'], ['my-tasks']],
  'task:updated':         [['tasks'], ['my-tasks']],
  'task:transitioned':    [['tasks'], ['my-tasks']],
  'task:claimed':         [['tasks'], ['my-tasks']],
  'task:completed':       [['tasks'], ['my-tasks']],
  'task:overdue':         [['tasks'], ['my-tasks']],
};

// ─── Hook ─────────────────────────────────────────────────────────────────────

interface UseSocketReturn {
  /** Register a per-event callback. Returns an unsubscribe function. */
  on: (event: string, handler: (data: unknown) => void) => () => void;
  /** Current connection status */
  isConnected: () => boolean;
}

export function useSocket(): UseSocketReturn {
  const queryClient = useQueryClient();
  const socketRef = useRef<Socket | null>(null);
  // Guards against a refresh/reconnect loop when the token is genuinely dead.
  const authRetried = useRef(false);

  useEffect(() => {
    const token = getAccessToken();
    if (!token) return;

    const socket = getSocket(token);
    socketRef.current = socket;

    // Auto-invalidate on every known event
    Object.entries(EVENT_INVALIDATIONS).forEach(([event, queryKeys]) => {
      socket.on(event, () => {
        queryKeys.forEach((key) => {
          queryClient.invalidateQueries({ queryKey: key });
        });
      });
    });

    // Global toast notifications for specific events
    socket.on('task:overdue', (data: any) => {
      if (data?.title) {
        toast.warning(`Task overdue: ${data.title}`);
      }
    });

    socket.on('connect_error', async (err) => {
      console.warn('[Socket] Connection error:', err.message);

      // The handshake carries the same JWT as the REST calls, so an expired
      // access token shows up here as an auth rejection. Swap in a fresh token
      // and retry once rather than burning all 5 reconnect attempts on a token
      // that can never succeed.
      const isAuthError = /auth|token|unauthor|jwt|expired/i.test(err.message ?? '');
      if (!isAuthError || authRetried.current) return;

      authRetried.current = true;
      const refreshed = await refreshAccessToken();
      if (refreshed) {
        socket.auth = { token: refreshed };
        socket.connect();
      }
    });

    socket.on('connect', () => {
      console.debug('[Socket] Connected to /staff namespace');
      authRetried.current = false;
    });

    socket.on('disconnect', (reason) => {
      console.debug('[Socket] Disconnected:', reason);
    });

    return () => {
      // Remove all auto-invalidation listeners but keep the socket alive
      // (other hook instances may still be using it)
      Object.keys(EVENT_INVALIDATIONS).forEach((event) => {
        socket.removeAllListeners(event);
      });
      socket.removeAllListeners('connect');
      socket.removeAllListeners('connect_error');
      socket.removeAllListeners('disconnect');
    };
  }, [queryClient]);

  const on = useCallback((event: string, handler: (data: unknown) => void) => {
    const socket = socketRef.current;
    if (!socket) return () => {};
    socket.on(event, handler);
    return () => socket.off(event, handler);
  }, []);

  const isConnected = useCallback(() => socketRef.current?.connected ?? false, []);

  return { on, isConnected };
}

/**
 * Call this when the user logs out to cleanly close the WebSocket.
 */
export { disconnectSocket };
