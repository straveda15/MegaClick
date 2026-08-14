import EventEmitter from 'events';

class AppEventBus extends EventEmitter {}

const eventBus = new AppEventBus();

// Prevent uncaught listener errors from crashing the process.
// Errors in event listeners are logged, not re-thrown.
eventBus.on('error', (err) => {
  console.error('[EventBus] Unhandled error in listener:', err);
});

export const EVENTS = {
  ATTENDANCE: {
    PUNCHED_IN: 'attendance.punched_in',
    PUNCHED_OUT: 'attendance.punched_out',
  },
  TASK: {
    CREATED: 'task.created',
    STATUS_CHANGED: 'task.status_changed',
    OVERDUE: 'task.overdue',
  },
  PRODUCTION: {
    STAGE_COMPLETED: 'production.stage_completed',
    BATCH_PACKAGED: 'production.batch_packaged',
    BATCH_DISPATCHED: 'production.batch_dispatched',
  },
  INVENTORY: {
    STOCK_DEDUCTED: 'inventory.stock_deducted',
    LOW_STOCK_ALERT: 'inventory.low_stock',
    STOCK_ADJUSTED: 'inventory.stock_adjusted',
  },
  LEAVE: {
    STATUS_CHANGED: 'leave.status_changed',
  },
  PAYSLIP: {
    GENERATED: 'payslip.generated',
  },
  ORDER: {
    CONFIRMED: 'order.confirmed',
    PACKED: 'order.packed',
    DISPATCHING: 'order.dispatching', // lock acquired, shipment in progress
    DISPATCHED: 'order.dispatched',
    DISPATCH_FAILED: 'order.dispatch_failed',
  },
  VENDOR: {
    STOCK_ADDED: 'vendor.stock_added',
  },
};

export default eventBus;
